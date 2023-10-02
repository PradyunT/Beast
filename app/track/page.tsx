"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Textarea } from "@/components/ui/textarea";
import * as z from "zod";
import Loader from "@/components/Loader";
import AuthenticationMessage from "@/components/AuthenticationMessage";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import goal from "@/types/goal";
import { PlusIcon } from "lucide-react";

// import type Exercise from "@/types/exercise";
// import type Workout from "@/types/workout";
// import type SetProps from "@/types/set";

interface SetProps {
  number: number;
  reps: number;
  weight: number;
}

interface Exercise {
  name: string;
  sets: SetProps[];
}

interface Workout {
  name: string;
  exercises: Exercise[];
}

const gymLat = 33.212060808618546;
const gymLong = -97.15406761440391;
const radius: number = 1; // FIXME

// For plain text input
const formSchema = z.object({
  workoutText: z.string().min(1).max(1000),
});

// For tracking in the website
const siteTrackingSchema = z.object({
  workoutName: z.string(), // Rename to workoutName
  exercises: z.array(
    z.object({
      exerciseName: z.string(), // Rename to exerciseName
      sets: z.array(
        z.object({ reps: z.coerce.number(), weight: z.coerce.number() })
      ),
    })
  ),
});

const Track = () => {
  const { data: session, status } = useSession();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [error2, setError2] = useState("");
  const [trackMode, setTrackMode] = useState<number | null>(null);
  const [consistencyGoal, setConsistencyGoal] = useState<goal | null>(null);

  const [exercises, setExercises] = useState<Exercise[]>([
    {
      name: "",
      sets: [{ number: 1, weight: 0, reps: 0 }],
    },
  ]);

  const { toast } = useToast();

  const getConsistencyGoal = async () => {
    try {
      const res = await fetch(`/api/users/getuser/${session?.user?.id}`, {
        method: "GET",
      });
      const user = await res.json();
      // setProfile(user);
      const foundConsistencyGoal = user.goals.find(
        (goal: goal) => goal.type === "consistency"
      );
      if (foundConsistencyGoal) {
        setConsistencyGoal(foundConsistencyGoal);
      }
    } catch (err) {
      console.error("Error fetching profile: ", err);
    }
  };

  useEffect(() => {
    if (status !== "loading") {
      getConsistencyGoal();
    }
  }, [session]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const siteTrackingForm = useForm<z.infer<typeof siteTrackingSchema>>({
    resolver: zodResolver(siteTrackingSchema),
  });

  // Function to parse workout text input
  const parseWorkoutText = (workoutText: string) => {
    const workout: Workout = {
      name: "",
      exercises: [
        {
          name: "",
          sets: [],
        },
      ],
    };

    const lines: Array<string> = workoutText.split("\n");
    const exercises: Exercise[] = [];
    let currentExercise: Exercise | null = null;
    workout.name = lines[0];

    for (let i = 2; i < lines.length; i++) {
      // Check if the line contains "Set: "
      const regex = /(Set )\w/;
      const setRegex = /(\d+(?:\.\d+)?) lbs x (\d+)/;

      if (regex.test(lines[i])) {
        // If the line contains "Set: "
        if (currentExercise === null) {
          // If there is not currently an exercise
          // Initialize exercise and add exercise name from the previous line
          currentExercise = { name: "", sets: [] };
          currentExercise.name = lines[i - 1];
        }
        // Initialize set and add the first set
        const match = lines[i].match(setRegex);
        currentExercise.sets.push({
          number: currentExercise.sets.length + 1,
          weight: parseFloat(match?.[1] || "0"),
          reps: parseInt(match?.[2] || "0"),
        });
      }

      // If the line is blank and there is a current exercise
      if (lines[i] === "" && currentExercise !== null) {
        // push currentExercise into exercises and reset currentExercise
        exercises.push(currentExercise);
        currentExercise = null;
      }
    }

    workout.exercises = exercises;
    return workout;
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setSubmitting(true);

    // Parse the workout text
    const parsedWorkout = parseWorkoutText(values.workoutText);

    // Custom validation logic
    if (!parsedWorkout.name) {
      setError("Workout name is required.");
      setSubmitting(false);
      return;
    }

    if (!parsedWorkout.exercises || parsedWorkout.exercises.length === 0) {
      setError("At least one exercise is required.");
      setSubmitting(false);
      return;
    }

    for (const exercise of parsedWorkout.exercises) {
      if (!exercise.name) {
        setError("Exercise name is required for all exercises.");
        setSubmitting(false);
        return;
      }

      if (!exercise.sets || exercise.sets.length === 0) {
        setError("At least one set is required for each exercise.");
        setSubmitting(false);
        return;
      }
    }

    // If all custom validation checks pass, proceed with submission
    const res = await fetch(`/api/track/${session?.user?.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ workout: parsedWorkout }),
    });

    if (res.status === 200) {
      toast({
        title: "Workout submitted ✅",
        description: "Your workout has been tracked",
      });

      // Check if user has a consistency goal
      if (consistencyGoal) {
        // If user has consistency goal
        const res = await fetch("/api/goals/update-goal", {
          method: "POST",
          body: JSON.stringify({
            goalId: consistencyGoal._id,
          }),
        });
        if (res.status === 200) {
          toast({
            title: "Successfully updated consistency goal ✅",
            description:
              "Your workout has been tracked toward your consistency goal",
          });
        } else if (res.status === 500) {
          toast({
            title: "Server error while trying to update consistency goal ❌",
            description:
              "There was a server error while trying to update your consistency goal",
          });
        }
      }
    } else if (res.status === 500) {
      toast({
        title: "Error ❌",
        description: "Server error",
      });
    }
    setSubmitting(false);
    setTrackMode(null);
  };

  const onSubmitSiteTracking = async (
    values: z.infer<typeof siteTrackingSchema>
  ) => {
    setSubmitting(true);

    const workout: Workout = {
      name: values.workoutName,
      exercises: values.exercises.map((exerciseData) => ({
        name: exerciseData.exerciseName,
        sets: exerciseData.sets.map((setData, setIndex) => ({
          number: setIndex + 1,
          weight: setData.weight,
          reps: setData.reps,
        })),
      })),
    };

    const res = await fetch(`/api/track/${session?.user?.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        workout: workout,
      }),
    });

    if (res.status === 200) {
      toast({
        title: "Workout submitted ✅",
        description: "Your workout has been tracked",
      });
      // Check if user has a consistency goal
      const res = await fetch(`/api/users/getuser/${session?.user.id}`, {
        method: "GET",
      });
      const user = await res.json();
      const consistencyGoal = user.goals.find(
        (goal: goal) => goal.type === "consistency"
      );
      if (consistencyGoal) {
        // If user has consistency goal
        const res = await fetch("/api/goals/update-goal", {
          method: "POST",
          body: JSON.stringify({
            goalId: consistencyGoal._id,
          }),
        });
        if (res.status === 200) {
          toast({
            title: "Successfully updated consistency goal ✅",
            description:
              "Your workout has been tracked toward your consistency goal",
          });
        } else if (res.status === 500) {
          toast({
            title: "Server error while trying to update consistency goal ❌",
            description:
              "There was a server error while trying to update your consistency goal",
          });
        }
      }
    } else if (res.status === 500) {
      toast({
        title: "Error ❌",
        description: "Server error",
      });
    }
    setSubmitting(false);
    setTrackMode(null);
  };

  const verify = async () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async function (position) {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        const radianConversion = (degrees: number) => degrees * (Math.PI / 180);
        const earthRadiusKm = 6371;

        const lat1 = radianConversion(userLat);
        const lon1 = radianConversion(userLng);
        const lat2 = radianConversion(gymLat);
        const lon2 = radianConversion(gymLong);

        const dLat = lat2 - lat1;
        const dLon = lon2 - lon1;

        const a =
          Math.sin(dLat / 2) ** 2 +
          Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        // Calculate the distance in kilometers
        const distanceKm = earthRadiusKm * c;

        if (distanceKm < radius) {
          // If the user is in range of Pohl Rec Center: Check if the user's latest workout was within the past day
          const res = await fetch(`/api/verify/${session?.user?.id}`, {
            method: "GET",
          });
          if (res.status === 500) {
            setError(
              "❌ Server error while verifying if the user has already tracked a workout"
            );
            toast({
              title: "Error",
              description:
                "❌ Server error while verifying if the user has already tracked a workout",
            });
          } else if (res.status === 403) {
            // If the user has already tracked a workout today
            setError("You have already tracked a workout today");
            toast({
              title: "Error",
              description: "You have already tracked a workout today",
            });
          } else if (res.status === 200) {
            // If the user has not already tracked a workout today: good to go
            setTrackMode(1);
          }
        } else {
          // If the user is out of range of Pohl Rec Center
          setError(
            `You are too far from Pohl Rec Center. Distance is ${distanceKm.toFixed(
              2
            )} km`
          );
          toast({
            title: "Error",
            description: `You are too far from Pohl Rec Center. Distance is ${distanceKm.toFixed(
              2
            )} km`,
          });
        }
      });
    } else {
      // If geolocation is not in the navigator object
      setError("Unable to get location. Check location permissions.");
      toast({
        title: "Error",
        description: "Unable to get location. Check location permissions.",
      });
    }
  };

  const handleQuickUpdate = async () => {
    setSubmitting(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async function (position) {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        const radianConversion = (degrees: number) => degrees * (Math.PI / 180);
        const earthRadiusKm = 6371;

        const lat1 = radianConversion(userLat);
        const lon1 = radianConversion(userLng);
        const lat2 = radianConversion(gymLat);
        const lon2 = radianConversion(gymLong);

        const dLat = lat2 - lat1;
        const dLon = lon2 - lon1;

        const a =
          Math.sin(dLat / 2) ** 2 +
          Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        // Calculate the distance in kilometers
        const distanceKm = earthRadiusKm * c;

        if (distanceKm < radius) {
          // If the user is in range of Pohl Rec Center: Check if the user's latest workout was within the past day
          const res = await fetch(
            `/api/verify/consistency/${session?.user?.id}`,
            {
              method: "GET",
            }
          );
          if (res.status === 500) {
            setError2(
              "❌ Server error while verifying if the user has already tracked a workout"
            );
            toast({
              title: "Error",
              description:
                "❌ Server error while verifying if the user has already tracked a workout",
            });
          } else if (res.status === 403) {
            // If the user has already tracked a workout today
            setError2("You have already tracked a workout today");
            toast({
              title: "Error",
              description: "You have already tracked a workout today",
            });
          } else if (res.status === 200) {
            // If the user has not already tracked a workout today: good to go
            setTrackMode(1);
          }
        } else {
          // If the user is out of range of Pohl Rec Center
          setError2(
            `You are too far from Pohl Rec Center. Distance is ${distanceKm.toFixed(
              2
            )} km`
          );
          toast({
            title: "Error",
            description: `You are too far from Pohl Rec Center. Distance is ${distanceKm.toFixed(
              2
            )} km`,
          });
        }
      });
    } else {
      // If geolocation is not in the navigator object
      setError2("Unable to get location. Check location permissions.");
      toast({
        title: "Error",
        description: "Unable to get location. Check location permissions.",
      });
    }
    setSubmitting(false);
  };

  const addSetToExercise = (exerciseIndex: number) => {
    setExercises((prevExercises) => {
      const updatedExercises = [...prevExercises];
      updatedExercises[exerciseIndex].sets.push({
        number: updatedExercises[exerciseIndex].sets.length + 1,
        weight: 0, // You can set the initial values as needed
        reps: 0,
      });
      return updatedExercises;
    });
  };

  return (
    <>
      {status === "loading" ? (
        <Loader />
      ) : !session ? (
        <>
          <AuthenticationMessage to="track your workout" />
        </>
      ) : (
        <section id="track" className="flex-col">
          <h1 className="heading">Track Workout</h1>
          <h2 className="text-xl text-gray-500 mt-1 mb-4">
            Track your workouts and update your consistency goal when
            you&apos;re at Pohl
          </h2>{" "}
          {/* Quick Update */}
          {consistencyGoal && !trackMode && (
            <Card className="mb-4">
              <CardHeader>
                <CardTitle>Quick Update</CardTitle>
                <CardDescription>
                  Update your consistency goal here
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button disabled={submitting} onClick={handleQuickUpdate}>
                  Update Goal
                </Button>
                <h1 className="text-red-600 mt-2">{error2}</h1>
              </CardContent>
            </Card>
          )}
          <Card>
            <CardHeader>
              <CardTitle>
                {trackMode == null
                  ? "Start Tracking"
                  : trackMode === 1
                  ? "Track In Site"
                  : "Input Text"}
              </CardTitle>
              <CardDescription>
                {trackMode == null
                  ? "Verify you are at Pohl Rec Center"
                  : trackMode === 1
                  ? "Track your workout all inside the site"
                  : "Input text from the Hevy App"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!trackMode ? (
                <>
                  <h1>
                    Verify your location and start tracking (requires location
                    permission).
                  </h1>
                  <Button
                    className="mt-4"
                    onClick={() => verify()}
                    disabled={submitting}>
                    Start
                  </Button>
                  <h1 className="text-red-600 mt-2">{error}</h1>
                </>
              ) : trackMode == 1 ? (
                // In site tracking
                <>
                  <Form {...siteTrackingForm}>
                    <form
                      onSubmit={siteTrackingForm.handleSubmit(
                        onSubmitSiteTracking
                      )}
                      className="space-y-6">
                      <FormField
                        control={siteTrackingForm.control}
                        name="workoutName" // Use "workoutName" instead of "name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Workout Name</FormLabel>
                            <FormControl>
                              <Input placeholder="PPL - PUSH" {...field} />
                            </FormControl>
                            <FormDescription>
                              The name of your workout
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {exercises.map((exercise, index) => (
                        <div key={index}>
                          <h1 className="text-2xl font-bold">
                            Exercise #{index + 1}
                          </h1>
                          {/* Render the form fields for this exercise here */}
                          <FormField
                            control={siteTrackingForm.control}
                            name={`exercises.${index}.exerciseName`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Exercise Name</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Exercise Name"
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>
                                  The name of your exercise
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          {/* Render sets for this exercise */}
                          <h2 className="text-xl font-semibold mt-4 mb-2">
                            Sets
                          </h2>
                          {exercise.sets.map((set, setIndex) => (
                            <div key={setIndex}>
                              {/* <h2 className="text-xl font-semibold mt-4 mb-2">
                              Set #{setIndex + 1}
                            </h2> */}
                              <div className="flex flex-row">
                                {" "}
                                <FormField
                                  control={siteTrackingForm.control}
                                  name={`exercises.${index}.sets.${setIndex}.weight`}
                                  render={({ field }) => (
                                    <FormItem className="inline mr-2">
                                      {/* <FormLabel>Weight X Reps</FormLabel> */}
                                      <FormControl>
                                        <Input
                                          placeholder="Weight"
                                          type="number"
                                          {...field}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={siteTrackingForm.control}
                                  name={`exercises.${index}.sets.${setIndex}.reps`}
                                  render={({ field }) => (
                                    <FormItem className="inline mb-2">
                                      {/* <FormLabel className="text-white">
                                      W
                                    </FormLabel> */}
                                      <FormControl>
                                        <Input
                                          placeholder="Reps"
                                          type="number"
                                          {...field}
                                        />
                                      </FormControl>
                                      {/* <FormDescription>
                                      The weight used x The number of reps
                                    </FormDescription> */}
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </div>
                          ))}
                          <Button
                            type="button"
                            variant="secondary"
                            className="block mt-2 mb-8 w-[100%]"
                            onClick={() => addSetToExercise(index)}>
                            <PlusIcon width={16} className="inline mb-0.5" />{" "}
                            Add Set
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        className="block mb-4 w-[100%]"
                        onClick={() =>
                          setExercises((prevExercises) => [
                            ...prevExercises,
                            {
                              name: "",
                              sets: [{ number: 1, weight: 0, reps: 0 }],
                            },
                          ])
                        }>
                        <PlusIcon width={16} className="inline mb-0.5 " /> Add
                        Exercise
                      </Button>
                      <Button
                        className="mt-4 w-[48%] mr-[4%] inline"
                        type="submit"
                        disabled={submitting}>
                        {submitting ? "Submitting" : "Finish Workout"}
                      </Button>
                      <Button
                        variant="secondary"
                        className="w-[48%] inline"
                        type="button"
                        onClick={() => setTrackMode(2)}>
                        Switch Mode
                      </Button>
                    </form>
                  </Form>
                </>
              ) : (
                <>
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-8">
                      <FormField
                        control={form.control}
                        name="workoutText"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Workout Text</FormLabel>
                            <FormControl>
                              <Textarea
                                className="h-40"
                                placeholder="Workout Text Here"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Input the text generated from your workout tracker
                              <Dialog>
                                <DialogTrigger>
                                  <span className="ml-1 link text-gray-600 transition-colors">
                                    Example
                                  </span>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>
                                      Example Workout Text Input
                                    </DialogTitle>
                                    <DialogDescription>
                                      PPL - PUSH Thursday, Aug 24, 2023 at
                                      8:26pm
                                      <br />
                                      Bench Press (Dumbbell) Set 1: 112.5 lbs x
                                      7
                                      <br />
                                      Set 2: 115 lbs x 7 Set 3: 115 lbs x 7
                                      <br />
                                      [Failure] Seated Shoulder Press (Machine)
                                      <br />
                                      Set 1: 90 lbs x 12 Set 2: 100 lbs x 8 Set
                                      3:
                                      <br />
                                      90 lbs x 10 Triceps Rope Pushdown Set 1:
                                      35
                                      <br />
                                      lbs x 12 Set 2: 30 lbs x 12 Set 3: 37.5
                                      lbs
                                      <br />
                                      x 12 [Failure] @hevyapp
                                      <br />
                                      https://hevy.com/workout/JZeyhzOREph
                                      <br />
                                    </DialogDescription>
                                  </DialogHeader>
                                </DialogContent>
                              </Dialog>
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        className="mt-4"
                        type="submit"
                        disabled={submitting}>
                        {submitting ? "Submitting" : "Finish Workout"}
                      </Button>
                      <Button
                        variant="secondary"
                        className="ml-2"
                        type="button"
                        onClick={() => setTrackMode(1)}>
                        Switch Mode
                      </Button>
                    </form>
                  </Form>
                </>
              )}
            </CardContent>
          </Card>
        </section>
      )}
    </>
  );
};

export default Track;
