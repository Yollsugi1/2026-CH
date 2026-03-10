import { Client } from "@notionhq/client";

export const notion = new Client({
  auth: process.env.NOTION_TOKEN || "placeholder",
});

export const databaseId = process.env.NOTION_DATABASE_ID || "";

export const isNotionConfigured = !!(
  process.env.NOTION_TOKEN && process.env.NOTION_DATABASE_ID
);
