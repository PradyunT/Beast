type workout = {
  name: String;
  exercises: [
    name: String,
    sets: [number: Number, reps: Number, weight: Number]
  ];
};

export default workout;
