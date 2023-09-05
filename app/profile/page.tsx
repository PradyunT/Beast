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
      ) : editMode ? (
        <>
          <Card>
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
                          This is your public display name. Make sure it&apos;s
                          identifiable.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={submitting}>
                    {submitting ? "Submitting" : "Submit"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </>
      ) : createGoalMode ? (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Create Goal</CardTitle>
              <CardDescription>
                Create and set your fitness goal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="consistency" className="w-[400px]">
                <TabsList className="mb-2">
                  <TabsTrigger value="consistency">Consistency</TabsTrigger>
                  <TabsTrigger value="weight">Weight</TabsTrigger>
                  <TabsTrigger value="lift">Lift</TabsTrigger>
                  <TabsTrigger value="cardio">Cardio</TabsTrigger>
                  <TabsTrigger value="calisthenics">Calisthenics</TabsTrigger>
                </TabsList>
                <TabsContent value="consistency">
                  <h1 className="text-xl font-bold mb-2">
                    Set goal for consistency
                  </h1>
                  <ConsistencyForm />
                </TabsContent>
                <TabsContent value="weight">
                  <h1 className="text-xl font-bold mb-2">
                    Set goal for body weight
                  </h1>
                  <WeightForm />
                </TabsContent>
                <TabsContent value="lift">
                  <h1 className="text-xl font-bold mb-2">
                    Set goal for lifting strength
                  </h1>
                  <StrengthForm />
                </TabsContent>
                <TabsContent value="cardio">
                  <h1 className="text-xl font-bold mb-2">
                    Set goal for distance cardio
                  </h1>
                  <CardioForm />
                </TabsContent>
                <TabsContent value="calisthenics">
                  Set goal for calisthenics WIP 🛠
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter>
              <p>
                Done setting goals?{" "}
                <Button
                  variant="secondary"
                  onClick={() => setCreateGoalMode(false)}
                  className="ml-2">
                  Go Back
                </Button>
              </p>
            </CardFooter>
          </Card>
        </>
      ) : (
        <>
          <Card className="w-fit">
            <CardHeader>
              <CardTitle>Your Profile</CardTitle>
              <CardDescription>View and edit your profile</CardDescription>
            </CardHeader>
            <CardContent>
              {profile?.initialized ? (
                <>
                  <h1 className="text-lg font-semibold">Display</h1>
                  <p> Display Name: {profile.displayName}</p>
                  <h1 className="text-xl font-semibold my-2">Goals</h1>
                  {profile?.goals ? (
                    <>
                      {profile.goals.map((goal, i) => {
                        // if (goal.type === "consistency") {
                        return <GoalCard goal={goal} key={i}/>;
                        // } else if (goal.type === "weight") {
                        //   return <>Render weight goal</>;
                        // } else if (goal.type === "strength") {
                        //   return <>Render strength goal</>;
                        // } else if (goal.type === "distanceCardio") {
                        //   return <>Render distance cardio goal</>;
                        // }
                      })}
                    </>
                  ) : (
                    <p>
                      You haven't set any goals yet. <br />
                      Press "create goal" and set some goals.
                    </p>
                  )}
                </>
              ) : (
                <>
                  <h1 className="text-md font-semibold">
                    Your profile hasn't been initialized yet. <br />
                    Initialize your profile below.
                  </h1>
                </>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={() => setEditMode(true)}>
                {profile?.initialized ? "Edit Profile" : "Initialize"}
              </Button>
              <Button
                onClick={() => setCreateGoalMode(true)}
                disabled={!profile?.initialized}
                variant={"secondary"}
                className="ml-2 hover:bg-gray-200">
                Create Goal
              </Button>
            </CardFooter>
          </Card>
        </>
      )}
    </section>
  );
};

export default Profile;
