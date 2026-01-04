import { connectToDB } from "./db.js";
import ContactInfoModel from "../models/contactInfoModel.js";

async function seedDatabase() {
  try {
    await connectToDB();
    await ContactInfoModel.create({
      id: "contactInfo",
      tel: "1111",
      email: "22222",
      address: "33333",
    });
  } catch (error) {
    console.log(error);
  }
}

seedDatabase();
