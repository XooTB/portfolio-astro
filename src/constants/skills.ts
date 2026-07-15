export type Skill = {
  title: [string, string];
  chips: string[];
  description: string;
};

const skills: Skill[] = [
  {
    title: ['Payments', 'Money Movement'],
    chips: [
      'Stablecoins',
      'TRON',
      'Solana',
      'Ethereum',
      'Payment Infrastructure',
    ],
    description:
      'Systems that move money have no room for "mostly works." I build payment backends where every transaction is tracked from first sight to final settlement, and where a crash, a retry, or a chain reorg never counts the same deposit twice. Boring, careful, and correct is the whole point.',
  },
  {
    title: ['Backend', 'Data'],
    chips: ['Node.js', 'TypeScript', 'PostgreSQL', 'Redis', 'Queues'],
    description:
      'Most backend problems are really data problems. I spend my time on the layer underneath the API: schemas that stay honest as the product changes, queues that survive restarts, and queries that are still fast when a table hits its millionth row. TypeScript and Postgres are where I do my best work.',
  },
  {
    title: ['AI That', 'Ships'],
    chips: ['LLM Apps', 'Automation', 'Product Engineering'],
    description:
      "There's a wide gap between an impressive AI demo and a feature people rely on every day. I build on the far side of that gap: LLM-driven products with the retries, fallbacks, and guardrails to run unattended. The model is maybe a tenth of the work. The system around it is the rest.",
  },
  {
    title: ['End-to-End', 'Ownership'],
    chips: ['React', 'Next.js', 'Docker', 'AWS', 'System Design'],
    description:
      'I\'m most useful when I own the whole problem: design, backend, frontend, deployment. Small teams don\'t have room for "not my part of the stack," and I like it that way. Hand me something vague and I\'ll come back with something running.',
  },
];

export default skills;
