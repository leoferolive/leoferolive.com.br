export type ProjectEntry = {
  id: string;
  type: 'app' | 'pwa' | 'infra';
  name: string;
  description: { pt: string; en: string };
  stack: readonly string[];
  builtWith?: string;
  link?: string;
};

export const projects: readonly ProjectEntry[] = [
  {
    id: 'nossalista',
    type: 'app',
    name: 'nossalista',
    description: {
      pt: 'Listas colaborativas em tempo real, compartilhadas entre família/amigos.',
      en: 'Real-time collaborative lists, shared between family/friends.',
    },
    stack: ['Java 25', 'Spring Boot 4', 'React/Vite', 'PostgreSQL', 'WebSocket'],
    builtWith: 'Claude Code + Codex via BMAD',
    link: 'https://github.com/leoferolive/nossalista',
  },
  {
    id: 'nossagrana',
    type: 'pwa',
    name: 'nossagrana',
    description: {
      pt: 'Gestão de finanças familiares. PWA instalável, offline-first.',
      en: 'Family finance management. Installable PWA, offline-first.',
    },
    stack: ['Node/TS', 'React/Vite', 'PostgreSQL'],
    builtWith: 'Claude Code + Codex',
    link: 'https://github.com/leoferolive/nossagrana',
  },
  {
    id: 'homelab',
    type: 'infra',
    name: 'homelab',
    description: {
      pt: 'Tudo em um Raspberry Pi 4B (8GB). K3s, Traefik, Cloudflare Tunnel. OpenClaw + Telegram para administração remota — provisiono bancos, faço deploys e troubleshoot direto pelo chat.',
      en: 'Everything on a Raspberry Pi 4B (8GB). K3s, Traefik, Cloudflare Tunnel. OpenClaw + Telegram for remote admin — I provision databases, deploy, and troubleshoot from chat.',
    },
    stack: ['Raspberry Pi 4B', 'K3s', 'Traefik', 'Cloudflare Tunnel', 'OpenClaw', 'Tailscale'],
  },
] as const;
