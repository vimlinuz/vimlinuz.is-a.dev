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
              <div className="rounded-lg border border-[#26233a] bg-[#191724] p-4 shadow-lg">
                <p className="text-[#908caa] text-lg font-semibold">
                  <span className="text-[#c4a7e7]">{post.title}</span>
                </p>

                <p className="mt-2 text-sm text-[#908caa]">
                  <span className="text-[#c4a7e7]">{post.date}</span>
                </p>

                <p className="mt-2 text-sm text-[#908caa]">
                  Tags:
                  <span className="ml-1 text-[#9ccfd8]">{post.tags}</span>
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
