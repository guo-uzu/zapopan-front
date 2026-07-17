import { getResponses } from "../data/getResponses";

const fetchResponses = async (debouncedText: string) => {
  const separatedText = debouncedText.split(",").map((e) => e.trim());
  const tags = separatedText.filter((e) => e.includes("#"));
  const plainText = separatedText.filter((e) => !e.includes("#"));

  const jsonBFormat = tags.map((e) => {
    return { label: `${e.slice(1, e.length)}` };
  });
  const multipleSearchFormat = plainText.join("|");

  try {
    const data = await getResponses(multipleSearchFormat, jsonBFormat);
    return data;
  } catch {}
};

export { fetchResponses };
