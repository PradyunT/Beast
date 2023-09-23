import type Goal from "@/types/goal";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "./ui/use-toast";
import { useState } from "react";
import { useSession } from "next-auth/react";
import goal from "@/types/goal";
import { formatTitle, formatDate } from "@/utils/format";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Close } from "@radix-ui/react-popover";
import Link from "next/link";

const GoalCard = ({
  goal,
  onDelete,
  setUpdateGoal,
}: {
  goal: Goal;
  onDelete: () => void;
  setUpdateGoal: (input: goal) => void;
}) => {
  const [deleting, setDeleting] = useState(false);
  const { data: session } = useSession();
  const { toast } = useToast();

  const handleDelete = async (goalId: string) => {
    setDeleting(true);
    const res = await fetch("/api/goals/delete", {
      method: "POST",
      body: JSON.stringify({
        goalId,
        userId: session?.user.id,
      }),
    });
    if (res.status === 200) {
      toast({
        title: "Successfully deleted goal ✅",
        description: "Your goal was sucessfully deleted",
      });
      onDelete();
    } else if (res.status === 404) {
      toast({
        title: "User or Goal not found ❌",
        description: "We couldn't find your user profile and/or your goal",
      });
    } else if (res.status === 500) {
      toast({
        title: "Server error while trying to delete goal ❌",
        description: "There was an error while trying to delete your goal",
      });
    }
    setDeleting(false);
  };
  console.log(goal);
  return (
    <Card>
      <CardHeader>
        <CardTitle>{formatTitle(goal.type)}</CardTitle>
        <CardDescription>{formatTitle(goal.type)} Goal</CardDescription>
      </CardHeader>
      <CardContent>
        {goal.type === "consistency" ? (
          <>
            <h1 className="profile-content">
              Frequency: {goal.consistency.frequency} <br />
              Date: {formatDate(goal.date)} <br />
              <h1 className="text-xl font-semibold mt-4 mb-2">Logs</h1>
              {goal.consistency.weekLog.map((week, i) => {
                return `Week ${i + 1}: ${
                  week.logs + ` ${week.logs == 1 ? "Workout" : "Workouts"}` ||
                  "No workouts tracked yet"
                }`;
              })}
              <br />
              Progress:{" "}
              {goal?.progress ? `${Math.round(goal.progress * 100)}%` : "0%"}
            </h1>
          </>
        ) : goal.type === "weight" ? (
          <>
            <h1 className="profile-content">
              Phase:{" "}
              {goal.weight.phase.charAt(0).toUpperCase() +
                goal.weight.phase.slice(1)}
              <br />
              Starting Weight: {goal.weight.startingWeight}
              <br />
              Current Weight: {goal.weight.currentWeight || "Not tracked yet"}
              <br />
              Goal Weight: {goal.weight.goalWeight}
              <br />
              Date: {formatDate(goal.date)}
              <br />
              Progress:{" "}
              {goal?.progress ? `${Math.round(goal.progress * 100)}%` : "0%"}
            </h1>
          </>
        ) : goal.type === "strength" ? (
          <>
            <h1 className="profile-content">
              Exercise: {goal.strength.exercise}
              <br />
              Starting Reps: {`${goal.strength.startingReps}`}
              <br />
              Starting Weight: {`${goal.strength.startingWeight}`}
              <br />
              Current Reps:{" "}
              {`${goal.strength.currentReps || "Not tracked yet"}`}
              <br />
              Current Weight:{" "}
              {`${goal.strength.currentWeight || "Not tracked yet"}`}
              <br />
              Goal Reps: {`${goal.strength.goalReps}`}
              <br />
              Goal Weight: {`${goal.strength.goalWeight}`}
              <br />
              Date: {formatDate(goal.date)}
              <br />
              Progress:{" "}
              {goal?.progress ? `${Math.round(goal.progress * 100)}%` : "0%"}
            </h1>
          </>
        ) : (
          <>
            {goal.distanceCardio?.cardioType === "staticTime" ? (
              <>
                <h1 className="profile-content">
                  {" "}
                  Cardio Type: Static Time
                  <br />
                  Starting Distance: {`${goal.distanceCardio.startingDistance}`}
                  <br />
                  Current Distance:{" "}
                  {`${
                    goal.distanceCardio.currentDistance || "Not tracked yet"
                  }`}
                  <br />
                  Goal Distance: {`${goal.distanceCardio.goalDistance}`}
                  <br />
                  Time:{" "}
                  {`${Math.floor(
                    goal.distanceCardio.staticTime / 60
                  )} min, ${Math.floor(
                    goal.distanceCardio.staticTime % 60
                  )} sec`}
                  <br />
                  Date: {formatDate(goal.date)}
                  <br />
                  Progress:{" "}
                  {goal?.progress
                    ? `${Math.round(goal.progress * 100)}%`
                    : "0%"}
                </h1>
              </>
            ) : (
              <>
                <h1 className="profile-content">
                  Cardio Type: Static Distance
                  <br />
                  Starting Time:{" "}
                  {`${Math.floor(
                    goal.distanceCardio.startingTime / 60
                  )} min, ${Math.floor(
                    goal.distanceCardio.startingTime % 60
                  )} sec`}
                  <br />
                  Current Time:{" "}
                  {goal.distanceCardio.currentTime
                    ? `${Math.floor(
                        goal.distanceCardio.currentTime / 60
                      )} min, ${Math.floor(
                        goal.distanceCardio.currentTime % 60
                      )} sec`
                    : "Not tracked yet"}
                  <br />
                  Goal Time:{" "}
                  {`${Math.floor(
                    goal.distanceCardio.goalTime / 60
                  )} min, ${Math.floor(goal.distanceCardio.goalTime % 60)} sec`}
                  <br />
                  Date: {formatDate(goal.date)}
                  <br />
                  Progress:{" "}
                  {goal?.progress
                    ? `${Math.round(goal.progress * 100)}%`
                    : "0%"}
                </h1>
              </>
            )}
          </>
        )}
      </CardContent>
      <CardFooter>
        {goal.type == "consistency" ? (
          <Link href="/track">
            <Button variant="secondary" className="mr-2">
              Update
            </Button>
          </Link>
        ) : (
          <Button
            variant="secondary"
            className="mr-2"
            onClick={() => setUpdateGoal(goal)}>
            Update
          </Button>
        )}
        <Popover>
          <PopoverTrigger>
            <Button>Delete</Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="flex flex-row">
              <h1>Are you sure you want to delete this goal?</h1>
              <Close>
                <Button
                  onClick={() => handleDelete(goal._id)}
                  disabled={deleting}>
                  Yes
                </Button>
              </Close>
            </div>
          </PopoverContent>
        </Popover>
      </CardFooter>
    </Card>
  );
};
export default GoalCard;
