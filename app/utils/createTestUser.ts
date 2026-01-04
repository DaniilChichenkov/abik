import { connectToDB } from "./db";
import UserModel from "../models/userModel";

async function createTestUser() {
  try {
    await connectToDB();
    const alreadyExist = await UserModel.findOne({ username: "Daniil" });
    if (!alreadyExist) {
      await UserModel.create({ username: "Daniil", passwordHash: "12345" });
    }
  } catch (error) {
    console.log(error);
  }
}

createTestUser();
