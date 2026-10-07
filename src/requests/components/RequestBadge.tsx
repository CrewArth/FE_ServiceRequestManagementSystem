import { Badge } from '../../common/components/Badge';

export const requestLabel = (value: string) => value.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase());

export function RequestBadge({ value, kind }: { value: string; kind: 'status' | 'priority' }) {
  const tone = kind === 'status'
    ? value === 'RESOLVED' ? 'green' : value === 'IN_PROGRESS' ? 'amber' : 'blue'
    : value === 'HIGH' ? 'red' : value === 'MEDIUM' ? 'amber' : 'slate';
  return <Badge tone={tone}>{requestLabel(value)}</Badge>;
}
