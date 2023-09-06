"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import Loader from "@/components/Loader";
import AuthenticationMessage from "@/components/AuthenticationMessage";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type ProfileProps from "@/types/ProfileProps";
import ConsistencyForm from "@/components/forms/ConsistencyForm";
import WeightForm from "@/components/forms/WeightForm";
import StrengthForm from "@/components/forms/StrengthForm";
import CardioForm from "@/components/forms/CardioForm";
import GoalCard from "@/components/GoalCard";
import type goal from "@/types/goal";
import UpdateGoal from "@/components/UpdateGoal";

const formSchema = z.object({
  displayName: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .max(20, { message: "Username can be at most 20 characters." }),
});

const Profile = () => {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<ProfileProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [createGoalMode, setCreateGoalMode] = useState(false);
  const [updateGoal, setUpdateGoal] = useState<goal | false>(false);

  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setSubmitting(true);
    const res = await fetch("/api/users/set-profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: session?.user.id,
        displayName: values.displayName,
      }),
    });

    if (res.status === 200) {
      getProfile();
      setSubmitting(false);
      setEditMode(false);
      toast({
        title: "Submitted successfully",
        description: "Your data was submitted successfully",
      });
    }
  };

  const getProfile = async () => {
    try {
      const res = await fetch(`/api/users/getuser/${session?.user?.id}`, {
        method: "GET",
      });
      const data = await res.json();
      setProfile(data);
      console.log(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching profile: ", err);
    }
  };

  useEffect(() => {
    if (status !== "loading") {
      getProfile();
    }
  }, [session]);

  return (
    <section className="profile">
      {loading ? (
        <Loader />
      ) : !session ? (
        <AuthenticationMessage to="access your profile" />
      ) : (
        <>
          {" "}
          <h1 className="heading">Your Profile</h1>
          <h2 className="text-xl text-gray-500 mt-1">
            View and edit your Profile and Goals
          </h2>{" "}
          {editMode ? (
            // Edit Mode
            <>
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Edit Profile</CardTitle>
                  <CardDescription>
                    Edit your profile and save your changes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-4">
                      <h1 className="text-xl font-bold">Display Settings</h1>
                      <FormField
                        control={form.control}
                        name="displayName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Display Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Display Name" {...field} />
                            </FormControl>
                            <FormDescription>
                              This is your public display name. Make sure
                              it&apos;s identifiable.
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
                        onClick={() => setEditMode(false)}
                        className="ml-2">
                        {" "}
                        Go Back
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </>
          ) : createGoalMode ? (
            // Create Goal Mode
            <>
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Create Goal</CardTitle>
                  <CardDescription>
                    Create and set your fitness goal
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="consistency" className="">
                    <TabsList className="mb-2 text-md sm:text-lg">
                      <TabsTrigger value="consistency">Consistency</TabsTrigger>
                      <TabsTrigger value="weight">Weight</TabsTrigger>
                      <TabsTrigger value="lift">Lift</TabsTrigger>
                      <TabsTrigger value="cardio">Cardio</TabsTrigger>
                    </TabsList>
                    <TabsContent value="consistency">
                      <h1 className="text-xl font-bold mb-2">
                        Set goal for consistency
                      </h1>
                      <ConsistencyForm
                        goBack={() => setCreateGoalMode(false)}
                      />
                    </TabsContent>
                    <TabsContent value="weight">
                      <h1 className="text-xl font-bold mb-2">
                        Set goal for body weight
                      </h1>
                      <WeightForm goBack={() => setCreateGoalMode(false)} />
                    </TabsContent>
                    <TabsContent value="lift">
                      <h1 className="text-xl font-bold mb-2">
                        Set goal for lifting strength
                      </h1>
                      <StrengthForm goBack={() => setCreateGoalMode(false)} />
                    </TabsContent>
                    <TabsContent value="cardio">
                      <h1 className="text-xl font-bold mb-2">
                        Set goal for distance cardio
                      </h1>
                      <CardioForm goBack={() => setCreateGoalMode(false)} />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </>
          ) : updateGoal ? (
            // Update Goal Mode
            <>
              <UpdateGoal
                goal={updateGoal}
                setUpdateGoal={setUpdateGoal}
                getProfile={getProfile}
              />
            </>
          ) : (
            // Default Mode
            <>
              <div className="mt-4">
                {profile?.initialized ? (
                  <>
                    <Card>
                      <CardHeader>
                        <CardTitle>Profile</CardTitle>
                        <CardDescription>Card Description</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p> Display Name: {profile.displayName}</p>
                      </CardContent>
                      <CardFooter>
                        <Button onClick={() => setEditMode(true)}>
                          {profile?.initialized ? "Edit Profile" : "Initialize"}
                        </Button>
                      </CardFooter>
                    </Card>
                    <Card className="mt-4">
                      <CardHeader>
                        <CardTitle>Goals</CardTitle>
                        <CardDescription>Card Description</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-row flex-wrap">
                          {profile.goals.length !== 0 ? (
                            <>
                              {profile.goals.map((goal, i) => {
                                return (
                                  <div className="w-[100%] pr-4 py-2 sm:w-1/3">
                                    <GoalCard
                                      onDelete={getProfile}
                                      setUpdateGoal={setUpdateGoal}
                                      goal={goal}
                                      key={i}
                                    />
                                  </div>
                                );
                              })}
                            </>
                          ) : (
                            <p>
                              You haven't set any goals yet. <br />
                              Press "create goal" and set some goals.
                            </p>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button
                          onClick={() => setCreateGoalMode(true)}
                          disabled={!profile?.initialized}
                          variant="secondary"
                          className="ml-2 hover:bg-gray-200">
                          Create Goal
                        </Button>
                      </CardFooter>
                    </Card>
                  </>
                ) : (
                  <>
                    <h1 className="text-md font-semibold">
                      Your profile hasn't been initialized yet. <br />
                      Initialize your profile below.
                    </h1>
                  </>
                )}
              </div>
            </>
          )}{" "}
        </>
      )}
    </section>
  );
};

export default Profile;
