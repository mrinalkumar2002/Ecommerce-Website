import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Address.css";
import { useTranslation } from "react-i18next";

const STORAGE_KEY = "pvx_user_addresses";

function Address() {
  const { t } = useTranslation();
  const [addresses, setAddresses] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    isDefault: false,
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(addresses));
  }, [addresses]);

  const handleOpenAdd = () => {
    setEditingId(null);
    setForm({
      fullName: "",
      phone: "",
      street: "",
      city: "",
      state: "",
      pincode: "",
      isDefault: addresses.length === 0, // default if first address
    });
    setShowAddModal(true);
  };

  const handleOpenEdit = (addr) => {
    setEditingId(addr.id);
    setForm({
      fullName: addr.fullName,
      phone: addr.phone,
      street: addr.street,
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
      isDefault: addr.isDefault || false,
    });
    setShowAddModal(true);
  };

  const handleSetDefault = (id) => {
    setAddresses((prev) =>
      prev.map((a) => ({
        ...a,
        isDefault: a.id === id,
      }))
    );
  };

  const handleDelete = (id) => {
    setAddresses((prev) => {
      const filtered = prev.filter((a) => a.id !== id);
      // If deleted was default, make first remaining as default
      if (filtered.length > 0 && !filtered.some((a) => a.isDefault)) {
        filtered[0].isDefault = true;
      }
      return filtered;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingId) {
      setAddresses((prev) =>
        prev.map((a) => {
          if (a.id === editingId) {
            return {
              ...a,
              ...form,
            };
          }
          return form.isDefault ? { ...a, isDefault: false } : a;
        })
      );
    } else {
      const newAddress = {
        id: "addr_" + Date.now(),
        ...form,
      };
      setAddresses((prev) => {
        if (newAddress.isDefault) {
          return [...prev.map((a) => ({ ...a, isDefault: false })), newAddress];
        }
        return [...prev, newAddress];
      });
    }

    setShowAddModal(false);
  };

  return (
    <div className="address-page">
      <div className="address-container">
        <Link to="/profile" className="address-back-btn">
          {t('address.back')}
        </Link>

        <div className="address-header">
          <div>
            <h1>{t('address.title')}</h1>
            <p>{t('address.subtitle')}</p>
          </div>
          <button
            className={`add-address-btn ${showAddModal ? "active" : ""}`}
            onClick={() => {
              if (showAddModal) setShowAddModal(false);
              else handleOpenAdd();
            }}
          >
            {showAddModal ? t('address.closeForm') : t('address.addNewAddress')}
          </button>
        </div>

        {/* INLINE EXPANDING FORM BELOW HEADER */}
        {showAddModal && (
          <div className="address-inline-form-card">
            <h2>{editingId ? t('address.editAddress') : t('address.addNewAddress')}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-row-2">
                <div className="modal-form-group">
                  <label>{t('address.fullName')}</label>
                  <input
                    type="text"
                    required
                    placeholder={t('address.fullNamePlaceholder')}
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  />
                </div>

                <div className="modal-form-group">
                  <label>{t('address.phone')}</label>
                  <input
                    type="tel"
                    required
                    placeholder={t('address.phonePlaceholder')}
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-form-group">
                <label>{t('address.street')}</label>
                <textarea
                  required
                  placeholder={t('address.streetPlaceholder')}
                  rows="2"
                  value={form.street}
                  onChange={(e) => setForm({ ...form, street: e.target.value })}
                />
              </div>

              <div className="form-row-3">
                <div className="modal-form-group">
                  <label>{t('address.city')}</label>
                  <input
                    type="text"
                    required
                    placeholder={t('address.cityPlaceholder')}
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                  />
                </div>

                <div className="modal-form-group">
                  <label>{t('address.state')}</label>
                  <input
                    type="text"
                    required
                    placeholder={t('address.statePlaceholder')}
                    value={form.state}
                    onChange={(e) => setForm({ ...form, state: e.target.value })}
                  />
                </div>

                <div className="modal-form-group">
                  <label>{t('address.pincode')}</label>
                  <input
                    type="text"
                    required
                    placeholder={t('address.pincodePlaceholder')}
                    value={form.pincode}
                    onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={form.isDefault}
                    onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
                  />
                  <span>{t('address.setDefault')}</span>
                </label>
              </div>

              <div className="inline-form-actions">
                <button type="submit" className="modal-save-btn">
                  {t('address.saveAddress')}
                </button>
                <button
                  type="button"
                  className="modal-cancel-btn"
                  onClick={() => setShowAddModal(false)}
                >
                  {t('address.cancel')}
                </button>
              </div>
            </form>
          </div>
        )}

        {addresses.length === 0 ? (
          <div className="address-empty">
            <div className="empty-icon">🏠</div>
            <h2>{t('address.noAddressTitle')}</h2>
            <p>{t('address.noAddressDesc')}</p>
            <button className="add-address-btn" onClick={handleOpenAdd}>
              {t('address.addFirstAddress')}
            </button>
          </div>
        ) : (
          <div className="address-grid">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className={`address-card ${addr.isDefault ? "default-card" : ""}`}
              >
                {addr.isDefault && (
                  <span className="default-badge">{t('address.defaultAddress')}</span>
                )}

                <div className="address-card-body">
                  <h3>{addr.fullName}</h3>
                  <p className="addr-phone">📞 {addr.phone}</p>
                  <p className="addr-text">
                    {addr.street}, {addr.city}, {addr.state} - <strong>{addr.pincode}</strong>
                  </p>
                </div>

                <div className="address-card-actions">
                  {!addr.isDefault && (
                    <button
                      className="action-btn make-default"
                      onClick={() => handleSetDefault(addr.id)}
                    >
                      {t('address.setDefault')}
                    </button>
                  )}
                  <button
                    className="action-btn edit"
                    onClick={() => handleOpenEdit(addr)}
                  >
                    {t('address.edit')}
                  </button>
                  <button
                    className="action-btn delete"
                    onClick={() => handleDelete(addr.id)}
                  >
                    {t('address.delete')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Address;
