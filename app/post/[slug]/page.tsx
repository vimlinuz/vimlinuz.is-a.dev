import Link from "next/link";
import { getPost } from "@/app/lib/postList";
import { serialize } from "next-mdx-remote/serialize";
import MDXContent from "@/app/components/MDXContent";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const safeSlug = slug.endsWith(".md") ? slug : `${slug}.md`;
  const post = await getPost(safeSlug);

  if (post === undefined) {
    return (
      <div className="no-projects">
        <p>No such post found.</p>
      </div>
    );
  }
  const content = await serialize(post.content || "");

  return (
    <div className="container post-page">
      <div className="terminal-buttons">
        <Link
          href="/post"
          className="btn close"
          style={{ textDecoration: "none" }}
        >
          <i className="fa-solid fa-xmark"></i>
        </Link>
      </div>
      <h1 className="name">{post.title}</h1>
      <div className="header"></div>
      <div className="file-content">
        <div>
          <article className="blog-content">
            <div className="wrapper">
              <MDXContent source={content} />
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
