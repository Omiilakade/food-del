import express from "express";
import { addFood, listFood, removeFood, searchFood } from "../controllers/foodController.js";
import multer from "multer";

const foodRouter = express.Router();

// Configure file storage for images & AR models
const storage = multer.diskStorage({
    destination: "uploads",
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({ storage: storage });

foodRouter.get("/list", listFood);
foodRouter.get("/search", searchFood); // ✅ Correctly define searchFood
foodRouter.post("/add", upload.single("image"), addFood);
foodRouter.post("/remove", removeFood);

export default foodRouter;
