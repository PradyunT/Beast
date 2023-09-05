import type Goal from "@/types/goal";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function formatTitle(title: string) {
  const words = title.split(/(?=[A-Z])/);

  const formattedWords = words.map((word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  });

  return formattedWords.join(" ");
}

const GoalCard = ({ goal }: { goal: Goal }) => {
  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>{formatTitle(goal.type)}</CardTitle>
        <CardDescription>{formatTitle(goal.type)} Goal</CardDescription>
      </CardHeader>
      <CardContent>
        {goal.type === "consistency" ? (
          <h1>Frequency: {goal.consistency.frequency}</h1>
        ) : goal.type === "weight" ? (
          <>Render Weight details</>
        ) : goal.type === "strength" ? (
          <>Render strength details</>
        ) : (
          <>Render distance cardio details</>
        )}
      </CardContent>
      <CardFooter>
        <p>Card Footer</p>
      </CardFooter>
    </Card>
  );
};
export default GoalCard;
