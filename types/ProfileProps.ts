type ProfileProps = {
    email: string;
    username: string;
    initialized: boolean;
    displayName: string;
    fullName: string;
    stats: {
      height: {
        feet: number;
        inches: number;
      }
      weight: number;
    };
    goals: {
      startingWeight: number;
      goalWeight: number;
      phase: string;
    };
    image: string;
  };
  
  export default ProfileProps;
  