import React from "react";
import "./SkeletonLoader.css";

export function ProductCardSkeleton() {
  return (
    <div className="skeleton-card" aria-hidden="true">
      <div className="skeleton-shimmer skeleton-media" />
      <div className="skeleton-body">
        <div className="skeleton-shimmer skeleton-title" />
        <div className="skeleton-shimmer skeleton-desc" />
        <div className="skeleton-shimmer skeleton-desc-short" />
      </div>
      <div className="skeleton-footer">
        <div className="skeleton-shimmer skeleton-price" />
        <div className="skeleton-shimmer skeleton-btn" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="skeleton-grid" aria-label="Loading products...">
      {Array.from({ length: count }).map((_, idx) => (
        <ProductCardSkeleton key={idx} />
      ))}
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="skeleton-detail-stage" aria-label="Loading product details...">
      <div className="skeleton-detail-card">
        <div className="skeleton-shimmer skeleton-detail-img" />
        <div className="skeleton-detail-content">
          <div className="skeleton-shimmer skeleton-detail-title" />
          <div className="skeleton-shimmer skeleton-detail-rating" />
          <div className="skeleton-shimmer skeleton-detail-pricebox" />
          <div className="skeleton-shimmer skeleton-detail-accordion" />
          <div className="skeleton-shimmer skeleton-detail-accordion" />
          <div className="skeleton-detail-actions">
            <div className="skeleton-shimmer skeleton-detail-btn" />
            <div className="skeleton-shimmer skeleton-detail-btn" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function CartSkeleton() {
  return (
    <div className="skeleton-cart-layout" aria-label="Loading cart...">
      <div className="skeleton-cart-list">
        {[1, 2].map((k) => (
          <div key={k} className="skeleton-cart-item">
            <div className="skeleton-shimmer skeleton-cart-img" />
            <div className="skeleton-cart-info">
              <div className="skeleton-shimmer skeleton-title" />
              <div className="skeleton-shimmer skeleton-desc-short" />
              <div className="skeleton-shimmer skeleton-price" />
            </div>
          </div>
        ))}
      </div>
      <div className="skeleton-cart-summary">
        <div className="skeleton-shimmer skeleton-summary-box" />
      </div>
    </div>
  );
}
