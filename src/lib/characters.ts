import alexanderVegaImg from "@/assets/alexander-vega.jpg";
import avaMiller from "@/assets/ava-miller.jpg";
import drChristianHayesImg from "@/assets/dr-christian-hayes.jpg";
import elenaValeImg from "@/assets/elena-vale.jpg";
import ethanCole from "@/assets/ethan-cole.jpg";
import ethanCrossImg from "@/assets/ethan-cross.jpg";
import isabellaReyesImg from "@/assets/isabella-reyes.jpg";
import lucasReed from "@/assets/lucas-reed.jpg";
import luciferionImg from "@/assets/luciferion.jpg";
import miaCarter from "@/assets/mia-carter.jpg";
import michaelVorenImg from "@/assets/michael-voren.jpg";
import mrHolloway from "@/assets/mr-holloway.jpg";
import mrsFinch from "@/assets/mrs-finch.jpg";
import noahBlakeImg from "@/assets/noah-blake.jpg";
import noahBrooks from "@/assets/noah-brooks.jpg";
import oliviaScottImg from "@/assets/olivia-scott.jpg";
import seraphinaImg from "@/assets/seraphina.jpg";

export type Character = {
  slug: string;
  name: string;
  age: number;
  role: string;
  trait: string;
  quote: string;
  bio: string;
  image: string;
  universe?: "Shadowrealm Saga" | "Rise of the Supreme";
};

export const UNIVERSES = ["All", "Shadowrealm Saga", "Rise of the Supreme"] as const;

export const CHARACTERS: Character[] = [
  // ==========================================
  // --- SHADOWREALM SAGA (THE 7 OF RAVENWOOD) ---
  // ==========================================
  {
    slug: "mia-carter",
    name: "Mia Carter",
    age: 16,
    role: "The Spark",
    trait: "Fearless",
    quote: "If it's hiding from us, it's afraid of us.",
    bio: "First through every door and last to admit she's scared. Mia turns panic into momentum, which saves the group as often as it endangers them.",
    image: miaCarter,
    universe: "Shadowrealm Saga",
  },
  {
    slug: "lucas-reed",
    name: "Lucas Reed",
    age: 14,
    role: "The Scout",
    trait: "Quick-witted",
    quote: "I mapped it. Twice. It moved.",
    bio: "Carries a flashlight, three spare batteries and a notebook of everything the adults refuse to write down. The youngest, and the one who notices first.",
    image: lucasReed,
    universe: "Shadowrealm Saga",
  },
  {
    slug: "ethan-cole",
    name: "Ethan Cole",
    age: 17,
    role: "The Lightbearer",
    trait: "Steady",
    quote: "Somebody has to hold the lantern. Might as well be me.",
    bio: "The group's centre of gravity. Ethan's calm isn't the absence of fear — it's a decision he makes again every night.",
    image: ethanCole,
    universe: "Shadowrealm Saga",
  },
  {
    slug: "noah-brooks",
    name: "Noah Brooks",
    age: 15,
    role: "The Empath",
    trait: "Perceptive",
    quote: "It isn't angry. It's grieving. That's worse.",
    bio: "Feels the Shadowrealm before he sees it. Noah reads intent the way others read maps, and it costs him every time.",
    image: noahBrooks,
    universe: "Shadowrealm Saga",
  },
  {
    slug: "ava-miller",
    name: "Ava Miller",
    age: 17,
    role: "The Listener",
    trait: "Analytical",
    quote: "Play it backwards. Now tell me that's static.",
    bio: "Headphones always on, decoding frequencies, recordings and lies. Ava trusts data — until the data starts asking her questions.",
    image: avaMiller,
    universe: "Shadowrealm Saga",
  },
  {
    slug: "mr-holloway",
    name: "Mr. Holloway",
    age: 60,
    role: "The Keeper",
    trait: "Guarded",
    quote: "I've seen this before. I buried the last group that asked.",
    bio: "Ravenwood's oldest resident and its most reluctant guide. He knows the rules of the Shadowrealm because he helped write them.",
    image: mrHolloway,
    universe: "Shadowrealm Saga",
  },
  {
    slug: "mrs-finch",
    name: "Mrs. Finch",
    age: 40,
    role: "The Strategist",
    trait: "Relentless",
    quote: "Sentiment is a luxury. Plans are not.",
    bio: "Precise, unreadable and always three moves ahead. Whether she's protecting the children or the town's secret depends on the day.",
    image: mrsFinch,
    universe: "Shadowrealm Saga",
  },

  // ==========================================
  // --- RISE OF THE SUPREME (10 ICONIC CHARACTERS) ---
  // ==========================================
  {
    slug: "alexander-vega",
    name: "Alexander Vega (The Supreme)",
    age: 23,
    role: "The Supreme · Main Hero (Rao Wasif)",
    trait: "Awakened Sovereign",
    quote: "Power defines a king. Sacrifice makes a legend.",
    bio: "The supreme celestial protagonist played and written by Rao Wasif. Wielding primordial violet cosmic vortex energy, Alexander rises from an ordinary mortal to humanity's greatest cosmic defender against the Void Overlords.",
    image: alexanderVegaImg,
    universe: "Rise of the Supreme",
  },
  {
    slug: "isabella-reyes",
    name: "Isabella Reyes",
    age: 22,
    role: "The Solar Empress",
    trait: "Radiant Empress",
    quote: "No eclipse can extinguish the morning sun.",
    bio: "High-ranking astral vanguard channeling pure thermonuclear solar fire. Her incandescent star-shields protect entire planetary sectors from cosmic bombardment.",
    image: isabellaReyesImg,
    universe: "Rise of the Supreme",
  },
  {
    slug: "ethan-cross",
    name: "Ethan Cross",
    age: 24,
    role: "The Stormbringer",
    trait: "Kinetic Thunder",
    quote: "Let the lightning strike where darkness gathers.",
    bio: "Frontline combat commander armored in hyper-conductive plating. Ethan channels raw atmospheric electric plasma, tearing through enemy battle lines with thunderous shockwaves.",
    image: ethanCrossImg,
    universe: "Rise of the Supreme",
  },
  {
    slug: "dr-christian-hayes",
    name: "Dr. Christian Hayes",
    age: 32,
    role: "Lead Scientist",
    trait: "Quantum Architect",
    quote: "The laws of physics aren't broken — they are evolving.",
    bio: "Chief scientific mind and quantum strategist of The Resistance. Dr. Hayes decoded the celestial frequency that unlocked Alexander's dormant supreme gene.",
    image: drChristianHayesImg,
    universe: "Rise of the Supreme",
  },
  {
    slug: "noah-blake",
    name: "Noah Blake",
    age: 21,
    role: "The Telekinetic",
    trait: "Psionic Master",
    quote: "You don't need a weapon when the world itself answers your call.",
    bio: "Prodigious psionic operative who bends gravity and telekinetically weaponizes cosmic asteroids and battlefield debris with devastating precision.",
    image: noahBlakeImg,
    universe: "Rise of the Supreme",
  },
  {
    slug: "luciferion",
    name: "Luciferion",
    age: 1000,
    role: "The Prime Overlord",
    trait: "Cosmic Tyrant",
    quote: "You fight against the natural order of nothingness.",
    bio: "The sovereign of the Void and supreme arch-villain. Cloaked in dark singularity rifts, Luciferion commands legions of shadow constructs seeking to consume all cosmic realms.",
    image: luciferionImg,
    universe: "Rise of the Supreme",
  },
  {
    slug: "michael-voren",
    name: "Michael Voren",
    age: 48,
    role: "Fallen Archmage",
    trait: "Eldritch Sorcerer",
    quote: "Knowledge without power is a tomb. I chose power.",
    bio: "Former high archivist of celestial lore who succumbed to forbidden dark cosmic arts. Wielding purple celestial spellcraft, he stands as Luciferion's most dangerous field general.",
    image: michaelVorenImg,
    universe: "Rise of the Supreme",
  },
  {
    slug: "seraphina",
    name: "Seraphina",
    age: 26,
    role: "Queen of Shadows",
    trait: "Shadow Monarch",
    quote: "In the dark, even your own reflection obeys me.",
    bio: "Master of abyssal shadow magic and dark gravitational rifts. Her shadowy tendrils and dark energy spheres can envelop entire skylines in absolute eternal night.",
    image: seraphinaImg,
    universe: "Rise of the Supreme",
  },
  {
    slug: "elena-vale",
    name: "Elena Vale",
    age: 22,
    role: "Energy Mage",
    trait: "Solar Conductor",
    quote: "Pure light leaves no shadow untouched.",
    bio: "Elite solar-kinetic combat mage who weaponizes hyper-dense photon spheres and fiery solar arcs alongside Isabella to purge void corruptions.",
    image: elenaValeImg,
    universe: "Rise of the Supreme",
  },
  {
    slug: "olivia-scott",
    name: "Olivia Scott",
    age: 23,
    role: "PSI Operative",
    trait: "Infiltration Specialist",
    quote: "I can dismantle your mind before you pull the trigger.",
    bio: "Top covert operative of The Resistance equipped with tactical psionic weaponry, sensory cloaking, and telepathic disruption fields.",
    image: oliviaScottImg,
    universe: "Rise of the Supreme",
  },
];
