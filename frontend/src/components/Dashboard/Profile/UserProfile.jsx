import { useState, useRef } from "react";
import { useGlobal } from "../../../hooks/useGlobal.jsx";
import AvatarUploader from "./AvatarUploader.jsx";
import Input from "../../Input.jsx";
import Button from "../../Button.jsx";
import "../../../CSS/Profile.css";

export default function UserProfile() {
  const { state, dispatch } = useGlobal();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: state.user?.name || "",
    email: state.user?.email || "",
  });

  const handleInputChange = (e) => {
    setFormData((old) => ({ ...old, [e.target.id]: e.target.value }));
  };

  const handleCancel = () => {
    setFormData({
      name: state.user?.name || "",
      email: state.user?.email || "",
    });
    setIsEditing(false);
  };

  return (
    <div className="user-profile">
      <h3 style={{ color: "#ff5252", marginBottom: 10 }}>Account Settings</h3>

      <div className="profile-container">
        <AvatarUploader />

        <form className="user-form" onSubmit={(e) => e.preventDefault()}>
          <div className="form-field">
            <label htmlFor="name">Name</label>
            {isEditing ? (
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            ) : (
              <span>{state.user?.name || formData.name}</span>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="email">Email</label>
            {isEditing ? (
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            ) : (
              <span>{state.user?.email || formData.email}</span>
            )}
          </div>

          <div className="form-buttons">
            {isEditing ? (
              <>
                <Button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    dispatch({ type: "Update_User", payload: formData });
                  }}
                >
                  Save
                </Button>
                <Button type="button" onClick={handleCancel}>
                  Cancel
                </Button>
              </>
            ) : (
              <Button type="button" onClick={() => setIsEditing(true)}>
                Edit
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
