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
      dispatch({ type: "errorMessage", payload: "File size exceeds 5MB" });
      clearFlowMessage();
      return;
    }

    if (!file.type.startsWith("image/")) {
      dispatch({ type: "errorMessage", payload: "Invalid file format" });
      clearFlowMessage();
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result;
      setImage(base64);
      await uploadAvatar(base64);
    };
    reader.readAsDataURL(file);
  };

  const uploadAvatar = async (base64Image) => {
    setIsUploading(true);

    try {
      const res = await apiRequest("/auth/avatar", "PATCH", {
        avatar: base64Image,
      });

      if (res?.user) {
        dispatch({ type: "Update_User", payload: res.user });
        dispatch({
          type: "successMessage",
          payload: "Avatar uploaded successfully ✅",
        });
        localStorage.setItem("user", JSON.stringify(res.user));
      } else {
        dispatch({ type: "errorMessage", payload: "Failed to upload avatar" });
      }
    } catch (err) {
      console.error("Avatar Upload Error:", err);
      dispatch({
        type: "errorMessage",
        payload: "Network error, please try again",
      });
    } finally {
      setIsUploading(false);

      setTimeout(() => {
        dispatch({ type: "clearMessage" });
      }, 2000);
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

        {state.flowMessage && (
          <p
            className={
              state.messageType === "error" ? "error-text" : "success-text"
            }
          >
            {state.flowMessage}
          </p>
        )}
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
