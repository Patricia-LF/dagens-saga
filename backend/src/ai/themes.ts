export interface StoryTheme {
  theme: string;
  lesson: string;
}

// Themes and lessons for batch generation (Swedish, because the stories are in Swedish).
// These are examples and will be replaced. A batch never uses the same theme twice,
// so the list must have at least as many entries as the largest batch.
export const THEMES: StoryTheme[] = [
  {
    theme: "en groda som inte kunde hoppa",
    lesson: "att alla är speciella på sitt eget sätt",
  },
  {
    theme: "en drake som är rädd för eld",
    lesson: "att modet växer när man delar sin rädsla",
  },
  {
    theme: "en pojke som ville ha en hund",
    lesson: "att man måste ta ansvar för, och vara snäll mot ett husdjur",
  },
  {
    theme: "en liten tomte som tappade bort sin mössa",
    lesson: "att det är okej att be om hjälp",
  },
  {
    theme: "en trädgård där blommorna kunde prata",
    lesson: "att lyssna på andra",
  },
];
