import express from "express";
import {
  deleteStory,
  getAllStories,
  getStory,
  getStoryById,
  updateStory,
  uploadStory,
} from "../Controllers/storyController.js";
import { protect } from "../Middleware/authMiddleware.js";

const router = express.Router();

router.post("/createstory", protect, uploadStory);
router.get("/getall", protect, getAllStories);
router.get("/getstory", protect, getStory);
router.get("/idstory/:id", protect, getStoryById);
router.put("/updatestory/:id", protect, updateStory);
router.delete("/deletestory/:id", protect, deleteStory);

export default router;
