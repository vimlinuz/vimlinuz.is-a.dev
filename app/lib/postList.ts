import fs from "fs/promises";

export async function getPostList(): Promise<string[]> {
  try {
    const files = await fs.readdir("./markdown");
    return files;
  } catch (err) {
    console.error("Error reading the markdown directorPath: ", err);
  }
  return [];
}
