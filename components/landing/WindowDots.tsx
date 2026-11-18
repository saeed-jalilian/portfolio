/** The three window-chrome dots; `className` sets their size and color. */
export function WindowDots({ className }: { className: string }) {
  return (
    <>
      {[0, 1, 2].map((i) => (
        <span key={i} className={`rounded-full ${className}`} />
      ))}
    </>
  );
}
