export type Source = {
  id: string;
  name: string;
  url: string;
  category?: string | null;
  createdAt?: string;
};

export type Article = {
  id: string;
  title: string;
  link: string;
  content?: string | null;
  publishedAt?: string | null;
  hash: string;
  sourceId: string;
  createdAt?: string;
  source?: Source;
};

export type NewsPreviewItem = {
  id: string;
  title: string;
  sourceName: string;
  category?: string | null;
  highlight: string;
  score: number;
  tags: string[];
};

export type NewsPreview = {
  date: string;
  summary: string;
  items: NewsPreviewItem[];
};
