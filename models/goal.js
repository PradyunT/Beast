import { Schema, model, models } from "mongoose";

const goalSchema = new Schema({
  type: {
    type: String,
    enum: [
      "consistency",
      "weight",
      "strength",
      "distanceCardio",
      "calisthenics",
    ],
    required: true,
  },
  consistency: {
    frequency: Number,
    initFrequency: Number,
    latestUpdateDate: { type: Date, default: Date.now() },
    weekLog: [{ date: Date, logs: Number }],
  },
  weight: {
    phase: {
      type: String,
      enum: ["bulking", "cutting", "maintaining"],
    },
    startingWeight: Number,
    currentWeight: Number,
    goalWeight: Number,
  },
  strength: {
    exercise: String,
    startingWeight: Number,
    currentWeight: Number,
    goalWeight: Number,
    startingReps: Number,
    currentReps: Number,
    goalReps: Number,
  },
  distanceCardio: {
    cardioType: {
      type: String,
      enum: ["staticTime", "staticDistance"],
    },
    startingDistance: Number,
    startingTime: Number,
    currentDistance: Number,
    currentTime: Number,
    goalDistance: Number,
    goalTime: Number,
    staticTime: Number,
    staticDistance: Number,
  },
  calisthenics: {
    skill: String,
  },
  progress: {
    type: Number,
    default: 0,
  },
  date: {
    type: Date,
    required: true,
  },
});

const Goal = models.Goal || model("Goal", goalSchema);

export default Goal;
