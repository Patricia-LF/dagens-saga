# Review routine for AI-generated stories

Every AI story is read and approved by me before it is shown in the app. This is done in the Supabase table view (the admin page was dropped 2026-11-04).

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
9. Optional: make an image for the story, upload it to the `story-images` bucket in Supabase Storage, and paste its public URL into `imageUrl`.

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
- [ ] No repeated characters, animal species or motifs from recent stories (for example fish swimming in the air).
- [ ] The ending shows how the main character feels through what they do, hear or think, not with a simile.

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

**2026-11-08 ("Sirra", the unicorn who wanted a friend)**

- Sirra and Veno: good story, but the last sentence ("Sjön låg stilla och höll deras speglar nära") was a poetic image that didn't mean anything concrete. Rewrote the ending by hand. If it happens again, add a rule to the prompt: end with a clear, concrete image a child can picture.
- Added a more specific description of the pegasus (a white horse with wings and a blue tail). If a character's species is rare, the story benefits from a short description of it the first time it appears.

**2026-11-08 ("Sille", the snake who couldn't say S)**

- Sille couldn't say S, but his own lines contained S ("Fast det känns knepigt"), and "ta Tille" was in the narrator's text. The model can't keep a rule about letters or sounds in the characters' speech.
- The story also had several magical things that were never explained and had no clear role in the story.
- Since it needed a lot of changes, I had it rewritten with Claude in chat. I asked for one clear magic rule, and for the message that practicing can help, but that it's okay not to pronounce everything right (for children who stutter or lisp).
- Added a rule to the prompt: end with a clear, concrete image a child can picture. The vague ending was a repeated problem from the previous story.

**2026-11-13 ("Nori", the seahorse learning to swim)**

- Too many details that had no role in the story: a stone, a bowl, a basket of seaweed, seaweed bread and a coral gate. Each one is fine on its own, but together they make the story hard to follow for a child.
- The body parts didn't add up: Nori swam with his "fin", then the text switched to his tail, and Ebba the starfish "blinked" sand off one arm, although a starfish has no eyes to blink with.
- The pearl bubbles worked well: one magic thing with a clear rule (they only light up when you breathe calmly), tied to the lesson about taking it slow.
- Fixed by hand: removed the stone, basket, bread and gate, used "ryggfena" for swimming and the tail for holding on, and let Ebba shake the sand off instead.
- Changes to the generation: new prompt rules (every object must matter for the story, at most one magic thing, animals move as their bodies work and body parts keep the same name), reasoning effort raised from "low" to "medium", and shorter stories (250–350 words). To be compared with the next three stories.

**2026-11-13 (prompt rework after "Otto")**

- Found two contradictions in the prompt: "Korta meningar, helst högst 12 ord" made the language choppy, and "Mycket magi … levande beskrivningar av miljöer" encouraged extra details. Replaced them with "vary sentence length" and "few but clear details".
- Added rules about introducing the magic thing, where the characters are (water, land, air), consistent body parts, and an ending that shows how the main character feels.
- Sorted the rules under Innehåll, Figurer and Magi, and merged overlapping ones.
- Reasoning effort raised from "low" to "medium", and MAX_OUTPUT_TOKENS from 2000 to 6000, since the first test used 2094 tokens. Cost per story went from about $0.023 to about $0.07.
- The next story was much better.

**2026-11-13 ("Otto", the seahorse who had just learned to swim, first story with the new prompt)**

- Much better than the earlier seahorse story: only three things in the story (the seaweed, the coral arch and the light pearl), and the dorsal fin and the tail were used correctly.
- Still needed polishing: the light pearl was presented as if the reader already knew it, the dolphin "glided over the sand" and "landed flat", which sounded like being on land, and the end said that Otto "stood straight", although a seahorse floats and is shaped like an S.
- Edited by hand with help from Claude in chat: explained where the pearl came from, made the bubbles "show the way, like stones to jump between", merged a repeated description and a split line of dialogue, and changed the ending so Otto floats without holding on to anything. This mirrors the beginning, where his tail holds on hard to the seaweed.
- These problems led to the prompt rework the same evening.

**2026-11-13 ("Rimmi", the bird who wanted to fly around the world, second story with the new prompt)**

- The best story so far: varied sentence length, one magic thing with a clear origin and rule (the blue stone from the beach where the turtle hatched), and an ending that shows how Rimmi feels.
- Small edits: split the long sentence with the stone's rule into two, and gave Rimmi an answer when Duni asks how it felt ("Stort. Men jag vågade."), which ties the story together.
- Kept "fågeln" without a species, since a six-year-old listening doesn't need to know bird species, and the cover image shows what Rimmi looks like.

**2026-11-13 ("Glo", the frog who couldn't jump, an older story)**

- Generated before the new rules. It had an extra character who lit dewdrops, and water lilies that sang, against the rule about singing things. I removed both.
- The removal left loose ends: frogs that ate seeds (frogs eat insects, which is awkward with a beetle as Glo's friend), and no clear reason why Glo needed to reach the far lily pad. Replaced it with a goal that only Glo couldn't reach: the big lily pad in the middle of the pond where all the frogs watch the sunrise.
- The title "Glo och de sjungande näckrosorna" has to change, since the lilies no longer sing.
- Older stories need more editing than the ones made with the new prompt.

**2026-11-15 ("Nysta", the reindeer)**

- replaced the snow hare with an arctic fox, since a hare or rabbit had already been in another story, and adjusted how it moves and where it lives.
- Rewrote the last sentence, which ended with a simile. Several stories had ended with the same kind of comparison ("som en filt", "som en kudde"), so the prompt rule for endings was changed. Two test stories afterwards had endings without similes.
