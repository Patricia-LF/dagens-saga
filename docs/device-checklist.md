# Device checklist

The app has no automated UI tests, so this checklist is run by hand on a real phone before each sprint ends, against the deployed backend. It takes about 15 minutes.

## Before you start

- [ ] Expo Go for SDK 57 is installed on the phone (see "Expo Go version" in the README), or the APK from EAS Build is installed (see "Build an Android app (APK) for demos" in the README).
- [ ] `mobile/.env` points to the deployed backend (`https://dagens-saga.vercel.app`).
- [ ] At least one story is approved for today, and a few for earlier days, so the screens have real data.
- [ ] With Expo Go: `npx expo start` is running, and the phone has scanned the QR code. With the APK this is not needed.

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
- [ ] Tapping a story opens it, and "Tillbaka" goes back.

## Look and feel

- [ ] The fonts load (Comic Neue for text, Irish Grover for the title), with no fallback font flashing.
- [ ] The background image fits the phone held upright, without odd cropping.
- [ ] Dark mode (switched on in the phone's settings) changes the background, colours and nav icons, and text is easy to read in both modes.
- [ ] With a larger text size in the phone's settings, text gets bigger and nothing is cut off.

## Loading, error and empty states

- [ ] The loading spinner shows briefly when a screen opens.
- [ ] With flight mode on, Dagens, Bibliotek and a story each show the error message with "Försök igen", and nothing crashes.
- [ ] After turning flight mode off, "Försök igen" loads the content.
- [ ] A day without an approved story shows "Ingen saga publicerad idag ännu".
- [ ] In the browser preview, `/story/999` shows "Den här sagan finns inte" with a button to the library.

## Reading modes, settings and favorites

- [ ] The reading mode buttons switch between page mode and scroll mode, and the choice is kept after restarting the app.
- [ ] Page mode: swiping and the arrows turn pages, the arrows are hidden on the first and last page, and the page indicator is right.
- [ ] Scroll mode: the cover fills the first view, and "Scrolla ner för att läsa" fades out when scrolling.
- [ ] The cover fits without scrolling, also with a title on two lines.
- [ ] The day/night switch changes the theme, and the choice is kept after restarting the app.
- [ ] The star adds and removes a favorite, with sparkles when added. Favorites are kept after restarting the app.
- [ ] The library shows a star next to favorites, and the filter shows only favorites, with a message when there are none.

## Animations

- [ ] The title letters fly in with sparkles, and the cover image and the fairies on the start page float.
- [ ] With "Remove animations" on in the phone's settings, nothing moves.

## Web version

- [ ] On a wide screen: the top bar with title, menu and day/night switch, and a reading view that fits the window.
- [ ] Reloading the page on a story keeps the story and the settings.

## Results

| Date       | Device                                                          | Sprint | Result | Notes                                                                                                                                                                     |
| ---------- | --------------------------------------------------------------- | ------ | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-10-30 | Samsung Galaxy S23, Expo Go SDK 57                              | 3      | Pass   | The app does not rotate, because `orientation` is `portrait` in `mobile/app.json`. Decided to keep portrait on phones (see ambiguity.md), and updated the checklist item. |
| 2026-11-15 | Samsung Galaxy S23, Expo Go SDK 57; web on localhost and Vercel | 5      | Pass   | Also checked reading modes, theme, favorites, animations and the desktop layout. All 73 automated tests pass, and tsc and lint report no problems.                        |
