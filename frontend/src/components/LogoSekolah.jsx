export default function LogoSekolah({ className = 'logo-sekolah' }) {
  return (
    <div className={className} aria-label="Logo Sekolah" title="Logo Sekolah">
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        <defs>
          <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e3a8a" />
            <stop offset="50%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>
          <filter id="logoShadow" x="-15%" y="-15%" width="130%" height="130%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.18" />
          </filter>
        </defs>

        {/* Perisai Lambang Sekolah */}
        <path
          d="M24 3.5L7 10V21.5C7 32.2 14.2 42.1 24 44.5C33.8 42.1 41 32.2 41 21.5V10L24 3.5Z"
          fill="url(#logoGrad)"
          filter="url(#logoShadow)"
        />

        {/* Bingkai Emas Dalam */}
        <path
          d="M24 6.8L10 12.2V21.5C10 30.3 16 38.6 24 40.8C32 38.6 38 30.3 38 21.5V12.2L24 6.8Z"
          fill="none"
          stroke="#fbbf24"
          strokeWidth="1.6"
          strokeOpacity="0.9"
        />

        {/* Bintang Prestasi */}
        <polygon
          points="24,10.5 25.4,14 29.1,14.3 26.3,16.7 27.2,20.3 24,18.3 20.8,20.3 21.7,16.7 18.9,14.3 22.6,14"
          fill="#fef08a"
        />

        {/* Buku Terbuka Ilmu Pengetahuan */}
        <path
          d="M24 24C21.2 22.3 17 22.3 14.5 23.3V31.5C17 30.5 21.2 30.5 24 32.2M24 24C26.8 22.3 31 22.3 33.5 23.3V31.5C31 30.5 26.8 30.5 24 32.2M24 24V32.2"
          stroke="#ffffff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Titik Cahaya Emas */}
        <circle cx="24" cy="21.5" r="1.3" fill="#facc15" />
      </svg>
    </div>
  );
}

