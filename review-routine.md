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

**2026-10-28 ("Borre", the bear who only ate buns)**

- The model invented creatures no child would recognise ("rotfe", "vindkalv"), probably because the prompt asks for varied creatures and the avoid list keeps growing.
- The vegetables were alive (a potato nudging his toe) and were then eaten, which felt odd.
- One character (Noppe) had no role in the story, and the lesson was stated outright.
- Rewrote it: a mother bear instead of the invented helper, a squirrel friend instead of Noppe, and ordinary food. Also said in the text that Borre is a bear, which the story never mentioned.
- Added two rules to the prompt: use animals and fairy-tale figures children recognise, and food that is eaten must not be alive.

**2026-10-28 ("Elvi", the mermaid with the magic diadem)**

- The model added a character (Nolle) with no role in the story. It seems to aim for three characters even when fewer would be better.
- The logic did not hold: Elvi made two wishes but only took one back, yet everyone stopped staring anyway. Some magic also happened without a reason (gold spots before any wish, a pearl that played a tone).
- Rewrote it as a story with three wishes, where the last one undoes the first two, and removed Nolle. The lesson (be careful what you wish for, and be glad for what you have) now shows through what happens.
- Updated the prompt: at most 3 characters, fewer is fine, and each one must have a clear role, so no characters that are just passing by. Also added that magic must follow clear rules, with a cause the child can understand.

**2026-10-28 ("Liri", the butterfly who wanted to control the weather)**

- The story never said Liri was a butterfly, the same problem as with Borre the bear.
- The helper (Nessa) was an invented creature, "a flower seed with glasses", and turned up at the end without explanation.
- Silverfish appeared out of dewdrops. Silverfish are pests, and the magic had no clear cause. Things singing (the grass) came back again, after singing stones and a singing pearl in earlier stories.
- The lesson (you can't control the weather) was there, but buried. Rewrote it with a real bumblebee as helper and three clear steps: shouting at the wind doesn't help, flying against it is tiring, and leaning with it gets her there.
- Updated the prompt: introduce every character with both kind and name the first time ("fjärilen …"), avoid pests and animals many find disgusting, and avoid things singing or playing as a way to show magic. Merged the rule about varied creatures with the rule about recognisable ones, since asking for variety seems to be what made the model invent new creatures. Replaced real character names in the prompt's examples with neutral ones.

**2026-10-28 (test run after the prompt changes)**

- Generated three stories to see if the new rules helped. The spider story ("Nella") is the best so far: every character introduced, two characters who both matter, magic with one clear rule that the plot uses, and the lesson shown through what happens.
- Small things still to fix by hand: a rabbit eating a cheese sandwich, an empty simile, and a last sentence close to a stated moral.
- Two of the stories repeated themes that already had stories, because the script only avoids repeats within one run. Deleted them. Until issue 48 is done, I remove a theme from themes.ts once it has become a kept story.
- Not yet changed: "Mycket magi och fantasi" in the prompt may be pushing the model to add too much magic. Waiting to see the effect of today's changes first.
