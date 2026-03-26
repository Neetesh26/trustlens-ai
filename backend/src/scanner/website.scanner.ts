import axios from "axios";
import * as cheerio from "cheerio";

export const scanWebsite = async (url: string) => {
  const response = await axios.get(url);
  const html = response.data;

  const $ = cheerio.load(html);

  const scripts: string[] = [];
  $("script").each((_, el) => {
    scripts.push($(el).attr("src") || "inline-script");
  });

  const forms = $("form").length;

  return {
    scripts,
    forms,
    hasSSL: url.startsWith("https"),
  };
};