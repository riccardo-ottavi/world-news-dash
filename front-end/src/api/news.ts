import axios from "axios";

export const fetchNews = async () => {
  const res = await axios.get("http://localhost:3000/news");
  return res.data;
};