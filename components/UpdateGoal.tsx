import type goal from "@/types/goal";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatTitle, formatDate } from "@/utils/format";
import { useState } from "react";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type goalProps from "@/types/goal";
import { useToast } from "./ui/use-toast";

const weightFormSchema = z.object({
  currentWeight: z.string(),
});

const strengthFormSchema = z.object({
  currentReps: z.string(),
  currentWeight: z.string(),
});

const staticTimeFormSchema = z.object({
  currentDistance: z.string(),
});

const staticDistanceFormSchema = z.object({
  currentTimeMin: z.string(),
  currentTimeSec: z.string(),
});

const UpdateGoal = ({
  goal,
  setUpdateGoal,
  getProfile,
}: {
  goal: goal;
  setUpdateGoal: (updateGoal: false | goalProps) => void;
  getProfile: () => void;
}) => {
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const weightForm = useForm<z.infer<typeof weightFormSchema>>({
    resolver: zodResolver(weightFormSchema),
  });

  const strengthForm = useForm<z.infer<typeof strengthFormSchema>>({
    resolver: zodResolver(strengthFormSchema),
  });

  const staticTimeForm = useForm<z.infer<typeof staticTimeFormSchema>>({
    resolver: zodResolver(staticTimeFormSchema),
  });

  const staticDistanceForm = useForm<z.infer<typeof staticDistanceFormSchema>>({
    resolver: zodResolver(staticDistanceFormSchema),
  });

  const onSubmitWeight = async (values: z.infer<typeof weightFormSchema>) => {
    setSubmitting(true);
    console.log(values);
    const res = await fetch("/api/goals/updateGoal", {
      method: "POST",
      body: JSON.stringify({
        goalId: goal._id,
        currentWeight: parseFloat(values.currentWeight),
      }),
    });

    if (res.status === 200) {
      toast({
        title: "Successfully deleted goal ✅",
        description: "Your goal was sucessfully deleted",
      });
      getProfile();
      setUpdateGoal(false);
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
    setSubmitting(false);
  };

  const onSubmitStrength = async (
    values: z.infer<typeof strengthFormSchema>
  ) => {
    setSubmitting(true);
    console.log(values);
    const res = await fetch("/api/goals/updateGoal", {
      method: "POST",
      body: JSON.stringify({
        goalId: goal._id,
        currentWeight: parseFloat(values.currentWeight),
        currentReps: parseFloat(values.currentReps),
      }),
    });

    if (res.status === 200) {
      toast({
        title: "Successfully deleted goal ✅",
        description: "Your goal was sucessfully deleted",
      });
      getProfile();
      setUpdateGoal(false);
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
    setSubmitting(false);
  };

  const onSubmitStaticTime = async (
    values: z.infer<typeof staticTimeFormSchema>
  ) => {
    setSubmitting(true);
    console.log(values);
    const res = await fetch("/api/goals/updateGoal", {
      method: "POST",
      body: JSON.stringify({
        goalId: goal._id,
        currentDistance: parseFloat(values.currentDistance),
      }),
    });

    if (res.status === 200) {
      toast({
        title: "Successfully deleted goal ✅",
        description: "Your goal was sucessfully deleted",
      });
      getProfile();
      setUpdateGoal(false);
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
    setSubmitting(false);
  };

  const onSubmitStaticDistance = async (
    values: z.infer<typeof staticDistanceFormSchema>
  ) => {
    setSubmitting(true);
    console.log(values);
    const res = await fetch("/api/goals/updateGoal", {
      method: "POST",
      body: JSON.stringify({
        goalId: goal._id,
        currentTime:
          parseFloat(values.currentTimeMin) * 60 +
          parseFloat(values.currentTimeSec),
      }),
    });

    if (res.status === 200) {
      toast({
        title: "Successfully deleted goal ✅",
        description: "Your goal was sucessfully deleted",
      });
      getProfile();
      setUpdateGoal(false);
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
    setSubmitting(false);
  };
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>{formatTitle(goal.type)}</CardTitle>
        <CardDescription>{formatTitle(goal.type)} Goal</CardDescription>
      </CardHeader>
      <CardContent>
        {goal.type === "weight" ? (
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
              Progress: {goal?.progress ? goal.progress : "0%"}
            </h1>
            <h1 className="text-2xl font-semibold mt-4">Update Field</h1>
            <Form {...weightForm}>
              <form
                onSubmit={weightForm.handleSubmit(onSubmitWeight)}
                className="space-y-8 mt-4">
                <FormField
                  control={weightForm.control}
                  name="currentWeight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Weight</FormLabel>
                      <FormControl>
                        <Input placeholder="150" type="number" {...field} />
                      </FormControl>
                      <FormDescription>
                        Update your current weight
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Submitting" : "Submit"}
                </Button>
                <Button
                  variant="secondary"
                  className="ml-2"
                  onClick={() => setUpdateGoal(false)}>
                  Go Back
                </Button>
              </form>
            </Form>
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
              Progress: {goal?.progress ? goal.progress : "0%"}
            </h1>
            <h1 className="text-2xl font-semibold mt-4">Update Fields</h1>
            <Form {...strengthForm}>
              <form
                onSubmit={strengthForm.handleSubmit(onSubmitStrength)}
                className="space-y-8 mt-4">
                <FormField
                  control={strengthForm.control}
                  name="currentReps"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Reps</FormLabel>
                      <FormControl>
                        <Input placeholder="6" type="number" {...field} />
                      </FormControl>
                      <FormDescription>
                        Update your current reps
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={strengthForm.control}
                  name="currentWeight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Weight</FormLabel>
                      <FormControl>
                        <Input placeholder="150" type="number" {...field} />
                      </FormControl>
                      <FormDescription>
                        Update your current weight
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Submitting" : "Submit"}
                </Button>
                <Button
                  variant="secondary"
                  className="ml-2"
                  onClick={() => setUpdateGoal(false)}>
                  Go Back
                </Button>
              </form>
            </Form>
          </>
        ) : (
          <>
            {goal.distanceCardio.cardioType === "staticTime" ? (
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
                  Progress: {goal?.progress ? goal.progress : "0%"}
                </h1>
                <h1 className="text-2xl font-semibold mt-4">Update Field</h1>
                <Form {...staticTimeForm}>
                  <form
                    onSubmit={staticTimeForm.handleSubmit(onSubmitStaticTime)}
                    className="space-y-8 mt-4">
                    <FormField
                      control={staticTimeForm.control}
                      name="currentDistance"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Distance</FormLabel>
                          <FormControl>
                            <Input placeholder="3" type="number" {...field} />
                          </FormControl>
                          <FormDescription>
                            Update your current distance
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={submitting}>
                      {submitting ? "Submitting" : "Submit"}
                    </Button>
                    <Button
                      variant="secondary"
                      className="ml-2"
                      onClick={() => setUpdateGoal(false)}>
                      Go Back
                    </Button>
                  </form>
                </Form>
              </>
            ) : (
              <>
                <h1>
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
                  Progress: {goal?.progress ? goal.progress : "0%"}
                </h1>
                <h1 className="text-2xl font-semibold mt-4">Update Fields</h1>
                <Form {...staticDistanceForm}>
                  <form
                    onSubmit={staticDistanceForm.handleSubmit(
                      onSubmitStaticDistance
                    )}
                    className="space-y-8 mt-4">
                    <FormField
                      control={staticDistanceForm.control}
                      name="currentTimeMin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Time Min</FormLabel>
                          <FormControl>
                            <Input placeholder="6" type="number" {...field} />
                          </FormControl>
                          <FormDescription>
                            Update your current reps
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={staticDistanceForm.control}
                      name="currentTimeSec"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Time Sec</FormLabel>
                          <FormControl>
                            <Input placeholder="150" type="number" {...field} />
                          </FormControl>
                          <FormDescription>
                            Update your current weight
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={submitting}>
                      {submitting ? "Submitting" : "Submit"}
                    </Button>
                    <Button
                      variant="secondary"
                      className="ml-2"
                      onClick={() => setUpdateGoal(false)}>
                      Go Back
                    </Button>
                  </form>
                </Form>
              </>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default UpdateGoal;
