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
  displayName: String,
  tags: {
    type: [
      {
        tag: {
          type: String,
        },
      },
    ],
    default: [{ tag: "Rookie" }],
  },
  fullName: String,
  goals: [
    {
      type: Schema.Types.ObjectId,
      ref: "Goal",
    },
  ],
  workouts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Workout",
    },
  ],
  image: String,
});

const User = models.User || model("User", userSchema);

export default User;
