
const WORDS_PER_MINUTE = 200;

// Returns whole minutes, never less than 1.
export function getReadingTime(markdown: string) {
  const text = markdown
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ") // images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // links -> just the link text
    .replace(/[#>*_`~|-]/g, " "); // Markdown symbols

  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}