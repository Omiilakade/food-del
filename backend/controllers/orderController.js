import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js"
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Config variables
const currency = "inr";  // ✅ Changed currency to INR
const deliveryCharge = 5000;  // ✅ Converted delivery charge to paise (50 INR * 100)
const frontend_URL = 'http://localhost:5173';

// Placing User Order using Stripe (INR)
const placeOrder = async (req, res) => {
    try {
        // Calculate total amount for all items (in INR)
        const totalAmount = req.body.items.reduce((total, item) => total + (item.price * item.quantity), 0);

        // Calculate delivery charge as 8% of the total amount
        const deliveryCharge = totalAmount * 0.12;  // 8% of totalAmount in INR
        const deliveryChargeInPaise = deliveryCharge * 100;  // Convert to paise for Stripe (INR)

        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: totalAmount,  // Store total amount in INR
            address: req.body.address,
        });
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        // Convert items to INR (Stripe requires the smallest currency unit, so multiply by 100)
        const line_items = req.body.items.map((item) => ({
            price_data: {
                currency: currency,
                product_data: {
                    name: item.name
                },
                unit_amount: item.price * 100  // Convert price to paise (INR)
            },
            quantity: item.quantity
        }));

        // Add delivery charge as a separate line item (in paise)
        line_items.push({
            price_data: {
                currency: currency,
                product_data: {
                    name: "GST tax"
                },
                unit_amount: deliveryChargeInPaise  // Delivery charge in paise (converted from INR)
            },
            quantity: 1
        });
        

        // Create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            success_url: `${frontend_URL}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_URL}/verify?success=false&orderId=${newOrder._id}`,
            line_items: line_items,
            mode: 'payment',
        });

        res.json({ success: true, session_url: session.url });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error processing payment" });
    }
};

// Placing Order with Cash on Delivery (COD)
const placeOrderCod = async (req, res) => {
    try {
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
            payment: true,
        });
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        res.json({ success: true, message: "Order Placed" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error placing order" });
    }
};

// Listing Orders for Admin
const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching orders" });
    }
};

// User Orders
const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.body.userId });
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching user orders" });
    }
};

// Update Order Status
const updateStatus = async (req, res) => {
    console.log(req.body);
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
        res.json({ success: true, message: "Status Updated" });
    } catch (error) {
        res.json({ success: false, message: "Error updating status" });
    }
};

// Verify Order after Payment
const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;
    try {
        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            res.json({ success: true, message: "Payment Successful" });
        } else {
            await orderModel.findByIdAndDelete(orderId);
            res.json({ success: false, message: "Payment Failed" });
        }
    } catch (error) {
        res.json({ success: false, message: "Verification Error" });
    }
};

export { placeOrder, listOrders, userOrders, updateStatus, verifyOrder, placeOrderCod };


