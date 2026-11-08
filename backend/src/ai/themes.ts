export interface StoryTheme {
  theme: string;
  lesson: string;
}

// Themes and lessons for batch generation (Swedish, because the stories are in Swedish).
// These are examples and will be replaced. The batch script skips every theme that already
// has a story in the database (deleting the story frees the theme again), so the list needs
// at least as many unused entries as --count.
export const THEMES: StoryTheme[] = [
  {
    theme: "en drake som var rädd för eld",
    lesson: "att det är ok att be om hjälp",
  },
  {
    theme:
      "en enhörning som kände sig ensam, men hittade en ny vän, en pegasus",
    lesson: "att man kan ha kul ihop när man är olika",
  },
  {
    theme: "en av tomtens renar som åkt vilse",
    lesson: "att man alltid hittar hem, eller så hittar någon dig",
  },
  {
    theme: "en orm som inte kunde säga S",
    lesson: "att man ibland kan öva på att uttala rätt",
  },
  {
    theme: "en liten sjöhäst som precis lärt sig simma",
    lesson: "alla måste lära sig första gången man testar en ny sak",
  },
];
