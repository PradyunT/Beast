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
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { useToast } from "../ui/use-toast";
import { useSession } from "next-auth/react";

const staticTimeFormSchema = z.object({
  startingDistance: z.string(),
  goalDistance: z.string(),
  staticTimeMinutes: z.string(),
  staticTimeSeconds: z.string(),
  date: z.date(),
});

const staticDistanceFormSchema = z.object({
  startingTimeSeconds: z.string(),
  startingTimeMinutes: z.string(),
  goalTimeSeconds: z.string(),
  goalTimeMinutes: z.string(),
  staticDistance: z.string(),
  date: z.date(),
});

const CardioForm = () => {
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const { data: session } = useSession();
  const staticTimeForm = useForm<z.infer<typeof staticTimeFormSchema>>({
    resolver: zodResolver(staticTimeFormSchema),
  });
  const staticDistanceForm = useForm<z.infer<typeof staticDistanceFormSchema>>({
    resolver: zodResolver(staticDistanceFormSchema),
  });
  const onSubmitStaticTime = async (
    values: z.infer<typeof staticTimeFormSchema>
  ) => {
    setSubmitting(true);
    const {
      startingDistance,
      goalDistance,
      staticTimeMinutes,
      staticTimeSeconds,
      date,
    } = values;
    const res = await fetch("/api/goals/create", {
      method: "POST",
      body: JSON.stringify({
        userId: session?.user.id,
        startingDistance,
        goalDistance,
        staticTimeMinutes,
        staticTimeSeconds,
        type: "distanceCardio",
        cardioType: "staticTime",
        date,
      }),
    });

    if (res.status === 200) {
      toast({
        title: "Successfully created goal ✅",
        description: "Your goal has been created successfully",
      });
    } else if (res.status === 500) {
      toast({
        title: "Server error trying to create goal ❌",
        description: "There was an error while trying to create your goal",
      });
    }
    setSubmitting(false);
  };

  const onSubmitStaticDistance = async (
    values: z.infer<typeof staticDistanceFormSchema>
  ) => {
    setSubmitting(true);
    const {
      startingTimeSeconds,
      startingTimeMinutes,
      goalTimeSeconds,
      goalTimeMinutes,
      staticDistance,
      date,
    } = values;
    const res = await fetch("/api/goals/create", {
      method: "POST",
      body: JSON.stringify({
        userId: session?.user.id,
        startingTimeSeconds,
        startingTimeMinutes,
        goalTimeSeconds,
        goalTimeMinutes,
        staticDistance,
        type: "distanceCardio",
        cardioType: "staticDistance",
        date,
      }),
    });

    if (res.status === 200) {
      toast({
        title: "Successfully created goal ✅",
        description: "Your goal has been created successfully",
      });
    } else if (res.status === 500) {
      toast({
        title: "Server error trying to create goal ❌",
        description: "There was an error while trying to create your goal",
      });
    }
    setSubmitting(false);
  };
  return (
    <Tabs defaultValue="setTime" className="w-[400px]">
      <TabsList className="mb-2">
        <TabsTrigger value="setTime">Static Time</TabsTrigger>
        <TabsTrigger value="setDistance">Static Distance</TabsTrigger>
      </TabsList>
      <TabsContent value="setTime">
        <Form {...staticTimeForm}>
          <form
            className="space-y-6"
            onSubmit={staticTimeForm.handleSubmit(onSubmitStaticTime)}>
            <FormField
              control={staticTimeForm.control}
              name="startingDistance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Starting Distance</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="1" {...field} />
                  </FormControl>
                  <FormDescription>
                    How far you are currently able to run (in miles).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={staticTimeForm.control}
              name="goalDistance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Goal Distance</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="1" {...field} />
                  </FormControl>
                  <FormDescription>
                    How far you are currently able to run (in miles).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={staticTimeForm.control}
              name="staticTimeMinutes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="7" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={staticTimeForm.control}
              name="staticTimeSeconds"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="number" placeholder="50" {...field} />
                  </FormControl>
                  <FormDescription>
                    How long it takes you to run the distance you set (minutes,
                    then seconds).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={staticTimeForm.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Goal Date</FormLabel>
                  <br />
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}>
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    For how long do you want to hold your consistency goal for?
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
      </TabsContent>
      <TabsContent value="setDistance">
        <Form {...staticDistanceForm}>
          <form
            className="space-y-6"
            onSubmit={staticDistanceForm.handleSubmit(onSubmitStaticDistance)}>
            <FormField
              control={staticDistanceForm.control}
              name="startingTimeMinutes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Starting Time</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="7" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={staticDistanceForm.control}
              name="startingTimeSeconds"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="number" placeholder="50" {...field} />
                  </FormControl>
                  <FormDescription>
                    Your current time to run the distance you set (minutes, then
                    seconds).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={staticDistanceForm.control}
              name="goalTimeMinutes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Goal Time</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="7" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={staticDistanceForm.control}
              name="goalTimeSeconds"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="number" placeholder="50" {...field} />
                  </FormControl>
                  <FormDescription>
                    Your goal time is to run the distance you set (minutes, then
                    seconds).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={staticDistanceForm.control}
              name="staticDistance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Distance</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="7" {...field} />
                  </FormControl>
                  <FormDescription>
                    How far you are able to run in your inputted time (in
                    miles).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={staticDistanceForm.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Goal Date</FormLabel>
                  <br />
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}>
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    For how long do you want to hold your consistency goal for?
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
      </TabsContent>
    </Tabs>
  );
};
export default CardioForm;
