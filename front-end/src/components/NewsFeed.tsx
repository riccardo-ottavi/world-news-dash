import { useState, useEffect } from "react";
import { fetchNews } from "../api/news";
import NewsCard from "./NewsCard";

export default function NewsFeed() {
  const [news, setNews] = useState<any[]>([]);

  useEffect(() => {
    fetchNews().then(setNews);
  }, []);

  return (
    <>
    <h1>News</h1>
    <div className="news-feed">
      {news.map((item: any) => (
        <NewsCard key={item.id} item={item} />
      ))}
    </div>
    </>
  );
}