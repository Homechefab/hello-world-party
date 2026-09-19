import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  getStoredConsent,
  isConsentRequiredRegion,
  setConsent,
  subscribeConsent,
} from "@/lib/consent";
import { enableAdTracking } from "@/lib/tracking";

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let active = true;

    const init = async () => {
      const stored = getStoredConsent();
      if (stored === "granted") {
        enableAdTracking();
        return;
      }
      if (stored === "denied") return;

      const consentRequired = await isConsentRequiredRegion();
      if (!active) return;

      if (!consentRequired) {
        enableAdTracking();
        return;
      }

      setVisible(true);
    };

    void init();

    const unsubscribe = subscribeConsent((choice) => {
      if (choice === "granted") enableAdTracking();
      setVisible(false);
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[100] p-3 sm:p-4">
      <div className="mx-auto max-w-3xl rounded-xl border bg-card p-4 shadow-lg">
        <p className="text-sm text-muted-foreground">
          Vi använder cookies för att mäta och förbättra vår marknadsföring (Meta och TikTok).
          Du väljer själv och kan ändra dig när du vill.{" "}
          <Link to="/privacy" className="underline">
            Läs mer i integritetspolicyn
          </Link>
          .
        </p>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={() => setConsent("denied")} className="sm:w-auto">
            Neka
          </Button>
          <Button onClick={() => setConsent("granted")} className="sm:w-auto">
            Godkänn
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
