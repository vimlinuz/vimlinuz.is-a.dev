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
              <div className="post-card">
                <p className="post-card-title">{post.title}</p>
                {post.tags && post.tags.length > 0 && (
                  <div className="post-topic flex gap-1.5">
                    {post.tags.slice(0, 5).map((topic) => (
                      <span key={topic} className="topic-tag m-16 text-white">
                        {topic}
                      </span>
                    ))}
                  </div>
                )}
                <div className="post-card-footer">
                  <span className="post-date">Updated {post.date}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
