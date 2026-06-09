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
