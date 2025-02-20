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

    const newRating = await Rating.create({
      user: req.user._id, // Assumes you are passing authenticated user
      story: storyId,
      rating,
      comment,
    });

    res.status(201).json(newRating);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRatingsById = async (req, res) => {
  try {
    const { storyId } = req.params;

    const reviews = await Rating.find({ story: storyId })
      .populate("user", "username") // Populate user details (e.g., username)
      .sort({ createdAt: -1 }); // Sort by latest reviews

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
};
