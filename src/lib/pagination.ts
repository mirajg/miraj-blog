export function parsePageNumber(
  value: string | string[] | undefined,
): number | null {
  if (value === undefined) return 1;
  if (typeof value !== "string" || !/^[1-9]\d*$/.test(value)) return null;

  const page = Number(value);
  return Number.isSafeInteger(page) ? page : null;
}

export function paginationHref(path: string, page: number) {
  return page === 1 ? path : `${path}?page=${page}`;
}
  