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
      price: { type: Number, required: true },
      ee: { type: String, required: true },
      ru: { type: String, required: true },
      priceType: { type: String, required: true },
    },
  ],
});

const ServiceModel = mongoose.model("Service", serviceSchema);

export default ServiceModel;
