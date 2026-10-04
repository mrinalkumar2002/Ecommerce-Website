import React, { useState, useEffect } from "react";
import api from "../../api";
import "./AdminFeatures.css";

const DEFAULT_SETTINGS = [
  { key: "gst_rate", label: "GST Rate (%)", value: "18", type: "number", icon: "📊", group: "Tax" },
  { key: "shipping_free_above", label: "Free Shipping Above (₹)", value: "500", type: "number", icon: "🚚", group: "Shipping" },
  { key: "shipping_charge", label: "Shipping Charge (₹)", value: "50", type: "number", icon: "📦", group: "Shipping" },
  { key: "store_name", label: "Store Name", value: "MYCA", type: "text", icon: "🏪", group: "Store" },
  { key: "support_email", label: "Support Email", value: "support@myca.com", type: "email", icon: "📧", group: "Store" },
  { key: "support_phone", label: "Support Phone", value: "+91 9876543210", type: "text", icon: "📞", group: "Store" },
  { key: "currency", label: "Currency", value: "INR", type: "text", icon: "💰", group: "Store" },
  { key: "max_cart_quantity", label: "Max Quantity Per Cart Item", value: "10", type: "number", icon: "🛒", group: "Store" },
];

export default function AdminSettings() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => { fetchSettings(); }, []);

  const fetchSettings = async () => {
    try {
      const res = await api.get("/admin/settings");
      const map = {};
      (res.data.settings || []).forEach(s => { map[s.key] = s.value; });
      setSettings(map);
    } catch { } finally { setLoading(false); }
  };

  const getValue = (key, defaultVal) => settings[key] !== undefined ? settings[key] : defaultVal;

  const handleChange = (key, value) => setSettings(prev => ({ ...prev, [key]: value }));

  const handleSaveAll = async () => {
    setSaving(true); setMsg("");
    try {
      for (const def of DEFAULT_SETTINGS) {
        await api.put("/admin/settings", { key: def.key, value: getValue(def.key, def.value) });
      }
      setMsg("✅ All settings saved successfully!");
    } catch { setMsg("❌ Error saving settings."); }
    finally { setSaving(false); }
  };

  const groups = [...new Set(DEFAULT_SETTINGS.map(d => d.group))];

  if (loading) return <div className="af-loading">Loading settings...</div>;

  return (
    <div className="af-page">
      <div className="af-header">
        <div>
          <h1 className="af-title">Store Settings</h1>
          <p className="af-desc">Configure tax rates, shipping charges, and store info</p>
        </div>
        <button className="af-btn-primary" onClick={handleSaveAll} disabled={saving}>{saving ? "Saving..." : "💾 Save All"}</button>
      </div>

      {msg && <div className={`af-msg ${msg.startsWith("✅") ? "af-msg-success" : "af-msg-error"}`}>{msg}</div>}

      {groups.map(group => (
        <div key={group} className="af-settings-group">
          <h3 className="af-settings-group-title">{group} Settings</h3>
          <div className="af-settings-grid">
            {DEFAULT_SETTINGS.filter(d => d.group === group).map(def => (
              <div key={def.key} className="af-setting-card">
                <div className="af-setting-icon">{def.icon}</div>
                <div className="af-setting-body">
                  <label className="af-setting-label">{def.label}</label>
                  <input
                    className="af-input"
                    type={def.type}
                    value={getValue(def.key, def.value)}
                    onChange={e => handleChange(def.key, e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
