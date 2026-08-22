import miaCarter from "@/assets/mia-carter.png.asset.json";
import lucasReed from "@/assets/lucas-reed.png.asset.json";
import ethanCole from "@/assets/ethan-cole.png.asset.json";
import noahBrooks from "@/assets/noah-brooks.png.asset.json";
import avaMiller from "@/assets/ava-miller.png.asset.json";
import mrHolloway from "@/assets/mr-holloway.png.asset.json";
import mrsFinch from "@/assets/mrs-finch.png.asset.json";

export type Character = {
  slug: string;
  name: string;
  age: number;
  role: string;
  trait: string;
  quote: string;
  bio: string;
  image: string;
};

export const CHARACTERS: Character[] = [
  {
    slug: "mia-carter",
    name: "Mia Carter",
    age: 16,
    role: "The Spark",
    trait: "Fearless",
    quote: "If it's hiding from us, it's afraid of us.",
    bio: "First through every door and last to admit she's scared. Mia turns panic into momentum, which saves the group as often as it endangers them.",
    image: miaCarter.url,
  },
  {
    slug: "lucas-reed",
    name: "Lucas Reed",
    age: 14,
    role: "The Scout",
    trait: "Quick-witted",
    quote: "I mapped it. Twice. It moved.",
    bio: "Carries a flashlight, three spare batteries and a notebook of everything the adults refuse to write down. The youngest, and the one who notices first.",
    image: lucasReed.url,
  },
  {
    slug: "ethan-cole",
    name: "Ethan Cole",
    age: 17,
    role: "The Lightbearer",
    trait: "Steady",
    quote: "Somebody has to hold the lantern. Might as well be me.",
    bio: "The group's centre of gravity. Ethan's calm isn't the absence of fear — it's a decision he makes again every night.",
    image: ethanCole.url,
  },
  {
    slug: "noah-brooks",
    name: "Noah Brooks",
    age: 15,
    role: "The Empath",
    trait: "Perceptive",
    quote: "It isn't angry. It's grieving. That's worse.",
    bio: "Feels the Shadowrealm before he sees it. Noah reads intent the way others read maps, and it costs him every time.",
    image: noahBrooks.url,
  },
  {
    slug: "ava-miller",
    name: "Ava Miller",
    age: 17,
    role: "The Listener",
    trait: "Analytical",
    quote: "Play it backwards. Now tell me that's static.",
    bio: "Headphones always on, decoding frequencies, recordings and lies. Ava trusts data — until the data starts asking her questions.",
    image: avaMiller.url,
  },
  {
    slug: "mr-holloway",
    name: "Mr. Holloway",
    age: 60,
    role: "The Keeper",
    trait: "Guarded",
    quote: "I've seen this before. I buried the last group that asked.",
    bio: "Hollow Creek's oldest resident and its most reluctant guide. He knows the rules of the Shadowrealm because he helped write them.",
    image: mrHolloway.url,
  },
  {
    slug: "mrs-finch",
    name: "Mrs. Finch",
    age: 40,
    role: "The Strategist",
    trait: "Relentless",
    quote: "Sentiment is a luxury. Plans are not.",
    bio: "Precise, unreadable and always three moves ahead. Whether she's protecting the children or the town's secret depends on the day.",
    image: mrsFinch.url,
  },
];
