import { connectToDB } from "@/utils/database";
import User from "@/models/user";
import Workout from "@/models/workout";

export const GET = async (req, { params }) => {
  try {
    await connectToDB();
    console.log(params.userId);

    // Check if user has already submitted a workout
    const foundUser = await User.findById(params.userId).populate("workouts");
    if (foundUser.workouts.length > 0) {
      // Get the latest workout
      const latestWorkout = foundUser.workouts[0];

      // Check if the latest workout date is within the current day
      const currentDate = new Date();
      const latestWorkoutDate = latestWorkout.date;

      if (
        // FIXME
        false
        // currentDate.getUTCFullYear() === latestWorkoutDate.getUTCFullYear() &&
        // currentDate.getUTCMonth() === latestWorkoutDate.getUTCMonth() &&
        // currentDate.getUTCDate() === latestWorkoutDate.getUTCDate()
      ) {
        // User already has tracked a workout today
        return new Response("You've already tracked a workout today", {
          status: 403,
        });
      } else {
        // User has not yet tracked a workout today
        return new Response("Good to track workout", {
          status: 200,
        });
      }
    } else {
      // User has 0 tracked workouts
      return new Response("Good to track workout", { status: 200 });
    }
  } catch (err) {
    console.log(err);
    return new Response("Error while verifying if user can track workout", {
      status: 500,
    });
  }
};
