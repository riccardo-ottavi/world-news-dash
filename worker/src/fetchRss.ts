import axios from "axios";
import { parseStringPromise } from "xml2js";

export async function fetchRss(url: string) {
  const response = await axios.get(url);
  const xml = response.data;

  const result = await parseStringPromise(xml, {
    trim: true,
    explicitArray: false,
  });

  return result;
}