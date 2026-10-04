import React, { useEffect, useState, useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import { removeFromWishlist } from "../redux/wishlistSlice";
import api from "../api";
import "./Profile.css";
import { useTranslation } from "react-i18next";
import ProductTransText from "./ProductTransText";

// React Icons
import {
  FaUserCircle,
  FaUserEdit,
  FaLock,
  FaMapMarkerAlt,
  FaShoppingBag,
  FaHeart,
  FaCreditCard,
  FaBell,
  FaShieldAlt,
  FaQuestionCircle,
  FaFileContract,
  FaSignOutAlt,
  FaPlus,
  FaTrashAlt,
  FaEdit,
  FaCheckCircle,
  FaExclamationCircle,
  FaEye,
  FaEyeSlash,
  FaArrowLeft,
  FaDownload,
  FaChevronDown,
  FaChevronUp,
  FaBoxOpen,
  FaTruck,
  FaStar,
  FaHome,
  FaBuilding,
  FaTimes,
  FaChevronRight,
  FaPhoneAlt,
  FaEnvelope,
  FaCcVisa,
  FaCcMastercard,
  FaMoneyCheckAlt,
  FaCommentDots,
} from "react-icons/fa";

const STORAGE_KEY_ADDRESSES = "pvx_user_addresses";
const STORAGE_KEY_PAYMENTS = "pvx_user_payments";
const STORAGE_KEY_NOTIFS = "pvx_user_notifications";

export default function Profile() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items || []);
  const [searchParams, setSearchParams] = useSearchParams();

  // Active Tab from URL query param or default to 'overview'
  const initialTab = searchParams.get("tab") || "overview";
  const [activeTab, setActiveTab] = useState(initialTab);

  // User Profile State
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "Not specified",
    dob: "",
    altPhone: "",
  });

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "Not specified",
    dob: "",
    altPhone: "",
  });

  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [toastMessage, setToastMessage] = useState({ type: "", text: "" });

  // Robust Redux Wishlist Selector with null-safety and localStorage fallback
  const rawWishlistItems = useSelector((state) => state.wishlist?.items);
  const wishlistItems = useMemo(() => {
    if (Array.isArray(rawWishlistItems)) {
      return rawWishlistItems.filter((item) => item && typeof item === "object");
    }
    try {
      const stored = localStorage.getItem("pvx_wishlist");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed.filter((item) => item && typeof item === "object");
        }
      }
    } catch {}
    return [];
  }, [rawWishlistItems]);

  // Orders State
  const [orders, setOrders] = useState([]);
  const [orderFilter, setOrderFilter] = useState("all");

  // Addresses State
  const [addresses, setAddresses] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ADDRESSES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
      return [
        {
          id: "addr_default_1",
          fullName: "Primary Delivery Address",
          phone: "9876543210",
          street: "Flat 402, Royal Palms, MG Road",
          city: "Bengaluru",
          state: "Karnataka",
          pincode: "560001",
          type: "Home",
          isDefault: true,
        },
      ];
    } catch {
      return [];
    }
  });

  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressForm, setAddressForm] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    type: "Home",
    isDefault: false,
  });

  // Saved Payments State
  const [paymentMethods, setPaymentMethods] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PAYMENTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
      return [
        {
          id: "card_1",
          type: "card",
          brand: "Visa",
          cardNumber: "•••• •••• •••• 4242",
          cardHolder: "Primary Account Holder",
          expiry: "08/29",
          isDefault: true,
        },
        {
          id: "upi_1",
          type: "upi",
          upiId: "shoppyuser@okhdfcbank",
          isDefault: false,
        },
      ];
    } catch {
      return [];
    }
  });

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentType, setPaymentType] = useState("card");
  const [cardForm, setCardForm] = useState({
    cardNumber: "",
    cardHolder: "",
    expiry: "",
    cvv: "",
    isDefault: false,
  });
  const [upiForm, setUpiForm] = useState({
    upiId: "",
    isDefault: false,
  });

  // Security / Password State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  // Notification Preferences State
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_NOTIFS);
      if (saved) return JSON.parse(saved);
      return {
        orderUpdates: true,
        shipmentTracking: true,
        promotions: false,
        priceAlerts: true,
        newsletters: false,
        whatsappUpdates: true,
      };
    } catch {
      return {
        orderUpdates: true,
        shipmentTracking: true,
        promotions: false,
        priceAlerts: true,
        newsletters: false,
        whatsappUpdates: true,
      };
    }
  });

  // Support / FAQ State
  const [faqSearch, setFaqSearch] = useState("");
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [ticketForm, setTicketForm] = useState({ subject: "", message: "", productName: "General Inquiry / Other", productId: "" });
  const [myTickets, setMyTickets] = useState([]);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [myPurchasedProducts, setMyPurchasedProducts] = useState([]);
  const [submittingTicket, setSubmittingTicket] = useState(false);

  const handleFetchMyTickets = async () => {
    try {
      const userEmail = user.email || "";
      const res = await api.get(`/public/tickets/user?email=${encodeURIComponent(userEmail)}`);
      if (Array.isArray(res.data)) setMyTickets(res.data);
    } catch {}
  };

  useEffect(() => {
    if (activeTab === "support") {
      handleFetchMyTickets();
      api.get("/products")
        .then((res) => { if (Array.isArray(res.data)) setAvailableProducts(res.data); })
        .catch(() => {});
      api.get("/orders")
        .then((res) => {
          const orderList = res.data?.orders || (Array.isArray(res.data) ? res.data : []);
          const items = [];
          orderList.forEach((ord) => {
            (ord.items || ord.cartItems || []).forEach((it) => {
              items.push({
                productId: it.productId || it._id || it.id,
                title: it.title || it.name,
                orderId: ord._id ? ord._id.slice(-6).toUpperCase() : "ORD",
              });
            });
          });
          setMyPurchasedProducts(items);
        })
        .catch(() => {});
    }
  }, [activeTab, user.email]);

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    if (!ticketForm.subject.trim() || !ticketForm.message.trim()) return;
    setSubmittingTicket(true);
    try {
      await api.post("/public/tickets", {
        name: user.name || "Customer",
        email: user.email || "customer@shoppyglobe.com",
        subject: ticketForm.subject.trim(),
        message: ticketForm.message.trim(),
        productName: ticketForm.productName || "General Inquiry / Other",
        productId: ticketForm.productId || null,
      });
      setTicketForm({ subject: "", message: "", productName: "General Inquiry / Other", productId: "" });
      showToast("success", "Support ticket submitted successfully! Admin team will reply soon.");
      handleFetchMyTickets();
    } catch {
      showToast("error", "Failed to submit ticket. Please try again.");
    } finally {
      setSubmittingTicket(false);
    }
  };

  // Terms Tab active category
  const [termsTab, setTermsTab] = useState("terms");

  // Logout / Deactivate Modals
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Sync tab with URL query parameter
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam && tabParam !== activeTab) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    setSearchParams({ tab: tabKey });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Toast helper
  const showToast = (type, text) => {
    setToastMessage({ type, text });
    setTimeout(() => {
      setToastMessage({ type: "", text: "" });
    }, 3800);
  };

  // Initial Load
  useEffect(() => {
    fetchUserData();
    fetchOrders();
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ADDRESSES, JSON.stringify(addresses));
  }, [addresses]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PAYMENTS, JSON.stringify(paymentMethods));
  }, [paymentMethods]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_NOTIFS, JSON.stringify(notifications));
  }, [notifications]);

  // Fetch User Data
  const fetchUserData = async () => {
    try {
      setLoading(true);
      const res = await api.get("/auth/me");
      const userData = res.data?.user || {};
      const userEmail = userData.email || "";

      let cachedProfile = {};
      try {
        if (userEmail) {
          cachedProfile = JSON.parse(
            localStorage.getItem("pvx_user_profile_" + userEmail) || "{}"
          );
        }
      } catch (e) {}

      const nameVal = userData.name || cachedProfile.name || "Valued Shopper";
      const phoneVal = userData.phone || cachedProfile.phone || "";
      const genderVal = cachedProfile.gender || "Not specified";
      const dobVal = cachedProfile.dob || "";
      const altPhoneVal = cachedProfile.altPhone || "";

      const fullUser = {
        name: nameVal,
        email: userEmail,
        phone: phoneVal,
        gender: genderVal,
        dob: dobVal,
        altPhone: altPhoneVal,
      };

      setUser(fullUser);
      setProfileForm(fullUser);
    } catch (err) {
      console.error("Failed to load user profile", err);
      const fallbackUser = {
        name: "Valued Shopper",
        email: "shopper@shoppyglobe.com",
        phone: "+91 98765 43210",
        gender: "Not specified",
        dob: "",
        altPhone: "",
      };
      setUser(fallbackUser);
      setProfileForm(fallbackUser);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Orders
  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders");
      if (res.data?.success && Array.isArray(res.data.orders)) {
        setOrders(res.data.orders);
      } else {
        loadLocalOrders();
      }
    } catch {
      loadLocalOrders();
    }
  };

  const loadLocalOrders = () => {
    try {
      const saved = localStorage.getItem("pvx_user_orders");
      if (saved) {
        const parsed = JSON.parse(saved);
        setOrders(Array.isArray(parsed) ? parsed : []);
      } else {
        setOrders([]);
      }
    } catch {
      setOrders([]);
    }
  };

  // Save Profile
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setSavingProfile(true);
      const res = await api.put("/auth/profile", {
        name: profileForm.name,
        phone: profileForm.phone,
      });

      const updatedUser = {
        ...user,
        ...profileForm,
        name: res.data?.user?.name || profileForm.name,
        phone: res.data?.user?.phone || profileForm.phone,
      };

      setUser(updatedUser);

      if (user.email) {
        localStorage.setItem(
          "pvx_user_profile_" + user.email,
          JSON.stringify(updatedUser)
        );
      }

      setIsEditingProfile(false);
      showToast("success", "Profile details updated successfully! ✨");
    } catch (err) {
      console.error("Profile save error", err);
      const updatedUser = { ...user, ...profileForm };
      setUser(updatedUser);
      if (user.email) {
        localStorage.setItem(
          "pvx_user_profile_" + user.email,
          JSON.stringify(updatedUser)
        );
      }
      setIsEditingProfile(false);
      showToast("success", "Profile details saved locally! ✨");
    } finally {
      setSavingProfile(false);
    }
  };

  // Save Password
  const handleSavePassword = (e) => {
    e.preventDefault();
    if (!passwordForm.currentPassword) {
      showToast("error", "Please enter your current password.");
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      showToast("error", "New password must be at least 6 characters long.");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast("error", "New password and Confirm password do not match.");
      return;
    }

    setPasswordSaving(true);
    setTimeout(() => {
      setPasswordSaving(false);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      showToast("success", "Password changed successfully! 🔐");
    }, 900);
  };

  const passwordStrength = useMemo(() => {
    const p = passwordForm.newPassword;
    if (!p) return 0;
    let score = 0;
    if (p.length >= 6) score++;
    if (/[A-Z]/.test(p) && /[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p) && p.length >= 8) score++;
    return score;
  }, [passwordForm.newPassword]);

  // Address Handlers
  const handleOpenAddAddress = () => {
    setEditingAddressId(null);
    setAddressForm({
      fullName: user.name || "",
      phone: user.phone || "",
      street: "",
      city: "",
      state: "",
      pincode: "",
      type: "Home",
      isDefault: addresses.length === 0,
    });
    setShowAddressModal(true);
  };

  const handleOpenEditAddress = (addr) => {
    setEditingAddressId(addr.id);
    setAddressForm({
      fullName: addr.fullName || "",
      phone: addr.phone || "",
      street: addr.street || "",
      city: addr.city || "",
      state: addr.state || "",
      pincode: addr.pincode || "",
      type: addr.type || "Home",
      isDefault: addr.isDefault || false,
    });
    setShowAddressModal(true);
  };

  const handleSaveAddress = (e) => {
    e.preventDefault();
    if (editingAddressId) {
      setAddresses((prev) =>
        prev.map((a) => {
          if (a.id === editingAddressId) {
            return { ...a, ...addressForm };
          }
          return addressForm.isDefault ? { ...a, isDefault: false } : a;
        })
      );
      showToast("success", "Address updated successfully!");
    } else {
      const newAddr = {
        id: "addr_" + Date.now(),
        ...addressForm,
      };
      setAddresses((prev) => {
        if (newAddr.isDefault) {
          return [...prev.map((a) => ({ ...a, isDefault: false })), newAddr];
        }
        return [...prev, newAddr];
      });
      showToast("success", "New address added successfully!");
    }
    setShowAddressModal(false);
  };

  const handleDeleteAddress = (id) => {
    setAddresses((prev) => {
      const filtered = prev.filter((a) => a.id !== id);
      if (filtered.length > 0 && !filtered.some((a) => a.isDefault)) {
        filtered[0].isDefault = true;
      }
      return filtered;
    });
    showToast("success", "Address removed from your address book.");
  };

  const handleSetDefaultAddress = (id) => {
    setAddresses((prev) =>
      prev.map((a) => ({
        ...a,
        isDefault: a.id === id,
      }))
    );
    showToast("success", "Default delivery address updated.");
  };

  // Payment Handlers
  const handleSavePayment = (e) => {
    e.preventDefault();
    if (paymentType === "card") {
      const cleanNum = cardForm.cardNumber.replace(/\s+/g, "");
      if (cleanNum.length < 12) {
        showToast("error", "Please enter a valid card number.");
        return;
      }
      const last4 = cleanNum.slice(-4);
      const isVisa = cleanNum.startsWith("4");
      const newCard = {
        id: "card_" + Date.now(),
        type: "card",
        brand: isVisa ? "Visa" : "Mastercard",
        cardNumber: `•••• •••• •••• ${last4}`,
        cardHolder: cardForm.cardHolder || user.name || "Cardholder",
        expiry: cardForm.expiry || "12/28",
        isDefault: cardForm.isDefault || paymentMethods.length === 0,
      };

      setPaymentMethods((prev) => {
        if (newCard.isDefault) {
          return [...prev.map((p) => ({ ...p, isDefault: false })), newCard];
        }
        return [...prev, newCard];
      });
      setCardForm({ cardNumber: "", cardHolder: "", expiry: "", cvv: "", isDefault: false });
      showToast("success", "Payment card saved securely!");
    } else {
      if (!upiForm.upiId.includes("@")) {
        showToast("error", "Please enter a valid UPI ID (e.g. name@bank).");
        return;
      }
      const newUpi = {
        id: "upi_" + Date.now(),
        type: "upi",
        upiId: upiForm.upiId,
        isDefault: upiForm.isDefault || paymentMethods.length === 0,
      };
      setPaymentMethods((prev) => {
        if (newUpi.isDefault) {
          return [...prev.map((p) => ({ ...p, isDefault: false })), newUpi];
        }
        return [...prev, newUpi];
      });
      setUpiForm({ upiId: "", isDefault: false });
      showToast("success", "UPI ID saved successfully!");
    }
    setShowPaymentModal(false);
  };

  const handleDeletePayment = (id) => {
    setPaymentMethods((prev) => prev.filter((p) => p.id !== id));
    showToast("success", "Payment method removed.");
  };

  const handleSetDefaultPayment = (id) => {
    setPaymentMethods((prev) =>
      prev.map((p) => ({
        ...p,
        isDefault: p.id === id,
      }))
    );
    showToast("success", "Default payment method updated.");
  };

  // Notification Handler
  const handleToggleNotification = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
    showToast("success", "Notification preferences saved.");
  };

  // Data Export (JSON)
  const handleDownloadUserData = () => {
    const dataObj = {
      userProfile: user,
      deliveryAddresses: addresses,
      ordersCount: orders.length,
      orders: orders,
      savedPaymentCount: paymentMethods.length,
      notificationSettings: notifications,
      exportTimestamp: new Date().toISOString(),
      platform: "ShoppyGlobe Luxury Ecommerce",
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dataObj, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `shoppyglobe_account_data_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast("success", "Account data downloaded successfully! 📥");
  };

  // Clear Activity
  const handleClearActivity = () => {
    try {
      localStorage.removeItem("pvx_recent_searches");
      showToast("success", "Search history & activity cleared.");
    } catch {
      showToast("error", "Failed to clear activity.");
    }
  };

  // Logout
  const handleConfirmLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {}
    localStorage.removeItem("pvx_auth_token");
    localStorage.removeItem("token");
    setShowLogoutModal(false);
    navigate("/login");
  };

  // Wishlist Action: Move to Cart (Safe Object Construction)
  const handleMoveToCart = async (item) => {
    if (!item) return;
    const prodId = item._id || item.productId || "prod_" + Date.now();
    const prodTitle = item.title || "Product";
    const prodPrice = Number(item.price) || 0;
    const prodImages = Array.isArray(item.images) && item.images.length > 0
      ? item.images
      : item.image
      ? [item.image]
      : [`https://picsum.photos/seed/${prodId}/300/300`];

    const currentQty = cartItems.find((i) => String(i.productId || i._id) === String(prodId))?.quantity || 0;

    dispatch(
      addToCart({
        _id: prodId,
        productId: prodId,
        title: prodTitle,
        price: prodPrice,
        images: prodImages,
        quantity: 1,
      })
    );
    dispatch(removeFromWishlist(prodId));

    try {
      await api.post("/cart/add", {
        productId: prodId,
        title: prodTitle,
        price: prodPrice,
        images: prodImages,
        quantity: 1,
        newTotalQty: currentQty + 1,
      });
    } catch {}

    showToast("success", `Moved "${prodTitle.slice(0, 22)}..." to Cart! 🛍️`);
  };

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    if (!Array.isArray(orders)) return [];
    if (orderFilter === "all") return orders;
    return orders.filter((o) => {
      if (!o) return false;
      const status = (o.status || "").toLowerCase();
      if (orderFilter === "delivered") return status.includes("deliver");
      if (orderFilter === "progress") return !status.includes("deliver") && !status.includes("cancel");
      if (orderFilter === "cancelled") return status.includes("cancel");
      return true;
    });
  }, [orders, orderFilter]);

  // FAQs Data
  const faqs = [
    {
      q: "How do I track my order status in real time?",
      a: "You can track your active orders by navigating to the 'My Orders' section in your Account Hub or visiting the dedicated Orders page. Each order features an interactive 5-stage shipment timeline with live courier milestones.",
    },
    {
      q: "What is ShoppyGlobe's return & exchange policy?",
      a: "We offer a hassle-free 15-day return and exchange policy on all eligible items. Products must be unused, in their original condition with all tags and authentic luxury packaging intact.",
    },
    {
      q: "How do I change my registered email address or phone number?",
      a: "You can update your phone number, gender, and birthdate in the 'Personal Information' tab. Registered email addresses are bound to your security identity.",
    },
    {
      q: "Is my saved payment and UPI information secure?",
      a: "Yes. All saved cards are tokenized and protected using 256-bit bank-grade PCI-DSS compliant encryption. We never store your CVV or complete card numbers on our servers.",
    },
    {
      q: "How can I redeem promotional discount coupon codes?",
      a: "You can apply valid promotional codes directly on the Cart and Checkout pages before placing your order. Active VIP discounts will be deducted instantly from your grand total.",
    },
  ];

  const filteredFaqs = faqs.filter(
    (f) =>
      f.q.toLowerCase().includes(faqSearch.toLowerCase()) ||
      f.a.toLowerCase().includes(faqSearch.toLowerCase())
  );

  if (loading) {
    return (
      <div className="account-hub-page">
        <div className="account-loading-box">
          <div className="account-spinner" />
          <p>{t("profile.loading") || "Loading your account profile..."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="account-hub-page">
      {/* TOAST POPUP NOTIFICATION */}
      {toastMessage.text && (
        <div className={`account-toast ${toastMessage.type}`}>
          {toastMessage.type === "success" ? <FaCheckCircle /> : <FaExclamationCircle />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      <div className="account-hub-container">
        {/* TOP BREADCRUMB / BACK */}
        <div className="account-top-bar">
          <Link to="/" className="account-back-store-btn">
            <FaArrowLeft /> {t("profile.backToHome") || "Back to Store"}
          </Link>
          <div className="account-breadcrumbs">
            <span>{t("header.home")}</span> / <strong className="active">{t("profile.myAccount")}</strong>
          </div>
        </div>

        {/* MOBILE HORIZONTAL TABS SELECTOR */}
        <div className="account-mobile-tabs-scroll">
          <button
            type="button"
            className={`mobile-tab-pill ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => handleTabChange("overview")}
          >
            <FaUserCircle /> {t("profile.accountOverview")}
          </button>
          <button
            type="button"
            className={`mobile-tab-pill ${activeTab === "personal_info" ? "active" : ""}`}
            onClick={() => handleTabChange("personal_info")}
          >
            <FaUserEdit /> {t("profile.personalDetails")}
          </button>
          <button
            type="button"
            className={`mobile-tab-pill ${activeTab === "orders" ? "active" : ""}`}
            onClick={() => handleTabChange("orders")}
          >
            <FaShoppingBag /> {t("profile.myOrdersAndTracking")} ({orders.length})
          </button>
          <button
            type="button"
            className={`mobile-tab-pill ${activeTab === "addresses" ? "active" : ""}`}
            onClick={() => handleTabChange("addresses")}
          >
            <FaMapMarkerAlt /> {t("profile.manageAddresses")} ({addresses.length})
          </button>
          <button
            type="button"
            className={`mobile-tab-pill ${activeTab === "wishlist" ? "active" : ""}`}
            onClick={() => handleTabChange("wishlist")}
          >
            <FaHeart /> {t("profile.wishlistAndSaved")} ({wishlistItems.length})
          </button>
          <button
            type="button"
            className={`mobile-tab-pill ${activeTab === "payments" ? "active" : ""}`}
            onClick={() => handleTabChange("payments")}
          >
            <FaCreditCard /> {t("profile.paymentMethods")}
          </button>
          <button
            type="button"
            className={`mobile-tab-pill ${activeTab === "security" ? "active" : ""}`}
            onClick={() => handleTabChange("security")}
          >
            <FaLock /> {t("profile.passwordAndSecurity")}
          </button>
          <button
            type="button"
            className={`mobile-tab-pill ${activeTab === "notifications" ? "active" : ""}`}
            onClick={() => handleTabChange("notifications")}
          >
            <FaBell /> {t("profile.notifications")}
          </button>
          <button
            type="button"
            className={`mobile-tab-pill ${activeTab === "support" ? "active" : ""}`}
            onClick={() => handleTabChange("support")}
          >
            <FaQuestionCircle /> {t("profile.helpCenterAndFaqs")}
          </button>
        </div>

        {/* MAIN MASTER-DETAIL GRID */}
        <div className="account-layout-grid">
          {/* ========================================================
              LEFT SIDEBAR — MASTER NAVIGATION
             ======================================================== */}
          <aside className="account-sidebar-card">
            {/* USER PROFILE HEADER BANNER */}
            <div className="sidebar-profile-header">
              <div className="sidebar-avatar-wrap">
                <div className="sidebar-avatar-bubble">
                  {user.name ? user.name.charAt(0).toUpperCase() : "👤"}
                </div>
                <span className="avatar-verified-tick" title="Verified Member">✓</span>
              </div>

              <div className="sidebar-user-meta">
                <h3 className="sidebar-user-name">{user.name || "User Account"}</h3>
                <p className="sidebar-user-email">{user.email || "No email"}</p>
                <div className="sidebar-membership-badge">
                  <FaStar className="star-icon" /> ShoppyClub VIP Member
                </div>
              </div>
            </div>

            {/* NAVIGATION MENU SECTIONS */}
            <nav className="sidebar-nav-menu">
              {/* SECTION 1: ACCOUNT & PROFILE */}
              <div className="sidebar-menu-group">
                <span className="sidebar-group-heading">{t("profile.accountAndProfile")}</span>
                <button
                  type="button"
                  className={`sidebar-nav-item ${activeTab === "overview" ? "active" : ""}`}
                  onClick={() => handleTabChange("overview")}
                >
                  <FaUserCircle className="item-icon" />
                  <span className="item-label">{t("profile.accountOverview")}</span>
                  <FaChevronRight className="item-arrow" />
                </button>

                <button
                  type="button"
                  className={`sidebar-nav-item ${activeTab === "personal_info" ? "active" : ""}`}
                  onClick={() => handleTabChange("personal_info")}
                >
                  <FaUserEdit className="item-icon" />
                  <span className="item-label">{t("profile.personalDetails")}</span>
                  <FaChevronRight className="item-arrow" />
                </button>

                <button
                  type="button"
                  className={`sidebar-nav-item ${activeTab === "security" ? "active" : ""}`}
                  onClick={() => handleTabChange("security")}
                >
                  <FaLock className="item-icon" />
                  <span className="item-label">{t("profile.passwordAndSecurity")}</span>
                  <FaChevronRight className="item-arrow" />
                </button>

                <button
                  type="button"
                  className={`sidebar-nav-item ${activeTab === "addresses" ? "active" : ""}`}
                  onClick={() => handleTabChange("addresses")}
                >
                  <FaMapMarkerAlt className="item-icon" />
                  <span className="item-label">{t("profile.manageAddresses")}</span>
                  {addresses.length > 0 && (
                    <span className="sidebar-badge-count">{addresses.length}</span>
                  )}
                  <FaChevronRight className="item-arrow" />
                </button>
              </div>

              {/* SECTION 2: ORDERS & PURCHASES */}
              <div className="sidebar-menu-group">
                <span className="sidebar-group-heading">{t("profile.ordersAndSaves")}</span>
                <button
                  type="button"
                  className={`sidebar-nav-item ${activeTab === "orders" ? "active" : ""}`}
                  onClick={() => handleTabChange("orders")}
                >
                  <FaShoppingBag className="item-icon" />
                  <span className="item-label">{t("profile.myOrdersAndTracking")}</span>
                  {orders.length > 0 && (
                    <span className="sidebar-badge-count orders-count">{orders.length}</span>
                  )}
                  <FaChevronRight className="item-arrow" />
                </button>

                <button
                  type="button"
                  className={`sidebar-nav-item ${activeTab === "wishlist" ? "active" : ""}`}
                  onClick={() => handleTabChange("wishlist")}
                >
                  <FaHeart className="item-icon" />
                  <span className="item-label">{t("profile.wishlistAndSaved")}</span>
                  {wishlistItems.length > 0 && (
                    <span className="sidebar-badge-count wishlist-count">
                      {wishlistItems.length}
                    </span>
                  )}
                  <FaChevronRight className="item-arrow" />
                </button>

                <button
                  type="button"
                  className={`sidebar-nav-item ${activeTab === "payments" ? "active" : ""}`}
                  onClick={() => handleTabChange("payments")}
                >
                  <FaCreditCard className="item-icon" />
                  <span className="item-label">{t("profile.paymentMethods")}</span>
                  <FaChevronRight className="item-arrow" />
                </button>
              </div>

              {/* SECTION 3: SETTINGS & PREFERENCES */}
              <div className="sidebar-menu-group">
                <span className="sidebar-group-heading">{t("profile.settingsAndPrivacy")}</span>
                <button
                  type="button"
                  className={`sidebar-nav-item ${activeTab === "notifications" ? "active" : ""}`}
                  onClick={() => handleTabChange("notifications")}
                >
                  <FaBell className="item-icon" />
                  <span className="item-label">{t("profile.notifications")}</span>
                  <FaChevronRight className="item-arrow" />
                </button>

                <button
                  type="button"
                  className={`sidebar-nav-item ${activeTab === "privacy" ? "active" : ""}`}
                  onClick={() => handleTabChange("privacy")}
                >
                  <FaShieldAlt className="item-icon" />
                  <span className="item-label">{t("profile.privacyAndData")}</span>
                  <FaChevronRight className="item-arrow" />
                </button>
              </div>

              {/* SECTION 4: HELP & LEGAL */}
              <div className="sidebar-menu-group">
                <span className="sidebar-group-heading">{t("profile.supportAndLegal")}</span>
                <button
                  type="button"
                  className={`sidebar-nav-item ${activeTab === "support" ? "active" : ""}`}
                  onClick={() => handleTabChange("support")}
                >
                  <FaQuestionCircle className="item-icon" />
                  <span className="item-label">{t("profile.helpCenterAndFaqs")}</span>
                  <FaChevronRight className="item-arrow" />
                </button>

                <button
                  type="button"
                  className={`sidebar-nav-item ${activeTab === "terms" ? "active" : ""}`}
                  onClick={() => handleTabChange("terms")}
                >
                  <FaFileContract className="item-icon" />
                  <span className="item-label">{t("profile.termsAndPolicies")}</span>
                  <FaChevronRight className="item-arrow" />
                </button>
              </div>

              {/* LOGOUT BUTTON */}
              <div className="sidebar-logout-wrapper">
                <button
                  type="button"
                  className="sidebar-logout-btn"
                  onClick={() => setShowLogoutModal(true)}
                >
                  <FaSignOutAlt /> {t("profile.signOut")}
                </button>
              </div>
            </nav>
          </aside>

          {/* ========================================================
              RIGHT MAIN CONTENT AREA — DYNAMIC TAB PANELS
             ======================================================== */}
          <main className="account-main-content">
            {/* ----------------------------------------------------
                TAB 1: ACCOUNT OVERVIEW
               ---------------------------------------------------- */}
            {activeTab === "overview" && (
              <div className="tab-pane-container">
                <div className="tab-pane-header">
                  <div>
                    <h2 className="tab-title">{t("profile.accountOverview")}</h2>
                    <p className="tab-subtitle">
                      {t("profile.welcomeBack")}, <strong>{user.name || "Valued Customer"}</strong>. {t("profile.shoppingSnapshot")}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="tab-primary-btn"
                    onClick={() => handleTabChange("personal_info")}
                  >
                    <FaEdit /> {t("profile.editProfile")}
                  </button>
                </div>

                {/* OVERVIEW STATS CARDS */}
                <div className="overview-stats-grid">
                  <div
                    className="overview-stat-card"
                    onClick={() => handleTabChange("orders")}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="stat-icon-wrap orders" style={{ background: "#EEF2FF", color: "#4F46E5" }}>
                      <FaShoppingBag />
                    </div>
                    <div className="stat-data">
                      <span className="stat-label">{t("profile.totalOrders")}</span>
                      <span className="stat-number">{orders.length}</span>
                      <span className="stat-subtext" style={{ fontSize: "11px", color: "#6B7280", fontWeight: "600", display: "block", marginTop: "2px" }}>
                        {orders.filter(o => !(o.status || "").toLowerCase().includes("deliver")).length} {t("profile.activeInProgress")}
                      </span>
                    </div>
                  </div>

                  <div
                    className="overview-stat-card"
                    onClick={() => handleTabChange("wishlist")}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="stat-icon-wrap wishlist" style={{ background: "#FEF2F2", color: "#EF4444" }}>
                      <FaHeart />
                    </div>
                    <div className="stat-data">
                      <span className="stat-label">{t("profile.wishlistItems")}</span>
                      <span className="stat-number">{wishlistItems.length}</span>
                      <span className="stat-subtext" style={{ fontSize: "11px", color: "#6B7280", fontWeight: "600", display: "block", marginTop: "2px" }}>
                        {t("profile.savedFavorites")}
                      </span>
                    </div>
                  </div>

                  <div
                    className="overview-stat-card"
                    onClick={() => handleTabChange("addresses")}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="stat-icon-wrap addresses" style={{ background: "#F5F3FF", color: "#8B5CF6" }}>
                      <FaMapMarkerAlt />
                    </div>
                    <div className="stat-data">
                      <span className="stat-label">{t("profile.savedAddresses")}</span>
                      <span className="stat-number">{addresses.length}</span>
                      <span className="stat-subtext" style={{ fontSize: "11px", color: "#6B7280", fontWeight: "600", display: "block", marginTop: "2px" }}>
                        {t("profile.deliveryAddresses")}
                      </span>
                    </div>
                  </div>

                  <div
                    className="overview-stat-card"
                    style={{ cursor: "default" }}
                  >
                    <div className="stat-icon-wrap payments" style={{ background: "#FFFBEB", color: "#D97706" }}>
                      <FaCreditCard />
                    </div>
                    <div className="stat-data">
                      <span className="stat-label">{t("profile.shoppyCoinsBalance")}</span>
                      <span className="stat-number">250</span>
                      <span className="stat-subtext" style={{ fontSize: "11px", color: "#6B7280", fontWeight: "600", display: "block", marginTop: "2px" }}>
                        {t("profile.coinsAvailable")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* PROFILE SUMMARY CARD */}
                <div className="account-card-box">
                  <div className="card-box-header">
                    <h3>{t("profile.personalSnapshot")}</h3>
                    <button
                      type="button"
                      className="card-text-action"
                      onClick={() => handleTabChange("personal_info")}
                    >
                      {t("profile.manage")}
                    </button>
                  </div>

                  <div className="info-summary-grid">
                    <div className="summary-item">
                      <span className="summary-label">{t("profile.fullName")}</span>
                      <strong className="summary-val">{user.name || t("profile.notSpecified")}</strong>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">{t("profile.emailAddress")}</span>
                      <strong className="summary-val">{user.email || t("profile.notSpecified")}</strong>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">{t("profile.phoneNumber")}</span>
                      <strong className="summary-val">{user.phone || t("profile.notSpecified")}</strong>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">{t("profile.gender")}</span>
                      <strong className="summary-val">{user.gender === "Not specified" ? t("profile.notSpecified") : user.gender}</strong>
                    </div>
                  </div>
                </div>

                {/* DEFAULT DELIVERY ADDRESS CARD */}
                <div className="account-card-box">
                  <div className="card-box-header">
                    <h3>Default Delivery Address</h3>
                    <button
                      type="button"
                      className="card-text-action"
                      onClick={() => handleTabChange("addresses")}
                    >
                      Change
                    </button>
                  </div>

                  {addresses.length > 0 ? (
                    (() => {
                      const defaultAddr = addresses.find((a) => a.isDefault) || addresses[0];
                      return (
                        <div className="default-address-display">
                          <div className="addr-meta-row">
                            <strong>{defaultAddr.fullName}</strong>
                            <span className="addr-pill-badge">{defaultAddr.type || "Home"}</span>
                            <span className="addr-default-tag">Default</span>
                          </div>
                          <p className="addr-street-line">{defaultAddr.street}</p>
                          <p className="addr-city-line">
                            {defaultAddr.city}, {defaultAddr.state} - <strong>{defaultAddr.pincode}</strong>
                          </p>
                          <p className="addr-phone-line">📞 {defaultAddr.phone}</p>
                        </div>
                      );
                    })()
                  ) : (
                    <div className="empty-inline-hint">
                      <p>No address saved yet.</p>
                      <button
                        type="button"
                        className="btn-link-action"
                        onClick={handleOpenAddAddress}
                      >
                        + Add Address
                      </button>
                    </div>
                  )}
                </div>

                {/* SECURITY & 2FA HEALTH CARD */}
                <div className="account-card-box security-health-box">
                  <div className="security-health-left">
                    <FaShieldAlt className="shield-icon" />
                    <div>
                      <h4>Account Security Status: High</h4>
                      <p>Two-factor authentication is active and your session is encrypted.</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="card-text-action"
                    onClick={() => handleTabChange("security")}
                  >
                    Security Settings
                  </button>
                </div>
              </div>
            )}

            {/* ----------------------------------------------------
                TAB 2: PERSONAL INFORMATION
               ---------------------------------------------------- */}
            {/* ----------------------------------------------------
                TAB 2: PERSONAL INFORMATION
               ---------------------------------------------------- */}
            {activeTab === "personal_info" && (
              <div className="tab-pane-container">
                <div className="tab-pane-header">
                  <div>
                    <h2 className="tab-title"><ProductTransText text="Personal Information" /></h2>
                    <p className="tab-subtitle">
                      <ProductTransText text="Manage your profile identification, contact phone, and personal details." />
                    </p>
                  </div>
                  {!isEditingProfile && (
                    <button
                      type="button"
                      className="tab-primary-btn"
                      onClick={() => setIsEditingProfile(true)}
                    >
                      <FaEdit /> <ProductTransText text="Edit Details" />
                    </button>
                  )}
                </div>

                <div className="account-card-box">
                  {!isEditingProfile ? (
                    <div className="profile-details-view">
                      <div className="details-row-2">
                        <div className="detail-field">
                          <label><ProductTransText text="Full Name" /></label>
                          <div className="field-display-box">{user.name || <ProductTransText text="Not specified" />}</div>
                        </div>
                        <div className="detail-field">
                          <label><ProductTransText text="Email Address" /></label>
                          <div className="field-display-box linked-email">
                            <span>{user.email || <ProductTransText text="Not specified" />}</span>
                            <span className="field-badge verified"><ProductTransText text="Verified" /> ✓</span>
                          </div>
                        </div>
                      </div>

                      <div className="details-row-2">
                        <div className="detail-field">
                          <label><ProductTransText text="Mobile Phone Number" /></label>
                          <div className="field-display-box">{user.phone || <ProductTransText text="Not specified" />}</div>
                        </div>
                        <div className="detail-field">
                          <label><ProductTransText text="Alternate Mobile" /></label>
                          <div className="field-display-box">{user.altPhone || <ProductTransText text="Not specified" />}</div>
                        </div>
                      </div>

                      <div className="details-row-2">
                        <div className="detail-field">
                          <label><ProductTransText text="Gender" /></label>
                          <div className="field-display-box"><ProductTransText text={user.gender || "Not specified"} /></div>
                        </div>
                        <div className="detail-field">
                          <label><ProductTransText text="Date of Birth" /></label>
                          <div className="field-display-box">{user.dob || <ProductTransText text="Not specified" />}</div>
                        </div>
                      </div>

                      <div className="profile-edit-trigger-wrap">
                        <button
                          type="button"
                          className="tab-primary-btn"
                          onClick={() => setIsEditingProfile(true)}
                        >
                          <FaUserEdit /> <ProductTransText text="Edit Personal Information" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSaveProfile} className="profile-details-form">
                      <div className="form-grid-2">
                        <div className="form-input-group">
                          <label><ProductTransText text="Full Name *" /></label>
                          <input
                            type="text"
                            required
                            placeholder="Enter your full name"
                            value={profileForm.name}
                            onChange={(e) =>
                              setProfileForm({ ...profileForm, name: e.target.value })
                            }
                          />
                        </div>

                        <div className="form-input-group">
                          <label><ProductTransText text="Email Address" /> (<ProductTransText text="Account Linked" />)</label>
                          <input
                            type="email"
                            disabled
                            value={profileForm.email}
                            className="input-disabled"
                            title="Email is bound to your account login"
                          />
                          <small className="field-help-text"><ProductTransText text="Email cannot be edited directly." /></small>
                        </div>
                      </div>

                      <div className="form-grid-2">
                        <div className="form-input-group">
                          <label><ProductTransText text="Phone Number *" /></label>
                          <input
                            type="tel"
                            required
                            placeholder="10-digit mobile number"
                            value={profileForm.phone}
                            onChange={(e) =>
                              setProfileForm({ ...profileForm, phone: e.target.value })
                            }
                          />
                        </div>

                        <div className="form-input-group">
                          <label><ProductTransText text="Alternate Mobile" /> (<ProductTransText text="Optional" />)</label>
                          <input
                            type="tel"
                            placeholder="Alternate contact number"
                            value={profileForm.altPhone}
                            onChange={(e) =>
                              setProfileForm({ ...profileForm, altPhone: e.target.value })
                            }
                          />
                        </div>
                      </div>

                      <div className="form-grid-2">
                        <div className="form-input-group">
                          <label><ProductTransText text="Gender" /></label>
                          <select
                            value={profileForm.gender}
                            onChange={(e) =>
                              setProfileForm({ ...profileForm, gender: e.target.value })
                            }
                          >
                            <option value="Not specified">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                            <option value="Prefer not to say">Prefer not to say</option>
                          </select>
                        </div>

                        <div className="form-input-group">
                          <label><ProductTransText text="Date of Birth" /></label>
                          <input
                            type="date"
                            value={profileForm.dob}
                            onChange={(e) =>
                              setProfileForm({ ...profileForm, dob: e.target.value })
                            }
                          />
                        </div>
                      </div>

                      <div className="form-action-buttons">
                        <button
                          type="submit"
                          className="tab-primary-btn"
                          disabled={savingProfile}
                        >
                          {savingProfile ? <ProductTransText text="Saving Details..." /> : <ProductTransText text="Save Changes" />}
                        </button>
                        <button
                          type="button"
                          className="tab-secondary-btn"
                          disabled={savingProfile}
                          onClick={() => {
                            setProfileForm(user);
                            setIsEditingProfile(false);
                          }}
                        >
                          <ProductTransText text="Cancel" />
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            )}

            {/* ----------------------------------------------------
                TAB 3: SECURITY & PASSWORD
               ---------------------------------------------------- */}
            {activeTab === "security" && (
              <div className="tab-pane-container">
                <div className="tab-pane-header">
                  <div>
                    <h2 className="tab-title"><ProductTransText text="Password & Security" /></h2>
                    <p className="tab-subtitle">
                      <ProductTransText text="Keep your account safe by updating your password and managing security authentications." />
                    </p>
                  </div>
                </div>

                <div className="account-card-box">
                  <div className="card-box-header">
                    <h3><ProductTransText text="Change Password" /></h3>
                  </div>

                  <form onSubmit={handleSavePassword} className="security-password-form">
                    <div className="form-input-group">
                      <label><ProductTransText text="Current Password *" /></label>
                      <div className="password-input-wrap">
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          placeholder={i18n.language === "hi" ? "अपना वर्तमान पासवर्ड दर्ज करें" : "Enter your current password"}
                          value={passwordForm.currentPassword}
                          onChange={(e) =>
                            setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                          }
                        />
                        <button
                          type="button"
                          className="password-eye-btn"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </div>

                    <div className="form-grid-2">
                      <div className="form-input-group">
                        <label><ProductTransText text="New Password *" /></label>
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          placeholder={i18n.language === "hi" ? "न्यूनतम 6 अक्षर" : "Minimum 6 characters"}
                          value={passwordForm.newPassword}
                          onChange={(e) =>
                            setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                          }
                        />
                        {passwordForm.newPassword && (
                          <div className="password-meter-wrap">
                            <div className="meter-bars">
                              <span className={`meter-bar ${passwordStrength >= 1 ? "active" : ""}`} />
                              <span className={`meter-bar ${passwordStrength >= 2 ? "active" : ""}`} />
                              <span className={`meter-bar ${passwordStrength >= 3 ? "active" : ""}`} />
                            </div>
                            <span className="meter-text">
                              {passwordStrength === 1 && (i18n.language === "hi" ? "कमजोर" : "Weak")}
                              {passwordStrength === 2 && (i18n.language === "hi" ? "अच्छा" : "Good")}
                              {passwordStrength === 3 && (i18n.language === "hi" ? "मजबूत" : "Strong")}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="form-input-group">
                        <label><ProductTransText text="Confirm New Password *" /></label>
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          placeholder={i18n.language === "hi" ? "नया पासवर्ड पुनः दर्ज करें" : "Re-enter new password"}
                          value={passwordForm.confirmPassword}
                          onChange={(e) =>
                            setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="tab-primary-btn"
                      disabled={passwordSaving}
                    >
                      {passwordSaving ? <ProductTransText text="Updating Password..." /> : <ProductTransText text="Update Password" />}
                    </button>
                  </form>
                </div>

                <div className="account-card-box">
                  <div className="card-box-header">
                    <div>
                      <h3><ProductTransText text="Two-Factor Authentication (2FA)" /></h3>
                      <p className="card-desc-text">
                        <ProductTransText text="Add an extra layer of security. We send a verification OTP whenever you log in from an unknown device." />
                      </p>
                    </div>
                    <label className="switch-toggle">
                      <input
                        type="checkbox"
                        checked={twoFactorEnabled}
                        onChange={() => {
                          setTwoFactorEnabled(!twoFactorEnabled);
                          showToast(
                            "success",
                            !twoFactorEnabled ? "2FA Enabled successfully! 🛡️" : "2FA Disabled"
                          );
                        }}
                      />
                      <span className="switch-slider" />
                    </label>
                  </div>
                </div>

                <div className="account-card-box">
                  <div className="card-box-header">
                    <h3><ProductTransText text="Active Login Sessions" /></h3>
                  </div>

                  <div className="sessions-list">
                    <div className="session-item active-session">
                      <div className="session-icon">💻</div>
                      <div className="session-details">
                        <strong><ProductTransText text="Windows PC • Chrome Browser" /></strong>
                        <span><ProductTransText text="Active Now • Current Device" /></span>
                      </div>
                      <span className="session-badge-current"><ProductTransText text="This Device" /></span>
                    </div>

                    <div className="session-item">
                      <div className="session-icon">📱</div>
                      <div className="session-details">
                        <strong><ProductTransText text="ShoppyGlobe Mobile App (iOS)" /></strong>
                        <span>Last active 2 days ago • Bengaluru, India</span>
                      </div>
                    </div>
                  </div>

                  <div className="session-actions">
                    <button
                      type="button"
                      className="tab-secondary-btn danger"
                      onClick={() => showToast("success", "Logged out of all other devices.")}
                    >
                      <ProductTransText text="Log Out of All Other Sessions" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ----------------------------------------------------
                TAB 4: MANAGE ADDRESSES
               ---------------------------------------------------- */}
            {activeTab === "addresses" && (
              <div className="tab-pane-container">
                <div className="tab-pane-header">
                  <div>
                    <h2 className="tab-title"><ProductTransText text="Manage Addresses" /></h2>
                    <p className="tab-subtitle">
                      <ProductTransText text="Add, edit, or set default delivery addresses for seamless express checkout." />
                    </p>
                  </div>
                  <button
                    type="button"
                    className="tab-primary-btn"
                    onClick={handleOpenAddAddress}
                  >
                    <FaPlus /> <ProductTransText text="+ Add New Address" />
                  </button>
                </div>

                {addresses.length === 0 ? (
                  <div className="account-empty-state">
                    <FaMapMarkerAlt className="empty-icon-lg" />
                    <h3><ProductTransText text="No Addresses Saved" /></h3>
                    <p><ProductTransText text="Save your delivery locations to place orders in one click." /></p>
                    <button
                      type="button"
                      className="tab-primary-btn"
                      onClick={handleOpenAddAddress}
                    >
                      <ProductTransText text="+ Add Your First Address" />
                    </button>
                  </div>
                ) : (
                  <div className="address-cards-grid">
                    {addresses.map((addr) => (
                      <div
                        key={addr.id}
                        className={`address-card-item ${addr.isDefault ? "is-default" : ""}`}
                      >
                        <div className="addr-top-bar">
                          <span className="addr-type-tag">
                            {addr.type === "Work" ? <FaBuilding /> : <FaHome />} <ProductTransText text={addr.type || "Home"} />
                          </span>
                          {addr.isDefault && <span className="addr-default-badge"><ProductTransText text="Default Address" /></span>}
                        </div>

                        <div className="addr-card-body">
                          <h4 className="addr-name">{addr.fullName}</h4>
                          <p className="addr-phone-text">📞 {addr.phone}</p>
                          <p className="addr-street-text">{addr.street}</p>
                          <p className="addr-city-text">
                            {addr.city}, {addr.state} - <strong>{addr.pincode}</strong>
                          </p>
                        </div>

                        <div className="addr-card-footer">
                          {!addr.isDefault && (
                            <button
                              type="button"
                              className="addr-btn-link"
                              onClick={() => handleSetDefaultAddress(addr.id)}
                            >
                              <ProductTransText text="Set as Default" />
                            </button>
                          )}
                          <div className="addr-actions-right">
                            <button
                              type="button"
                              className="addr-icon-btn edit"
                              onClick={() => handleOpenEditAddress(addr)}
                              title="Edit Address"
                            >
                              <FaEdit /> <ProductTransText text="Edit" />
                            </button>
                            <button
                              type="button"
                              className="addr-icon-btn delete"
                              onClick={() => handleDeleteAddress(addr.id)}
                              title="Delete Address"
                            >
                              <FaTrashAlt />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ----------------------------------------------------
                TAB 5: MY ORDERS & TRACKING
               ---------------------------------------------------- */}
            {activeTab === "orders" && (
              <div className="tab-pane-container">
                <div className="tab-pane-header">
                  <div>
                    <h2 className="tab-title"><ProductTransText text="My Orders" /></h2>
                    <p className="tab-subtitle">
                      <ProductTransText text="View recent purchases, track live shipping status, or download tax invoices." />
                    </p>
                  </div>
                  <Link to="/orders" className="tab-primary-btn">
                    <FaBoxOpen /> <ProductTransText text="Full Tracking Hub" />
                  </Link>
                </div>

                <div className="orders-filter-bar">
                  <button
                    type="button"
                    className={`filter-btn ${orderFilter === "all" ? "active" : ""}`}
                    onClick={() => setOrderFilter("all")}
                  >
                    <ProductTransText text="All" /> ({orders.length})
                  </button>
                  <button
                    type="button"
                    className={`filter-btn ${orderFilter === "progress" ? "active" : ""}`}
                    onClick={() => setOrderFilter("progress")}
                  >
                    <ProductTransText text="In Progress" />
                  </button>
                  <button
                    type="button"
                    className={`filter-btn ${orderFilter === "delivered" ? "active" : ""}`}
                    onClick={() => setOrderFilter("delivered")}
                  >
                    <ProductTransText text="Delivered" />
                  </button>
                </div>

                {filteredOrders.length === 0 ? (
                  <div className="account-empty-state">
                    <FaShoppingBag className="empty-icon-lg" />
                    <h3><ProductTransText text="No Orders Placed Yet" /></h3>
                    <p><ProductTransText text="Looks like you haven't placed any orders yet. Discover our premium collection!" /></p>
                    <Link to="/productlist" className="tab-primary-btn">
                      <ProductTransText text="Explore Products" />
                    </Link>
                  </div>
                ) : (
                  <div className="orders-cards-stack">
                    {filteredOrders.map((order, idx) => {
                      if (!order) return null;
                      const orderNum = order.orderId || order._id || `ORD-${idx + 1}`;
                      const orderDate = order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "Recently";

                      return (
                        <div className="account-order-card" key={orderNum}>
                          <div className="order-card-top">
                            <div className="order-meta-info">
                              <span className="order-id-tag"><ProductTransText text="Order #" />{orderNum}</span>
                              <span className="order-date-tag">📅 <ProductTransText text="Placed on" /> {orderDate}</span>
                            </div>
                            <div className="order-status-badge delivered">
                              <FaTruck /> <ProductTransText text={order.status || "Confirmed / Processing"} />
                            </div>
                          </div>

                          <div className="order-items-preview-list">
                            {Array.isArray(order.items) &&
                              order.items.map((item, i) => {
                                if (!item) return null;
                                return (
                                  <div className="order-item-inline" key={i}>
                                    <img
                                      src={
                                        item.image ||
                                        `https://picsum.photos/seed/${item.productId || i}/100/100`
                                      }
                                      alt={item.title || "Item"}
                                      className="item-preview-thumb"
                                      onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = `https://picsum.photos/seed/${item.productId || i}/100/100`;
                                      }}
                                    />
                                    <div className="item-preview-info">
                                      <h4><ProductTransText text={item.title || "Product"} /></h4>
                                      <span>Qty: {item.quantity || 1} • Price: ₹{Number(item.price || 0).toLocaleString("en-IN")}</span>
                                    </div>
                                  </div>
                                );
                              })}
                          </div>

                          <div className="order-card-bottom">
                            <div className="order-total-sum">
                              <span><ProductTransText text="Total Paid:" /></span>
                              <strong>₹{Number(order.totalAmount || 0).toLocaleString("en-IN")}</strong>
                            </div>
                            <div className="order-quick-actions">
                              <Link to="/orders" className="tab-secondary-btn">
                                <ProductTransText text="Track Order & Invoice" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ----------------------------------------------------
                TAB 6: WISHLIST & SAVED ITEMS (100% BULLETPROOF & SAFE)
               ---------------------------------------------------- */}
            {activeTab === "wishlist" && (
              <div className="tab-pane-container">
                <div className="tab-pane-header">
                  <div>
                    <h2 className="tab-title"><ProductTransText text="Wishlist & Saved Items" /></h2>
                    <p className="tab-subtitle">
                      <ProductTransText text="Your curated personal collection of saved favourite luxury items." />
                    </p>
                  </div>
                  <Link to="/wishlist" className="tab-primary-btn">
                    <FaHeart /> <ProductTransText text="Full Wishlist View" />
                  </Link>
                </div>

                {!wishlistItems || wishlistItems.length === 0 ? (
                  <div className="account-empty-state">
                    <div className="empty-icon-bubble">
                      <FaHeart className="empty-icon-lg" />
                    </div>
                    <h3><ProductTransText text="Your Wishlist is Empty" /></h3>
                    <p><ProductTransText text="Save items you love by clicking the heart icon while browsing products." /></p>
                    <Link to="/productlist" className="tab-primary-btn">
                      <ProductTransText text="Discover Products" />
                    </Link>
                  </div>
                ) : (
                  <div className="wishlist-products-grid">
                    {wishlistItems.map((item, idx) => {
                      if (!item) return null;
                      const id = item._id || item.productId || `wishlist_item_${idx}`;
                      const title = item.title || "Luxury Product";
                      const price = Number(item.price) || 0;
                      const imageSrc =
                        (Array.isArray(item.images) && item.images[0]) ||
                        item.image ||
                        `https://picsum.photos/seed/${id}/300/300`;

                      return (
                        <div className="wishlist-product-card" key={id}>
                          <div className="wishlist-thumb-wrap">
                            <img
                              src={imageSrc}
                              alt={title}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = `https://picsum.photos/seed/${id}/300/300`;
                              }}
                            />
                            <button
                              type="button"
                              className="wishlist-remove-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                dispatch(removeFromWishlist(id));
                                window.dispatchEvent(
                                  new CustomEvent("pvx_show_toast", {
                                    detail: {
                                      title: "Removed from Wishlist",
                                      text: title,
                                      img: imageSrc,
                                      type: "wishlist-remove",
                                    },
                                  })
                                );
                                showToast("success", "Item removed from wishlist.");
                              }}
                              title="Remove from Wishlist"
                              aria-label="Remove from Wishlist"
                            >
                              <FaTrashAlt />
                            </button>
                          </div>
                          <div className="wishlist-card-details">
                            <h4 className="prod-title" title={title}>
                              <ProductTransText text={title} />
                            </h4>
                            <div className="prod-price-row">
                              <span className="price-val">₹{price.toLocaleString("en-IN")}</span>
                            </div>
                            <button
                              type="button"
                              className="wishlist-move-cart-btn"
                              onClick={() => handleMoveToCart(item)}
                            >
                              <ProductTransText text="Move to Cart" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ----------------------------------------------------
                TAB 7: PAYMENT METHODS
               ---------------------------------------------------- */}
            {activeTab === "payments" && (
              <div className="tab-pane-container">
                <div className="tab-pane-header">
                  <div>
                    <h2 className="tab-title"><ProductTransText text="Saved Payment Methods" /></h2>
                    <p className="tab-subtitle">
                      <ProductTransText text="Manage your saved credit/debit cards and UPI IDs for 1-click checkout." />
                    </p>
                  </div>
                  <button
                    type="button"
                    className="tab-primary-btn"
                    onClick={() => setShowPaymentModal(true)}
                  >
                    <FaPlus /> <ProductTransText text="Add Payment Method" />
                  </button>
                </div>

                <div className="payment-security-notice">
                  <FaShieldAlt className="shield-notice-icon" />
                  <div>
                    <strong><ProductTransText text="100% Secure & PCI-DSS Compliant Storage" /></strong>
                    <p><ProductTransText text="Your card details are tokenized and protected with 256-bit encryption. We never store CVV." /></p>
                  </div>
                </div>

                {paymentMethods.length === 0 ? (
                  <div className="account-empty-state">
                    <FaCreditCard className="empty-icon-lg" />
                    <h3><ProductTransText text="No Payment Methods Saved" /></h3>
                    <p><ProductTransText text="Save cards or UPI handles for lightning fast checkouts." /></p>
                    <button
                      type="button"
                      className="tab-primary-btn"
                      onClick={() => setShowPaymentModal(true)}
                    >
                      <ProductTransText text="+ Add Payment Method" />
                    </button>
                  </div>
                ) : (
                  <div className="payment-cards-grid">
                    {paymentMethods.map((pm) => (
                      <div
                        key={pm.id}
                        className={`payment-card-box ${pm.isDefault ? "is-default" : ""}`}
                      >
                        {pm.type === "card" ? (
                          <>
                            <div className="payment-card-top">
                              <span className="card-brand-icon">
                                {pm.brand === "Visa" ? <FaCcVisa /> : <FaCcMastercard />}
                              </span>
                              {pm.isDefault && <span className="payment-default-badge"><ProductTransText text="Default" /></span>}
                            </div>
                            <div className="payment-card-number">{pm.cardNumber}</div>
                            <div className="payment-card-bottom">
                              <div className="card-holder-info">
                                <span className="card-lbl"><ProductTransText text="CARDHOLDER" /></span>
                                <strong>{pm.cardHolder}</strong>
                              </div>
                              <div className="card-expiry-info">
                                <span className="card-lbl"><ProductTransText text="EXPIRES" /></span>
                                <strong>{pm.expiry}</strong>
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="payment-card-top">
                              <span className="card-brand-icon upi">
                                <FaMoneyCheckAlt /> UPI ID
                              </span>
                              {pm.isDefault && <span className="payment-default-badge"><ProductTransText text="Default" /></span>}
                            </div>
                            <div className="payment-card-number upi-id">{pm.upiId}</div>
                            <div className="payment-card-bottom">
                              <span className="upi-verified-text">✓ Instant UPI AutoPay Ready</span>
                            </div>
                          </>
                        )}

                        <div className="payment-card-actions">
                          {!pm.isDefault && (
                            <button
                              type="button"
                              className="card-action-link"
                              onClick={() => handleSetDefaultPayment(pm.id)}
                            >
                              <ProductTransText text="Set as Default" />
                            </button>
                          )}
                          <button
                            type="button"
                            className="card-delete-icon"
                            onClick={() => handleDeletePayment(pm.id)}
                            title="Delete Payment Method"
                          >
                            <FaTrashAlt />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ----------------------------------------------------
                TAB 8: NOTIFICATIONS SETTINGS
               ---------------------------------------------------- */}
            {activeTab === "notifications" && (
              <div className="tab-pane-container">
                <div className="tab-pane-header">
                  <div>
                    <h2 className="tab-title"><ProductTransText text="Notification Settings" /></h2>
                    <p className="tab-subtitle">
                      <ProductTransText text="Control which notifications and alerts you receive across SMS, WhatsApp, and Email." />
                    </p>
                  </div>
                </div>

                <div className="account-card-box">
                  <div className="notification-options-list">
                    <div className="notif-option-row">
                      <div className="notif-info">
                        <strong><ProductTransText text="Order Status & Tracking (SMS & Email)" /></strong>
                        <p><ProductTransText text="Receive order confirmation, invoice copy, and milestone progress alerts." /></p>
                      </div>
                      <label className="switch-toggle">
                        <input
                          type="checkbox"
                          checked={notifications.orderUpdates}
                          onChange={() => handleToggleNotification("orderUpdates")}
                        />
                        <span className="switch-slider" />
                      </label>
                    </div>

                    <div className="notif-option-row">
                      <div className="notif-info">
                        <strong><ProductTransText text="WhatsApp Shipment Updates" /></strong>
                        <p><ProductTransText text="Receive live delivery tracking and out-for-delivery alerts directly on WhatsApp." /></p>
                      </div>
                      <label className="switch-toggle">
                        <input
                          type="checkbox"
                          checked={notifications.whatsappUpdates}
                          onChange={() => handleToggleNotification("whatsappUpdates")}
                        />
                        <span className="switch-slider" />
                      </label>
                    </div>

                    <div className="notif-option-row">
                      <div className="notif-info">
                        <strong><ProductTransText text="Price Drop & Wishlist Alerts" /></strong>
                        <p><ProductTransText text="Be the first to know when items in your Wishlist go on sale or restock." /></p>
                      </div>
                      <label className="switch-toggle">
                        <input
                          type="checkbox"
                          checked={notifications.priceAlerts}
                          onChange={() => handleToggleNotification("priceAlerts")}
                        />
                        <span className="switch-slider" />
                      </label>
                    </div>

                    <div className="notif-option-row">
                      <div className="notif-info">
                        <strong><ProductTransText text="Exclusive Member Deals & Promotions" /></strong>
                        <p><ProductTransText text="VIP early access to festival sales, exclusive promo codes, and brand launches." /></p>
                      </div>
                      <label className="switch-toggle">
                        <input
                          type="checkbox"
                          checked={notifications.promotions}
                          onChange={() => handleToggleNotification("promotions")}
                        />
                        <span className="switch-slider" />
                      </label>
                    </div>

                    <div className="notif-option-row">
                      <div className="notif-info">
                        <strong><ProductTransText text="Weekly Editorial Newsletter" /></strong>
                        <p><ProductTransText text="Curated luxury style guides, seasonal lookbooks, and fashion highlights." /></p>
                      </div>
                      <label className="switch-toggle">
                        <input
                          type="checkbox"
                          checked={notifications.newsletters}
                          onChange={() => handleToggleNotification("newsletters")}
                        />
                        <span className="switch-slider" />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ----------------------------------------------------
                TAB 9: PRIVACY & DATA SETTINGS
               ---------------------------------------------------- */}
            {activeTab === "privacy" && (
              <div className="tab-pane-container">
                <div className="tab-pane-header">
                  <div>
                    <h2 className="tab-title"><ProductTransText text="Privacy & Data Settings" /></h2>
                    <p className="tab-subtitle">
                      <ProductTransText text="Manage your data portability, clear browsing logs, and exercise your privacy rights." />
                    </p>
                  </div>
                </div>

                <div className="account-card-box">
                  <div className="privacy-feature-row">
                    <div>
                      <h3><ProductTransText text="Download Account Data" /></h3>
                      <p className="card-desc-text">
                        <ProductTransText text="Download a machine-readable JSON copy of your personal profile, addresses, orders, and preferences." />
                      </p>
                    </div>
                    <button
                      type="button"
                      className="tab-secondary-btn"
                      onClick={handleDownloadUserData}
                    >
                      <FaDownload /> <ProductTransText text="Download Data" />
                    </button>
                  </div>
                </div>

                <div className="account-card-box">
                  <div className="privacy-feature-row">
                    <div>
                      <h3><ProductTransText text="Clear Search & Browsing Activity" /></h3>
                      <p className="card-desc-text">
                        <ProductTransText text="Erase your recent searches and browsing cache stored in your current browser." />
                      </p>
                    </div>
                    <button
                      type="button"
                      className="tab-secondary-btn"
                      onClick={handleClearActivity}
                    >
                      <FaTrashAlt /> <ProductTransText text="Clear Activity" />
                    </button>
                  </div>
                </div>

                <div className="account-card-box danger-zone">
                  <div className="privacy-feature-row">
                    <div>
                      <h3 className="danger-text"><ProductTransText text="Account Deactivation" /></h3>
                      <p className="card-desc-text">
                        <ProductTransText text="Permanently close your ShoppyGlobe account and delete all associated personal profile records." />
                      </p>
                    </div>
                    <button
                      type="button"
                      className="tab-secondary-btn danger"
                      onClick={() => setShowDeleteModal(true)}
                    >
                      <ProductTransText text="Request Deactivation" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ----------------------------------------------------
                TAB 10: HELP CENTER & FAQS
               ---------------------------------------------------- */}
            {activeTab === "support" && (
              <div className="tab-pane-container">
                <div className="tab-pane-header">
                  <div>
                    <h2 className="tab-title"><ProductTransText text="Help & Customer Support" /></h2>
                    <p className="tab-subtitle">
                      <ProductTransText text="Find instant answers to common questions or reach out to our dedicated 24x7 support team." />
                    </p>
                  </div>
                </div>

                <div className="support-channels-grid">
                  <div className="channel-card">
                    <div className="channel-icon-wrap phone">
                      <FaPhoneAlt />
                    </div>
                    <h4><ProductTransText text="24x7 Helpline" /></h4>
                    <p>1800-123-SHOPPY (Toll Free)</p>
                    <span className="channel-sub"><ProductTransText text="Instant Voice Support" /></span>
                  </div>

                  <a
                    href="mailto:support@shoppyglobe.com?subject=Support%20Inquiry%20-%20ShoppyGlobe"
                    className="channel-card"
                    style={{ textDecoration: "none", color: "inherit", cursor: "pointer" }}
                    title="Click to send an email to support@shoppyglobe.com"
                  >
                    <div className="channel-icon-wrap email">
                      <FaEnvelope />
                    </div>
                    <h4><ProductTransText text="Email Assistance" /></h4>
                    <p style={{ color: "#8B5E3C", fontWeight: "700" }}>support@shoppyglobe.com ↗</p>
                    <span className="channel-sub"><ProductTransText text="Response within 2 hours" /></span>
                  </a>

                  <div className="channel-card">
                    <div className="channel-icon-wrap chat">
                      <FaCommentDots />
                    </div>
                    <h4><ProductTransText text="AI Shopping Assistant" /></h4>
                    <p><ProductTransText text="Instant answers & recommendations" /></p>
                    <span className="channel-sub"><ProductTransText text="Online 24/7" /></span>
                  </div>
                </div>

                <div className="account-card-box">
                  <div className="card-box-header">
                    <h3><ProductTransText text="Frequently Asked Questions" /></h3>
                  </div>

                  <div className="faq-search-input-wrap">
                    <input
                      type="text"
                      placeholder={i18n.language === "hi" ? "प्रश्न या विषय खोजें (जैसे ट्रैकिंग, रिटर्न, भुगतान)..." : "Search question or topic (e.g. tracking, returns, payments)..."}
                      value={faqSearch}
                      onChange={(e) => setFaqSearch(e.target.value)}
                    />
                  </div>

                  <div className="faqs-accordion-list">
                    {filteredFaqs.map((faq, index) => {
                      const isOpen = openFaqIndex === index;
                      return (
                        <div
                          key={index}
                          className={`faq-accordion-item ${isOpen ? "open" : ""}`}
                        >
                          <button
                            type="button"
                            className="faq-question-btn"
                            onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                          >
                            <span><ProductTransText text={faq.q} /></span>
                            {isOpen ? <FaChevronUp /> : <FaChevronDown />}
                          </button>
                          {isOpen && (
                            <div className="faq-answer-content">
                              <p><ProductTransText text={faq.a} /></p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 📩 RAISE SUPPORT TICKET CARD */}
                <div className="account-card-box">
                  <div className="card-box-header">
                    <h3><ProductTransText text="📩 Raise a Support Ticket" /></h3>
                    <p className="card-desc-text"><ProductTransText text="Have an order issue or question? Submit a ticket to our support team." /></p>
                  </div>

                  <form onSubmit={handleCreateTicket} style={{ marginTop: "16px" }}>
                    <div style={{ marginBottom: "12px" }}>
                      <label style={{ fontWeight: "600", fontSize: "14px", display: "block", marginBottom: "4px" }}><ProductTransText text="Select Related Product (Optional)" /></label>
                      <select
                        value={ticketForm.productId}
                        onChange={(e) => {
                          const chosenId = e.target.value;
                          const purchasedMatch = myPurchasedProducts.find((p) => String(p.productId) === String(chosenId));
                          const catalogMatch = availableProducts.find((p) => String(p._id || p.id) === String(chosenId));
                          const title = purchasedMatch ? purchasedMatch.title : catalogMatch ? catalogMatch.title : "General Inquiry / Other";
                          setTicketForm({
                            ...ticketForm,
                            productId: chosenId,
                            productName: title,
                          });
                        }}
                        style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ccc", background: "#fff" }}
                      >
                        <option value=""><ProductTransText text="-- General Inquiry / Account Issue --" /></option>
                        {myPurchasedProducts.length > 0 && (
                          <optgroup label="🛍️ My Purchased Products & Orders">
                            {myPurchasedProducts.map((p, idx) => (
                              <option key={`purchased-${idx}`} value={p.productId}>
                                📦 {p.title} (Order #{p.orderId})
                              </option>
                            ))}
                          </optgroup>
                        )}
                        <optgroup label="🌐 All Catalog Products">
                          {availableProducts.map((p) => (
                            <option key={p._id || p.id} value={p._id || p.id}>
                              📦 {p.title} (₹{p.price})
                            </option>
                          ))}
                        </optgroup>
                      </select>
                    </div>

                    <div style={{ marginBottom: "12px" }}>
                      <label style={{ fontWeight: "600", fontSize: "14px", display: "block", marginBottom: "4px" }}><ProductTransText text="Subject / Issue Title *" /></label>
                      <input
                        type="text"
                        required
                        placeholder={i18n.language === "hi" ? "उदा. ऑर्डर क्षतिग्रस्त, भुगतान समस्या, आकार विनिमय" : "e.g. Order damaged, Payment issue, Size exchange"}
                        value={ticketForm.subject}
                        onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                        style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
                      />
                    </div>

                    <div style={{ marginBottom: "16px" }}>
                      <label style={{ fontWeight: "600", fontSize: "14px", display: "block", marginBottom: "4px" }}><ProductTransText text="Detailed Description *" /></label>
                      <textarea
                        required
                        rows="4"
                        placeholder={i18n.language === "hi" ? "अपनी समस्या का विस्तार से वर्णन करें..." : "Explain your problem in detail..."}
                        value={ticketForm.message}
                        onChange={(e) => setTicketForm({ ...ticketForm, message: e.target.value })}
                        style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
                      />
                    </div>

                    <button
                      type="submit"
                      className="tab-primary-btn"
                      disabled={submittingTicket}
                    >
                      {submittingTicket ? <ProductTransText text="Submitting Ticket..." /> : <ProductTransText text="Submit Support Ticket" />}
                    </button>
                  </form>
                </div>

                {/* 📋 MY SUPPORT TICKETS STATUS LIST */}
                {myTickets.length > 0 && (
                  <div className="account-card-box">
                    <div className="card-box-header">
                      <h3><ProductTransText text="My Support Tickets" /> ({myTickets.length})</h3>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "12px" }}>
                      {myTickets.map((t) => (
                        <div
                          key={t._id}
                          style={{
                            padding: "14px",
                            borderRadius: "10px",
                            background: "#f9fafb",
                            border: "1px solid #e5e7eb",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <div>
                            <strong style={{ fontSize: "15px", color: "#111827" }}>{t.subject}</strong>
                            <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#6b7280" }}>{t.message}</p>
                            <span style={{ fontSize: "11px", color: "#9ca3af" }}>Submitted on {new Date(t.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div>
                            <span
                              style={{
                                padding: "4px 12px",
                                borderRadius: "20px",
                                fontSize: "12px",
                                fontWeight: "700",
                                textTransform: "uppercase",
                                backgroundColor:
                                  t.status === "open"
                                    ? "#fef3c7"
                                    : t.status === "in_progress"
                                    ? "#dbeafe"
                                    : t.status === "resolved"
                                    ? "#d1fae5"
                                    : "#f3f4f6",
                                color:
                                  t.status === "open"
                                    ? "#92400e"
                                    : t.status === "in_progress"
                                    ? "#1e40af"
                                    : t.status === "resolved"
                                    ? "#065f46"
                                    : "#374151",
                              }}
                            >
                              {t.status === "open"
                                ? "OPEN 🟡"
                                : t.status === "in_progress"
                                ? "IN PROGRESS 🔵"
                                : t.status === "resolved"
                                ? "RESOLVED 🟢"
                                : "CLOSED 🔴"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ----------------------------------------------------
                TAB 11: TERMS & POLICIES
               ---------------------------------------------------- */}
            {activeTab === "terms" && (
              <div className="tab-pane-container">
                <div className="tab-pane-header">
                  <div>
                    <h2 className="tab-title"><ProductTransText text="Terms & Policies" /></h2>
                    <p className="tab-subtitle">
                      <ProductTransText text="Review our authentic service agreements, user privacy, and customer return policies." />
                    </p>
                  </div>
                </div>

                <div className="account-card-box">
                  <div className="terms-sub-nav">
                    <button
                      type="button"
                      className={`terms-sub-btn ${termsTab === "terms" ? "active" : ""}`}
                      onClick={() => setTermsTab("terms")}
                    >
                      <ProductTransText text="Terms of Service" />
                    </button>
                    <button
                      type="button"
                      className={`terms-sub-btn ${termsTab === "privacy" ? "active" : ""}`}
                      onClick={() => setTermsTab("privacy")}
                    >
                      <ProductTransText text="Privacy Policy" />
                    </button>
                    <button
                      type="button"
                      className={`terms-sub-btn ${termsTab === "returns" ? "active" : ""}`}
                      onClick={() => setTermsTab("returns")}
                    >
                      <ProductTransText text="Returns & Refunds" />
                    </button>
                    <button
                      type="button"
                      className={`terms-sub-btn ${termsTab === "guarantee" ? "active" : ""}`}
                      onClick={() => setTermsTab("guarantee")}
                    >
                      <ProductTransText text="Authenticity Guarantee" />
                    </button>
                  </div>

                  <div className="terms-content-reader">
                    {termsTab === "terms" && (
                      <div className="terms-body-article">
                        <h4><ProductTransText text="1. User Account & Agreement" /></h4>
                        <p>
                          <ProductTransText text="By accessing ShoppyGlobe, you confirm that you are at least 18 years of age or accessing under parental guidance. You agree to provide accurate and authentic profile and delivery details." />
                        </p>
                        <h4><ProductTransText text="2. Pricing & Product Accuracy" /></h4>
                        <p>
                          <ProductTransText text="We ensure that all listed prices, specifications, and imagery represent the authentic items accurately. Prices are inclusive of applicable goods & services tax (GST)." />
                        </p>
                        <h4><ProductTransText text="3. Order Acceptance & Fulfillment" /></h4>
                        <p>
                          <ProductTransText text="Receipt of an electronic order confirmation does not signify our final acceptance of your order. We reserve the right to verify payment or dispatch capacity before shipping." />
                        </p>
                      </div>
                    )}

                    {termsTab === "privacy" && (
                      <div className="terms-body-article">
                        <h4><ProductTransText text="1. Data Collection & Usage" /></h4>
                        <p>
                          <ProductTransText text="We only collect essential details (Name, Contact Email, Phone, and Delivery Locations) required to fulfill your orders and deliver customer satisfaction." />
                        </p>
                        <h4><ProductTransText text="2. Data Security & Encryption" /></h4>
                        <p>
                          <ProductTransText text="All transmission of sensitive data is protected via SSL/TLS 256-bit encryption. Payment transactions are processed through certified PCI-DSS compliant payment gateways." />
                        </p>
                      </div>
                    )}

                    {termsTab === "returns" && (
                      <div className="terms-body-article">
                        <h4><ProductTransText text="1. 15-Day Return Period" /></h4>
                        <p>
                          <ProductTransText text="You may request a return or exchange for eligible purchases within 15 calendar days from delivery date." />
                        </p>
                        <h4><ProductTransText text="2. Instant Refund Processing" /></h4>
                        <p>
                          <ProductTransText text="Once returned goods pass quality inspection at our fulfillment hub, refunds are credited back to the original payment source within 3-5 business days." />
                        </p>
                      </div>
                    )}

                    {termsTab === "guarantee" && (
                      <div className="terms-body-article">
                        <h4><ProductTransText text="100% Genuine & Authentic Products" /></h4>
                        <p>
                          <ProductTransText text="ShoppyGlobe guarantees that 100% of products sold across all categories are authentic, sourced directly from verified brand partners and authorized manufacturers." />
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ============================================================
          MODALS
         ============================================================ */}

      {/* 1. ADD / EDIT ADDRESS MODAL */}
      {showAddressModal && (
        <div className="account-modal-overlay" onClick={() => setShowAddressModal(false)}>
          <div className="account-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="account-modal-header">
              <h3>{editingAddressId ? "Edit Delivery Address" : "Add New Delivery Address"}</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowAddressModal(false)}
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSaveAddress} className="modal-form-body">
              <div className="form-grid-2">
                <div className="form-input-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Recipient name"
                    value={addressForm.fullName}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, fullName: e.target.value })
                    }
                  />
                </div>
                <div className="form-input-group">
                  <label>Mobile Phone *</label>
                  <input
                    type="tel"
                    required
                    placeholder="10-digit phone number"
                    value={addressForm.phone}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, phone: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="form-input-group">
                <label>Street Address / Flat / Building *</label>
                <textarea
                  required
                  rows="2"
                  placeholder="House number, apartment name, street name"
                  value={addressForm.street}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, street: e.target.value })
                  }
                />
              </div>

              <div className="form-grid-3">
                <div className="form-input-group">
                  <label>City *</label>
                  <input
                    type="text"
                    required
                    placeholder="City"
                    value={addressForm.city}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, city: e.target.value })
                    }
                  />
                </div>
                <div className="form-input-group">
                  <label>State *</label>
                  <input
                    type="text"
                    required
                    placeholder="State"
                    value={addressForm.state}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, state: e.target.value })
                    }
                  />
                </div>
                <div className="form-input-group">
                  <label>Pincode *</label>
                  <input
                    type="text"
                    required
                    placeholder="6-digit pincode"
                    value={addressForm.pincode}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, pincode: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-input-group">
                  <label>Address Type</label>
                  <select
                    value={addressForm.type}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, type: e.target.value })
                    }
                  >
                    <option value="Home">Home (All-day delivery)</option>
                    <option value="Work">Work / Office (9 AM - 6 PM)</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="modal-checkbox-row">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={addressForm.isDefault}
                      onChange={(e) =>
                        setAddressForm({ ...addressForm, isDefault: e.target.checked })
                      }
                    />
                    <span>Make this my default address</span>
                  </label>
                </div>
              </div>

              <div className="modal-action-buttons">
                <button type="submit" className="tab-primary-btn">
                  {editingAddressId ? "Save Address Changes" : "Add Address"}
                </button>
                <button
                  type="button"
                  className="tab-secondary-btn"
                  onClick={() => setShowAddressModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. ADD PAYMENT METHOD MODAL */}
      {showPaymentModal && (
        <div className="account-modal-overlay" onClick={() => setShowPaymentModal(false)}>
          <div className="account-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="account-modal-header">
              <h3>Add Payment Method</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowPaymentModal(false)}
              >
                <FaTimes />
              </button>
            </div>

            <div className="payment-type-selector">
              <button
                type="button"
                className={`type-btn ${paymentType === "card" ? "active" : ""}`}
                onClick={() => setPaymentType("card")}
              >
                <FaCreditCard /> Credit / Debit Card
              </button>
              <button
                type="button"
                className={`type-btn ${paymentType === "upi" ? "active" : ""}`}
                onClick={() => setPaymentType("upi")}
              >
                <FaMoneyCheckAlt /> UPI ID (GooglePay / PhonePe)
              </button>
            </div>

            <form onSubmit={handleSavePayment} className="modal-form-body">
              {paymentType === "card" ? (
                <>
                  <div className="form-input-group">
                    <label>Card Number *</label>
                    <input
                      type="text"
                      required
                      placeholder="16-digit card number"
                      maxLength={19}
                      value={cardForm.cardNumber}
                      onChange={(e) =>
                        setCardForm({ ...cardForm, cardNumber: e.target.value })
                      }
                    />
                  </div>

                  <div className="form-input-group">
                    <label>Cardholder Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Name printed on card"
                      value={cardForm.cardHolder}
                      onChange={(e) =>
                        setCardForm({ ...cardForm, cardHolder: e.target.value })
                      }
                    />
                  </div>

                  <div className="form-grid-2">
                    <div className="form-input-group">
                      <label>Expiry (MM/YY) *</label>
                      <input
                        type="text"
                        required
                        placeholder="MM/YY"
                        maxLength={5}
                        value={cardForm.expiry}
                        onChange={(e) =>
                          setCardForm({ ...cardForm, expiry: e.target.value })
                        }
                      />
                    </div>
                    <div className="form-input-group">
                      <label>CVV / Security Code *</label>
                      <input
                        type="password"
                        required
                        placeholder="3 or 4 digits"
                        maxLength={4}
                        value={cardForm.cvv}
                        onChange={(e) =>
                          setCardForm({ ...cardForm, cvv: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="modal-checkbox-row">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={cardForm.isDefault}
                        onChange={(e) =>
                          setCardForm({ ...cardForm, isDefault: e.target.checked })
                        }
                      />
                      <span>Set as default payment card</span>
                    </label>
                  </div>
                </>
              ) : (
                <>
                  <div className="form-input-group">
                    <label>UPI ID / VPA *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. mobile@okhdfcbank or yourname@paytm"
                      value={upiForm.upiId}
                      onChange={(e) =>
                        setUpiForm({ ...upiForm, upiId: e.target.value })
                      }
                    />
                    <small className="field-help-text">
                      Supports Google Pay, PhonePe, Paytm, BHIM, and all bank UPI handles.
                    </small>
                  </div>

                  <div className="modal-checkbox-row">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={upiForm.isDefault}
                        onChange={(e) =>
                          setUpiForm({ ...upiForm, isDefault: e.target.checked })
                        }
                      />
                      <span>Set as default UPI handle</span>
                    </label>
                  </div>
                </>
              )}

              <div className="modal-action-buttons">
                <button type="submit" className="tab-primary-btn">
                  Save Payment Method
                </button>
                <button
                  type="button"
                  className="tab-secondary-btn"
                  onClick={() => setShowPaymentModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. LOGOUT CONFIRMATION MODAL */}
      {showLogoutModal && (
        <div className="account-modal-overlay" onClick={() => setShowLogoutModal(false)}>
          <div className="account-modal-box confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-icon-wrap">
              <FaSignOutAlt />
            </div>
            <h3>Sign Out of ShoppyGlobe?</h3>
            <p>Are you sure you want to log out? You can sign back in anytime to access your orders and wishlist.</p>
            <div className="modal-action-buttons">
              <button
                type="button"
                className="tab-primary-btn danger"
                onClick={handleConfirmLogout}
              >
                Yes, Sign Out
              </button>
              <button
                type="button"
                className="tab-secondary-btn"
                onClick={() => setShowLogoutModal(false)}
              >
                Stay Logged In
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. DELETE ACCOUNT CONFIRMATION MODAL */}
      {showDeleteModal && (
        <div className="account-modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="account-modal-box confirm-dialog danger" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-icon-wrap danger">
              <FaShieldAlt />
            </div>
            <h3 className="danger-text">Deactivate ShoppyGlobe account?</h3>
            <p>
              This action will close your account and delete your saved addresses, payment methods, and wishlists.
            </p>
            <div className="modal-action-buttons">
              <button
                type="button"
                className="tab-primary-btn danger"
                onClick={() => {
                  showToast("success", "Deactivation request received. Logging out...");
                  setTimeout(() => handleConfirmLogout(), 1200);
                }}
              >
                Confirm Deactivation
              </button>
              <button
                type="button"
                className="tab-secondary-btn"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
