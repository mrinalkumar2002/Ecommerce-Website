import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearCart, removeFromCart } from "../redux/cartSlice";
import { useNavigate, useLocation, Link } from "react-router-dom";
import api from "../api";
import "./Checkout.css";
import { useTranslation } from "react-i18next";
import ProductTransText from "./ProductTransText";

export default function Checkout() {
  const { t } = useTranslation();
  const location = useLocation();
  const reduxCartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const singleItem = location.state?.singleItem;
  const checkoutItems = singleItem ? [singleItem] : reduxCartItems;

  const [step, setStep] = useState(1); // 1 = Address & Summary, 2 = Payment Selection, 3 = Confirmed
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState(null);
  const [countdown, setCountdown] = useState(3);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  // Payment Options
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [selectedUpiApp, setSelectedUpiApp] = useState(null);
  const [upiId, setUpiId] = useState("");
  const [selectedBank, setSelectedBank] = useState("");
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardExpiry: "",
    cardCvv: "",
    cardName: "",
  });

  // 🏷️ Coupon State
  const [appliedCoupon] = useState(() => {
    if (location.state?.appliedCoupon) return location.state.appliedCoupon;
    try {
      const saved = sessionStorage.getItem("pvx_applied_coupon");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const SAMPLE_ADDRESSES = [
    {
      id: "addr-sample-1",
      fullName: "Shivam Sharma",
      phone: "9871234567",
      street: "F-316, Urban Homes, Aditya World City",
      city: "Ghaziabad",
      state: "Uttar Pradesh",
      pincode: "201002",
      isDefault: true,
    },
    {
      id: "addr-sample-2",
      fullName: "Rahul Verma",
      phone: "8800112233",
      street: "Tower B-402, Cyber Towers, Sector 62",
      city: "Noida",
      state: "Uttar Pradesh",
      pincode: "201301",
      isDefault: false,
    },
  ];

  const [savedAddresses] = useState(() => {
    try {
      const saved = localStorage.getItem("pvx_user_addresses");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return SAMPLE_ADDRESSES;
    } catch {
      return SAMPLE_ADDRESSES;
    }
  });

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
  });

  useEffect(() => {
    async function loadDefaultData() {
      let userName = "";
      let userEmail = "";

      try {
        const res = await api.get("/auth/me");
        const u = res.data?.user || {};
        userName = u.name || "";
        userEmail = u.email || "";
      } catch (err) {}

      let currentAddr = savedAddresses.find((a) => a.isDefault) || savedAddresses[0];
      setSelectedAddress(currentAddr);

      const addrStr = currentAddr
        ? `${currentAddr.street}, ${currentAddr.city}, ${currentAddr.state} - ${currentAddr.pincode}`
        : "";

      setForm({
        name: userName || currentAddr?.fullName || "",
        email: userEmail || "",
        address: addrStr,
      });
    }
    loadDefaultData();
  }, [savedAddresses]);

  // Calculations
  const rawSubtotal = checkoutItems.reduce(
    (acc, item) => acc + Number(item.price || 0) * Number(item.quantity || 1),
    0
  );
  const totalMRP = Math.round(rawSubtotal * 1.25);
  const catalogDiscount = totalMRP - rawSubtotal;

  let couponDiscountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.code === "SAVE10") {
      couponDiscountAmount = Math.round(rawSubtotal * 0.1);
    } else if (appliedCoupon.code === "SHOPPY20" && rawSubtotal >= 1000) {
      couponDiscountAmount = Math.round(rawSubtotal * 0.2);
    }
  }

  const finalTotal = Math.max(0, rawSubtotal - couponDiscountAmount);

  const handleSelectAddress = (addr) => {
    setSelectedAddress(addr);
    const addrStr = `${addr.street}, ${addr.city}, ${addr.state} - ${addr.pincode}`;
    setForm((prev) => ({
      ...prev,
      name: addr.fullName || prev.name,
      address: addrStr,
    }));
    setShowAddressModal(false);
  };

  const handleContinueToPayment = (e) => {
    e.preventDefault();
    setCheckoutError("");
    if (!form.name || !form.email || !form.address) {
      setCheckoutError(t("common.selectAddressAlert"));
      return;
    }
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  async function handleFinalOrder(e) {
    e.preventDefault();
    if (isSubmitting) return; // 🔒 Duplicate Submission Prevention Lock

    setCheckoutError("");

    if (paymentMethod === "upi_direct" && !selectedUpiApp) {
      setCheckoutError(t("common.selectUpiAlert"));
      return;
    }
    if (paymentMethod === "upi_id" && !upiId.trim()) {
      setCheckoutError("Please enter a valid UPI ID (e.g. yourname@okhdfcbank)");
      return;
    }
    if (paymentMethod === "netbanking" && !selectedBank) {
      setCheckoutError(t("common.selectBankAlert"));
      return;
    }

    try {
      setIsSubmitting(true);

      const paymentDetails = {
        method: paymentMethod,
        upiApp: selectedUpiApp,
        upiId: upiId || undefined,
        bank: selectedBank || undefined,
        couponApplied: appliedCoupon?.code || null,
        couponDiscount: couponDiscountAmount,
      };

      const orderPayload = {
        customer: form,
        items: checkoutItems.map((item) => ({
          productId: item.productId || item._id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          image: item.images?.[0] || "",
        })),
        totalAmount: finalTotal,
        paymentMethod,
        paymentDetails,
        couponCode: appliedCoupon?.code || null,
        discountAmount: couponDiscountAmount,
      };

      const res = await api.post("/orders", orderPayload);
      const createdOrderId = res.data?.order?._id || `ORD-${Date.now()}`;
      setPlacedOrderId(createdOrderId);

      // Clear Redux Cart & Session Coupon
      if (singleItem) {
        dispatch(removeFromCart(singleItem.productId || singleItem._id));
      } else {
        dispatch(clearCart());
      }
      sessionStorage.removeItem("pvx_applied_coupon");

      setOrderPlaced(true);
      setStep(3);

      // Countdown Timer for Auto Redirect
      let timer = 3;
      const interval = setInterval(() => {
        timer -= 1;
        setCountdown(timer);
        if (timer <= 0) {
          clearInterval(interval);
          navigate("/orders");
        }
      }, 1000);
    } catch (err) {
      setCheckoutError(err.response?.data?.message || "Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="checkout-page">
      {/* 🧭 MULTI-STEP PROGRESS BAR */}
      <div className="checkout-steps-bar">
        <div className={`checkout-step-item ${step >= 1 ? "active" : ""} ${step > 1 ? "completed" : ""}`}>
          <div className="step-number">{step > 1 ? "✓" : "1"}</div>
          <span className="step-label">{t("checkout.step1")}</span>
        </div>
        <div className="step-line"></div>
        <div className={`checkout-step-item ${step >= 2 ? "active" : ""} ${step > 2 ? "completed" : ""}`}>
          <div className="step-number">{step > 2 ? "✓" : "2"}</div>
          <span className="step-label">{t("checkout.step2")}</span>
        </div>
        <div className="step-line"></div>
        <div className={`checkout-step-item ${step >= 3 ? "active" : ""}`}>
          <div className="step-number">3</div>
          <span className="step-label">{t("checkout.step3")}</span>
        </div>
      </div>

      <div className="checkout-wrapper">
        <div className="checkout-card">
          {/* STEP 1: ADDRESS & ITEMS REVIEW */}
          {step === 1 && (
            <div className="checkout-step-content">
              <h2>📍 {t("checkout.deliveryAddress")}</h2>

              {/* Saved Address Preview Card */}
              {selectedAddress && (
                <div className="selected-address-box">
                  <div className="addr-box-header">
                    <div>
                      <strong>{selectedAddress.fullName}</strong>
                      <span className="addr-phone">📱 {selectedAddress.phone}</span>
                    </div>
                    <button
                      type="button"
                      className="change-addr-btn"
                      onClick={() => setShowAddressModal(true)}
                    >
                      {t("checkout.changeAddress")}
                    </button>
                  </div>
                  <p className="addr-text">
                    {selectedAddress.street}, {selectedAddress.city}, {selectedAddress.state} -{" "}
                    <strong>{selectedAddress.pincode}</strong>
                  </p>
                </div>
              )}

              {/* Items Summary in Step 1 */}
              <div className="checkout-items-list">
                <h3>{t("checkout.orderItems")} ({checkoutItems.length})</h3>
                {checkoutItems.map((item) => (
                  <div key={item.productId || item._id} className="checkout-item-row">
                    <img
                      src={item.images?.[0] || `https://picsum.photos/seed/${item.productId}/80/80`}
                      alt={item.title}
                    />
                    <div className="checkout-item-info">
                      <strong><ProductTransText text={item.title} /></strong>
                      <span>Qty: {item.quantity} × ₹{Number(item.price).toLocaleString()}</span>
                    </div>
                    <span className="checkout-item-price">
                      ₹{(Number(item.price) * Number(item.quantity)).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {checkoutError && <div className="checkout-error-banner">{checkoutError}</div>}

              <button
                type="button"
                className="checkout-next-btn"
                onClick={handleContinueToPayment}
              >
                {t("checkout.proceedToPayment")} →
              </button>
            </div>
          )}

          {/* STEP 2: PAYMENT METHOD SELECTION */}
          {step === 2 && (
            <div className="checkout-step-content">
              <div className="step2-header">
                <button
                  type="button"
                  className="step-back-btn"
                  onClick={() => setStep(1)}
                >
                  ← {t("checkout.backToAddress")}
                </button>
                <h2>💳 {t("checkout.selectPaymentMethod")}</h2>
              </div>

              <div className="payment-options-grid">
                {/* Credit / Debit Card */}
                <label className={`payment-option-card ${paymentMethod === "card" ? "selected" : ""}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === "card"}
                    onChange={() => setPaymentMethod("card")}
                  />
                  <div className="pay-option-body">
                    <div className="pay-option-title">
                      <span>💳 Credit / Debit / ATM Card</span>
                      <small>Visa, MasterCard, RuPay, Amex</small>
                    </div>
                  </div>
                </label>

                {/* UPI Direct App */}
                <label className={`payment-option-card ${paymentMethod === "upi_direct" ? "selected" : ""}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === "upi_direct"}
                    onChange={() => setPaymentMethod("upi_direct")}
                  />
                  <div className="pay-option-body">
                    <div className="pay-option-title">
                      <span>📱 UPI Instant (GPay / PhonePe / Paytm)</span>
                    </div>
                    {paymentMethod === "upi_direct" && (
                      <div className="upi-apps-row">
                        {["GPay", "PhonePe", "Paytm", "BHIM"].map((app) => (
                          <button
                            key={app}
                            type="button"
                            className={`upi-app-btn ${selectedUpiApp === app ? "selected" : ""}`}
                            onClick={() => setSelectedUpiApp(app)}
                          >
                            {app}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </label>

                {/* Cash on Delivery */}
                <label className={`payment-option-card ${paymentMethod === "cod" ? "selected" : ""}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                  />
                  <div className="pay-option-body">
                    <div className="pay-option-title">
                      <span>💵 Cash on Delivery (COD)</span>
                      <small>Pay with cash or UPI upon delivery</small>
                    </div>
                  </div>
                </label>
              </div>

              {checkoutError && <div className="checkout-error-banner">{checkoutError}</div>}

              {/* 🔒 DUPLICATE SUBMISSION PROTECTED BUTTON */}
              <button
                type="button"
                className="checkout-pay-btn"
                onClick={handleFinalOrder}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span>⏳ Processing Order Safely...</span>
                ) : (
                  <span>🔒 Pay & Place Order (₹{finalTotal.toLocaleString()})</span>
                )}
              </button>
            </div>
          )}

          {/* STEP 3: ORDER CONFIRMED */}
          {step === 3 && orderPlaced && (
            <div className="order-confirmed-view">
              <div className="confirmed-icon">🎉</div>
              <h2>{t("checkout.orderSuccessTitle")}</h2>
              <p className="confirmed-order-id">
                {t("checkout.orderNumber")}: <strong>{placedOrderId}</strong>
              </p>
              <p className="confirmed-msg">
                {t("checkout.orderSuccessDesc")}
              </p>
              <div className="confirmed-countdown">
                Redirecting to Orders in <strong>{countdown}s</strong>...
              </div>
              <button
                className="view-orders-now-btn"
                onClick={() => navigate("/orders")}
              >
                {t("orders.title")} →
              </button>
            </div>
          )}
        </div>

        {/* RIGHT: ORDER SUMMARY SIDEBAR */}
        {step < 3 && (
          <aside className="checkout-summary-sidebar">
            <h3>{t("cart.priceDetails")}</h3>

            <div className="summary-row">
              <span>Total MRP ({checkoutItems.reduce((a, b) => a + b.quantity, 0)} items)</span>
              <span>₹{totalMRP.toLocaleString()}</span>
            </div>

            <div className="summary-row discount">
              <span>Catalogue Discount</span>
              <span>− ₹{catalogDiscount.toLocaleString()}</span>
            </div>

            {couponDiscountAmount > 0 && (
              <div className="summary-row discount coupon">
                <span>🏷️ Coupon Discount ({appliedCoupon.code})</span>
                <span>− ₹{couponDiscountAmount.toLocaleString()}</span>
              </div>
            )}

            <div className="summary-row">
              <span>Delivery Charges</span>
              <span className="free-text">FREE</span>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-total-row">
              <strong>{t("cart.totalAmount")}</strong>
              <strong className="total-amount">₹{finalTotal.toLocaleString()}</strong>
            </div>

            {appliedCoupon && (
              <div className="applied-coupon-badge">
                <span>🏷️ Coupon <strong>{appliedCoupon.code}</strong> Applied</span>
              </div>
            )}
          </aside>
        )}
      </div>

      {/* CHANGE ADDRESS POPUP MODAL */}
      {showAddressModal && (
        <div className="address-modal-overlay">
          <div className="address-modal-card">
            <div className="addr-modal-header">
              <h3>{t("checkout.selectDeliveryAddress")}</h3>
              <button onClick={() => setShowAddressModal(false)}>✕</button>
            </div>
            <div className="addr-modal-list">
              {savedAddresses.map((addr) => (
                <div
                  key={addr.id}
                  className={`modal-addr-item ${selectedAddress?.id === addr.id ? "selected" : ""}`}
                  onClick={() => handleSelectAddress(addr)}
                >
                  <div className="modal-addr-header">
                    <strong>{addr.fullName}</strong>
                    <span>{addr.phone}</span>
                  </div>
                  <p>{addr.street}, {addr.city}, {addr.state} - {addr.pincode}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
