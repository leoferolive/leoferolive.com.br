export type StackGroupData = {
  id: string;
  name: string;
  items: readonly string[];
};

export const stack: readonly StackGroupData[] = [
  {
    id: 'ai',
    name: 'ai/',
    items: [
      'Spring AI',
      'Pgvector',
      'Azure OpenAI',
      'MCP',
      'Claude Code',
      'Cursor',
      'ChatGPT',
      'Codex',
      'BMAD',
      'RAG',
    ],
  },
  {
    id: 'backend',
    name: 'backend/',
    items: [
      'Java 8–25',
      'Spring Boot 4',
      'Microservices',
      'BFF',
      'Event-driven',
      'Kafka',
      'REST + SSE',
      'OIDC',
    ],
  },
  {
    id: 'data',
    name: 'data/',
    items: ['PostgreSQL', 'MongoDB', 'Redis', 'SQL Server', 'Oracle', 'DB2'],
  },
  {
    id: 'devops',
    name: 'devops/',
    items: [
      'AWS EKS',
      'Kubernetes',
      'K3s',
      'Helm',
      'Docker',
      'GitHub Actions',
      'Jenkins',
      'Cloudflare Tunnel',
      'Tailscale',
      'Traefik',
    ],
  },
] as const;
