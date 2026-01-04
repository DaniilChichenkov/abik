import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema({
  //Title of gallery
  title: {
    ee: { type: String, required: true, unique: true },
    ru: { type: String, required: true, unique: true },
  },
});

const GalleryModel = mongoose.model("Gallery", gallerySchema);

export default GalleryModel;
