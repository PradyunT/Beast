import { connectToDB } from "@/utils/database";
import Goal from "@/models/goal";

export const POST = async (req) => {
  try {
    await connectToDB();
    const data = await req.json();
    const foundGoal = await Goal.findById(data.goalId);

    if (!foundGoal) {
      return new Response("Failed to find goal", { status: 404 });
    }
    if (foundGoal.type === "consistency") {
      // Update weeklog
      const consistencyGoal = foundGoal.consistency;
      const today = new Date();
      console.log(consistencyGoal);
      const weeklogFirstDate = consistencyGoal.weekLog[0].date;
      const nextSunday = new Date();
      nextSunday.setDate(today.getDate() + (7 - today.getDay()));
      nextSunday.setHours(0, 0, 0, 0);
      if (today >= weeklogFirstDate && today <= nextSunday) {
        // If today is within the current week: add log into weeklog
        consistencyGoal.weekLog[0].logs += 1;
      } else {
        // If today is not within the current week (today until sunday): create new weeklog with date starting last sunday
        const lastSunday = new Date();
        lastSunday.setDate(today.getDate() - today.getDay()); // Set the day of the week to Sunday
        lastSunday.setHours(0, 0, 0, 0);
        consistencyGoal.weekLog.unshift({ date: lastSunday, logs: 1 });
      }
      // Update progress
      let totalLogs = 0;
      let totalGoal = 0;

      consistencyGoal.weekLog.forEach((week, index) => {
        totalLogs += week.logs;
        if (index === consistencyGoal.weekLog.length - 1) {
          // Use initFrequency for the last week
          totalGoal += consistencyGoal.initFrequency;
        } else {
          totalGoal += consistencyGoal.frequency;
        }
      });

      const progress = totalLogs / totalGoal;
      foundGoal.progress = progress;
    } else if (foundGoal.type === "weight") {
      // Update currentWeight
      const { currentWeight } = data;
      foundGoal.weight.currentWeight = currentWeight;
      // Update progress
      const { startingWeight, goalWeight } = foundGoal.weight;
      if (goalWeight > startingWeight) {
        const progress =
          (currentWeight - startingWeight) / (goalWeight - startingWeight);
        foundGoal.progress = progress;
      } else {
        const progress =
          (startingWeight - goalWeight) / (startingWeight - goalWeight);
        foundGoal.progress = progress;
      }
    } else if (foundGoal.type === "strength") {
      // Update currentReps and currentWeight
      const { currentWeight, currentReps } = data;
      foundGoal.strength.currentWeight = currentWeight;
      foundGoal.strength.currentReps = currentReps;

      // Update progress
      const { startingWeight, startingReps, goalWeight, goalReps } =
        foundGoal.strength;
      // starting 5x155 current 6x165 goal 6x215
      const progress =
        (currentWeight * currentReps - startingWeight * startingReps) /
        (goalWeight * goalReps - startingWeight * startingReps);
      foundGoal.progress = progress;
    } else if (foundGoal.type === "distanceCardio") {
      if (foundGoal.distanceCardio.cardioType === "staticTime") {
        // Update currentDistance
        const { currentDistance } = data;
        foundGoal.distanceCardio.currentDistance = currentDistance;

        // Update progress
        const { startingDistance, goalDistance } = foundGoal.distanceCardio;
        const progress =
          (currentDistance - startingDistance) /
          (goalDistance - startingDistance);
        foundGoal.progress = progress;
      } else if (foundGoal.distanceCardio.cardioType === "staticDistance") {
        // Update currentTime
        const { currentTime } = data;
        foundGoal.distanceCardio.currentTime = currentTime;
        // Update progress
        const { startingTime, goalTime } = foundGoal.distanceCardio;
        // starting: 100 current: 90 final: 80
        const progress =
          (startingTime - currentTime) / (startingTime - goalTime);
        foundGoal.progress = progress;
      }
    } else {
      return new Response("Failed to identify goal type", { status: 404 });
    }
    await foundGoal.save();
    return new Response("Successfully updated goal", { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response("Failed to update goal", { status: 500 });
  }
};
