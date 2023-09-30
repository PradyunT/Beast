import { connectToDB } from "@/utils/database";
import User from "@/models/user";
import Goal from "@/models/goal";

export const GET = async (req, { params }) => {
  try {
    await connectToDB();

    // Check if user has a consistency goal
    const foundUser = await User.findById(params.userId).populate({
      path: "goals",
      match: { type: "consistency" }, // Filter for consistency goals only
    });

    if (!foundUser.goals || foundUser.goals.length === 0) {
      // User doesn't have a consistency goal
      return new Response("No consistency goal found", { status: 500 });
    }

    const consistencyGoal = foundUser.goals[0].consistency; // Assuming there's only one consistency goal

    // Check if the weekLog array is not empty
    if (consistencyGoal.weekLog.length > 0) {
      // Get the latest entry in the weekLog (which is the first entry)
      const latestUpdateDate = consistencyGoal.latestUpdateDate;
      const currentDate = new Date();

      // Check if the latestUpdateDate is on the same day as the current day
      if (
        currentDate.getUTCFullYear() === latestUpdateDate.getUTCFullYear() &&
        currentDate.getUTCMonth() === latestUpdateDate.getUTCMonth() &&
        currentDate.getUTCDate() === latestUpdateDate.getUTCDate()
      ) {
        // User has already tracked a workout today
        return new Response("You've already tracked a workout today", {
          status: 403,
        });
      }
    }

    // User has not yet tracked a workout today
    return new Response("Good to track workout", { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response("Error while verifying if user can track workout", {
      status: 500,
    });
  }
};
