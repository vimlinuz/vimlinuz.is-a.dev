import Link from "next/link";
type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const safeSlug = slug.endsWith(".md") ? slug : `${slug}.md`;
  const Post = (await import(`@/markdown/${safeSlug}`)).default;

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
      <h1 className="name">{safeSlug}</h1>
      <div className="header"></div>
      <div className="file-content">
        <div>
          <article className="blog-content">
            <Post />
          </article>
        </div>
      </div>
    </div>
  );
}
