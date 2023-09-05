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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { useState } from "react";
import { useToast } from "../ui/use-toast";
import { useSession } from "next-auth/react";
const formSchema = z.object({
  exercise: z.string(),
  startingReps: z.string(),
  startingWeight: z.string(),
  goalReps: z.string(),
  goalWeight: z.string(),
  date: z.date(),
});

const StrengthForm = () => {
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const { data: session } = useSession();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setSubmitting(true);
    const {
      exercise,
      startingReps,
      goalReps,
      startingWeight,
      goalWeight,
      date,
    } = values;
    const res = await fetch("/api/goals/create", {
      method: "POST",
      body: JSON.stringify({
        userId: session?.user.id,
        exercise,
        startingReps,
        goalReps,
        startingWeight,
        goalWeight,
        type: "strength",
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="exercise"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lift Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Deadlift, Squat, ..."
                  {...field}
                  className="w-1/2"
                />
              </FormControl>
              <FormDescription>
                The name of the lift that you want to increase in strength in
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="startingReps"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Starting Reps</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="8"
                  {...field}
                  className="w-1/2"
                />
              </FormControl>
              <FormDescription>
                The number of reps you are/were able to lift{" "}
                <span className="underline">when you first set this goal</span>.
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
                The amount of weight you are/were able to lift{" "}
                <span className="underline">when you first set this goal</span>.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="goalReps"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Goal Reps</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="8"
                  {...field}
                  className="w-1/2"
                />
              </FormControl>
              <FormDescription>
                The number of reps you are able to lift{" "}
                <span className="underline">right now</span> (Can be the same as
                starting reps).
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
                The amount of weight you are/were able to lift{" "}
                <span className="underline">right now</span>(Can be the same as
                starting weight).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
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
                By when do you want to reach your goal?
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
  );
};
export default StrengthForm;
