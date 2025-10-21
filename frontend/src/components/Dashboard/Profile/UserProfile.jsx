import { useState } from "react";
import { useGlobal } from "../../../hooks/useGlobal.jsx";
import AvatarUploader from "./AvatarUploader.jsx";
import Input from "../../shared/Input.jsx";
import Button from "../../shared/Button.jsx";
import { apiRequest } from "../../../services/api.js";
import "../../../CSS/Profile.css";

export default function UserProfile() {
  const { state, dispatch } = useGlobal();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    name: state.user?.name || "",
    email: state.user?.email || "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleCancel = () => {
    setFormData({
      name: state.user?.name || "",
      email: state.user?.email || "",
      password: "",
      confirmPassword: "",
    });
    setIsEditing(false);
    setError("");
    setSuccess("");
  };

  const handleSave = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
      };
      if (formData.password) {
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match");
          setLoading(false);
          return;
        }
        payload.password = formData.password;
      }

      const res = await apiRequest("/auth/profile", "PATCH", payload);

      if (res?.user) {
        dispatch({ type: "Update_User", payload: res.user });
        localStorage.setItem("user", JSON.stringify(res.user));

        setSuccess("Profile updated successfully ✅");
        setIsEditing(false);
      }
    } catch (err) {
      setError(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
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

          {isEditing && (
            <>
              <div className="form-field">
                <label htmlFor="password">New Password</label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Leave blank to keep current"
                />
              </div>

              <div className="form-field">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Re-enter password"
                />
              </div>
            </>
          )}

          {error && <p className="error-text">{error}</p>}
          {success && <p className="success-text">{success}</p>}

          <div className="form-buttons">
            {isEditing ? (
              <>
                <Button type="button" onClick={handleSave} disabled={loading}>
                  {loading ? "Saving..." : "Save"}
                </Button>
                <Button type="button" onClick={handleCancel}>
                  Cancel
                </Button>
              </>
            ) : (
              <Button type="button" onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
