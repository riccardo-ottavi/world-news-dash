type NewsArticle = {
  id: string | number;
  title: string;
  source?: { name?: string };
  link: string;
};

type NewsCardProps = {
  item: NewsArticle;
};

export default function NewsCard({ item }: NewsCardProps) {
  return (
    <div className="news-card" key={item.id}>
      <h3>{item.title}</h3>
      <p>{item.source?.name}</p>
      <a href={item.link} target="_blank">
        Read full article
      </a>
    </div>
  );
}