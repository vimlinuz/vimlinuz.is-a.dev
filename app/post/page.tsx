import { Metadata } from "next";
import Link from "next/link";
import { getPostList } from "../lib/postList";

export const metadata: Metadata = {
  title: "vimlinuz - feed",
  description: "Unpolished development notes, experiments, and technical ideas",
};

export default async function postList() {
  const postDetails = await getPostList();
  return (
    <div className="container post-page">
      <div className="terminal-buttons">
        <Link href="/" className="btn close" style={{ textDecoration: "none" }}>
          <i className="fa-solid fa-xmark"></i>
        </Link>
      </div>
      <h1 className="name">posts</h1>
      <div className="header"></div>
      <div className="file-content">
        <div className="flex post-list">
          {postDetails.map((post) => (
            <Link
              key={post.title}
              href={`/post/${post.fileName}`}
              className="blog_main"
            >
              <div>
                <p>Title:</p> {post.title}
                <p>Date:</p>
                {post.date} <p>Tags:</p>
                {post.tags}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
