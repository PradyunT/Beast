import { connectToDB } from "@/utils/database";
import User from "@/models/user";
import Goal from "@/models/goal";
import Workouts from "@/models/workout";

export const GET = async (req, res) => {
  try {
    await connectToDB();
    const foundUsers = await User.find({ initialized: true })
      .populate("workouts")
      .populate("goals");
    return new Response(JSON.stringify(foundUsers), { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify("Failed to get users"), { status: 500 });
  }
};
