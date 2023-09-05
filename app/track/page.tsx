"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
const radius = 1000; // FIXME

// For plain text input
const formSchema = z.object({
  workoutText: z.string().min(1).max(1000),
});

// For tracking in the website
/*
const formSchema2 = z.object({
  exercise: z.object({
    name: z.string(),
    sets: z.object({
      reps: z.number(),
      weight: z.number(),
    }),
  }),
});
*/

const Track = () => {
  const { data: session, status } = useSession();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [trackMode, setTrackMode] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  // Function to parse workout text input
  function parseWorkoutText(workoutText: string) {
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
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSubmitting(true);
    // Parse the workout text
    const parsedWorkout = parseWorkoutText(values.workoutText);
    console.log(parsedWorkout);
    const res = await fetch(`/api/track/${session?.user?.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ workout: parsedWorkout }),
    });

    if (res.status === 200) {
      toast({
        title: "Workout submitted",
        description: "Your workout has been tracked",
      });
    } else if (res.status === 500) {
      toast({
        title: "Error",
        description: "Server error",
      });
    }
    setSubmitting(false);
  }

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
              "Server error while verifying if the user can track the workout today"
            );
            toast({
              title: "Error",
              description:
                "Server error while verifying if the user can track the workout today",
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
            setTrackMode(true);
          }
        } else {
          // If the user is out of range of Pohl Rec Center
          setError(
            `You are too far from Pohl Rec Center. Distance is ${distanceKm.toFixed(
              2
            )}`
          );
          toast({
            title: "Error",
            description: `You are too far from Pohl Rec Center. Distance is ${distanceKm.toFixed(
              2
            )}`,
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

  useEffect(() => {
    if (status !== "loading") {
      setLoading(false);
    }
  }, [session, status]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : !session ? (
        <>
          <AuthenticationMessage to="track your workout" />
        </>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Track Workout</CardTitle>
            <CardDescription>
              Track your workouts when you&apos;re at Pohl Rec Center
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!trackMode ? (
              <>
                <h1>
                  Start tracking your workout now (requires location
                  permission).
                </h1>
                <Button
                  className="mt-4"
                  onClick={() => verify()}
                  disabled={submitting}>
                  Track Now
                </Button>
                <h1 className="text-red-600 mt-2">{error}</h1>
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
                              placeholder="Workout Text Here"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Input the text generated from your workout tracker
                            <Dialog>
                              <DialogTrigger>
                                <span className="ml-1 underline text-gray-600 hover:text-blue-500 transition-colors">
                                  Example
                                </span>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>
                                    Example Workout Text Input
                                  </DialogTitle>
                                  <DialogDescription>
                                    PPL - PUSH Thursday, Aug 24, 2023 at 8:26pm
                                    <br />
                                    Bench Press (Dumbbell) Set 1: 112.5 lbs x 7
                                    <br />
                                    Set 2: 115 lbs x 7 Set 3: 115 lbs x 7<br />
                                    [Failure] Seated Shoulder Press (Machine)
                                    <br />
                                    Set 1: 90 lbs x 12 Set 2: 100 lbs x 8 Set 3:
                                    <br />
                                    90 lbs x 10 Triceps Rope Pushdown Set 1: 35
                                    <br />
                                    lbs x 12 Set 2: 30 lbs x 12 Set 3: 37.5 lbs
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
                    <Button className="mt-4" type="submit">
                      Finish Workout
                    </Button>
                  </form>
                </Form>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default Track;
