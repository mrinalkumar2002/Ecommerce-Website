import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import { FaTimes, FaTshirt, FaUpload, FaCheckCircle, FaSpinner, FaShoppingBag, FaExclamationTriangle } from "react-icons/fa";
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
  const [statusMessage, setStatusMessage] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [showOriginal, setShowOriginal] = useState(false);

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
    setError(null);
    setShowOriginal(false);
    setStatusMessage("Starting...");
    try {
      const res = await processVirtualTryOn({
        userPhotoUrl: userPhoto,
        product: selectedProduct,
        onProgress: (msg) => setStatusMessage(msg),
      });
      setResult(res);
      setStatusMessage("");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
      setResult(null);
    } finally {
      setProcessing(false);
    }
  };

  const garmentInputRef = useRef(null);

  const handleGarmentUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const img = new Image();
      img.onload = () => {
        // IDM-VTON expects 768x1024. We create a standardized canvas to prevent IndexError
        const targetWidth = 768;
        const targetHeight = 1024;
        const canvas = document.createElement("canvas");
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext("2d");
        
        // Fill white background
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, targetWidth, targetHeight);

        // Calculate aspect ratio to fit image inside the canvas with padding
        const scale = Math.min((targetWidth - 40) / img.width, (targetHeight - 40) / img.height);
        const drawWidth = img.width * scale;
        const drawHeight = img.height * scale;
        const offsetX = (targetWidth - drawWidth) / 2;
        const offsetY = (targetHeight - drawHeight) / 2;

        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        
        canvas.toBlob((blob) => {
          const blobUrl = URL.createObjectURL(blob);
          setSelectedProduct({
            _id: "custom_garment_" + Date.now(),
            title: "Custom Garment",
            price: 0,
            images: [blobUrl]
          });
          setResult(null);
          setError(null);
        }, "image/jpeg", 0.95);
      };
      img.src = URL.createObjectURL(file);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setUserPhoto(previewUrl);
      setResult(null);
      setError(null);
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
              <p>{t("virtualTryOn.subtitle", "Upload your photo & see yourself wearing the selected outfit")}</p>
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
              <input
                ref={garmentInputRef}
                type="file"
                accept="image/*"
                onChange={handleGarmentUpload}
                style={{ display: "none" }}
              />
              <div
                className={`vto-garment-chip vto-upload-garment-chip ${selectedProduct?._id?.startsWith("custom_garment") ? "active" : ""}`}
                onClick={() => garmentInputRef.current?.click()}
              >
                <div className="vto-upload-icon-box">
                  <FaUpload size={18} />
                </div>
                <div className="vto-chip-text">
                  <strong>Upload Your</strong>
                  <span>Own Garment</span>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: Main Studio Canvas */}
          <div className="vto-studio-grid">
            {/* Left: Model / User Photo */}
            <div className="vto-photo-side">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="vto-side-title">2. Your Photo / AI Result:</span>
                {result?.generatedImageUrl && (
                  <button
                    type="button"
                    className="vto-toggle-view-btn"
                    onClick={() => setShowOriginal(!showOriginal)}
                  >
                    {showOriginal ? "✨ View AI Try-On Result" : "🔄 View Original Photo"}
                  </button>
                )}
              </div>
              <div className="vto-photo-frame">
                <img
                  src={
                    result?.generatedImageUrl && !showOriginal
                      ? result.generatedImageUrl
                      : userPhoto
                  }
                  alt="Try-on Model"
                  className="vto-model-preview"
                />
                {processing && (
                  <div className="vto-processing-overlay">
                    <FaSpinner className="vto-spinner" />
                    <span className="vto-process-title">{statusMessage || "Processing..."}</span>
                    <span className="vto-process-subtitle">
                      First request may take 1-2 minutes while the AI server starts up
                    </span>
                  </div>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="vto-error-box">
                  <FaExclamationTriangle style={{ color: "#C62828", flexShrink: 0 }} />
                  <div>
                    <strong>Try-On Failed</strong>
                    <span>{error}</span>
                  </div>
                </div>
              )}

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
                        setError(null);
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
                  {!selectedProduct?._id?.startsWith("custom_garment") && (
                    <div className="vto-price-row">
                      <strong>₹{Number(selectedProduct?.price || 0).toLocaleString()}</strong>
                      <span className="vto-discount-pill">20% OFF</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="vto-fit-insights-box">
                <div className="vto-insight-row">
                  <FaCheckCircle className="insight-check" />
                  <div>
                    <strong>Fit Index: {result ? result.fitScore : "Select & run try-on to see"}</strong>
                    <span>Designed for standard Indian regular fit dimensions</span>
                  </div>
                </div>
                <div className="vto-insight-row">
                  <FaCheckCircle className="insight-check" />
                  <div>
                    <strong>Fabric Silhouette: {result ? result.fabricDrape : "Run try-on to evaluate"}</strong>
                    <span>Retains shape and wrinkle resistance after wash</span>
                  </div>
                </div>
                {result?.provider && (
                  <div className="vto-insight-row">
                    <FaCheckCircle className="insight-check" />
                    <div>
                      <strong>Powered by: {result.provider}</strong>
                      <span>Real AI diffusion-based cloth swap</span>
                    </div>
                  </div>
                )}
              </div>

              {/* How it works note */}
              <div className="vto-how-it-works">
                <strong>💡 Tip for Sarees & Ethnic Outfits:</strong>
                <span>For Sarees & Lehengas, use a standing portrait photo (showing waist & shoulder). Our AI automatically optimizes shoulder pallu and waist draping parameters!</span>
              </div>

              <div className="vto-actions-row">
                <button
                  type="button"
                  className="vto-generate-btn"
                  onClick={handleRunTryOn}
                  disabled={processing}
                >
                  {processing ? "⏳ AI is Working... Please Wait" : "⚡ Run AI Try-On"}
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
            🔒 <strong>Privacy Safeguard:</strong> Your photo is sent to Hugging Face AI servers for processing and is not permanently stored.
          </small>
        </div>
      </div>
    </div>
  );
}
