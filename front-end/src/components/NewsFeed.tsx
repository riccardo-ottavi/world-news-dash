import { useState, useEffect } from "react";
import { fetchNews, fetchCategories, fetchSources } from "../api/news";
import NewsCard from "./NewsCard";
import type { Article, Source } from "../../../shared/types/types";

export default function NewsFeed() {
  const [news, setNews] = useState<Article[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [sources, setSources] = useState<Source[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [selectedSource, setSelectedSource] = useState<string | undefined>(undefined);

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => setCategories([]));
    fetchSources().then(setSources).catch(() => setSources([]));
  }, []);

  useEffect(() => {
    fetchNews({ category: selectedCategory, sourceId: selectedSource }).then(setNews).catch(() => setNews([]));
  }, [selectedCategory, selectedSource]);

  const categoryLabels: Record<string, string> = {
    italia: "Italia",
    world: "Mondo",
    technology: "Tecnologia",
  };

  return (
    <>
      <h1>News</h1>

      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <select value={selectedCategory ?? ""} onChange={(e) => setSelectedCategory(e.target.value || undefined)}>
          <option value="">Tutte le categorie</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {categoryLabels[c] ?? c}
            </option>
          ))}
        </select>

        <select value={selectedSource ?? ""} onChange={(e) => setSelectedSource(e.target.value || undefined)}>
          <option value="">Tutte le fonti</option>
          {sources.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      <div className="news-feed">
        {news.map((item) => (
          <NewsCard key={item.id} item={item} />
        ))}
      </div>
    </>
  );
}