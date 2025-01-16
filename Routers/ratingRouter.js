import express from "express";
import { protect } from "../Middleware/authMiddleware.js";
import { addRating, getRatingsById } from "../Controllers/ratingController.js";

const router = express.Router();

router.post("/createrating", protect, addRating);
router.get("/reviews/:storyId", getRatingsById);

export default router;
