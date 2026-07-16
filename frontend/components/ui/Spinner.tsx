export default function Spinner({ className = '' }: Readonly<{ className?: string }>) {
  return (
    <div
      className={`animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 ${className}`}
    />
  );
}