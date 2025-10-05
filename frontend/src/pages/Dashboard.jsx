import { useState, useRef } from "react";
import defaultImage from "../assets/imageSkeleton.png";
import "../CSS/Dashboard.css";
import { useGlobal } from "../hooks/useGlobal.jsx";

function Dashboard() {
  const { state, dispatch } = useGlobal();
  const [image, setImage] = useState("");
  const [imageError, setImageError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: state.user?.name || "",
    email: state.user?.email || "",
  });

  const imageRef = useRef(null);
  const handleInputChange = (e) => {
    setFormData((oldState) => ({
      ...oldState,
      [e.target.id]: e.target.value,
    }));
  };
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("File size exceeds the minimum limit");
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
      const baseImage = reader.result;
      setImage(baseImage);
      setIsUploading(false);
      setUploaded(true);
      setTimeout(() => {
        setUploaded(false);
      }, 2000);
    };
    reader.readAsDataURL(file);
  };
  const handleCancel = () => {
    setFormData({
      name: state.user?.name || "",
      email: state.user?.email || "",
    });
    setIsEditing(false);
  };
  return (
    <div className="dasboard-container">
      <button
        onClick={() => dispatch({ type: "logout" })}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          padding: "10px 15px",
          backgroundColor: "#ff5252",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        Logout
      </button>
      <h1>{state.user.name} Dashboard</h1>
      <div className="user-profile">
        <h3 style={{ color: "#ff5252", marginBottom: 10 }}>Account Settings</h3>
        <div className="user-avatar">
          <div className="avatar-display">
            {!imageError && image ? (
              <img
                src={image}
                alt="profileImage"
                onError={() => setImageError(true)}
              />
            ) : (
              <img src={defaultImage} alt="default " />
            )}

            {isUploading && <p>Loading...</p>}
            {uploaded && !isUploading && <p>Uploaded</p>}
          </div>

          <div className="avatar-input">
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleImage}
              disabled={isUploading}
              ref={imageRef}
            />
            <button
              onClick={() => {
                if (!isUploading) {
                  imageRef.current.click();
                }
              }}
            >
              Upload
            </button>
            <div className="user-details">
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="user-name">
                  {isEditing ? (
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <div>{state.user.name || formData.name}</div>
                  )}
                </div>
                <div className="user-email">
                  {isEditing ? (
                    <input
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      id="email"
                    />
                  ) : (
                    <div>{state.user.email || formData.email}</div>
                  )}
                </div>
                <div className="form-buttons">
                  {isEditing ? (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          dispatch({ type: "Update_User", payload: formData });
                        }}
                      >
                        Save
                      </button>

                      <button type="button" onClick={handleCancel}>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(true);
                      }}
                    >
                      Edit
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
