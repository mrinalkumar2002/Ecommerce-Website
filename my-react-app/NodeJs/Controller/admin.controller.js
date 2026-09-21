import Product from "../Model/products.model.js";
import Order from "../Model/order.model.js";
import auth from "../Model/auth.model.js";
import mongoose from "mongoose";

/* ===================== DASHBOARD STATS ===================== */
export async function getDashboardStats(req, res) {
  try {
    const months = parseInt(req.query.months) || 6;
    let totalProducts = 0;
    let totalOrders = 0;
    let totalUsers = 0;
    let totalRevenue = 0;
    let recentOrders = [];
    let lowStockProducts = [];
    let monthlySales = [];

    if (mongoose.connection.readyState === 1) {
      totalProducts = await Product.countDocuments();
      totalOrders = await Order.countDocuments();
      totalUsers = await auth.countDocuments();

      const revenueAgg = await Order.aggregate([
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]);
      totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].total : 0;

      recentOrders = await Order.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .lean();

      lowStockProducts = await Product.find({ stock: { $lt: 10 } })
        .select("title stock images")
        .limit(5)
        .lean();

      // Real monthly sales aggregation
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - months + 1);
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);

      const salesAgg = await Order.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            sales: { $sum: "$totalAmount" },
            orders: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]);

      // Build a full list of months even if no orders
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const salesMap = {};
      salesAgg.forEach((entry) => {
        const key = `${entry._id.year}-${entry._id.month}`;
        salesMap[key] = { sales: Math.round(entry.sales), orders: entry.orders };
      });

      for (let i = 0; i < months; i++) {
        const d = new Date();
        d.setMonth(d.getMonth() - (months - 1 - i));
        const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
        monthlySales.push({
          name: monthNames[d.getMonth()],
          sales: salesMap[key]?.sales || 0,
          orders: salesMap[key]?.orders || 0,
        });
      }
    }

    res.status(200).json({
      success: true,
      stats: {
        totalProducts,
        totalOrders,
        totalUsers,
        totalRevenue,
      },
      recentOrders,
      lowStockProducts,
      monthlySales,
    });
  } catch (error) {
    console.error("DASHBOARD STATS ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
}

/* ===================== ALL ORDERS ===================== */
export async function getAllOrders(req, res) {
  try {
    let orders = [];

    if (mongoose.connection.readyState === 1) {
      orders = await Order.find().sort({ createdAt: -1 }).lean();
    }

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("GET ALL ORDERS ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
}

/* ===================== UPDATE ORDER STATUS ===================== */
export async function updateOrderStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      });
    }

    if (mongoose.connection.readyState === 1) {
      const order = await Order.findOneAndUpdate(
        { orderId: id },
        { status },
        { new: true }
      );

      if (!order) {
        return res.status(404).json({ success: false, message: "Order not found" });
      }

      return res.status(200).json({ success: true, order });
    }

    res.status(503).json({ success: false, message: "Database not connected" });
  } catch (error) {
    console.error("UPDATE ORDER STATUS ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
}

/* ===================== ALL USERS ===================== */
export async function getAllUsers(req, res) {
  try {
    let users = [];

    if (mongoose.connection.readyState === 1) {
      users = await auth.find().select("-password").sort({ _id: -1 }).lean();
    }

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("GET ALL USERS ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
}

/* ===================== ADD PRODUCT ===================== */
export async function addProduct(req, res) {
  try {
    const { title, description, price, stock, category, company, images, rating } = req.body;

    if (!title || !description || !price) {
      return res.status(400).json({
        success: false,
        message: "Title, description, and price are required",
      });
    }

    const productId = "z-ADMIN-" + Date.now() + "-" + Math.floor(1000 + Math.random() * 9000);

    const product = new Product({
      _id: productId,
      title,
      description,
      price: Number(price),
      stock: Number(stock) || 50,
      category: category || "general",
      company: company || "Generic",
      images: images || [],
      rating: Number(rating) || 4.5,
      reviewCount: 0,
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: "Product added successfully!",
      product,
    });
  } catch (error) {
    console.error("ADD PRODUCT ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
}

/* ===================== UPDATE PRODUCT ===================== */
export async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (mongoose.connection.readyState === 1) {
      const product = await Product.findByIdAndUpdate(id, updates, { new: true });

      if (!product) {
        return res.status(404).json({ success: false, message: "Product not found" });
      }

      return res.status(200).json({ success: true, product });
    }

    res.status(503).json({ success: false, message: "Database not connected" });
  } catch (error) {
    console.error("UPDATE PRODUCT ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
}

/* ===================== DELETE PRODUCT ===================== */
export async function deleteProduct(req, res) {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1) {
      const product = await Product.findByIdAndDelete(id);

      if (!product) {
        return res.status(404).json({ success: false, message: "Product not found" });
      }

      return res.status(200).json({
        success: true,
        message: "Product deleted successfully",
      });
    }

    res.status(503).json({ success: false, message: "Database not connected" });
  } catch (error) {
    console.error("DELETE PRODUCT ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
}
