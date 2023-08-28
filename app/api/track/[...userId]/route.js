import { connectToDB } from "@/utils/database";
import Workout from "@/models/Workout";
import User from "@/models/user";

export const POST = async ({ params }) => {
  try {
    await connectToDB();

    // Create workout
    const newWorkout = new Workout();

    // Update user's workout array
    const foundUser = await User.findById(params.userId).populate("workout");
    foundUser.workouts.unshift(newWorkout._id);

    // Set workout's userId
    newWorkout.userId = foundUser._id;

    // Save Workout and foundUser
    await foundUser.save();
    await newWorkout.save();

    return new Response("Successfully tracked workout", { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response("Failed to track workout", { status: 500 });
  }
};
