const Order = require('../models/Order');
const User = require('../models/User');

// Get all orders (admin only)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('items.productId')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      'items.productId'
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (
      req.user.role !== 'admin' &&
      req.user.role !== 'rider' &&
      order.userId !== req.user.uid
    ) {
      return res
        .status(403)
        .json({ message: 'Not authorized to view this order' });
    }

    if (req.user.role === 'rider' && order.assignedRider !== req.user.uid) {
      return res
        .status(403)
        .json({ message: 'This order is not assigned to you' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get orders for current user
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.uid })
      .populate('items.productId')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    // Add userId from authenticated user
    const newOrder = new Order({
      ...req.body,
      userId: req.user.uid,
    });

    const savedOrder = await newOrder.save();

    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Admin: Update order status
exports.updateOrderStatus = async (req, res) => {
  console.log('updateOrderStatus called with params:', req.params);
  console.log('Request body:', req.body);
  
  try {
    const { orderStatus } = req.body;
    console.log('Order status from request:', orderStatus);

    if (!['Processing', 'Shipped', 'Cancelled'].includes(orderStatus)) {
      console.log('Invalid status transition, received:', orderStatus);
      return res.status(400).json({
        message: 'Invalid status transition for admin',
      });
    }

    const order = await Order.findById(req.params.id);
    console.log('Order found by ID:', order ? 'Yes' : 'No');

    if (!order) {
      console.log('Order not found with ID:', req.params.id);
      return res.status(404).json({ message: 'Order not found' });
    }

    order.orderStatus = orderStatus;
    console.log('Setting order status to:', orderStatus);

    if (orderStatus === 'Shipped' && !req.body.assignedRider) {
      console.log('Shipping status but no rider assigned');
      return res.status(400).json({
        message: 'Rider must be assigned when shipping an order',
      });
    }

    if (req.body.assignedRider) {
      const rider = await User.findOne({
        firebaseUID: req.body.assignedRider,
        role: 'rider',
        isActive: true,
      });

      if (!rider) {
        console.log('Rider not found or not active');
        return res.status(404).json({
          message: 'Rider not found or not active',
        });
      }

      order.assignedRider = req.body.assignedRider;
      console.log('Rider assigned successfully');
    }

    await order.save();
    console.log('Order saved successfully');

    res.json(order);
  } catch (error) {
    console.error('Error in updateOrderStatus:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.updateDeliveryStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;

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

    if (req.body.deliveryNotes) {
      order.deliveryNotes = req.body.deliveryNotes;
    }

    await order.save();

    res.json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getRiderOrders = async (req, res) => {
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

module.exports = exports;
