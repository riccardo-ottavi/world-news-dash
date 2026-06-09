import axios from "axios";
import type { Article, Source, NewsPreview } from "../../../shared/types/types";

export const fetchNews = async (params?: { category?: string; sourceId?: string }): Promise<Article[]> => {
  const res = await axios.get("http://localhost:3000/news", { params });
  return res.data;
};

export const fetchNewsPreview = async (): Promise<NewsPreview> => {
  const res = await axios.get("http://localhost:3000/news/preview");
  return res.data;
};

export const fetchCategories = async (): Promise<string[]> => {
  const res = await axios.get("http://localhost:3000/sources/categories");
  return res.data;
};

export const fetchSources = async (): Promise<Source[]> => {
  const res = await axios.get("http://localhost:3000/sources");
  return res.data;
};