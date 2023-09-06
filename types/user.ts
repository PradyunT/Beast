import goal from "./goal";
import workout from "./workout";

export type user = {
  email: string;
  username: string;
  initialize: boolean;
  displayName: string;
  tags: [tag: string];
  fullName: String;
  goals: [goal];
  workouts: [workout];
  image: string;
};
