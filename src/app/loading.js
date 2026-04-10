export default function GlobalLoading() {
  return (
    <div className="fixed top-0 left-0 w-full z-[9999]">
      {/* Brand Red Top Progress Bar */}
      <div className="top-loading-bar" />
      
      {/* Subtle Overlay to prevent double clicks */}
      <div className="fixed inset-0 bg-white/10 pointer-events-none" />
    </div>
  );
}
