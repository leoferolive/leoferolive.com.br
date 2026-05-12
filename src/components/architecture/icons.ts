import {
  siCloudflare,
  siTraefikproxy,
  siNginx,
  siFastapi,
  siReact,
  siSqlite,
  siPrometheus,
  siGrafana,
  siGithub,
  siGithubactions,
  siGooglegemini,
  siPython,
  siLinux,
  siTailscale,
  siKubernetes,
  siGit,
  siOpenrouter,
} from 'simple-icons';

type SimpleIcon = { title: string; hex: string; path: string };

const REGISTRY: Record<string, SimpleIcon> = {
  cloudflare: siCloudflare,
  traefikproxy: siTraefikproxy,
  nginx: siNginx,
  fastapi: siFastapi,
  react: siReact,
  sqlite: siSqlite,
  prometheus: siPrometheus,
  grafana: siGrafana,
  github: siGithub,
  githubactions: siGithubactions,
  googlegemini: siGooglegemini,
  python: siPython,
  linux: siLinux,
  tailscale: siTailscale,
  kubernetes: siKubernetes,
  git: siGit,
  openrouter: siOpenrouter,
};

export type ResolvedIcon = SimpleIcon | null;

export function getIcon(slug: string): ResolvedIcon {
  if (!slug) return null;
  return REGISTRY[slug] ?? null;
}
