import { connectToDB } from "@/utils/database.js";
import Goal from "@/models/goal.js";
import User from "@/models/user";

export const POST = async (req) => {
  try {
    const data = await req.json();
    const { userId, type, date } = data;
    await connectToDB();
    let newGoal;

    if (type === "consistency") {
      const { frequency } = data;
      newGoal = await new Goal({
        consistency: { frequency },
        date,
        type,
      });
    } else if (type === "weight") {
      const { startingWeight, goalWeight } = data;
      newGoal = await new Goal({
        weight: { startingWeight, goalWeight },
        date,
        type,
      });
    } else if (type === "strength") {
      const { exercise, startingWeight, goalWeight, startingReps, goalReps } =
        data;
      newGoal = await new Goal({
        strength: {
          exercise,
          startingWeight,
          goalWeight,
          startingReps,
          goalReps,
        },
        date,
        type,
      });
    } else if (type === "distanceCardio") {
      const { cardioType } = data;
      if (cardioType === "staticTime") {
        const {
          startingDistance,
          goalDistance,
          staticTimeMinutes,
          staticTimeSeconds,
          cardioType,
        } = data;
        newGoal = await new Goal({
          distanceCardio: {
            cardioType,
            startingDistance,
            goalDistance,
            staticTime:
              parseInt(staticTimeMinutes) * 60 + parseInt(staticTimeSeconds),
          },
          date,
          type,
        });
      } else if (cardioType === "staticDistance") {
        const {
          startingTimeSeconds,
          startingTimeMinutes,
          goalTimeSeconds,
          goalTimeMinutes,
          staticDistance,
          cardioType,
        } = data;
        newGoal = await new Goal({
          distanceCardio: {
            cardioType,
            startingTime:
              parseInt(startingTimeMinutes) * 60 +
              parseInt(startingTimeSeconds),
            goalTime:
              parseInt(goalTimeMinutes) * 60 + parseInt(goalTimeSeconds),
            staticDistance,
          },
          date,
          type,
        });
      }
    } else {
      return new Response(`Error: type '${type}' does not exist`, {
        status: 500,
      });
    }

    await newGoal.save();

    const foundUser = await User.findById(userId);
    foundUser.goals.push(newGoal._id);
    await foundUser.save();
    return new Response("Successfully created goal", { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response("Failed to create goal", { status: 500 });
  }
};
