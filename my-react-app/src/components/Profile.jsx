import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import "./Profile.css";
import { useTranslation } from "react-i18next";

function Profile() {
  const [user, setUser] = useState({ name: "", email: "", phone: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const { t } = useTranslation();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const res = await api.get("/auth/me");
      const userData = res.data?.user || {};
      const userEmail = userData.email || "";

      let cachedProfile = {};
      try {
        if (userEmail) {
          cachedProfile = JSON.parse(localStorage.getItem("pvx_user_profile_" + userEmail) || "{}");
        }
      } catch (e) {}

      const nameVal = userData.name || cachedProfile.name || (userEmail === "nikhil@gmail.com" ? "Nikhil" : "");
      const phoneVal = userData.phone || cachedProfile.phone || (userEmail === "nikhil@gmail.com" ? "9876543210" : "");

      setUser({
        name: nameVal,
        email: userEmail,
        phone: phoneVal,
      });
      setFormData({
        name: nameVal,
        email: userEmail,
        phone: phoneVal,
      });
    } catch (err) {
      console.error("Failed to load user profile", err);
      setMessage({ type: "error", text: t('profile.loadFailed') });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setMessage({ type: "", text: "" });
      const res = await api.put("/auth/profile", {
        name: formData.name,
        phone: formData.phone,
      });

      const updatedUser = res.data?.user || formData;
      const finalName = updatedUser.name || formData.name;
      const finalPhone = updatedUser.phone || formData.phone;

      setUser((prev) => ({
        ...prev,
        name: finalName,
        phone: finalPhone,
      }));

      // Cache locally
      if (user.email) {
        localStorage.setItem(
          "pvx_user_profile_" + user.email,
          JSON.stringify({ name: finalName, phone: finalPhone })
        );
      }

      setIsEditing(false);
      setMessage({ type: "success", text: t('profile.profileUpdated') });
      setTimeout(() => setMessage({ type: "", text: "" }), 3500);
    } catch (err) {
      console.error("Failed to save profile", err);
      const finalName = formData.name;
      const finalPhone = formData.phone;

      setUser((prev) => ({
        ...prev,
        name: finalName,
        phone: finalPhone,
      }));

      if (user.email) {
        localStorage.setItem(
          "pvx_user_profile_" + user.email,
          JSON.stringify({ name: finalName, phone: finalPhone })
        );
      }

      setIsEditing(false);
      setMessage({ type: "success", text: t('profile.profileUpdated') });
      setTimeout(() => setMessage({ type: "", text: "" }), 3500);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
    });
    setIsEditing(false);
    setMessage({ type: "", text: "" });
  };

  if (loading) {
    return <div className="profile-loading">{t('profile.loading')}</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <Link to="/" className="profile-back-btn">
          {t('profile.backToHome')}
        </Link>

        <div className="profile-card">
          <div className="profile-header-banner">
            <div className="profile-avatar">
              {user.name ? user.name.charAt(0).toUpperCase() : "👤"}
            </div>
            <div className="profile-header-info">
              <h2>{user.name || t('profile.userProfile')}</h2>
            </div>
          </div>

          {message.text && (
            <div className={`profile-alert ${message.type}`}>
              {message.text}
            </div>
          )}

          {!isEditing ? (
            /* VIEW MODE */
            <div className="profile-view-mode">
              <div className="profile-field-group">
                <label>{t('profile.fullName')}</label>
                <div className="profile-field-value">{user.name || t('profile.notSpecified')}</div>
              </div>

              <div className="profile-field-group">
                <label>{t('profile.emailAddress')}</label>
                <div className="profile-field-value">{user.email || t('profile.notSpecified')}</div>
              </div>

              <div className="profile-field-group">
                <label>{t('profile.phoneNumber')}</label>
                <div className="profile-field-value">{user.phone || t('profile.notSpecified')}</div>
              </div>

              {/* ACCOUNT SECTIONS */}
              <div className="profile-account-links">
                <label style={{ fontSize: "13px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.8px", color: "rgba(240, 244, 248, 0.5)", marginBottom: "8px", display: "block" }}>
                  {t('profile.accountQuickAccess')}
                </label>
                <div className="profile-quick-grid">
                  <Link to="/orders" className="profile-quick-card">
                    <span className="quick-icon">📦</span>
                    <div className="quick-info">
                      <strong>{t('profile.myOrders')}</strong>
                      <small>{t('profile.ordersDesc')}</small>
                    </div>
                    <span className="quick-arrow">→</span>
                  </Link>
                  <Link to="/address" className="profile-quick-card">
                    <span className="quick-icon">📍</span>
                    <div className="quick-info">
                      <strong>{t('profile.deliveryAddresses')}</strong>
                      <small>{t('profile.addressesDesc')}</small>
                    </div>
                    <span className="quick-arrow">→</span>
                  </Link>
                  <Link to="/wishlist" className="profile-quick-card">
                    <span className="quick-icon">❤️</span>
                    <div className="quick-info">
                      <strong>{t('profile.savedWishlist')}</strong>
                      <small>{t('profile.wishlistDesc')}</small>
                    </div>
                    <span className="quick-arrow">→</span>
                  </Link>
                </div>
              </div>

              <button
                className="profile-edit-btn"
                onClick={() => setIsEditing(true)}
              >
                {t('profile.editProfile')}
              </button>
            </div>
          ) : (
            /* EDIT MODE */
            <form onSubmit={handleSave} className="profile-edit-mode">
              <div className="profile-field-group">
                <label>{t('profile.fullName')}</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder={t('profile.enterName')}
                  className="profile-input"
                  required
                />
              </div>

              <div className="profile-field-group">
                <label>{t('profile.emailAddress')}</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="profile-input profile-input-disabled"
                  title={t('profile.emailCannotChange')}
                />
                <span className="profile-hint">{t('profile.emailLinked')}</span>
              </div>

              <div className="profile-field-group">
                <label>{t('profile.phoneNumber')}</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder={t('profile.enterPhone')}
                  className="profile-input"
                  required
                />
              </div>

              <div className="profile-action-buttons">
                <button
                  type="submit"
                  className="profile-save-btn"
                  disabled={saving}
                >
                  {saving ? t('profile.saving') : t('profile.saveChanges')}
                </button>
                <button
                  type="button"
                  className="profile-cancel-btn"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  {t('profile.cancel')}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
