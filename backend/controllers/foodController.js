import foodModel from "../models/foodModel.js";
import fs from 'fs';

// List all food items
const listFood = async (req, res) => {
    try {
        const foods = await foodModel.find({});
        res.json({ success: true, data: foods });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error retrieving food items" });
    }
};

// Add new food item with AR file upload
const addFood = async (req, res) => {
    try {
        let image_filename = req.file ? req.file.filename : null;

        const food = new foodModel({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            image: image_filename,
            ar_model_link: req.body.ar_model_link || null // Ensure it handles null values
        });

        await food.save();
        res.json({ success: true, message: "Food Added Successfully" });
    } catch (error) {
        console.error("Error adding food:", error);
        res.json({ success: false, message: "Error adding food item" });
    }
};


// Delete a food item
const removeFood = async (req, res) => {
    try {
        const food = await foodModel.findById(req.body.id);
        fs.unlink(`uploads/${food.image}`, () => {});
        if (food.ar_model_file) fs.unlink(`uploads/${food.ar_model_file}`, () => {});

        await foodModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Food Removed" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error removing food item" });
    }
};

// Search food items by name
const searchFood = async (req, res) => {
    try {
        const query = req.query.query;
        if (!query) {
            return res.json({ success: false, message: "Search query is required" });
        }

        const foods = await foodModel.find({
            name: { $regex: query, $options: "i" } // Case-insensitive search
        });

        res.json({ success: true, data: foods });
    } catch (error) {
        console.error("Error searching food:", error);
        res.json({ success: false, message: "Error searching food items" });
    }
};

export { listFood, addFood, removeFood, searchFood };
