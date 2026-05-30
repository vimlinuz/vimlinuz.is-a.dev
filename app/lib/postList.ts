import "server-only";
import fs from "fs/promises";
import matter from "gray-matter";

export interface postDetails {
  fileName: string;
  title: string;
  date: string;
  content: string;
  tags: string[];
}

export async function getPostList(): Promise<postDetails[]> {
  try {
    const files = await fs.readdir("./markdown");
    const markdownFiles = files.filter((file) => file.endsWith(".md"));

    const details = await Promise.all(
      markdownFiles.map(async (file) => {
        const filePath = `./markdown/${file}`;
        const str = await fs.readFile(filePath, "utf8");
        const allContent = matter(str);
        const dateValue = allContent.data.date;
        return {
          fileName: file,
          title: allContent.data.title ?? file,
          date: dateValue ? new Date(dateValue).toISOString().slice(0, 10) : "",
          content: allContent.content,
          tags: Array.isArray(allContent.data.tags) ? allContent.data.tags : [],
        };
      }),
    );

    return details;
  } catch (err) {
    console.error("Error reading the markdown directorPath: ", err);
  }
  return [];
}

export async function getPost(file: string): Promise<postDetails | undefined> {
  try {
    const filePath = `./markdown/${file}`;
    const str = await fs.readFile(filePath, "utf8");
    const allContent = matter(str);
    const dateValue = allContent.data.date;
    return {
      fileName: file,
      title: allContent.data.title ?? file,
      date: dateValue ? new Date(dateValue).toISOString().slice(0, 10) : "",
      content: allContent.content,
      tags: Array.isArray(allContent.data.tags) ? allContent.data.tags : [],
    };
  } catch (err) {
    console.error("Error reading markdown file: ", err);
  }
}
