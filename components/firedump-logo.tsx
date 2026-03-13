type FireDumpLogoProps = {
  compact?: boolean;
};

export function FireDumpLogo({ compact = false }: FireDumpLogoProps) {
  return (
    <div className={`brand-lockup${compact ? " brand-lockup-compact" : ""}`}>
      <span className="brand-mark" aria-hidden="true">
        <svg viewBox="0 0 64 64" role="img">
          <defs>
            <linearGradient id="firedump-gradient" x1="12" y1="10" x2="52" y2="54">
              <stop offset="0%" stopColor="#f49b38" />
              <stop offset="100%" stopColor="#c53d1b" />
            </linearGradient>
          </defs>
          <rect
            x="6"
            y="6"
            width="52"
            height="52"
            rx="18"
            fill="#2d180d"
          />
          <path
            d="M20 39h24a2 2 0 0 1 2 2v5a4 4 0 0 1-4 4H22a4 4 0 0 1-4-4v-5a2 2 0 0 1 2-2Z"
            fill="#fff7eb"
          />
          <path
            d="M24 35h16a2 2 0 0 1 0 4H24a2 2 0 0 1 0-4Zm3-8h10a2 2 0 0 1 0 4H27a2 2 0 0 1 0-4Z"
            fill="#fff7eb"
            opacity="0.78"
          />
          <path
            d="M32 14c4 5 7 9 7 14 0 5-3.2 8.4-7 8.4s-7-3.4-7-8.4c0-3.7 1.7-7.1 5.1-10.7.8-.8 1.4-1.8 1.9-3.3Z"
            fill="url(#firedump-gradient)"
          />
          <path
            d="M33 20c2 2.5 3.3 4.7 3.3 7 0 2.6-1.6 4.6-4.3 5.5 1-.9 1.6-2.2 1.6-3.8 0-1.6-.8-3.4-2.4-5.5.8-.8 1.4-1.9 1.8-3.2Z"
            fill="#ffd27a"
          />
        </svg>
      </span>
      <span className="brand-copy">
        <strong className="brand-name">FireDump</strong>
        <span className="brand-tag">Firestore backups without the CLI detour</span>
      </span>
    </div>
  );
}
