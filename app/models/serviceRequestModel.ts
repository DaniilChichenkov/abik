import mongoose from "mongoose";

const serviceRequestSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  service: {
    title: {
      ru: { type: String, required: true },
      ee: { type: String, required: true },
    },
    price: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
      validate: {
        validator: (v: any) =>
          typeof v === "number" ||
          (typeof v === "string" && v === "volumeBased"),
        message: "Invalid value",
      },
    },
    priceType: { type: String, required: true },
    additionalInfo: {
      ru: { type: String },
      ee: { type: String },
    },
  },
  serviceCategory: {
    title: {
      ru: { type: String, required: true },
      ee: { type: String, required: true },
    },
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

const ServiceRequestModel = mongoose.model(
  "ServiceRequest",
  serviceRequestSchema
);
export default ServiceRequestModel;
