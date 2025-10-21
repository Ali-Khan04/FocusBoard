import { useState, useRef, useEffect } from "react";
import defaultImage from "../../../assets/imageSkeleton.png";
import Button from "../../shared/Button.jsx";
import { apiRequest } from "../../../services/api.js";
import { useGlobal } from "../../../hooks/useGlobal.jsx";
import "../../../CSS/Profile.css";

export default function AvatarUploader() {
  const { state, dispatch } = useGlobal();
  const [image, setImage] = useState(state.user?.avatar || "");
  const [imageError, setImageError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (state.user?.avatar) {
      setImage(state.user.avatar);
    } else {
      setImage("");
    }
  }, [state.user?.avatar]);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg("File size exceeds 5MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setErrorMsg("Invalid file format");
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result;
      setImage(base64);
      setErrorMsg("");
      await uploadAvatar(base64);
    };
    reader.readAsDataURL(file);
  };

  const uploadAvatar = async (base64Image) => {
    setIsUploading(true);
    setUploaded(false);

    try {
      const res = await apiRequest("/auth/avatar", "PATCH", {
        avatar: base64Image,
      });

      if (res?.user) {
        dispatch({ type: "Update_User", payload: res.user });
        localStorage.setItem("user", JSON.stringify(res.user));

        setUploaded(true);
        setTimeout(() => setUploaded(false), 2000);
      }
    } catch (err) {
      console.error("Avatar Upload Error:", err);
      setErrorMsg(err.message || "Failed to upload avatar");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="avatar-uploader">
      <div className="avatar-display">
        {!imageError && image ? (
          <img src={image} alt="profile" onError={() => setImageError(true)} />
        ) : (
          <img src={defaultImage} alt="default" />
        )}
        {isUploading && <p>Uploading...</p>}
        {uploaded && !isUploading && (
          <p className="success-text">Uploaded ✅</p>
        )}
        {errorMsg && <p className="error-text">{errorMsg}</p>}
      </div>

      <div className="avatar-actions">
        <input
          type="file"
          accept="image/*"
          hidden
          onChange={handleImage}
          ref={fileInputRef}
        />
        <Button
          type="button"
          onClick={() => {
            if (!isUploading) fileInputRef.current?.click();
          }}
        >
          {isUploading ? "Uploading..." : "Upload"}
        </Button>
      </div>
    </div>
  );
}
