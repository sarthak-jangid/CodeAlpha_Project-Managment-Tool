import { Badge } from '../common/Badge';
import { PRIORITY_LABELS } from '../../utils/taskHelpers';
import type { TaskPriority } from '../../types';

export const PriorityBadge = ({ priority = 'medium' }: { priority?: TaskPriority }) => {
  return <Badge variant={priority}>{PRIORITY_LABELS[priority]}</Badge>;
};
