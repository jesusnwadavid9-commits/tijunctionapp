import { firestore } from '@/firebase/config';
import { reportsRef } from '@/firebase/collections';
import type { ReportTargetType } from '@/types';

export async function submitReport(
  reporterId: string,
  targetType: ReportTargetType,
  targetId: string,
  reason: string,
): Promise<void> {
  await reportsRef().add({
    reporterId,
    targetType,
    targetId,
    reason,
    status: 'pending',
    createdAt: firestore.FieldValue.serverTimestamp(),
  });
}
