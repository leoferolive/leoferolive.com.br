import type { StackGroupData } from '@/data/stack';

export function StackGroup({ group }: { group: StackGroupData }) {
  return (
    <div>
      <h3 className="font-bold text-accent">{group.name}</h3>
      <ul className="mt-2 space-y-0.5 text-sm">
        {group.items.map((item, i) => {
          const last = i === group.items.length - 1;
          return (
            <li key={item} className="text-text-muted hover:text-text-primary transition-colors">
              <span className="text-text-faint">{last ? '└── ' : '├── '}</span>
              {item}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
