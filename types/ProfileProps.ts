type ProfileProps = {
  _id: string;
  email: string;
  username: string;
  initialized: boolean;
  displayName: string;
  fullName: string;
  stats: {
    height: {
      feet: number;
      inches: number;
    };
    weight: number;
  };
  goals: {
    startingWeight: number;
    goalWeight: number;
    phase: "bulking" | "cutting" | "maintaining";
  };
  tags: { _id: string; tag: string }[];
  image: string;
  workouts: Array<string>;
};

export default ProfileProps;
