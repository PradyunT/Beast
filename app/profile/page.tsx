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
import Loader from "@/components/Loader";
import AuthenticationMessage from "@/components/AuthenticationMessage";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

type ProfileProps = {
  email: {
    type: String;
  };
  username: {
    type: String;
  };
  initialized: {
    type: Boolean;
  };
  displayName: {
    type: String;
  };
  fullName: {
    type: String;
  };
  stats: {
    height: {
      type: Number;
    };
    weight: {
      type: Number;
    };
  };
  goals: {
    startingWeight: {
      type: Number;
    };
    goalWeight: {
      type: Number;
    };
    bulking: {
      type: Boolean;
    };
    cutting: {
      type: Boolean;
    };
  };
  image: {
    type: String;
  };
};

const formSchema = z.object({
  displayName: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .max(20, { message: "Username can be at most 20 characters." }),
  height: z.number(),
  weight: z.number(),
  startingWeight: z.number(),
  goalWeight: z.number(),
  bulking: z.boolean(),
  cutting: z.boolean(),
});

const Profile = () => {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<ProfileProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      displayName: "",
      height: 0,
      weight: 0,
      startingWeight: 0,
      goalWeight: 0,
      bulking: false,
      cutting: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setSubmitting(true);
    console.log(values);
  };

  const getProfile = async (): Promise<void> => {
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
    if (session) {
      getProfile();
    }
  }, [session]);

  return (
    <section className="profile">
      {!session ? (
        <AuthenticationMessage to="access your profile" />
      ) : loading ? (
        <Loader />
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
                  className="space-y-8">
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
                          This is your public display name. Make sure it's
                          identifiable.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <h1 className="text-lg font-semibold">Progress Metrics</h1>
                  <FormField
                    control={form.control}
                    name="height"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Height</FormLabel>
                        <FormControl>
                          <Input placeholder="Height" {...field} />
                        </FormControl>
                        <FormDescription>Your current height</FormDescription>
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
                          <Input placeholder="Weight" {...field} />
                        </FormControl>
                        <FormDescription>Your current weight</FormDescription>
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
                          <Input placeholder="Starting Weight" {...field} />
                        </FormControl>
                        <FormDescription>
                          Your weight when you started taking fitness seriously
                          (can be the same as current weight).
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
                <>{profile.username}</>
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
