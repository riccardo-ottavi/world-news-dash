import axios from "axios";
import type { Article, Source } from "../../../shared/types/types";

export const fetchNews = async (params?: { category?: string; sourceId?: string }): Promise<Article[]> => {
  const res = await axios.get("http://localhost:3000/news", { params });
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