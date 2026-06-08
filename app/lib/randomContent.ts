import contentPairs from "@/data/contentPairs.json" with { type: "json" };

export function getRandomContentPair() {
  return contentPairs[Math.floor(Math.random() * contentPairs.length)];
}
