import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import { FaTimes, FaTshirt, FaCamera, FaUpload, FaCheckCircle, FaSpinner, FaShoppingBag } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { processVirtualTryOn } from "../services/virtualTryOnService";
import { clothesProducts } from "../data/clothesData";
import "./VirtualTryOnModal.css";

const DEMO_MODELS = [
  {
    name: "Model Alex",
    gender: "Unisex Fit",
    img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop",
  },
  {
    name: "Model Jordan",
    gender: "Tailored Fit",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop",
  },
];

export default function VirtualTryOnModal({ isOpen, onClose, initialProduct, onToast }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const [selectedProduct, setSelectedProduct] = useState(initialProduct || clothesProducts[0]);
  const [userPhoto, setUserPhoto] = useState(DEMO_MODELS[0].img);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (initialProduct) setSelectedProduct(initialProduct);
  }, [initialProduct]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleRunTryOn = async () => {
    setProcessing(true);
    setResult(null);
    try {
      const res = await processVirtualTryOn({
        userPhotoUrl: userPhoto,
        product: selectedProduct,
      });
      setResult(res);
    } catch {
      setResult(null);
    } finally {
      setProcessing(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setUserPhoto(previewUrl);
      setResult(null);
    }
  };

  const handleAddToCart = () => {
    if (!selectedProduct) return;
    dispatch(addToCart(selectedProduct));
    if (onToast) {
      onToast({
        show: true,
        title: selectedProduct.title,
        img: selectedProduct.images?.[0] || "",
        type: "cart",
      });
    }
  };

  return (
    <div className="vto-modal-backdrop" onClick={onClose}>
      <div className="vto-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="vto-modal-header">
          <div className="vto-header-left">
            <div className="vto-header-icon"><FaTshirt /></div>
            <div>
              <h3>{t("virtualTryOn.title", "AI Virtual Try-On Studio")}</h3>
              <p>{t("virtualTryOn.subtitle", "Preview how fashion styles look on your silhouette before checkout")}</p>
            </div>
          </div>
          <button type="button" className="vto-close-btn" onClick={onClose} aria-label="Close modal">
            <FaTimes />
          </button>
        </div>

        {/* Studio Layout */}
        <div className="vto-modal-body">
          {/* Step 1: Select Garment */}
          <div className="vto-selector-strip">
            <span className="vto-strip-label">1. Choose Garment to Try:</span>
            <div className="vto-garments-row">
              {clothesProducts.slice(0, 5).map((p) => (
                <div
                  key={p._id}
                  className={`vto-garment-chip ${selectedProduct?._id === p._id ? "active" : ""}`}
                  onClick={() => {
                    setSelectedProduct(p);
                    setResult(null);
                  }}
                >
                  <img src={p.images?.[0]} alt={p.title} />
                  <div className="vto-chip-text">
                    <strong>{p.title}</strong>
                    <span>₹{Number(p.price).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Step 2: Main Studio Canvas */}
          <div className="vto-studio-grid">
            {/* Left: Model / User Photo */}
            <div className="vto-photo-side">
              <span className="vto-side-title">2. Your Model Silhouette:</span>
              <div className="vto-photo-frame">
                <img src={userPhoto} alt="Try-on Model" className="vto-model-preview" />
                {processing && (
                  <div className="vto-processing-overlay">
                    <FaSpinner className="vto-spinner" />
                    <span>Mapping fabric drape & lighting...</span>
                  </div>
                )}
              </div>

              {/* Upload or Demo Switch */}
              <div className="vto-model-actions">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  style={{ display: "none" }}
                />
                <button
                  type="button"
                  className="vto-upload-btn"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <FaUpload /> Upload Your Photo
                </button>

                <div className="vto-demo-models">
                  {DEMO_MODELS.map((m, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`vto-demo-btn ${userPhoto === m.img ? "active" : ""}`}
                      onClick={() => {
                        setUserPhoto(m.img);
                        setResult(null);
                      }}
                    >
                      {m.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Try-On Simulation & Fit Insights */}
            <div className="vto-result-side">
              <span className="vto-side-title">3. Fit & Styling Evaluation:</span>

              <div className="vto-card-summary">
                <div className="vto-prod-thumb">
                  <img src={selectedProduct?.images?.[0]} alt={selectedProduct?.title} />
                </div>
                <div className="vto-prod-meta">
                  <h4>{selectedProduct?.title}</h4>
                  <div className="vto-price-row">
                    <strong>₹{Number(selectedProduct?.price || 0).toLocaleString()}</strong>
                    <span className="vto-discount-pill">20% OFF</span>
                  </div>
                </div>
              </div>

              <div className="vto-fit-insights-box">
                <div className="vto-insight-row">
                  <FaCheckCircle className="insight-check" />
                  <div>
                    <strong>Fit Index: {result ? result.fitScore : "98% True to Size"}</strong>
                    <span>Designed for standard Indian regular fit dimensions</span>
                  </div>
                </div>
                <div className="vto-insight-row">
                  <FaCheckCircle className="insight-check" />
                  <div>
                    <strong>Fabric Silhouette: {result ? result.fabricDrape : "Breathable Premium Weave"}</strong>
                    <span>Retains shape and wrinkle resistance after wash</span>
                  </div>
                </div>
              </div>

              <div className="vto-actions-row">
                <button
                  type="button"
                  className="vto-generate-btn"
                  onClick={handleRunTryOn}
                  disabled={processing}
                >
                  {processing ? "Simulating Try-On..." : "⚡ Run Try-On Fit"}
                </button>

                <button
                  type="button"
                  className="vto-cart-btn"
                  onClick={handleAddToCart}
                >
                  <FaShoppingBag /> Add Style to Cart
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Privacy Note */}
        <div className="vto-modal-footer">
          <small>
            🔒 <strong>Privacy Safeguard:</strong> Your uploaded photo is used temporarily for in-session visual try-on rendering and is never stored on permanent servers.
          </small>
        </div>
      </div>
    </div>
  );
}
