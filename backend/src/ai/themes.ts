export interface StoryTheme {
  theme: string;
  lesson: string;
}

// Themes and lessons for batch generation (Swedish, because the stories are in Swedish).
// These are examples and will be replaced. A batch never uses the same theme twice,
// so the list must have at least as many entries as the largest batch.
export const THEMES: StoryTheme[] = [
  /*  {
    theme: "en björn som inte ville äta sina grönsaker",
    lesson: "vikten av att äta en blandad, nyttig kost",
  },
  {
    theme: "en fjäril som precis lärt sig flyga",
    lesson: "att man inte kan kontrollera vädret",
  },
  {
    theme: "en spindel som inte ville skrämmas",
    lesson: "att man inte ska ha förutfattade meningar",
  },
  {
    theme: "en sjöjungfru som hittade ett magiskt diadem",
    lesson: "att se upp med vad man önskar sig, och vara glad över det man har",
  }, */
  {
    theme: "en liten flicka som fick en lillebror",
    lesson: "att dela med sig",
  },
];
