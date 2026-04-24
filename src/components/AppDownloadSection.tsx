import { QRCodeSVG } from "qrcode.react";
import { Apple, Smartphone } from "lucide-react";

const APP_STORE_URL = "https://apps.apple.com/se/app/homechef/id6753142886";
const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=app.lovable.211e56d1e9f5433c89dc4ce2d7998096";

const AppDownloadSection = () => {
  return (
    <section className="py-10 px-4">
      <div className="max-w-4xl mx-auto bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm">
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Ladda ner Homechef-appen
          </h2>
          <p className="text-muted-foreground text-sm md:text-base">
            Skanna QR-koden med din mobilkamera för att ladda ner
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Apple App Store */}
          <a
            href={APP_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-3 p-5 rounded-xl border border-border bg-background hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-2 text-foreground">
              <Apple className="w-5 h-5" />
              <span className="font-semibold">App Store</span>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <QRCodeSVG value={APP_STORE_URL} size={140} level="M" />
            </div>
            <p className="text-xs text-muted-foreground">För iPhone & iPad</p>
          </a>

          {/* Google Play */}
          <a
            href={PLAY_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-3 p-5 rounded-xl border border-border bg-background hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-2 text-foreground">
              <Smartphone className="w-5 h-5" />
              <span className="font-semibold">Google Play</span>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <QRCodeSVG value={PLAY_STORE_URL} size={140} level="M" />
            </div>
            <p className="text-xs text-muted-foreground">För Android</p>
          </a>
        </div>
      </div>
    </section>
  );
};

export default AppDownloadSection;
