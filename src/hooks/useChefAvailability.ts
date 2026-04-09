import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface OperatingHours {
  day_of_week: number;
  is_open: boolean;
  open_time: string;
  close_time: string;
}

interface ChefAvailabilityResult {
  isOpen: boolean;
  loading: boolean;
  nextOpenInfo: string | null; // e.g. "Mån 11:00"
}

const DAY_NAMES = ["Sön", "Mån", "Tis", "Ons", "Tor", "Fre", "Lör"];

/**
 * Check if a chef is currently accepting orders based on their operating hours.
 * Uses Swedish timezone (Europe/Stockholm).
 */
export function useChefAvailability(chefId: string | undefined): ChefAvailabilityResult {
  const [isOpen, setIsOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [nextOpenInfo, setNextOpenInfo] = useState<string | null>(null);

  useEffect(() => {
    if (!chefId) {
      setLoading(false);
      return;
    }

    const check = async () => {
      try {
        const { data, error } = await supabase
          .from("chef_operating_hours")
          .select("day_of_week, is_open, open_time, close_time")
          .eq("chef_id", chefId);

        if (error) throw error;

        if (!data || data.length === 0) {
          // No operating hours set = always open (backwards compat)
          setIsOpen(true);
          setLoading(false);
          return;
        }

        const result = checkAvailability(data);
        setIsOpen(result.isOpen);
        setNextOpenInfo(result.nextOpenInfo);
      } catch (err) {
        console.error("Error checking chef availability:", err);
        setIsOpen(true); // fail open
      } finally {
        setLoading(false);
      }
    };

    check();
  }, [chefId]);

  return { isOpen, loading, nextOpenInfo };
}

/**
 * Pure function to check availability from operating hours data.
 * Exported for use without hooks (e.g. in cart checkout).
 */
export function checkAvailability(hours: OperatingHours[]): { isOpen: boolean; nextOpenInfo: string | null } {
  const now = new Date();
  // Convert to Stockholm time
  const stockholm = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Stockholm",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    weekday: "short",
  }).formatToParts(now);

  const hourPart = stockholm.find(p => p.type === "hour")?.value || "0";
  const minutePart = stockholm.find(p => p.type === "minute")?.value || "0";
  

  const currentMinutes = parseInt(hourPart) * 60 + parseInt(minutePart);

  // Map JS weekday names to day_of_week (0=Sun..6=Sat matching JS getDay)
  // But we need Stockholm's day of week
  const stockholmDate = new Date(now.toLocaleString("en-US", { timeZone: "Europe/Stockholm" }));
  const currentDay = stockholmDate.getDay(); // 0=Sun

  const todayHours = hours.find(h => h.day_of_week === currentDay);

  if (todayHours && todayHours.is_open) {
    const [openH, openM] = todayHours.open_time.split(":").map(Number);
    const [closeH, closeM] = todayHours.close_time.split(":").map(Number);
    const openMinutes = openH * 60 + openM;
    const closeMinutes = closeH * 60 + closeM;

    if (currentMinutes >= openMinutes && currentMinutes < closeMinutes) {
      return { isOpen: true, nextOpenInfo: null };
    }
  }

  // Find next open slot
  const nextOpen = findNextOpen(hours, currentDay, currentMinutes);
  return { isOpen: false, nextOpenInfo: nextOpen };
}

function findNextOpen(hours: OperatingHours[], currentDay: number, currentMinutes: number): string | null {
  // Check remaining today first
  const todayHours = hours.find(h => h.day_of_week === currentDay);
  if (todayHours && todayHours.is_open) {
    const [openH, openM] = todayHours.open_time.split(":").map(Number);
    const openMinutes = openH * 60 + openM;
    if (currentMinutes < openMinutes) {
      return `Idag ${todayHours.open_time.substring(0, 5)}`;
    }
  }

  // Check upcoming days
  for (let i = 1; i <= 7; i++) {
    const day = (currentDay + i) % 7;
    const dayHours = hours.find(h => h.day_of_week === day);
    if (dayHours && dayHours.is_open) {
      return `${DAY_NAMES[day]} ${dayHours.open_time.substring(0, 5)}`;
    }
  }

  return null;
}

/**
 * Fetch and check availability for a chef by ID (non-hook version for imperative use).
 */
export async function isChefCurrentlyOpen(chefId: string): Promise<{ isOpen: boolean; nextOpenInfo: string | null }> {
  const { data, error } = await supabase
    .from("chef_operating_hours")
    .select("day_of_week, is_open, open_time, close_time")
    .eq("chef_id", chefId);

  if (error || !data || data.length === 0) {
    return { isOpen: true, nextOpenInfo: null }; // fail open / no hours set
  }

  return checkAvailability(data);
}
