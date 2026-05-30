import Link from "next/link";
import { getPost } from "@/app/lib/postList";
import { serialize } from "next-mdx-remote/serialize";
import MDXContent from "@/app/components/MDXContent";
import styles from "./page.module.css";

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
    <div className={`container post-page ${styles.postShell}`}>
      <div className="terminal-buttons">
        <Link
          href="/post"
          className="btn close"
          style={{ textDecoration: "none" }}
        >
          <i className="fa-solid fa-xmark"></i>
        </Link>
      </div>
      <div className={styles.postPanel}>
        <div className={styles.postHeader}>
          <h1 className={`name ${styles.postTitle}`}>{post.title}</h1>
        </div>
        <div className={`file-content ${styles.contentFrame}`}>
          <div>
            <article className={styles.article}>
              <div className={styles.postBody}>
                <MDXContent source={content} />
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>
  );
}
