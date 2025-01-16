import express from "express";
import { protect } from "../Middleware/authMiddleware.js";
import { addRating } from "../Controllers/ratingController.js";

const router = express.Router();

router.post("/createrating", protect, addRating);

export default router;
