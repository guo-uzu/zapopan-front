export default function parseSearchQuery(search: string) {
  const parts = search
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  const text: string[] = [];
  const labels: string[] = [];

  for (const part of parts) {
    if (part.startsWith("#")) {
      const label = part.slice(1).trim();

      if (label) {
        labels.push(label);
      }
    } else {
      text.push(part);
    }
  }

  return {
    text,
    labels,
  };
}
