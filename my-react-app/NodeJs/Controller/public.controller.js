import Banner from "../Model/banner.model.js";
import Category from "../Model/category.model.js";
import Coupon from "../Model/coupon.model.js";
import Review from "../Model/review.model.js";
import Ticket from "../Model/ticket.model.js";
import Setting from "../Model/setting.model.js";
import AuthUser from "../Model/auth.model.js";

// GET /api/public/banners - Get active promotional banners
export async function getPublicBanners(req, res) {
  try {
    const banners = await Banner.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch banners", error: error.message });
  }
}

// GET /api/public/categories - Get active product categories
export async function getPublicCategories(req, res) {
  try {
    const categories = await Category.find({ isActive: true }).sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch categories", error: error.message });
  }
}

// GET /api/public/coupons - Get active non-expired coupons
export async function getPublicCoupons(req, res) {
  try {
    const now = new Date();
    const coupons = await Coupon.find({ isActive: true, expiryDate: { $gte: now } }).select("code discountType discountValue minOrderValue expiryDate");
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch coupons", error: error.message });
  }
}

// POST /api/public/coupons/validate - Validate coupon code
export async function validateCoupon(req, res) {
  try {
    const { code, cartTotal = 0 } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, message: "Coupon code is required" });
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase().trim(), isActive: true });
    if (!coupon) {
      return res.status(404).json({ success: false, message: "Invalid or expired coupon code" });
    }

    // Check expiry
    if (new Date(coupon.expiryDate) < new Date()) {
      return res.status(400).json({ success: false, message: "This coupon code has expired" });
    }

    // Check minimum order value
    if (cartTotal < coupon.minOrderValue) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount of ₹${coupon.minOrderValue} required for this coupon`,
      });
    }

    // Calculate discount amount
    let discountAmount = 0;
    if (coupon.discountType === "percentage") {
      discountAmount = (cartTotal * coupon.discountValue) / 100;
    } else {
      discountAmount = coupon.discountValue;
    }

    // Cap discount to cart total
    discountAmount = Math.min(discountAmount, cartTotal);

    res.json({
      success: true,
      message: "Coupon applied successfully!",
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount: Math.round(discountAmount),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error validating coupon", error: error.message });
  }
}

// GET /api/public/reviews/:productId - Get approved reviews for product
export async function getProductReviews(req, res) {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ product: productId, isApproved: true })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    const totalReviews = reviews.length;
    const avgRating =
      totalReviews > 0
        ? Math.round((reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews) * 10) / 10
        : 0;

    res.json({
      reviews,
      totalReviews,
      avgRating,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch reviews", error: error.message });
  }
}

// POST /api/public/reviews - Submit review (pending admin approval)
export async function submitReview(req, res) {
  try {
    const { productId, rating, comment, userName } = req.body;
    if (!productId || !rating || !comment) {
      return res.status(400).json({ message: "Product ID, rating, and comment are required" });
    }

    const userId = req.user ? req.user._id || req.user.id : null;

    const newReview = new Review({
      user: userId,
      product: productId,
      rating: Number(rating),
      comment: comment.trim(),
      isApproved: false, // requires admin approval
    });

    await newReview.save();
    res.status(201).json({
      success: true,
      message: "Review submitted successfully! It will appear once approved by an admin.",
      review: newReview,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to submit review", error: error.message });
  }
}

// POST /api/public/tickets - Create customer support ticket
export async function createSupportTicket(req, res) {
  try {
    const { name, email, subject, message, productName, productId } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: "All fields (name, email, subject, message) are required" });
    }

    const ticket = new Ticket({
      user: req.user ? req.user._id || req.user.id : null,
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim(),
      productName: productName && productName.trim() ? productName.trim() : "General Inquiry / Other",
      productId: productId || null,
      status: "open",
    });

    await ticket.save();
    res.status(201).json({
      success: true,
      message: "Support ticket submitted successfully! Our team will contact you shortly.",
      ticket,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to submit ticket", error: error.message });
  }
}

// GET /api/public/tickets/user - Get user support tickets
export async function getUserTickets(req, res) {
  try {
    const { email } = req.query;
    let query = {};
    if (req.user) {
      query.user = req.user._id || req.user.id;
    } else if (email) {
      query.email = email;
    } else {
      return res.json([]);
    }

    const tickets = await Ticket.find(query).sort({ createdAt: -1 });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user tickets", error: error.message });
  }
}

// GET /api/public/settings - Get public store settings
export async function getPublicSettings(req, res) {
  try {
    const settingsList = await Setting.find({});
    const settings = {};
    settingsList.forEach((s) => {
      settings[s.key] = s.value;
    });

    // Fallbacks if not set in DB
    const result = {
      gst_rate: settings.gst_rate !== undefined ? Number(settings.gst_rate) : 18,
      shipping_fee: settings.shipping_fee !== undefined ? Number(settings.shipping_fee) : 50,
      free_shipping_min: settings.free_shipping_min !== undefined ? Number(settings.free_shipping_min) : 499,
      store_name: settings.store_name || "MYCA",
      support_email: settings.support_email || "support@myca.com",
      support_phone: settings.support_phone || "+91 98765 43210",
      currency_symbol: settings.currency_symbol || "₹",
    };

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch settings", error: error.message });
  }
}
