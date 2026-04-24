const APP_STORE_URL = "https://apps.apple.com/se/app/homechef/id6753142886";
const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=app.lovable.211e56d1e9f5433c89dc4ce2d7998096";

const AppStoreBadge = () => (
  <svg viewBox="0 0 180 60" className="h-14 w-auto" xmlns="http://www.w3.org/2000/svg" aria-label="Hämta i App Store">
    <rect x="1" y="1" width="178" height="58" rx="10" fill="#000" stroke="#A6A6A6" strokeWidth="1" />
    {/* Apple logo */}
    <path
      transform="translate(14, 14) scale(0.055)"
      fill="#fff"
      d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"
    />
    <text x="46" y="25" fill="#fff" fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" fontSize="9">
      Hämta i
    </text>
    <text x="46" y="44" fill="#fff" fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" fontSize="19" fontWeight="500">
      App Store
    </text>
  </svg>
);

const GooglePlayBadge = () => (
  <svg viewBox="0 0 200 60" className="h-14 w-auto" xmlns="http://www.w3.org/2000/svg" aria-label="Ladda ned på Google Play">
    <rect x="1" y="1" width="198" height="58" rx="10" fill="#000" stroke="#A6A6A6" strokeWidth="1" />
    {/* Google Play triangle */}
    <g transform="translate(14, 14)">
      <path d="M0 0 L0 32 L17 16 Z" fill="#00D7B5" />
      <path d="M0 0 L17 16 L24 9 Z" fill="#FFCE00" opacity="0.95" />
      <path d="M0 32 L17 16 L24 23 Z" fill="#FF3A44" opacity="0.95" />
      <path d="M17 16 L24 9 L24 23 Z" fill="#FFA000" />
      <path d="M0 0 L0 32 L17 16 Z" fill="url(#playGrad)" />
      <defs>
        <linearGradient id="playGrad" x1="0" y1="0" x2="17" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#00E0FF" />
          <stop offset="1" stopColor="#00B36B" />
        </linearGradient>
      </defs>
    </g>
    <text x="50" y="25" fill="#fff" fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" fontSize="9">
      LADDA NED PÅ
    </text>
    <text x="50" y="44" fill="#fff" fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" fontSize="18" fontWeight="500">
      Google Play
    </text>
  </svg>
);

const AppDownloadSection = () => {
  return (
    <section className="py-10 px-4">
      <div className="max-w-4xl mx-auto bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm">
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Ladda ner Homechef-appen
          </h2>
          <p className="text-muted-foreground text-sm md:text-base">
            Tillgänglig för iPhone och Android
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={APP_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-80 transition-opacity"
          >
            <AppStoreBadge />
          </a>
          <a
            href={PLAY_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-80 transition-opacity"
          >
            <GooglePlayBadge />
          </a>
        </div>
      </div>
    </section>
  );
};

export default AppDownloadSection;
