import { connectToDB } from "./db";
import UserModel from "../models/userModel";
import "dotenv/config";

async function createTestUser() {
  try {
    await connectToDB();
    const alreadyExist = await UserModel.findOne({
      username: process.env.USERNAME,
    });
    if (!alreadyExist) {
      await UserModel.create({
        username: process.env.USERNAME,
        passwordHash: process.env.USERPASS,
      });
    }
  } catch (error) {
    console.log(error);
  }
}

createTestUser();
