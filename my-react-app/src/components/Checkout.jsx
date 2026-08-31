import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearCart, removeFromCart } from "../redux/cartSlice";
import { useNavigate, useLocation, Link } from "react-router-dom";
import api from "../api";
import "./Checkout.css";
import { useTranslation } from "react-i18next";
import ProductTransText from "./ProductTransText";

function Checkout() {
  const { t } = useTranslation();
  const location = useLocation();
  const reduxCartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const singleItem = location.state?.singleItem;
  const checkoutItems = singleItem ? [singleItem] : reduxCartItems;

  const [step, setStep] = useState(1); // 1 = Address & Items & Price Summary, 2 = Final Payment Selection
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [countdown, setCountdown] = useState(1);
  const [showAddressModal, setShowAddressModal] = useState(false);

  // Distinct sample addresses with unique names, phone numbers, and locations
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
    {
      id: "addr-sample-3",
      fullName: "Priya Malhotra",
      phone: "9911445566",
      street: "House No. 84, Ring Road, Model Town",
      city: "New Delhi",
      state: "Delhi",
      pincode: "110009",
      isDefault: false,
    },
  ];

  // Address list state
  const [savedAddresses, setSavedAddresses] = useState(() => {
    try {
      const saved = localStorage.getItem("pvx_user_addresses");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Keep user's default saved address as first item if available, and append unique sample addresses
          const uniqueSamples = SAMPLE_ADDRESSES.filter(
            (s) => !parsed.some((p) => p.street === s.street || p.fullName === s.fullName)
          );
          return [...parsed, ...uniqueSamples];
        }
      }
      return SAMPLE_ADDRESSES;
    } catch {
      return SAMPLE_ADDRESSES;
    }
  });

  // Selected address state
  const [selectedAddress, setSelectedAddress] = useState(null);

  // Form state
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
  });

  // Initialize selected address and form on load
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

      // Update localStorage with distinct addresses list
      localStorage.setItem("pvx_user_addresses", JSON.stringify(savedAddresses));

      let currentAddr = null;
      if (savedAddresses.length > 0) {
        currentAddr = savedAddresses.find((a) => a.isDefault) || savedAddresses[0];
      }

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
  }, []);

  const total = checkoutItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

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
    if (!form.name || !form.email || !form.address) {
      alert("Please enter/select a delivery address!");
      return;
    }
    setStep(2);
  };

  async function handleFinalOrder(e) {
    e.preventDefault();

    if (paymentMethod === "upi_direct" && !selectedUpiApp) {
      alert("Please select a UPI App (PhonePe or Google Pay) to continue.");
      return;
    }

    const saveOrderToDatabase = async (payId = "") => {
      const orderPayload = {
        items: checkoutItems.map((item) => ({
          productId: item.productId || item._id || item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          image: item.images?.[0] || item.image || "",
        })),
        totalAmount: total,
        paymentMethod: paymentMethod === "upi_direct" ? "upi" : paymentMethod,
        paymentId: payId,
        shippingAddress: selectedAddress || { fullName: form.name, email: form.email, street: form.address },
      };

      try {
        await api.post("/orders", orderPayload);
      } catch (err) {
        console.error("Error saving order to backend:", err);
      }

      // Save to localStorage as seamless fallback
      try {
        const existingOrders = JSON.parse(localStorage.getItem("pvx_user_orders") || "[]");
        const localOrder = {
          orderId: "ORD-" + Date.now() + "-" + Math.floor(1000 + Math.random() * 9000),
          items: orderPayload.items,
          totalAmount: total,
          paymentMethod: paymentMethod,
          paymentId: payId,
          status: "Confirmed",
          shippingAddress: orderPayload.shippingAddress,
          createdAt: new Date().toISOString(),
        };
        existingOrders.unshift(localOrder);
        localStorage.setItem("pvx_user_orders", JSON.stringify(existingOrders));
      } catch (e) {}
    };

    const completeClearCart = async (payId = "") => {
      await saveOrderToDatabase(payId);

      if (singleItem) {
        try {
          await api.delete(`/cart/${singleItem.productId}`);
        } catch {}
        dispatch(removeFromCart(singleItem.productId));
      } else {
        try {
          await api.delete("/cart/clear");
        } catch {}
        dispatch(clearCart());
      }
      setOrderPlaced(true);
    };

    if (paymentMethod === "upi") {
      // 💳 ONLINE PAYMENT VIA RAZORPAY
      try {
        const { data: orderRes } = await api.post("/payment/create-order", { amount: total });
        
        if (!orderRes.success) {
          alert("Could not create Razorpay order. Please try again.");
          return;
        }

        const rzpKey = orderRes.key || "rzp_test_TOb9ndistzEYCD";
        const options = {
          key: rzpKey,
          amount: orderRes.order.amount,
          currency: orderRes.order.currency || "INR",
          name: "Shop Online",
          description: "Order Purchase Payment",
          order_id: orderRes.order.id,
          handler: async function (response) {
            try {
              const { data: verifyRes } = await api.post("/payment/verify-payment", {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });

              if (verifyRes.success) {
                await completeClearCart(response.razorpay_payment_id);
              } else {
                alert("Payment verification failed!");
              }
            } catch (err) {
              alert("Payment verification error!");
            }
          },
          prefill: {
            name: form.name || "Customer",
            email: form.email || "customer@example.com",
            contact: selectedAddress?.phone || "9876543210",
          },
          theme: {
            color: "#00d4aa",
          },
        };

        if (window.Razorpay) {
          const rzp1 = new window.Razorpay(options);
          rzp1.on("payment.failed", function (response) {
            alert("Payment Failed: " + (response.error?.description || "Transaction cancelled"));
          });
          rzp1.open();
        } else {
          alert("Razorpay SDK not loaded. Please refresh the page.");
        }
      } catch (err) {
        console.error("Razorpay error detail:", err.response?.data || err.message);
        alert("Payment Error: " + (err.response?.data?.message || err.message || "Server Error"));
      }
    } else if (paymentMethod === "upi_direct") {
      // 📱 MOCK UPI APP PAYMENT
      await completeClearCart("UPI-" + selectedUpiApp.toUpperCase() + "-" + Date.now());
    } else {
      // 💵 CASH ON DELIVERY
      await completeClearCart("COD-" + Date.now());
    }
  }

  useEffect(() => {
    let timer;
    if (orderPlaced) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(timer);
            navigate("/");
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [orderPlaced, navigate]);

  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [selectedUpiApp, setSelectedUpiApp] = useState("");

  return (
    <div className="checkout-page">
      {!orderPlaced ? (
        step === 1 ? (
          /* STEP 1: Address, Order Items, Price Details -> Continue */
          <form className="checkout-card" onSubmit={handleContinueToPayment}>
            <Link to="/" className="cart-back" style={{ marginBottom: "1rem", display: "inline-block" }}>{t("checkout.backToHome")}</Link>
            <h1>{t("checkout.orderSummary")}</h1>

            {singleItem && (
              <div className="single-item-notice">
                {t("checkout.directBuyMode")} <strong><ProductTransText text={singleItem.title} /></strong> {t("checkout.only")}
              </div>
            )}

            {/* 1. DELIVERY ADDRESS SECTION */}
            <div className="checkout-section">
              <div className="checkout-section-header">
                <h2>{t("checkout.deliveryAddress")}</h2>
                {savedAddresses.length > 0 && (
                  <button
                    type="button"
                    className="change-address-btn"
                    onClick={() => setShowAddressModal(true)}
                  >
                    {t("checkout.changeAddress")}
                  </button>
                )}
              </div>

              <div className="current-address-box">
                {selectedAddress ? (
                  <div>
                    <div className="addr-user-row">
                      <strong>{selectedAddress.fullName}</strong>
                      <span className="addr-phone-tag">📞 {selectedAddress.phone}</span>
                      {selectedAddress.isDefault && (
                        <span className="addr-default-tag">{t("checkout.default")}</span>
                      )}
                    </div>
                    <p className="addr-full-text">
                      {selectedAddress.street}, {selectedAddress.city}, {selectedAddress.state} - <strong>{selectedAddress.pincode}</strong>
                    </p>
                  </div>
                ) : (
                  <div className="manual-address-input">
                    <div className="form-group" style={{ marginBottom: "12px" }}>
                      <label>{t("checkout.fullName")}</label>
                      <input
                        type="text"
                        required
                        placeholder={t("address.fullNamePlaceholder")}
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: "12px" }}>
                      <label>{t("checkout.emailAddress")}</label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. rahul@gmail.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>{t("checkout.deliveryAddressDetails")}</label>
                      <textarea
                        required
                        placeholder={t("address.streetPlaceholder")}
                        value={form.address}
                        onChange={(e) => setForm({ ...form, address: e.target.value })}
                        rows="2"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 2. CART PRODUCTS ITEMS LIST */}
            <div className="checkout-section">
              <h2>{t("checkout.orderItems")} ({checkoutItems.reduce((acc, i) => acc + i.quantity, 0)})</h2>
              <div className="checkout-items-list">
                {checkoutItems.length === 0 ? (
                  <p className="empty">{t("checkout.cartEmpty")}</p>
                ) : (
                  checkoutItems.map((item) => (
                    <div className="checkout-item-row" key={item.productId || item.title || item._id}>
                      <img
                        src={item.images?.[0] || `https://picsum.photos/seed/${item.productId}/100/100`}
                        alt={item.title}
                        className="checkout-item-img"
                      />
                      <div className="checkout-item-info">
                        <h4><ProductTransText text={item.title} /></h4>
                        <span className="checkout-item-qty">{t("checkout.qty")}: {item.quantity} × ₹{item.price}</span>
                      </div>
                      <strong className="checkout-item-total">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </strong>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* 3. PRICE DETAILS SUMMARY AT BOTTOM */}
            <div className="checkout-price-details-box">
              <h2>{t("checkout.priceDetails")}</h2>

              <div className="checkout-price-row">
                <span className="checkout-row-label">
                  {t("checkout.mrp")} ({checkoutItems.reduce((acc, i) => acc + i.quantity, 0)} {t("checkout.items")})
                  <small className="checkout-tax-subtext">{t("checkout.inclTaxes")}</small>
                </span>
                <span className="checkout-mrp-amount">₹{(total * 1.1).toFixed(2)}</span>
              </div>

              <div className="checkout-price-row checkout-discount-row">
                <span className="checkout-discount-label">{t("checkout.extraDiscount")}</span>
                <span className="checkout-discount-amount">− ₹{(total * 0.1).toFixed(2)}</span>
              </div>

              <div className="checkout-divider" />

              <div className="checkout-total-row">
                <span className="checkout-total-label">{t("checkout.totalAmountToPay")}</span>
                <strong className="checkout-total-val">₹{total.toFixed(2)}</strong>
              </div>
            </div>

            <button className="pay-btn" type="submit">
              {t("checkout.continueToPayment")}
            </button>
          </form>
        ) : (
          /* STEP 2: ONLY Amount Payable & Payment Method Options -> Confirm & Pay */
          <form className="checkout-card" onSubmit={handleFinalOrder}>
            <div className="step-back-header">
              <button type="button" className="step-back-btn" onClick={() => setStep(1)}>
                {t("checkout.backToOrderSummary")}
              </button>
            </div>

            <h1>{t("checkout.selectPaymentMethod")}</h1>

            {/* AMOUNT TO PAY CARD */}
            <div className="payment-amount-highlight">
              <span>{t("checkout.totalAmountPayable")}</span>
              <strong>₹{total.toFixed(2)}</strong>
            </div>

            {/* PAYMENT METHOD SELECTION */}
            <div className="checkout-section" style={{ marginTop: "24px" }}>
              <h2>{t("checkout.choosePaymentOption")}</h2>
              <div className="payment-options">
                <label className={`payment-option ${paymentMethod === "upi" ? "selected" : ""}`}>
                  <input
                    type="radio"
                    name="payment"
                    value="upi"
                    checked={paymentMethod === "upi"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>{t("checkout.cardNetBanking")}</span>
                </label>

                <label className={`payment-option ${paymentMethod === "upi_direct" ? "selected" : ""}`}>
                  <input
                    type="radio"
                    name="payment"
                    value="upi_direct"
                    checked={paymentMethod === "upi_direct"}
                    onChange={(e) => {
                      setPaymentMethod(e.target.value);
                      setSelectedUpiApp("");
                    }}
                  />
                  <span>{t("checkout.upiPayment")}</span>
                </label>

                {paymentMethod === "upi_direct" && (
                  <div className="upi-apps-container">
                    <label className={`upi-app-option ${selectedUpiApp === "phonepe" ? "active" : ""}`}>
                      <input
                        type="radio"
                        name="upi_app"
                        value="phonepe"
                        checked={selectedUpiApp === "phonepe"}
                        onChange={(e) => setSelectedUpiApp(e.target.value)}
                      />
                      <span className="upi-app-name">{t("checkout.phonePe")}</span>
                    </label>
                    <label className={`upi-app-option ${selectedUpiApp === "gpay" ? "active" : ""}`}>
                      <input
                        type="radio"
                        name="upi_app"
                        value="gpay"
                        checked={selectedUpiApp === "gpay"}
                        onChange={(e) => setSelectedUpiApp(e.target.value)}
                      />
                      <span className="upi-app-name">{t("checkout.googlePay")}</span>
                    </label>
                  </div>
                )}

                <label className={`payment-option ${paymentMethod === "cod" ? "selected" : ""}`}>
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>{t("checkout.cashOnDelivery")}</span>
                </label>
              </div>
            </div>

            <button className="pay-btn" type="submit" style={{ marginTop: "32px" }}>
              {t("checkout.confirmAndPay")} ₹{total.toFixed(2)} →
            </button>
          </form>
        )
      ) : (
        <div className="success-card">
          <h1>{t("checkout.orderConfirmed")}</h1>
          <p>{t("checkout.thankYou")}</p>
          <span>{t("checkout.redirecting")} {countdown}s…</span>
        </div>
      )}

      {/* CHANGE ADDRESS POPUP MODAL */}
      {showAddressModal && (
        <div className="address-select-modal-overlay">
          <div className="address-select-modal">
            <div className="modal-header">
              <h3>{t("checkout.selectDeliveryAddress")}</h3>
              <button className="close-modal-btn" onClick={() => setShowAddressModal(false)}>✕</button>
            </div>

            <div className="saved-addresses-modal-list">
              {savedAddresses.map((addr) => (
                <div
                  key={addr.id}
                  className={`modal-addr-card ${selectedAddress?.id === addr.id ? "selected" : ""}`}
                  onClick={() => handleSelectAddress(addr)}
                >
                  <div className="modal-addr-top">
                    <strong>{addr.fullName}</strong>
                    {addr.isDefault && <span className="default-tag">{t("checkout.default")}</span>}
                  </div>
                  <p className="modal-addr-phone">📞 {addr.phone}</p>
                  <p className="modal-addr-text">
                    {addr.street}, {addr.city}, {addr.state} - {addr.pincode}
                  </p>
                  <button type="button" className="select-addr-action-btn">
                    {selectedAddress?.id === addr.id ? t("checkout.selected") : t("checkout.deliverHere")}
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="modal-add-new-btn"
              onClick={() => {
                setShowAddressModal(false);
                navigate("/address");
              }}
            >
              {t("checkout.addManageAddresses")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Checkout;
