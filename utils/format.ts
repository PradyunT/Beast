export const formatDate = (date: Date) => {
  const newDate = new Date(date);
  return newDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const formatTitle = (title: string) => {
  const words = title.split(/(?=[A-Z])/);

  const formattedWords = words.map((word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  });

  return formattedWords.join(" ");
};
