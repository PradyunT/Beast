import { Schema, model, models } from "mongoose";

const userSchema = new Schema({
  email: {
    type: String,
    unique: [true, "Email already exists"],
    required: [true, "Email is required"],
  },
  username: {
    type: String,
    required: [true, "Username is required"],
    match: [
      /^(?=.{3,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/,
      "Username invalid, it should contain 8-20 alphanumeric letters and be unique",
    ],
  },
  initialized: {
    type: Boolean,
    default: false,
  },
  displayName: {
    type: String
  },
  fullName: {
    type: String
  },
  stats: {
    height: {
      type: Number,
    },
    weight: {
      type: Number,
    },
  },
  goals: {
    startingWeight: {
      type: Number,
    },
    goalWeight: {
      type: Number,
    },
    bulking: {
      type: Boolean,
    },
    cutting: {
      type: Boolean,
    },
  },
  image: {
    type: String,
  },
});

const User = models.User || model("User", userSchema);

export default User;
