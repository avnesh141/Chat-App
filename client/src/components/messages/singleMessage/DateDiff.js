
 export function DateDiff(date) {
  const now = new Date();
  const diffMs = now - new Date(date);
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) return "just now";
  if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays === 1) return "yesterday";
  if (diffDays <= 7) return `${diffDays} days ago`;
  
  const d = new Date(date);
  const options = { day: 'numeric', month: 'short', year: now.getFullYear() !== d.getFullYear() ? 'numeric' : undefined };
  return d.toLocaleDateString(undefined, options);
}