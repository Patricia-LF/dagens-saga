# Device checklist

The app has no automated UI tests, so this checklist is run by hand on a real phone before each sprint ends, against the deployed backend. It takes about 15 minutes.

## Before you start

- [ ] Expo Go for SDK 57 is installed on the phone (see "Expo Go version" in the README).
- [ ] `mobile/.env` points to the deployed backend (`https://dagens-saga.vercel.app`).
- [ ] At least one story is approved for today, and a few for earlier days, so the screens have real data.
- [ ] `npx expo start` is running, and the phone has scanned the QR code.

## Navigation

- [ ] The bottom nav shows Hem, Dagens and Bibliotek, with the right icons.
- [ ] Each tab opens the right screen, and the selected tab is marked.
- [ ] The bottom nav is not hidden behind the phone's home bar or buttons.
- [ ] Tapping the title "Dagens saga" goes to the start page.

## Story of the day

- [ ] Today's story is shown with title and text.
- [ ] Paragraphs have space between them, and each line of dialogue starts on a new line.
- [ ] A long story scrolls smoothly to the end.

## Library and reading view

- [ ] The library lists the visible stories, newest first.
- [ ] Today's story is labelled "I dag", and the others show a date in Swedish (for example "21 oktober").
- [ ] No drafts or stories with future dates are shown.
- [ ] Tapping a story opens it, and "Tillbaka till biblioteket" goes back.

## Look and feel

- [ ] The fonts load (Comic Neue for text, Irish Grover for the title), with no fallback font flashing.
- [ ] The background image fits the phone held upright, without odd cropping.
- [ ] Turning the phone sideways changes the background image and keeps the text readable.
- [ ] Dark mode (switched on in the phone's settings) changes the background, colours and nav icons, and text is easy to read in both modes.
- [ ] With a larger text size in the phone's settings, text gets bigger and nothing is cut off.

## Loading, error and empty states

- [ ] The loading spinner shows briefly when a screen opens.
- [ ] With flight mode on, Dagens, Bibliotek and a story each show the error message with "Försök igen", and nothing crashes.
- [ ] After turning flight mode off, "Försök igen" loads the content.
- [ ] A day without an approved story shows "Ingen saga publicerad idag ännu".
- [ ] In the browser preview, `/story/999` shows "Den här sagan finns inte" with a button to the library.

## Results

| Date | Device | Sprint | Result | Notes |
| ---- | ------ | ------ | ------ | ----- |
|      |        |        |        |       |
