import { Schema, model, models } from "mongoose";

const workoutSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: String,
  exercises: [
    {
      name: String,
      sets: [{ number: Number, reps: Number, weight: Number }],
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

const Workout = models.Workout || model("Workout", workoutSchema);

export default Workout;
