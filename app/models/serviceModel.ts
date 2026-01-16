import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
  //Title of category
  title: {
    ee: { type: String, required: true, unique: true },
    ru: { type: String, required: true, unique: true },
  },

  //Children (Content) as array
  content: [
    {
      price: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
        validate: {
          validator: (v: any) => typeof v === "number" || v === "volumeBased",
          message: "Invalid value",
        },
      },
      ee: { type: String, required: true },
      ru: { type: String, required: true },
      priceType: { type: String, required: true },
      additionalInfo: {
        ru: { type: String },
        ee: { type: String },
      },
    },
  ],
});

const ServiceModel = mongoose.model("Service", serviceSchema);

export default ServiceModel;
