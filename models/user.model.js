import { model, Schema } from "mongoose";

const userSchema = Schema({
  username: { type: String },
  password: { type: String }
});

export const User = model("user", userSchema);