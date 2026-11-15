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
    theme: "en giraffunge som inte nådde upp till grenarna längst upp i träden",
    lesson:
      "att man får vänta på att bli vuxen och stor, och ta vara på barndomen",
  },
  {
    theme: "en av tomtens renar som åkt vilse",
    lesson: "att man alltid hittar hem, eller så hittar någon dig",
  },
  {
    theme: "ett litet moln som ville lysa som en stjärna",
    lesson: "att molnets regn också är bra och gör nytta",
  },
  {
    theme: "en pojke som råkade släppa sin ballong så den flög iväg",
    lesson: "att det är bättre att berätta sanningen för sina föräldrar",
  },
];
