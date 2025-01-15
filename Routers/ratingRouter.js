import express from "express";
import { protect } from "../Middleware/authMiddleware.js";
import {
  addRating,
  getStoryRatings,
  getUserRatings,
} from "../Controllers/ratingController.js";

const router = express.Router();

router.post("/createrating", protect, addRating);
router.get("/getratings/:storyId", protect, getStoryRatings);
router.get("/getuserratings", protect, getUserRatings);

export default router;
