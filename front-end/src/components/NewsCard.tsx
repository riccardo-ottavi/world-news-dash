import type { Article } from "../../../shared/types/types";

type NewsCardProps = {
  item: Article;
};

export default function NewsCard({ item }: NewsCardProps) {
  return (
    <div className="news-card" key={item.id}>
      {(item as any).image && (
        <div className="news-card-image">
          <img src={(item as any).image} alt={item.title} />
        </div>
      )}
      <h3>{item.title}</h3>
      <p>{item.source?.name}</p>
      <a href={item.link} target="_blank" rel="noreferrer">
        Read full article
      </a>
    </div>
  );
}