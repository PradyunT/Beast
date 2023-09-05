type goal = {
  _id: string;
  type: string;
  date: Date;
  progress: number;
  consistency: {
    frequency: number;
    weekLog: { firstWeek: { date: Date; logs: Number } };
    weeks: { date: Date; logs: Number }[];
  };
  weight: {
    phase: string;
    startingWeight: number;
    currentWeight: number;
    goalWeight: number;
  };
  strength: {
    exercise: string;
    startingWeight: Number;
    currentWeight: Number;
    goalWeight: Number;
    startingReps: Number;
    currentReps: Number;
    goalReps: Number;
  };
  distanceCardio: {
    cardioType: string;
    startingDistance: Number;
    startingTime: Number;
    currentDistance: Number;
    currentTime: Number;
    goalDistance: Number;
    goalTime: Number;
    staticTime: Number;
    staticDistance: Number;
  };
};

export default goal;
