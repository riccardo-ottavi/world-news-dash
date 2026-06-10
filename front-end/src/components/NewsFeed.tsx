import { useState, useEffect } from "react";
import { fetchNews, fetchNewsPreview, fetchCategories, fetchSources } from "../api/news";
import NewsCard from "./NewsCard";
import type { Article, Source, NewsPreview } from "../../../shared/types/types";

export default function NewsFeed() {
  const [news, setNews] = useState<Article[]>([]);
  const [preview, setPreview] = useState<NewsPreview | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [sources, setSources] = useState<Source[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [selectedSource, setSelectedSource] = useState<string | undefined>(undefined);

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => setCategories([]));
    fetchSources().then(setSources).catch(() => setSources([]));
    fetchNewsPreview().then(setPreview).catch(() => setPreview(null));
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

      {preview ? (
        <section style={{ marginBottom: 16, padding: 16, border: "1px solid #ccc", borderRadius: 8, background: "#f9f9f9" }}>
          <h2>Anteprima del giorno</h2>
          <p style={{ whiteSpace: "pre-wrap", lineHeight: 1.5 }}>{preview.summary}</p>
        </section>
      ) : null}

      <div className="news-feed">
        {news.map((item) => (
          <NewsCard key={item.id} item={item} />
        ))}
      </div>
    </>
  );
}