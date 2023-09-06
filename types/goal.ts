type goal = {
  _id: string;
  type: string;
  date: Date;
  progress: number;
  consistency: {
    frequency: number;
    weekLog: { date: Date; logs: number }[];
  };
  weight: {
    phase: string;
    startingWeight: number;
    currentWeight: number;
    goalWeight: number;
  };
  strength: {
    exercise: string;
    startingWeight: number;
    currentWeight: number;
    goalWeight: number;
    startingReps: number;
    currentReps: number;
    goalReps: number;
  };
  distanceCardio: {
    cardioType: string;
    startingDistance: number;
    startingTime: number;
    currentDistance: number;
    currentTime: number;
    goalDistance: number;
    goalTime: number;
    staticTime: number;
    staticDistance: number;
  };
};

export default goal;
