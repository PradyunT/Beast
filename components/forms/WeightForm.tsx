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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useToast } from "../ui/use-toast";
import { useSession } from "next-auth/react";
const formSchema = z.object({
  phase: z.string(),
  goalWeight: z.string(),
  startingWeight: z.string(),
  date: z.date(),
});

const WeightForm = ({ goBack }: { goBack: () => void }) => {
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const { data: session } = useSession();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setSubmitting(true);
    const { phase, startingWeight, goalWeight, date } = values;
    const res = await fetch("/api/goals/create", {
      method: "POST",
      body: JSON.stringify({
        userId: session?.user.id,
        phase,
        startingWeight,
        goalWeight,
        date,
        type: "weight",
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
          name="phase"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bulking / Cutting / Maintaining</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a value" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="bulking">Bulking</SelectItem>
                  <SelectItem value="cutting">Cutting</SelectItem>
                  <SelectItem value="maintaining">Maintaining</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Are you bulking, cutting, or maintaining?
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
                  placeholder="Ex. 125, 150"
                  {...field}
                  className="w-1/2"
                />
              </FormControl>
              <FormDescription>
                Your weight when you started taking fitness seriously (can be
                the same as current weight, in lbs.)
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
                  placeholder="Ex. 110, 175"
                  {...field}
                  className="w-1/2"
                />
              </FormControl>
              <FormDescription>
                Your ideal weight. What weight do you want to be at 1 year from
                now?
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
        <Button variant="secondary" onClick={goBack} className="ml-2">
          Go Back
        </Button>
      </form>
    </Form>
  );
};
export default WeightForm;
