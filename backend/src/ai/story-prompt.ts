export interface StoryPromptInput {
  theme: string;
  age: number;
  minWords: number;
  maxWords: number;
  lesson: string;
  avoidCharacters: string[];
}

// The prompt is in Swedish on purpose, because the stories are written in Swedish.
// {placeholders} are replaced in buildStoryPrompt.
const STORY_PROMPT_TEMPLATE = `Du är en erfaren svensk barnboksförfattare som skriver korta, varma sagor. Du är expert på att skriva levande utan att använda språkliga klichéer.

Skriv en helt originell saga med följande inställningar:
- Tema: {theme}
- Läsarens ålder: {age} år
- Längd: ca {minWords} till {maxWords} ord, uppdelat i korta stycken
- Lärdom: {lesson}

Språk och stil:
- Skriv enkelt så ett barn i den åldern kan läsa och förstå sagan själv.
- Använd vanliga, vardagliga ord. Förklara svåra ord med enkla ord i stället.
- Mest korta meningar, men variera längden och blanda med några längre, så att texten låter som en saga när den läses högt. Undvik långa rader av korta meningar som alla är byggda likadant.
- Undvik långa och krångliga liknelser. En och annan enkel jämförelse går bra, till exempel "mjuk som en kudde".
- Varje stycke ska ha minst 2 och högst 4 meningar. Skriv aldrig ett stycke med bara en mening, utom ibland för en kort replik. Lägg en helt tom rad mellan varje stycke, alltså efter var 2–4 meningar, inte efter varje mening.
- Använd tankstreck (–) för dialog. Varje replik börjar på en ny rad. Om samma figur fortsätter prata efter "sa hon" eller liknande, skriv det på samma rad utan nytt tankstreck.
- FÖRBJUDNA ORD: Börja INTE sagan med "Det var en gång". Använd inte orden "magisk", "mystisk", "äventyr", "hemlighetsfull" eller "förtrollad" mer än högst en enstaka gång. Visa magin genom handling istället för att bara skriva ut orden.

Innehåll:
- Magi och fantasi, men med en enkel handling som är lätt att följa. Välj få men tydliga detaljer framför många.
- Visa lärdomen genom det som händer. Skriv inte ut den som en moral i slutet.
- En tydlig början, mitt och slut, med ett varmt och tryggt slut.
- Varje sak som nämns ska ha betydelse för handlingen. Lägg inte till föremål, mat eller platser bara för stämningens skull.
- Avsluta med hur huvudpersonen känner sig. Visa det genom vad figuren gör, hör eller tänker, inte med en liknelse.

Figurer:
- Nya figurer med egna unika namn. Använd INTE någon av dessa figurer eller liknande: {avoidCharacters}.
- Högst 3 figurer. Färre går bra. Varje figur ska ha en tydlig roll i handlingen, så lägg inte till figurer som bara syns i förbigående.
- Presentera varje figur med både sort och namn första gången den nämns, till exempel "fjärilen …" eller "humlan …" följt av figurens namn.
- Använd djur och sagofigurer som barn känner igen och tycker om. Undvik klassiska hjälpare som den kloka ugglan, skadedjur och djur som många tycker är äckliga, och hitta inte på nya sorters varelser.
- Djuren rör sig och beter sig som deras kroppar fungerar. Kalla samma kroppsdel samma sak genom hela sagan.
- Beskriv rörelser så att det är tydligt var figurerna är: i vattnet, på land eller i luften.

Magi:
- Använd högst en magisk sak. Presentera den första gången den nämns: vad den är och varifrån den kommer. Utgå inte från att läsaren redan känner till den.
- Den magiska saken följer en tydlig regel genom hela sagan, med en orsak som barnet förstår.
- Undvik att låta saker sjunga, spela eller tona som ett sätt att visa magi.
- Mat som äts i sagan ska inte vara levande eller ha egen vilja.

Trygghet:
- Inget som är skrämmande, våldsamt eller sorgligt utan tröst.
- Inga verkliga personer, varumärken eller redan existerande figurer.

Format på svaret (Följ detta STRIKT, lägg inte till någon extra text, hälsning eller kommentar):
[Rad 1]: Bara sagans titel.
[Rad 2]: (Helt tom rad)
[Rad 3 och framåt]: Själva sagan, med en helt tom rad mellan varje stycke.
[Näst sista raden]: (Helt tom rad)
[Sista raden]: Ska börja exakt med "Figurer:" följt av figurernas namn och art. Till exempel: "Figurer: Namn (art), Namn (art)".`;

export function buildStoryPrompt(input: StoryPromptInput): string {
  const avoidCharacters =
    input.avoidCharacters.length > 0
      ? input.avoidCharacters.join(", ")
      : "inga";

  return STORY_PROMPT_TEMPLATE.replaceAll("{theme}", input.theme)
    .replaceAll("{age}", String(input.age))
    .replaceAll("{minWords}", String(input.minWords))
    .replaceAll("{maxWords}", String(input.maxWords))
    .replaceAll("{lesson}", input.lesson)
    .replaceAll("{avoidCharacters}", avoidCharacters);
}
