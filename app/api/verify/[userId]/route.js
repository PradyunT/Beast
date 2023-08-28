import { connectToDB } from "@/utils/database";
import User from "@/models/user";
import Workout from "@/models/workout";

import { NextResponse } from "next/server";

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
        currentDate.getUTCFullYear() === latestWorkoutDate.getUTCFullYear() &&
        currentDate.getUTCMonth() === latestWorkoutDate.getUTCMonth() &&
        currentDate.getUTCDate() === latestWorkoutDate.getUTCDate()
      ) {
        // User already has tracked a workout today
        return NextResponse.json({
          message: "You've already tracked a workout today",
          status: 400,
        });
        // return new Response("You've already tracked a workout today", {
        //   status: 403,
        // });
      } else {
        // User has not yet tracked a workout today
        return NextResponse.json({
          message: "Good to track workout",
          status: 200,
        });
        // return new Response("Good to track workout", { status: 200 });
      }
    }
  } catch (err) {
    console.log(err);
    return NextResponse.json({
      message: "Error while verifying if user can track workout" + err,
      status: 500,
    });
    // return new Response("Error while verifying if user can track workout", {
    //   status: 500,
    // });
  }
};
