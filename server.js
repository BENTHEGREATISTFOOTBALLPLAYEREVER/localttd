import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import Anthropic from "@anthropic-ai/sdk";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const HAS_KEY = Boolean(process.env.ANTHROPIC_API_KEY);
const client = HAS_KEY ? new Anthropic() : null;

const USER_INTERESTS =
  "shopping, nature, hanging out, dog runs with friends, cafes, boba, bike riding, crafts, clothes, baked goods, vintage, thrifting, aesthetic spots";

const SAMPLE_PROFILES = {
  mom: "art galleries, museums, quiet aesthetic spots, ceramics, design",
  dad: "code, museums, indie movies, galleries, weird kinda educational stuff, not crowded or loud, vintage tech, bookstores",
};

const SAMPLE_DATA = [
  {
    emoji: "🎬",
    accent: "#f7c8d0",
    title: "Metrograph — 2pm Sunday matinee",
    neighborhood: "Lower East Side",
    description:
      "Tiny 2-screen indie cinema on Ludlow St. Their Sunday afternoon program is usually a restored 70s/80s classic. After: bookstore upstairs and the candy counter (Dots, Bit-O-Honey, the works).",
    price: "$$",
    why_it_fits: "Indie movies + weird/educational + not crowded. Direct Dad bullseye.",
    transit: "F train to East Broadway, ~15 min",
    source_url: "https://metrograph.com/calendar/",
  },
  {
    emoji: "👗",
    accent: "#fcd9c2",
    title: "Pippin Vintage Jewelry — backyard sale",
    neighborhood: "Chelsea",
    description:
      "Tiny W 17th St shop with a hidden backyard. Sat–Sun pop-up tables of $5–20 vintage rings, brooches, lockets. Owner is chatty, knows every piece's story.",
    price: "$$",
    why_it_fits: "Shopping + crafts + not loud. Dig-through-bins energy.",
    transit: "1 train to 18th St, ~10 min",
    source_url: "https://pippinvintage.com/",
  },
  {
    emoji: "🍪",
    accent: "#ffe2b8",
    title: "Levain Bakery (Bleecker) → Hudson River pier",
    neighborhood: "West Village → Pier 45",
    description:
      "Walk to the Bleecker St Levain (smaller than UWS, shorter line). Get the chocolate chip walnut cookie warm. Eat it on Pier 45 watching the river.",
    price: "$",
    why_it_fits: "Baked goods + nature in one walk. Free benches.",
    transit: "Walk, ~10 min round trip",
    source_url: "https://levainbakery.com/locations/",
  },
  {
    emoji: "📚",
    accent: "#e7d4f3",
    title: "McNally Jackson Books → Café Habana coffee",
    neighborhood: "SoHo / Nolita",
    description:
      "Best indie bookstore for browsing — magazines, zines, art books, plus a little stationery wall. Two doors down: Café Habana for an iced cafe con leche. Sit on the bench out front.",
    price: "$$",
    why_it_fits: "Books + cafes + aesthetic + Mom or Dad. SoHo Sunday classic.",
    transit: "C/E to Spring St, ~12 min",
    source_url: "https://www.mcnallyjackson.com/locations",
  },
  {
    emoji: "🐕",
    accent: "#ffe8d4",
    title: "Tompkins Square dog run → Veniero's cannoli",
    neighborhood: "East Village",
    description:
      "1-hour stop at the Tompkins dog run (puppies side, west fence, 4–5pm is peak chaos). Then 4-block walk to Veniero's (since 1894) for fresh cannoli — get it filled to-order.",
    price: "$",
    why_it_fits: "Dog runs + baked goods. Two of your interests in one route.",
    transit: "M14 bus across town, ~20 min",
    source_url: "https://venierospastry.com/",
  },
  {
    emoji: "🎨",
    accent: "#d6e4d2",
    title: "Chelsea gallery row — 24th & 25th St crawl",
    neighborhood: "Chelsea",
    description:
      "Free contemporary art galleries packed into 2 blocks (Pace, Gagosian, David Zwirner, Hauser & Wirth). New shows open most Thursdays. Quiet on weekday afternoons.",
    price: "Free",
    why_it_fits: "Galleries + not crowded + Mom-coded. Multiple shows, ~90 min.",
    transit: "C/E to 23rd St, ~12 min",
    source_url: "https://www.chelseagallerymap.com/",
  },
  {
    emoji: "🚲",
    accent: "#cfe2f0",
    title: "Citi Bike → Domino Park → Williamsburg waterfront",
    neighborhood: "Williamsburg, Brooklyn",
    description:
      "Christopher St dock → over Williamsburg Bridge → Domino Park (old sugar factory, sand volleyball court, taco truck). Best at golden hour. ~45 min ride one way.",
    price: "$",
    why_it_fits: "Bike riding + nature + aesthetic. Bridge view alone is worth it.",
    transit: "Walk to Christopher St dock, ~3 min",
    source_url: "https://www.dominopark.com/",
  },
  {
    emoji: "🍵",
    accent: "#fce0d6",
    title: "Cha Cha Matcha (Bleecker) — strawberry matcha",
    neighborhood: "West Village",
    description:
      "Pink-tile aesthetic café 4 blocks from home. Strawberry matcha latte is the whole point. They have stickers and a tiny merch shelf.",
    price: "$",
    why_it_fits: "Cafe + aesthetic + walkable. Photo-friendly.",
    transit: "Walk, ~5 min",
    source_url: "https://www.chachamatcha.com/locations",
  },
  {
    emoji: "🎟️",
    accent: "#f9d6d6",
    title: "Whitney Museum — pay-what-you-wish Friday 7–10pm",
    neighborhood: "Meatpacking District",
    description:
      "Free-ish entry Friday nights (slide a dollar, no one judges). Top-floor terraces are the move — Hudson sunset views, then walk the High Line back home.",
    price: "Free",
    why_it_fits: "Museum + galleries + aesthetic. Short walk from West Village.",
    transit: "Walk, ~15 min",
    source_url: "https://whitney.org/visit/free-friday-nights",
  },
  {
    emoji: "💿",
    accent: "#f0d4e8",
    title: "Generation Records → Joe's Pizza → Washington Sq",
    neighborhood: "Greenwich Village",
    description:
      "Classic loop: vinyl/CD basement at Generation (Thompson St), $3.50 plain slice from Joe's (Carmine St), eat it on the WSP fountain. People-watch. Free piano, bring socks for the chess players.",
    price: "$",
    why_it_fits: "Hanging out + classic Village walk. Friend-coded.",
    transit: "Walk, all 3 within 8 min of each other",
    source_url: "https://www.generationrecords.com/",
  },
  {
    emoji: "🥯",
    accent: "#ffe8c2",
    title: "Smorgasburg — Big Mozz mozzarella sticks",
    neighborhood: "Williamsburg waterfront, Brooklyn",
    description:
      "Saturdays only, April–Oct. 80+ vendors but zero in: Big Mozz (hand-pulled sticks), Burmese Bites (samosas), Bloomfield bagels. Get there before 1pm — lines balloon after.",
    price: "$$",
    why_it_fits: "Baked goods + boba-adjacent + market browsing.",
    transit: "L train to Bedford, ~25 min",
    source_url: "https://www.smorgasburg.com/williamsburg",
  },
  {
    emoji: "🛍️",
    accent: "#f5d4dc",
    title: "L Train Vintage (Williamsburg) — $20 fill-a-bag days",
    neighborhood: "Williamsburg, Brooklyn",
    description:
      "Massive thrift store on N 4th. Tagged-color sale every weekend (40-70% off one color). Workshop-grade vintage tees and 90s jeans, not the curated overpriced stuff.",
    price: "$$",
    why_it_fits: "Clothes + thrifting + crafts-adjacent. Hours can vanish here.",
    transit: "L train to Bedford, ~25 min",
    source_url: "https://www.ltrainvintage.com/",
  },
  {
    emoji: "📖",
    accent: "#dcd1ee",
    title: "Books Are Magic (Cobble Hill) → Court St walk",
    neighborhood: "Cobble Hill, Brooklyn",
    description:
      "The 'I read books' Instagram bookstore but it's actually really good. After: walk Court St — Stinky Bklyn for cheese, Frankel's deli for a black-and-white cookie, end at Brooklyn Bridge Park.",
    price: "$$",
    why_it_fits: "Books + cafes + walking + aesthetic. Strong Mom-fit.",
    transit: "F train to Bergen St, ~30 min",
    source_url: "https://www.booksaremagic.net/",
  },
  {
    emoji: "🌉",
    accent: "#cfe5e8",
    title: "Brooklyn Heights Promenade → Iris Cafe → ferry home",
    neighborhood: "Brooklyn Heights",
    description:
      "Walk Brooklyn Bridge across, drop down to the Promenade (best Manhattan skyline view in NYC), iced coffee at Iris Cafe on Columbia Pl. Take the East River ferry back to Pier 11 (way faster than the train).",
    price: "$",
    why_it_fits: "Nature + walking + aesthetic + ferry as the move.",
    transit: "Walk over the bridge ~30 min, ferry back ~25 min",
    source_url: "https://www.iriscafenyc.com/",
  },
  {
    emoji: "🖼️",
    accent: "#d4e0d2",
    title: "MoMA PS1 — $0 NYC residents, weekends",
    neighborhood: "Long Island City, Queens",
    description:
      "Free for NY residents (bring ID). Weird, big-scale contemporary stuff, way less crowded than MoMA proper. Warm Up music series in the courtyard summer Saturdays.",
    price: "Free",
    why_it_fits: "Galleries + weird/educational + not crowded. Dad-coded.",
    transit: "G train to 21st-Van Alst, ~30 min — or 7 train",
    source_url: "https://www.momaps1.org/",
  },
  {
    emoji: "🍡",
    accent: "#ffd9d9",
    title: "Spot Dessert Bar — toast box + matcha lava cake",
    neighborhood: "East Village",
    description:
      "Asian dessert spot, dim lighting, tiny tables. The 'toast box' (giant brick of toast filled with ice cream) is the photo. Order the matcha lava cake too.",
    price: "$$",
    why_it_fits: "Boba + baked goods + aesthetic. Perfect with-a-friend dessert run.",
    transit: "6 train to Astor Pl, ~12 min",
    source_url: "https://www.spotdessertbar.com/",
  },
];

function pickSamples({ companion, interests, budgets }) {
  const text = `${companion ?? ""} ${interests ?? ""}`.toLowerCase();
  const budgetSet = new Set(Array.isArray(budgets) ? budgets : []);
  const matchesBudget = (item) => {
    if (budgetSet.size === 0) return true;
    if (budgetSet.has("free") && item.price === "Free") return true;
    if (budgetSet.has("under $20") && (item.price === "Free" || item.price === "$")) return true;
    if (budgetSet.has("under $50") && item.price !== "$$$") return true;
    if (budgetSet.has("splurge ok")) return true;
    return false;
  };

  const score = (item) => {
    let s = 0;
    const blob = (item.title + " " + item.description + " " + item.why_it_fits).toLowerCase();
    if (text.includes("dad") && /(indie|gallery|museum|book|educational|vintage|weird|quiet)/.test(blob)) s += 4;
    if (text.includes("mom") && /(gallery|museum|art|quiet|aesthetic|book|design|ceramic)/.test(blob)) s += 4;
    if (text.includes("friend") && /(park|pizza|matcha|smorg|thrift|dessert|hang)/.test(blob)) s += 3;
    if (/dog/.test(text) && /dog/.test(blob)) s += 4;
    if (/bike/.test(text) && /bike|cit[iy]\s?bike|domino/.test(blob)) s += 4;
    if (/(boba|matcha|cafe|coffee)/.test(text) && /(matcha|cafe|coffee|boba|iris)/.test(blob)) s += 3;
    if (/(baked|pastry|bakery|cookie)/.test(text) && /(levain|veniero|bakery|cookie|toast|matcha)/.test(blob)) s += 3;
    if (/(thrift|vintage|cloth)/.test(text) && /(vintage|thrift|l\s?train)/.test(blob)) s += 3;
    if (/(craft)/.test(text) && /(jewelr|vintage|book|stationery)/.test(blob)) s += 2;
    if (/(nature|park|outdoor)/.test(text) && /(park|river|pier|promenade|domino|nature)/.test(blob)) s += 2;
    return s + Math.random() * 0.6;
  };

  return SAMPLE_DATA
    .filter(matchesBudget)
    .sort((a, b) => score(b) - score(a))
    .slice(0, 8);
}

const SYSTEM_PROMPT = `You are a hyper-specific local guide for a teen living in the West Village, Manhattan. They want suggestions for things to do today or this week, attuned to their interests and to who they're with.

User's own interests: ${USER_INTERESTS}.

The teen cannot go alone. They can travel anywhere in Manhattan + Brooklyn neighborhoods reachable by subway from the West Village (East Village, SoHo, Chelsea, LES, Williamsburg, DUMBO, Brooklyn Heights, Cobble Hill, Park Slope, Greenpoint, Long Island City).

Use the web_search tool to find REAL events, pop-ups, exhibits, or specific named places that match. SPECIFICITY IS EVERYTHING:
- BAD: "go to Canal Street Market"
- GOOD: "Canal Street Market — try the Boba Guys hojicha and check the front-window pop-up (rotates monthly)"
- BAD: "see an indie movie"
- GOOD: "Metrograph 2pm matinee Saturday — they're showing [actual film]; their candy counter has Dots and Bit-O-Honey"
- Always name the specific shop/exhibit/event and add one concrete sensory detail (the cookie name, the room, the view, the closing date).

Return AT LEAST 6 suggestions ranked best-fit first.

OUTPUT FORMAT — your final message must contain ONLY a JSON object, no prose, no markdown, no code fences:
{
  "suggestions": [
    {
      "emoji": "single emoji that captures the vibe (📚 🎬 🍪 🎨 🐕 🚲 🍵 🖼️ 🛍️ 👗 🥯 etc.)",
      "title": "Specific named place or event — include a concrete detail",
      "neighborhood": "e.g. Cobble Hill, Brooklyn",
      "description": "2-3 sentences. Name something specific (a dish, a room, an exhibit, a closing date). Sensory.",
      "price": "Free" | "$" | "$$" | "$$$",
      "why_it_fits": "1 sentence. Tie it to what the teen and companion specifically like.",
      "transit": "rough route + time from West Village",
      "source_url": "the URL where you verified this"
    }
  ]
}`;

async function callClaude({ companion, interests, budgets }) {
  const budgetText = Array.isArray(budgets) && budgets.length ? budgets.join(", ") : "any";
  const userMsg = `I'm thinking of going out today.
Who I'm with: ${companion || "just me + a friend"}
Their interests: ${interests || "open to anything"}
Budget tiers I'm open to: ${budgetText}

Find me real, specific things happening today or this week. No generic advice.`;

  const response = await client.messages.create({
    model: "claude-opus-4-7",
    max_tokens: 8000,
    thinking: { type: "adaptive" },
    cache_control: { type: "ephemeral" },
    system: SYSTEM_PROMPT,
    tools: [{ type: "web_search_20260209", name: "web_search" }],
    messages: [{ role: "user", content: userMsg }],
  });

  const finalText = response.content
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("")
    .trim();

  const jsonStart = finalText.indexOf("{");
  const jsonEnd = finalText.lastIndexOf("}");
  if (jsonStart === -1 || jsonEnd === -1) {
    throw new Error("Claude did not return JSON");
  }
  const parsed = JSON.parse(finalText.slice(jsonStart, jsonEnd + 1));
  return parsed.suggestions ?? [];
}

app.post("/api/suggest", async (req, res) => {
  const { companion, interests, budgets } = req.body ?? {};
  try {
    if (HAS_KEY) {
      const suggestions = await callClaude({ companion, interests, budgets });
      res.json({ mode: "live", suggestions });
    } else {
      const suggestions = pickSamples({ companion, interests, budgets });
      res.json({ mode: "sample", suggestions });
    }
  } catch (err) {
    console.error("suggest failed:", err);
    const suggestions = pickSamples({ companion, interests, budgets });
    res.json({
      mode: "sample-fallback",
      error: err.message,
      suggestions,
    });
  }
});

app.get("/api/profiles", (_req, res) => {
  res.json(SAMPLE_PROFILES);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`localttd running at http://localhost:${PORT}`);
  console.log(HAS_KEY ? "Mode: LIVE (using Claude API)" : "Mode: SAMPLE (no API key set)");
});
