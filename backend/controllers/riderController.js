const Order = require('../models/Order');
const User = require('../models/User');

// Get all assigned orders for the rider
exports.getAssignedOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      assignedRider: req.user.uid,
      orderStatus: { $in: ['Shipped', 'Delivered', 'Undelivered'] },
    })
      .populate('items.productId')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get assigned order details
exports.getOrderDetails = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      assignedRider: req.user.uid,
    }).populate('items.productId');

    if (!order) {
      return res.status(404).json({
        message: 'Order not found or not assigned to you',
      });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update order delivery status
exports.updateDeliveryStatus = async (req, res) => {
  try {
    const { orderStatus, deliveryNotes } = req.body;

    if (!['Delivered', 'Undelivered'].includes(orderStatus)) {
      return res.status(400).json({
        message:
          'Riders can only update order status to Delivered or Undelivered',
      });
    }

    const order = await Order.findOne({
      _id: req.params.id,
      assignedRider: req.user.uid,
      orderStatus: 'Shipped', 
    });

    if (!order) {
      return res.status(404).json({
        message:
          'Order not found or not assigned to you or not in shipped status',
      });
    }

    order.orderStatus = orderStatus;

    if (deliveryNotes) {
      order.deliveryNotes = deliveryNotes;
    }

    await order.save();

    res.json({
      message: `Order marked as ${orderStatus}`,
      order,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get rider profile
exports.getRiderProfile = async (req, res) => {
  try {
    const rider = await User.findOne({
      firebaseUID: req.user.uid,
      role: 'rider',
    }).select('-__v');

    if (!rider) {
      return res.status(404).json({ message: 'Rider profile not found' });
    }

    res.json(rider);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update rider profile (limited fields)
exports.updateRiderProfile = async (req, res) => {
  try {
    const updatedRider = await User.findOneAndUpdate(
      {
        firebaseUID: req.user.uid,
        role: 'rider',
      },
      {
        $set: {
          phone: req.body.phone,
          address: req.body.address,
        },
      },
      { new: true, runValidators: true }
    );

    if (!updatedRider) {
      return res.status(404).json({ message: 'Rider profile not found' });
    }

    res.json(updatedRider);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get rider statistics
exports.getRiderStats = async (req, res) => {
  try {
    const totalAssigned = await Order.countDocuments({
      assignedRider: req.user.uid,
    });

    const pendingDeliveries = await Order.countDocuments({
      assignedRider: req.user.uid,
      orderStatus: 'Shipped',
    });

    const deliveredOrders = await Order.countDocuments({
      assignedRider: req.user.uid,
      orderStatus: 'Delivered',
    });

    const undeliveredOrders = await Order.countDocuments({
      assignedRider: req.user.uid,
      orderStatus: 'Undelivered',
    });

    // Recent orders (last 5)
    const recentOrders = await Order.find({
      assignedRider: req.user.uid,
    })
      .sort({ updatedAt: -1 })
      .limit(5)
      .populate('items.productId');

    res.json({
      stats: {
        totalAssigned,
        pendingDeliveries,
        deliveredOrders,
        undeliveredOrders,
      },
      recentOrders,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = exports;
