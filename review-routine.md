# Review routine for AI-generated stories

Every AI story is read and approved by me before it is shown in the app. Until the admin page exists (issues 28–29), this is done in the Supabase table view.

## Statuses

| Status      | Meaning                                  | Set by                                 |
| ----------- | ---------------------------------------- | -------------------------------------- |
| `draft`     | Generated, not reviewed                  | The batch script                       |
| `scheduled` | Reviewed and approved, shown on its date | Me, after review                       |
| `published` | Its date has arrived                     | The cron job (issue 23), or me by hand |

The app shows stories with status `scheduled` or `published` and a date up to today (see ambiguity.md). **Approving a story = changing it from `draft` to `scheduled`.**

## Steps

1. Supabase → the project (Patricia-LF's Dagens saga) → **Table Editor** → `stories`.
2. Filter or sort on `status` to find the drafts.
3. Click a row to open it, and click on Expand editor to open it in the side panel.
4. Read the story and go through the checklist below.
5. Fix the `title` and `body` directly in the panel. Keep a blank line between paragraphs, and each line of dialogue on its own line.
6. If you rename a character, update `characters` too, since it is used to avoid repeats.
7. Check `scheduledDate`. Each date can only have one story.
8. Change `status` to `scheduled` and save.

**If a story is not good enough:** delete the row. Its date becomes free and is used by the next batch.

**Never** set `published` on a story with a future date.

## Checklist

**Safety and tone**

- [ ] Nothing scary, violent, or sad without comfort.
- [ ] Kind and warm, with a safe ending.
- [ ] No real people, brands or existing characters.

**Content**

- [ ] The lesson is shown through what happens, not stated as a moral at the end.
- [ ] Clear beginning, middle and end.
- [ ] Not too many characters (about 3 at most).
- [ ] No repeated characters or motifs from recent stories (for example fish swimming in the air).

**Language**

- [ ] Correct Swedish, with no words that sound translated.
- [ ] Simple enough for a 6-year-old to follow. Short sentences.
- [ ] The title matches the story.

**Format**

- [ ] A blank line between paragraphs, 2–4 sentences each.
- [ ] Each line of dialogue starts on a new line with a dash (–). The same speaker continues without a new dash.
- [ ] Roughly 250–350 words.

## Notes from use

_Add things here that come up during reviews, so the prompt or the checklist can be improved._

**2026-10-21 (first review: "Nimbis")**

- The batch script warns in the terminal when a story is longer than 350 words. This one was slightly over. Kept it, since the length felt fine to read.
- Changed "damm" to "stoft", since it sounds more magical.
- Motifs repeat across stories, for example fish swimming in the air (three stories so far). Added a rule to the prompt to vary the kind of creatures.
- The story had several characters. Added "at most 3 characters" to the prompt.
- Approved: status changed to `scheduled`.

**2026-10-22**

- No fish in the air in the new batch.
