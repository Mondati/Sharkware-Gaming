export default function Skeleton({ width = '100%', height = 16, radius = 6, style }) {
  return (
    <div
      className="sw-skeleton"
      style={{
        width,
        height,
        borderRadius: radius,
        ...style,
      }}
      aria-hidden="true"
    />
  );
}
