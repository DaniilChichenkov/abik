import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
});

//Hash password before saving in DB
userSchema.pre("save", async function (next) {
  //Create salt
  const saltRounds = 12;

  //Hash pass
  const hash = await bcrypt.hash(this.passwordHash!, saltRounds);

  //Store hashed pass in db
  if (hash) {
    this.passwordHash = hash;
  }
});

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
