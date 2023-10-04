import { connectToDB } from "@/utils/database";
import User from "@/models/user";
import Workout from "@/models/workout";

export const POST = async (req, { params }) => {
  try {
    await connectToDB();

    console.log(params.userId);

    // Create workout and set name and exercises
    const newWorkout = new Workout();
    newWorkout.quickUpdate = true;

    // Update user's workout array
    const foundUser = await User.findById(params.userId).populate("workouts");
    foundUser.workouts.unshift(newWorkout._id);

    // Set workout's userId
    newWorkout.userId = foundUser._id;

    // Save Workout and foundUser
    await foundUser.save();
    await newWorkout.save();

    return new Response("Successfully quick updated workout", { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response("Failed to quick update workout", { status: 500 });
  }
};
