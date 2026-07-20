/** Skeleton de chargement global (design-system §3.8, rectangles pulsants). */
export default function Loading() {
  return (
    <div className="mx-auto max-w-container px-md py-2xl lg:px-xl" aria-hidden="true">
      <div className="mb-lg h-8 w-1/3 animate-pulse rounded-md bg-surface-muted" />
      <div className="grid grid-cols-1 gap-lg sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-40 animate-pulse rounded-lg bg-surface-muted" />
        ))}
      </div>
    </div>
  );
}
