import Rating from "../Models/ratingSchema.js";
import Story from "../Models/storySchema.js";

// Add a new rating
export const addRating = async (req, res) => {
  const { storyId, rating, comment } = req.body;

  try {
    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    const existingRating = await Rating.findOne({
      user: req.user._id,
      story: storyId,
    });

    if (existingRating) {
      return res
        .status(400)
        .json({ message: "You have already rated this story." });
    }

    const newRating = await Rating.create({
      user: req.user._id,
      story: storyId,
      rating,
      comment,
    });

    res.status(201).json(newRating);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all ratings for a story
export const getStoryRatings = async (req, res) => {
  const { storyId } = req.params;

  try {
    const ratings = await Rating.find({ story: storyId }).populate(
      "user",
      "username email"
    );
    res.status(200).json(ratings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user's ratings
export const getUserRatings = async (req, res) => {
  try {
    const ratings = await Rating.find({ user: req.user._id }).populate(
      "story",
      "title description"
    );
    res.status(200).json(ratings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
