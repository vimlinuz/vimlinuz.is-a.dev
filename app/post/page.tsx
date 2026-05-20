import { Metadata } from "next";
import Link from "next/link";
import Welcome from "@/markdown/welcome.md";
import { getPostList } from "../lib/postList";

export const metadata: Metadata = {
  title: "vimlinuz - feed",
  description: "Unpolished development notes, experiments, and technical ideas",
};

export default async function postList() {
  const file_name = await getPostList();
  return (
    <div className="container">
      <div className="terminal-buttons">
        <Link href="/" className="btn close" style={{ textDecoration: "none" }}>
          <i className="fa-solid fa-xmark"></i>
        </Link>
      </div>
      <div className="filecontent">
        <ul>
          {file_name.map((name) => (
            <li
              key={name}
              style={{
                marginBottom: "10px",
                color: "blue",
                cursor: "pointer",
              }}
            >
              {name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
