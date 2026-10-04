import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearCart, removeFromCart } from "../redux/cartSlice";
import { useNavigate, useLocation, Link } from "react-router-dom";
import api from "../api";
import "./Checkout.css";
import { useTranslation } from "react-i18next";
import ProductTransText from "./ProductTransText";
import { FaMapMarkerAlt } from "react-icons/fa";

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

  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [selectedUpiApp, setSelectedUpiApp] = useState("Google Pay");
  const [upiId, setUpiId] = useState("");

  function loadRazorpayScript() {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

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
    if (appliedCoupon.discountAmount !== undefined) {
      couponDiscountAmount = appliedCoupon.discountAmount;
    } else if (appliedCoupon.discountType === "percentage") {
      couponDiscountAmount = Math.round((rawSubtotal * appliedCoupon.discountValue) / 100);
    } else if (appliedCoupon.discountType === "fixed") {
      couponDiscountAmount = appliedCoupon.discountValue;
    } else if (appliedCoupon.code === "SAVE10") {
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

  const finalizeOrder = async (extraPaymentDetails = {}) => {
    try {
      setIsSubmitting(true);

      const paymentDetails = {
        method: paymentMethod,
        ...extraPaymentDetails,
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
        paymentMethod:
          paymentMethod === "razorpay"
            ? "Online (Razorpay)"
            : paymentMethod === "upi"
            ? `UPI (${selectedUpiApp || "Instant"})`
            : "Cash on Delivery",
        paymentDetails,
        couponCode: appliedCoupon?.code || null,
        discountAmount: couponDiscountAmount,
      };

      const res = await api.post("/orders", orderPayload);
      const createdOrderId = res.data?.order?._id || `ORD-${Date.now()}`;
      setPlacedOrderId(createdOrderId);

      // Clear Redux Cart, Local Storage & Backend API Cart
      if (singleItem) {
        const itemProdId = singleItem.productId || singleItem._id;
        dispatch(removeFromCart(itemProdId));
        try {
          await api.delete(`/cart/${itemProdId}`);
        } catch {}
      } else {
        dispatch(clearCart());
        try {
          await api.delete("/cart/clear");
        } catch {}
      }
      sessionStorage.removeItem("pvx_applied_coupon");

      setOrderPlaced(true);
      setStep(3);

      // Countdown Timer for Auto Redirect
      let timer = 1;
      const interval = setInterval(() => {
        timer -= 1;
        setCountdown(timer);
        if (timer <= 0) {
          clearInterval(interval);
          navigate("/");
        }
      }, 1000);
    } catch (err) {
      setCheckoutError(err.response?.data?.message || "Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  async function handleFinalOrder(e) {
    e?.preventDefault();
    if (isSubmitting) return;

    setCheckoutError("");

    if (paymentMethod === "upi") {
      await finalizeOrder({
        gateway: "UPI Instant Direct",
        upiApp: selectedUpiApp,
        upiId: upiId || undefined,
      });
      return;
    }

    if (paymentMethod === "razorpay") {
      try {
        setIsSubmitting(true);
        const isLoaded = await loadRazorpayScript();

        // Call backend to create Razorpay Order
        const orderRes = await api.post("/payment/create-order", {
          amount: finalTotal,
          items: checkoutItems,
        });

        const { order, key, isMock } = orderRes.data || {};

        if (!isLoaded || isMock || !window.Razorpay) {
          // Fallback / mock payment confirmation
          await finalizeOrder({
            gateway: "Razorpay (Test / Mock)",
            razorpay_order_id: order?.id || `mock_${Date.now()}`,
          });
          return;
        }

        const options = {
          key: key || "rzp_test_placeholder",
          amount: order.amount,
          currency: order.currency || "INR",
          name: "MYCA Store",
          description: `Online Payment for ${checkoutItems.length} items`,
          image: "https://cdn-icons-png.flaticon.com/512/3081/3081840.png",
          order_id: order.id,
          handler: async function (response) {
            try {
              await api.post("/payment/verify-payment", {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });
            } catch (vErr) {
              console.warn("Signature verification:", vErr);
            }

            await finalizeOrder({
              gateway: "Razorpay",
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
          },
          prefill: {
            name: form.name,
            email: form.email,
            contact: selectedAddress?.phone || "9876543210",
          },
          notes: {
            address: form.address,
          },
          theme: {
            color: "#8B5E3C",
          },
          modal: {
            ondismiss: function () {
              setIsSubmitting(false);
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", function (resp) {
          setIsSubmitting(false);
          setCheckoutError(resp.error?.description || "Payment failed. Please try again.");
        });
        rzp.open();
      } catch (err) {
        console.error("Razorpay error:", err);
        setIsSubmitting(false);
        await finalizeOrder({ gateway: "Razorpay (Direct Mode)" });
      }
    } else {
      // COD
      await finalizeOrder({ method: "cod" });
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
              <h2 className="delivery-address-heading">
                <span className="location-pin-icon-badge">
                  <FaMapMarkerAlt />
                </span>
                <span>{t("checkout.deliveryAddress")}</span>
              </h2>

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
                {/* 1. ⚡ Online Payment via Razorpay */}
                <label className={`payment-option-card ${paymentMethod === "razorpay" ? "selected" : ""}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === "razorpay"}
                    onChange={() => setPaymentMethod("razorpay")}
                  />
                  <div className="pay-option-body">
                    <div className="pay-option-title">
                      <div className="pay-title-with-badge">
                        <span>⚡ Online Payment (Razorpay)</span>
                        <span className="pay-secure-badge">Recommended</span>
                      </div>
                      <small>Credit / Debit Cards, NetBanking, Wallets, PayLater</small>
                    </div>
                  </div>
                </label>

                {/* 2. 📱 UPI Instant Apps */}
                <label className={`payment-option-card ${paymentMethod === "upi" ? "selected" : ""}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === "upi"}
                    onChange={() => setPaymentMethod("upi")}
                  />
                  <div className="pay-option-body">
                    <div className="pay-option-title">
                      <div className="pay-title-with-badge">
                        <span>📱 UPI Instant (GPay / PhonePe / Paytm / BHIM)</span>
                        <span className="pay-instant-badge">Instant</span>
                      </div>
                      <small>Pay directly using any installed UPI App or UPI ID</small>
                    </div>

                    {paymentMethod === "upi" && (
                      <div className="upi-expand-section">
                        <div className="upi-apps-row">
                          {["Google Pay", "PhonePe", "Paytm", "BHIM UPI"].map((app) => (
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
                        <div className="upi-id-input-wrap">
                          <input
                            type="text"
                            placeholder="Or enter UPI ID (e.g. yourname@okhdfcbank)"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            className="upi-id-input"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </label>

                {/* 3. 💵 Cash on Delivery */}
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
        <div className="address-modal-overlay" onClick={() => setShowAddressModal(false)}>
          <div className="address-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="addr-modal-header">
              <h3>📍 {t("checkout.selectDeliveryAddress") || "Select Delivery Address"}</h3>
              <button className="addr-modal-close-btn" onClick={() => setShowAddressModal(false)}>✕</button>
            </div>
            <div className="addr-modal-list">
              {savedAddresses.map((addr) => (
                <div
                  key={addr.id}
                  className={`modal-addr-item ${selectedAddress?.id === addr.id ? "selected" : ""}`}
                  onClick={() => handleSelectAddress(addr)}
                >
                  <div className="modal-addr-radio">
                    <input
                      type="radio"
                      name="selected_address_radio"
                      checked={selectedAddress?.id === addr.id}
                      onChange={() => handleSelectAddress(addr)}
                    />
                  </div>
                  <div className="modal-addr-details">
                    <div className="modal-addr-header">
                      <strong>{addr.fullName}</strong>
                      {addr.isDefault && <span className="default-tag">Default</span>}
                      <span className="modal-addr-phone">📱 {addr.phone}</span>
                    </div>
                    <p className="modal-addr-street">
                      {addr.street}, {addr.city}, {addr.state} - <strong>{addr.pincode}</strong>
                    </p>
                  </div>
                  {selectedAddress?.id === addr.id && (
                    <div className="selected-checkmark">✓ Selected</div>
                  )}
                </div>
              ))}
            </div>
            <div className="addr-modal-footer">
              <button
                type="button"
                className="add-new-addr-modal-btn"
                onClick={() => {
                  setShowAddressModal(false);
                  navigate("/profile?tab=addresses");
                }}
              >
                + Add / Manage Addresses in Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
