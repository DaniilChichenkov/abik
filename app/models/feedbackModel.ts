import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
  // name: {
  //   requred: true,
  //   type: String,
  // },
  email: {
    required: true,
    type: String,
  },
  message: {
    required: true,
    type: String,
  },
  red: {
    type: Boolean,
    default: false,
  },
});

const FeedbackModel = mongoose.model("Feedback", feedbackSchema);

export default FeedbackModel;
