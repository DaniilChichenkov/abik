import mongoose from "mongoose";

const contactInfoSchema = new mongoose.Schema({
  id: {
    required: true,
    type: String,
  },
  tel: {
    required: true,
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
});

const ContactInfoModel = mongoose.model("ContactInfo", contactInfoSchema);
export default ContactInfoModel;
