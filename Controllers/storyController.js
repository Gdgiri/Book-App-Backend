import Story from "../Models/storySchema.js";
import mongoose from "mongoose";
// Controller to handle story upload
export const uploadStory = async (req, res) => {
  const { title, description, content, coverImage } = req.body;

  try {
    // Ensure all fields are provided
    if (!title || !description || !content || !coverImage) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Create and save the new story
    const story = await Story.create({
      title,
      description,
      content,
      coverImage,
      author: req.user._id, // Attach the authenticated user's ID
    });

    res.status(201).json({
      message: "Story uploaded successfully",
      story,
    });
  } catch (error) {
    console.error("Error uploading story:", error);
    res.status(500).json({ message: "Server error, please try again later" });
  }
};

// Controller to get all stories
export const getAllStories = async (req, res) => {
  try {
    const stories = await Story.find()
      .sort({ createdAt: -1 })
      .populate("author", "username email");

    res.status(200).json({
      message: "Stories fetched successfully",
      stories,
    });
  } catch (error) {
    console.error("Error fetching stories:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch stories", error: error.message });
  }
};

// Controller to get a uploaded story by ID

export const getStory = async (req, res) => {
  try {
    // Log the authenticated user ID
    console.log("Authenticated user ID:", req.user._id);

    // Find stories uploaded by the authenticated user
    const userStories = await Story.find({ author: req.user._id })
      .sort({
        createdAt: -1,
      })
      .populate("author", "username email");

    // Log the user stories to check if they are fetched correctly
    console.log("User stories found:", userStories);

    // Check if the user has uploaded any stories
    if (!userStories || userStories.length === 0) {
      return res
        .status(404)
        .json({ message: "You have not uploaded any stories yet." });
    }

    res.status(200).json({
      message: "Your uploaded stories fetched successfully",
      stories: userStories,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch your stories", error });
  }
};

// getById

export const getStoryById = async (req, res) => {
  const { id } = req.params;

  // Validate MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid story ID format" });
  }

  try {
    // Try to find the story by ID
    const story = await Story.findById(id);

    // Check if the story exists
    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    res.status(200).json(story); // Send the story data as a response
  } catch (error) {
    console.error("Error fetching story with ID:", id, error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Controller to update a story by ID

export const updateStory = async (req, res) => {
  const { id } = req.params;
  console.log("Story ID from request params:", id);
  const { title, description, content, coverImage } = req.body;

  try {
    // Check if story exists
    const story = await Story.findById(id);
    console.log("Fetched Story:", story);

    // If story does not exist
    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    console.log("Authenticated User ID:", req.user._id);
    console.log("Story Author ID:", story.author);

    // Check if the authenticated user is the author of the story or an admin
    if (
      story.author.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message:
          "You can only update your own story or an admin can update any story",
      });
    }

    // Update the story
    story.title = title || story.title;
    story.description = description || story.description;
    story.content = content || story.content;
    story.coverImage = coverImage || story.coverImage;

    // Save the updated story
    await story.save();

    res.status(200).json({
      message: "Story updated successfully",
      story,
    });
  } catch (error) {
    console.error("Error updating story:", error);
    res.status(500).json({ message: "Server error, please try again later" });
  }
};

export const deleteStory = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if the story exists
    const story = await Story.findById(id);

    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    // Check if the authenticated user is the author or an admin
    if (
      story.author.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this story" });
    }

    // Delete the story
    await story.deleteOne(); // Correct method to delete a single document

    res.status(200).json({ message: "Story deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete the story", error });
  }
};
