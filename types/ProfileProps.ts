import type goal from "./goal";
import type workout from "./workout";

type ProfileProps = {
  _id: string;
  email: string;
  username: string;
  initialized: boolean;
  displayName: string;
  fullName: string;
  goals: goal[];
  tags: { _id: string; tag: string }[];
  image: string;
  workouts: workout[];
};

export default ProfileProps;
