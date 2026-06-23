export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="pagination">
      <button
        className="btn btn--sm btn--outline"
        disabled={page === 0}
        onClick={() => onPageChange(page - 1)}
      >
        이전
      </button>
      <span className="pagination-info">{page + 1} / {totalPages}</span>
      <button
        className="btn btn--sm btn--outline"
        disabled={page + 1 >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        다음
      </button>
    </div>
  );
}
