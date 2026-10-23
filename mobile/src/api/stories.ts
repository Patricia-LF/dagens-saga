const API_URL = process.env.EXPO_PUBLIC_API_URL;

export type Story = {
  id: number;
  title: string;
  body: string;
  scheduledDate: string; // "YYYY-MM-DD"
  source: "ai" | "handwritten";
  imageUrl: string | null;
};

const mockStories: Story[] = [
  {
    id: 1,
    title: "Molnet Molli",
    body: `Högt ovanför byn Lillkvist bodde molnet Molli. Hon var luddig, rund och ljusgrå. Men Molli hade ett problem. Hon kunde inte sluta gråta. Tårarna föll genom luften och plaskade på taken. Blommorna nickade under dropparna. Små bäckar rann längs byns stigar.

– Jag vill sluta gråta! snyftade Molli. Tänk om alla blir arga på mig? 

Bredvid henne flög Pipra, en liten fjäril med silvervingar. Hon landade försiktigt på molnets mjuka kant. 
– Varför gråter du så mycket? frågade Pipra. 
– Jag vet inte, svarade Molli. Tårarna bara kommer!

Pipra flög ner till byns trädgård. Där mötte hon en pytteliten mullvad som hette Knorv. Han grävde bland torra jordklumpar. Hans morotsplantor hängde med bladen mot marken. 
– Vi behöver vatten, suckade Knorv. Men solen har varit här så länge! 

Pipra tittade upp mot Molli. 
Då fick hon en idé.
– Molli, vill du följa med och titta? ropade Pipra. 

Molli svävade långsamt ner över trädgården. Hennes tårar föll på jorden. Plötsligt började marken dofta friskt och gott. De torra jordklumparna blev mjuka. Morotsbladen lyfte sig försiktigt. Under jorden vaknade små frön. Deras gröna skott kikade fram.

Molli torkade sina kinder mot en vindpust. Men några droppar föll ändå. Nu såg hon något märkligt. Små sniglar kröp fram under bladen. En törstig humla drack ur en vattenpöl. 

Knorv dansade runt sina pigga morotsplantor. 
– Titta, Molli! ropade han. Ditt regn hjälper min trädgård att växa!

Molli log, och hennes tårar blev till mjukt sommarregn. Pipra dansade mellan dropparna. Knorv bjöd på knapriga morötter när skörden kom. 

Molli grät fortfarande ibland. Men nu visste hon att dropparna kunde göra nytta. 

När solen sedan tittade fram, spändes en regnbåge över byn. Molli vinkade glatt med sin fluffiga kant.`,
    scheduledDate: "2026-10-16",
    source: "ai",
    imageUrl: null,
  },
  {
    id: 2,
    title: "Draken som gömde sin eld",
    body: `Långt bortom molnens mjuka täcken låg en liten by där husen hade tak av blåskimrande kristaller. I en grotta bakom byn bodde draken Fnula.
Fnula hade fjäll som glittrade som pärlemor och vingar mjuka som sammet. Men det fanns en sak hon var rädd för: eld.

Varje gång det kittlade varmt i halsen gömde hon nosen under svansen.
– Tänk om jag råkar bränna något! pep hon.

En morgon kom hennes vän, månskensräven Vipsil, springande.
– Fnula! Stjärnblommorna i dalen har somnat. De behöver lite värme för att slå ut innan månen går upp!
Fnula tittade ner på sina tassar.
– Jag kan inte. Jag vågar inte.
Vipsil satte sig bredvid henne.
– Då går vi tillsammans. Du behöver inte göra det ensam.

De vandrade till dalen, där små silverblommor slöt sina kronblad. Fnula tog ett djupt andetag. Det började bubbla i halsen, och en liten gnista flög ut.
Fnula pep till och gömde sig bakom en sten.
– Jag klarar det inte!
– Vi tar det långsamt, sa Vipsil. Jag stannar här hos dig.
Fnula kikade fram. Vipsil log uppmuntrande. Tillsammans övade de på att blåsa försiktigt. 

Först kom bara en rökpuff. Sedan en pytteliten låga, varm som ett stearinljus.
Fnula riktade den mot marken bredvid blommorna.
En efter en vecklade stjärnblommorna ut sina kronblad. Dalen fylldes av gyllene ljus, och små ljusfjärilar dansade mellan blommorna.
Fnula skrattade förvånat.
– Jag var rädd hela tiden!
– Jag vet, sa Vipsil och strök henne över nosen. Men du bad om hjälp ändå.

Den kvällen somnade Fnula under en filt av mjuka moln. Hennes eld var fortfarande liten, och ibland blev hon fortfarande rädd.
Men nu visste hon att hon kunde ropa på en vän.`,
    scheduledDate: "2026-10-18",
    source: "ai",
    imageUrl: null,
  },
  {
    id: 3,
    title: "Stjärnan som ville ha en vän",
    body: `Långt ovanför molnen bodde en liten stjärna som hette Glimra. Varje kväll tände hon sitt ljus och blinkade glatt mot jorden.
Men Glimra hade ingen att leka med.
De andra stjärnorna dansade i stora ringar och lyste i takt med varandra. Glimra försökte göra likadant, men hennes ljus glittrade i regnbågens alla färger.
– Jag önskar att jag kunde lysa som alla andra, suckade hon.
En kväll bestämde sig Glimra för att leta efter en vän. Hon flög ner till månen och frågade:
– Vill du leka med mig?
– Gärna! sa månen. Men jag lyser bara silvervitt. Hur lyser du?
Glimra blev generad och gömde sitt färgglada sken bakom ett moln.
– Åh, jag lyser nog lite konstigt.
Då kikade en liten nattfjäril fram ur molnet. Den hade mjuka vingar som skimrade i lila och blått.
– Konstigt? Du lyser ju som en hel sagoträdgård! sa nattfjärilen.
Glimra tittade förvånat på sina egna färger.
– Tycker du verkligen det?
– Ja! Kan du lysa lite rosa? Jag har aldrig sett en rosa stjärna förut!
Glimra skrattade och lät sitt ljus bli mjukt rosa. Nattfjärilen snurrade runt i luften, och tillsammans målade de himlen med små glimmande färgprickar.
Snart kom fler stjärnor för att titta. En lyste grönt, en annan guldgult. De började leka en ny lek där alla fick lysa precis som de ville.
När morgonen närmade sig flög nattfjärilen upp på Glimras spets.
– Ska vi leka igen i morgon kväll?
– Ja! ropade Glimra.
Och den kvällen lyste hon starkare än någonsin, inte för att hon liknade någon annan, utan för att hon äntligen vågade vara Glimra.`,
    scheduledDate: "2026-10-12",
    source: "ai",
    imageUrl: null,
  },
];

// Later these will call the backend instead. The screens will not need to change.
export async function getArchive(): Promise<Story[]> {
  return mockStories;
}

export async function getStory(id: number): Promise<Story | undefined> {
  return mockStories.find((story) => story.id === id);
}

// Returns today's story from the backend, or null if there is none
export async function getTodaysStory(): Promise<Story | null> {
  if (!API_URL) {
    throw new Error("EXPO_PUBLIC_API_URL is not set. Add it to mobile/.env.");
  }

  const response = await fetch(`${API_URL}/stories/today`);

  // 404 means "no story today", which the screen already handles
  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(
      `Could not fetch today's story (status ${response.status})`,
    );
  }

  return response.json();
}
