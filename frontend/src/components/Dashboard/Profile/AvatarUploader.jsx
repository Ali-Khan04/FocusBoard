import { useState, useRef } from "react";
import defaultImage from "../../../assets/imageSkeleton.png";
import Input from "../../shared/Input.jsx";
import Button from "../../shared/Input.jsx";
import "../../../CSS/Profile.css";

export default function AvatarUploader() {
  const [image, setImage] = useState("");
  const [imageError, setImageError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const imageRef = useRef(null);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("File size exceeds 5MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Invalid file format");
      return;
    }

    setIsUploading(true);
    setImageError(false);

    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
      setIsUploading(false);
      setUploaded(true);
      setTimeout(() => setUploaded(false), 2000);
    };
    reader.readAsDataURL(file);
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
        {uploaded && !isUploading && <p>Uploaded!</p>}
      </div>

      <div className="avatar-actions">
        <Input
          type="file"
          hidden
          accept="image/*"
          onChange={handleImage}
          ref={imageRef}
        />
        <Button
          type="button"
          onClick={() => {
            if (!isUploading) imageRef.current.click();
          }}
        >
          Upload
        </Button>
      </div>
    </div>
  );
}
