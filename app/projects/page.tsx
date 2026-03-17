import { Suspense } from "react";
import Link from "next/link";
import { fetchGitHubRepos } from "../lib/github";
import ProjectCard from "../components/ProjectCard";

async function ProjectsList() {
  const repos = await fetchGitHubRepos("vimlinuz");

  if (repos.length === 0) {
    return (
      <div className="no-projects">
        <p>No projects found or unable to fetch from GitHub.</p>
      </div>
    );
  }

  return (
    <div className="projects-grid">
      {repos.map((repo) => (
        <ProjectCard key={repo.id} repo={repo} />
      ))}
    </div>
  );
}
import { Metadata } from "next";

function LoadingSkeleton() {
  return (
    <div className="projects-grid">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="project-card skeleton">
          <div className="skeleton-header"></div>
          <div className="skeleton-text"></div>
          <div className="skeleton-text short"></div>
          <div className="skeleton-footer"></div>
        </div>
      ))}
    </div>
  );
}

export default function Projects() {
  return (
    <div className="container projects-container">
      <div className="terminal-buttons">
        <Link href="/" className="btn close" style={{ textDecoration: "none" }}>
          <i className="fa-solid fa-xmark"></i>
        </Link>
      </div>

      <div className="projects-header">
        <h1 className="name">Projects</h1>
        <p className="projects-subtitle">
          A collection of my open source projects and experiments
        </p>
      </div>

      <Suspense fallback={<LoadingSkeleton />}>
        <ProjectsList />
      </Suspense>

      <div className="github-link-footer">
        <a
          href="https://github.com/vimlinuz?tab=repositories"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="fa-brands fa-github"></i>
          View all repositories on GitHub
        </a>
      </div>
    </div>
  );
}

export const metadata: Metadata = {
  title: "vimlinuz - Projects",
  description:
    "A collection of  vimlinuz's open source projects and experiments",
};
