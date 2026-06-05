import { useState, useEffect } from "react";
import { fetchNews } from "../api/news";

export default function NewsFeed() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    fetchNews().then(setNews);
  }, []);

  return (
    <div>
      <h1>News</h1>

      {news.map((item: any) => (
        <div key={item.id}>
          <h3>{item.title}</h3>
          <p>{item.source?.name}</p>
        </div>
      ))}
    </div>
  );
}