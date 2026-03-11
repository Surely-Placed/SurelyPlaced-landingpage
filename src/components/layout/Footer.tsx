export function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-white/80">
      <div className="container-narrow flex flex-col items-center justify-between gap-4 py-5 text-xs text-slate-500 sm:flex-row">
        <p>© {new Date().getFullYear()} SurelyPlaced. All rights reserved.</p>
        <p>Designed for high‑intent hiring leaders.</p>
      </div>
    </footer>
  );
}

