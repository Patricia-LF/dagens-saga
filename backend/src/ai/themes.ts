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
    theme: "en nyckelpiga på utflykt",
    lesson: "att man kan upptäcka massa nya ställen",
  },
  {
    theme: "en liten flicka som ville bli pilot, men var höjdrädd",
    lesson: "att man kan övervinna sina rädslor",
  },
  {
    theme: "en häst som var snabbast i världen",
    lesson: "att man inte ska skryta",
  },
  {
    theme: "en liten delfin som ville hälsa på hos sjöjungfruarna",
    lesson: "att man inte får gå iväg utan en vuxen",
  },
  {
    theme: "ett lejon som ville svalka sig",
    lesson: "att vissa katter faktiskt gillar att bada",
  },
];
