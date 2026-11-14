import Link from "next/link";
import { paginationHref } from "@/lib/pagination";

type Props = {
  path: string;
  page: number;
  totalPages: number;
};

export default function Pagination({ path, page, totalPages }: Props) {
  if (totalPages <= 1) return null;

  return (
    <nav className="pagination" aria-label="Pagination">
      {page > 1 ? ( 
        <Link href={paginationHref(path, page - 1)} rel="prev"> 
          Previous
        </Link>
      ) : (
        <span aria-disabled="true">Previous</span>
      )}
      <p>
        Page {page} of {totalPages}
      </p>
      {page < totalPages ? (
        <Link href={paginationHref(path, page + 1)} rel="next">
          Next
        </Link>
      ) : (
        <span aria-disabled="true">Next</span>
      )}
    </nav>
  );
}
