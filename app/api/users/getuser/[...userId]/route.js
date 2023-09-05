import { connectToDB } from "@/utils/database.js";
import User from "@/models/user";
import Workout from "@/models/workout";
import Goal from "@/models/goal";

export const GET = async (req, { params }) => {
  try {
    await connectToDB();
    const user = await User.findById(params.userId)
      .populate("workouts")
      .populate("goals");
    return new Response(JSON.stringify(user), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response("Error fetching user profile", { status: 500 });
  }
};
