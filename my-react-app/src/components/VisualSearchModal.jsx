import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaCamera, FaTimes, FaUpload, FaCheckCircle, FaSpinner, FaSearch } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { searchByImage } from "../services/visualSearchService";
import ProductCard from "./ProductCard";
import "./VisualSearchModal.css";

const SAMPLES = [
  {
    label: "Running Sneakers",
    category: "shoes",
    img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&auto=format&fit=crop",
  },
  {
    label: "Studio Headphones",
    category: "electronics",
    img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&auto=format&fit=crop",
  },
  {
    label: "Denim Jacket",
    category: "clothes",
    img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&auto=format&fit=crop",
  },
];

export default function VisualSearchModal({ isOpen, onClose, onToast }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [selectedImage, setSelectedImage] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);

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

  const handleProcessImage = async (imgUrlOrFile) => {
    setAnalyzing(true);
    setResults(null);
    try {
      const res = await searchByImage(imgUrlOrFile);
      setResults(res);
    } catch {
      setResults(null);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setSelectedImage(previewUrl);
      handleProcessImage(file);
    }
  };

  const handleSampleClick = (sample) => {
    setSelectedImage(sample.img);
    handleProcessImage(sample.label);
  };

  const handleReset = () => {
    setSelectedImage(null);
    setResults(null);
  };

  return (
    <div className="vs-modal-backdrop" onClick={onClose}>
      <div className="vs-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="vs-modal-header">
          <div className="vs-header-left">
            <div className="vs-header-icon"><FaCamera /></div>
            <div>
              <h3>{t("visualSearch.title", "Visual Search")}</h3>
              <p>{t("visualSearch.subtitle", "Upload or select a photo to discover visually matching items in our catalog")}</p>
            </div>
          </div>
          <button type="button" className="vs-close-btn" onClick={onClose} aria-label="Close modal">
            <FaTimes />
          </button>
        </div>

        {/* Body */}
        <div className="vs-modal-body">
          {!selectedImage ? (
            <div className="vs-upload-view">
              {/* Drag and drop / file selector */}
              <div
                className="vs-dropzone"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  style={{ display: "none" }}
                />
                <div className="vs-upload-icon-box"><FaUpload /></div>
                <h4>{t("visualSearch.uploadPrompt", "Drop an image here or click to browse")}</h4>
                <p>Supports PNG, JPG, WEBP up to 10MB</p>
                <button type="button" className="vs-browse-btn">
                  {t("visualSearch.selectImage", "Select from Device")}
                </button>
              </div>

              {/* Instant Test Samples */}
              <div className="vs-samples-section">
                <span className="vs-samples-label">⚡ {t("visualSearch.trySamples", "Or try with a sample product:")}</span>
                <div className="vs-samples-row">
                  {SAMPLES.map((s, idx) => (
                    <div
                      key={idx}
                      className="vs-sample-card"
                      onClick={() => handleSampleClick(s)}
                    >
                      <img src={s.img} alt={s.label} />
                      <span>{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="vs-results-view">
              {/* Image Preview strip */}
              <div className="vs-preview-strip">
                <div className="vs-preview-thumb">
                  <img src={selectedImage} alt="Uploaded query" />
                </div>
                <div className="vs-preview-info">
                  <strong>Query Image Loaded</strong>
                  {analyzing ? (
                    <span className="vs-status-analyzing">
                      <FaSpinner className="vs-spinner" /> Analyzing neural attributes & matching catalog...
                    </span>
                  ) : (
                    <span className="vs-status-success">
                      <FaCheckCircle /> Match completed ({results?.confidence ? `${Math.round(results.confidence * 100)}% Match Confidence` : "Matched"})
                    </span>
                  )}
                </div>
                <button type="button" className="vs-change-img-btn" onClick={handleReset}>
                  Change Photo
                </button>
              </div>

              {/* Matched Catalog Products Grid */}
              {results && results.matches && (
                <div className="vs-matches-container">
                  <div className="vs-matches-header">
                    <h4>Matching Catalog Products ({results.matches.length})</h4>
                    <span className="vs-category-detected">Category: <strong>{results.detectedCategory?.toUpperCase()}</strong></span>
                  </div>

                  <div className="vs-matches-grid">
                    {results.matches.map((product) => (
                      <ProductCard
                        key={product._id}
                        product={product}
                        onToast={onToast}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer info note */}
        <div className="vs-modal-footer">
          <small>
            🛡️ <strong>Privacy & Transparency:</strong> Images are processed locally in your session. Visual search connects to authentic catalog data.
          </small>
        </div>
      </div>
    </div>
  );
}
