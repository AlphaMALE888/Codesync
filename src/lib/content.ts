import { BaseEntity } from "@/data/types";

/**
 * Filter items according to the Content Status Rule:
 * - 'verified': Allowed in production and development.
 * - 'draft': Allowed with draft acknowledgment.
 * - 'pending': Stripped completely from production renders.
 */
export function renderable<T extends BaseEntity>(items: T[]): T[] {
  return items.filter((item) => {
    if (item.status === "pending") {
      return false;
    }
    // In production, also drop any items that are incomplete
    if (process.env.NODE_ENV === "production") {
      if (!item.id || !item.source) {
        return false;
      }
    }
    return true;
  });
}
