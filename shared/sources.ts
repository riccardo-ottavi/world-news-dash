export type SourceConfig = {
  name: string;
  url: string;
  category?: string | null;
};

const sources: SourceConfig[] = [
  {
    name: "ANSA",
    url: "https://www.ansa.it/sito/ansait_rss.xml",
    category: "italia",
  },
  {
    name: "Il Post",
    url: "https://www.ilpost.it/feed",
    category: "italia",
  },
  {
    name: "Reuters World",
    url: "http://feeds.reuters.com/Reuters/worldNews",
    category: "world",
  },
  {
    name: "BBC World",
    url: "https://feeds.bbci.co.uk/news/world/rss.xml",
    category: "world",
  },
  {
    name: "TechCrunch",
    url: "http://feeds.feedburner.com/TechCrunch/",
    category: "technology",
  },
  {
    name: "HDblog",
    url: "https://www.hdblog.it/feed/",
    category: "technology",
  },
];

export default sources;
