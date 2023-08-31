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

const formSchema = z.object({
  displayName: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .max(20, { message: "Username can be at most 20 characters." }),
  feet: z.coerce.number(),
  inches: z.coerce.number(),
  weight: z.coerce.number(),
  startingWeight: z.coerce.number(),
  goalWeight: z.coerce.number(),
  phase: z.string(),
});

const Profile = () => {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<ProfileProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editMode, setEditMode] = useState(false);
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
        feet: values.feet,
        inches: values.inches,
        goalWeight: values.goalWeight,
        startingWeight: values.startingWeight,
        weight: values.weight,
        phase: values.phase,
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
                  <h1 className="text-xl font-bold">Progress Metrics</h1>
                  <FormField
                    control={form.control}
                    name="feet"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Height</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="5"
                            {...field}
                            className="w-1/2"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="inches"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="8"
                            {...field}
                            className="w-1/2"
                          />
                        </FormControl>
                        <FormDescription>
                          Your height (feet then inches)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weight</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="160"
                            {...field}
                            className="w-1/2"
                          />
                        </FormControl>
                        <FormDescription>
                          Your current weight (lbs.)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="startingWeight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Starting Weight</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="150"
                            {...field}
                            className="w-1/2"
                          />
                        </FormControl>
                        <FormDescription>
                          Your weight when you started taking fitness seriously
                          (can be the same as current weight, in lbs.)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="goalWeight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Goal Weight</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="180"
                            {...field}
                            className="w-1/2"
                          />
                        </FormControl>
                        <FormDescription>
                          Your ideal weight. What weight do you want to be at 1
                          year from now?
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phase"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bulking / Cutting / Maintaining</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a value" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="bulking">Bulking</SelectItem>
                            <SelectItem value="cutting">Cutting</SelectItem>
                            <SelectItem value="maintaining">
                              Maintaining
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Are you bulking, cutting, or maintaining?
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
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Your Profile</CardTitle>
              <CardDescription>View and edit your profile</CardDescription>
            </CardHeader>
            <CardContent>
              {profile?.initialized ? (
                <>
                  <h1>Display Name: {profile.displayName}</h1>
                  <h1 className="text-xl font-semibold my-2">Stats</h1>
                  <h1>
                    Height: {profile.stats.height.feet.toString()}&apos;
                    {profile.stats.height.inches.toString()}&quot;
                  </h1>
                  <h1>Weight: {profile.stats.weight.toString()} lbs.</h1>{" "}
                  <h1 className="text-xl font-semibold my-2">Goals</h1>
                  <h1>
                    Starting Weight: {profile.goals.startingWeight.toString()}{" "}
                    lbs.
                  </h1>
                  <h1>
                    Goal Weight: {profile.goals.goalWeight.toString()} lbs.
                  </h1>
                  <h1>
                    Currently:{" "}
                    {profile.goals.phase.charAt(0).toUpperCase() +
                      profile.goals.phase.slice(1)}
                  </h1>
                </>
              ) : (
                <>
                  <h1 className="text-md font-semibold">
                    Profile is not initialized
                    <br />
                    Click the edit button and enter your profile data
                  </h1>
                </>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={() => setEditMode(true)}>Edit</Button>
            </CardFooter>
          </Card>
        </>
      )}
    </section>
  );
};

export default Profile;
