import mongoose from "mongoose";

const storySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a title for the story"],
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
    },
    content: {
      type: String,
      required: [true, "Please add the content of the story"],
    },
    coverImage: {
      type: String,
      required: [true, "Please upload a book cover image"],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth", // Link to the authenticated user schema
      required: true,
    },
  },
  { timestamps: true }
);

const Story = mongoose.model("Story", storySchema);
export default Story;
