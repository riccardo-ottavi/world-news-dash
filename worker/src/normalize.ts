export function normalizeItems(feed: any) {
  const items = feed.rss.channel.item;

  return items.map((item: any) => ({
    title: item.title,
    link: item.link,
    content: item.description || "",
    publishedAt: item.pubDate ? new Date(item.pubDate) : null,
  }));
}