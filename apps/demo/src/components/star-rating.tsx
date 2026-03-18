export function StarRating({ rating, max = 5, size = "sm" }: { rating: number; max?: number; size?: "sm" | "md" }) {
  const px = size === "sm" ? "12px" : "16px"
  return (
    <span className="inline-flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          style={{ fontSize: px, color: i < Math.round(rating) ? "#F59E0B" : "#3F3F46" }}
        >
          ★
        </span>
      ))}
    </span>
  )
}
