export const toTimestamp = (v: unknown): number | null => {
    if (v == null) return null;
    if (v instanceof Date) return isNaN(v.getTime()) ? null : v.getTime();
    if (typeof v === "number") return isNaN(v) ? null : v; // already ms
    const d = new Date(String(v)); // string -> Date
    return isNaN(d.getTime()) ? null : d.getTime();
};
