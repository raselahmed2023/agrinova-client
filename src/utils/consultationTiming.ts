import type { Consultation } from "@/types/consultation";

export const CONSULTATION_DURATION_MINUTES = 30;
export const CONSULTATION_DURATION_MS = CONSULTATION_DURATION_MINUTES * 60 * 1000;

/**
 * Parses the start timestamp (in ms) from a consultation object.
 */
export function parseConsultationStartTime(consultation: Consultation): number | null {
  if (!consultation) return null;

  // 1. Started time has highest priority for actual call inception
  if (consultation.startedAt) {
    const d = new Date(consultation.startedAt);
    if (!isNaN(d.getTime())) return d.getTime();
  }

  // 2. Scheduled exact timestamp
  if (consultation.scheduledAt) {
    const d = new Date(consultation.scheduledAt);
    if (!isNaN(d.getTime())) return d.getTime();
  }

  // 3. scheduledDate + scheduledTime, or scheduledDate alone (e.g. ISO date string)
  if (consultation.scheduledDate) {
    if (consultation.scheduledTime) {
      const parsed = parseDateAndTime(consultation.scheduledDate, consultation.scheduledTime);
      if (parsed) return parsed.getTime();
    }
    const d = new Date(consultation.scheduledDate);
    if (!isNaN(d.getTime())) return d.getTime();
  }

  // 4. preferredDate + preferredTime (fallback for pending/accepted)
  if (consultation.preferredDate) {
    if (consultation.preferredTime) {
      const parsed = parseDateAndTime(consultation.preferredDate, consultation.preferredTime);
      if (parsed) return parsed.getTime();
    }
    const d = new Date(consultation.preferredDate);
    if (!isNaN(d.getTime())) return d.getTime();
  }

  // 5. Fallback for updatedAt, createdAt, or ObjectId timestamp
  const fallback = consultation.updatedAt || consultation.createdAt;
  if (fallback) {
    const d = new Date(fallback);
    if (!isNaN(d.getTime())) return d.getTime();
  }

  const idStr = consultation._id || consultation.id;
  if (idStr && idStr.length === 24) {
    const timestamp = parseInt(idStr.substring(0, 8), 16) * 1000;
    if (!isNaN(timestamp)) return timestamp;
  }

  return null;
}

function parseDateAndTime(dateStr: string, timeStr: string): Date | null {
  try {
    let hours = 0;
    let minutes = 0;

    const timeMatch = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
    if (timeMatch) {
      hours = parseInt(timeMatch[1], 10);
      minutes = parseInt(timeMatch[2], 10);
      const meridiem = timeMatch[3]?.toUpperCase();
      if (meridiem === "PM" && hours < 12) hours += 12;
      if (meridiem === "AM" && hours === 12) hours = 0;
    } else {
      return null;
    }

    // Try ISO format (YYYY-MM-DD)
    const isoParts = dateStr.split("-").map(Number);
    if (isoParts.length === 3 && !isNaN(isoParts[0]) && !isNaN(isoParts[1]) && !isNaN(isoParts[2])) {
      return new Date(isoParts[0], isoParts[1] - 1, isoParts[2], hours, minutes, 0, 0);
    }

    // Try standard date parsing (e.g., "31 Aug 2026", "Sep 1, 2026")
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      d.setHours(hours, minutes, 0, 0);
      return d;
    }
  } catch {
    // Parsing error
  }
  return null;
}

export interface ConsultationTimingInfo {
  isOngoing: boolean;
  isUpcoming: boolean;
  isMissedOrIncomplete: boolean;
  isCompleted: boolean;
  isTerminal: boolean;
  startTime: number | null;
  endTime: number | null;
  remainingMs: number;
  remainingSeconds: number;
  formattedRemaining: string; // e.g. "28:45"
  progressPercent: number; // 0 to 100
  canReschedule: boolean;
}

/**
 * Computes live 30-minute timing status for a consultation.
 */
export function getConsultationOngoingInfo(
  consultation: Consultation,
  now: number = Date.now()
): ConsultationTimingInfo {
  const isCompleted = consultation.status === "COMPLETED";
  const isTerminal = ["COMPLETED", "CANCELLED", "REJECTED"].includes(consultation.status);

  const startTime = parseConsultationStartTime(consultation);

  if (!startTime || isTerminal) {
    return {
      isOngoing: false,
      isUpcoming: false,
      isMissedOrIncomplete: false,
      isCompleted,
      isTerminal,
      startTime,
      endTime: startTime ? startTime + CONSULTATION_DURATION_MS : null,
      remainingMs: 0,
      remainingSeconds: 0,
      formattedRemaining: "00:00",
      progressPercent: isCompleted ? 100 : 0,
      canReschedule: false,
    };
  }

  const endTime = startTime + CONSULTATION_DURATION_MS;
  const elapsedMs = now - startTime;
  const remainingMs = endTime - now;
  const isExpired = remainingMs <= 0;

  // Active during 30-minute ongoing session:
  // - If status is explicitly ONGOING and 30 minutes haven't passed
  // - OR status is SCHEDULED and now is within [startTime, endTime]
  const isOngoing =
    (consultation.status === "ONGOING" && !isExpired) ||
    (consultation.status === "SCHEDULED" && now >= startTime && !isExpired);

  const isUpcoming = (consultation.status === "SCHEDULED" || consultation.status === "ACCEPTED") && now < startTime;

  // If the 30-minute window passed and expert didn't mark as complete:
  const isMissedOrIncomplete = isExpired && !isTerminal;

  const remainingSeconds = Math.max(0, Math.floor(remainingMs / 1000));
  const mins = Math.floor(remainingSeconds / 60);
  const secs = remainingSeconds % 60;
  const formattedRemaining = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

  const progressPercent = Math.min(100, Math.max(0, (elapsedMs / CONSULTATION_DURATION_MS) * 100));

  // Farmer can reschedule if session was missed / not completed by expert, or if it's upcoming
  const canReschedule = isMissedOrIncomplete || isUpcoming;

  return {
    isOngoing,
    isUpcoming,
    isMissedOrIncomplete,
    isCompleted,
    isTerminal,
    startTime,
    endTime,
    remainingMs: Math.max(0, remainingMs),
    remainingSeconds,
    formattedRemaining,
    progressPercent: Math.round(progressPercent),
    canReschedule,
  };
}
