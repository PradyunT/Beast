import { connectToDB } from "@/utils/database";
import User from "@/models/user";
import Goal from "@/models/goal";

export const POST = async (req, { params }) => {
  try {
    await connectToDB();
    const { goalId, userId } = await req.json();

    const foundUser = await User.findById(userId);
    if (!foundUser) {
      return new Response("User not found", { status: 404 });
    }

    const foundGoalIndex = foundUser.goals.findIndex((goal) => goal == goalId);

    if (foundGoalIndex === -1) {
      return new Response("Goal not found", { status: 404 });
    }

    foundUser.goals.splice(foundGoalIndex, 1);

    await foundUser.save();
    await Goal.findByIdAndDelete(goalId);

    return new Response("Successfully deleted goal", { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response("Failed to delete goal", { status: 500 });
  }
};
