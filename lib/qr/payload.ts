/*
  Payload encoders and validation for the 13 launch types. The formats
  are the ones docs/PRD.md pins and they are verified by the decode test
  suite (P1-8), not trusted blindly:
    mailto:, tel:, SMSTO:number:message,
    WIFI:T:WPA;S:ssid;P:password;H:false;; with \ ; , : " escaping,
    vCard 3.0, geo:lat,lng, iCalendar VEVENT,
    upi://pay?pa=...&pn=...&am=...&cu=INR.
  Google review links come only from a user supplied Place ID or URL;
  the agent never invents a format for them.
*/

export type QrTypeSlug =
  | "url"
  | "text"
  | "email"
  | "phone"
  | "sms"
  | "wifi"
  | "vcard"
  | "location"
  | "event"
  | "upi"
  | "review"
  | "social"
  | "app-store";

export type FieldId = string;
export type FieldValues = Partial<Record<FieldId, string | boolean>>;

export type EncodeResult =
  | { ok: true; payload: string; errors: null }
  | { ok: false; payload: null; errors: Partial<Record<FieldId, string>> };

type FieldErrors = Partial<Record<FieldId, string>>;

function isBlank(value: string | boolean | undefined): boolean {
  return value === undefined || String(value).trim().length === 0;
}

function normalizePhone(value: string): string {
  return value.replace(/[\s().,-]/g, "");
}

/** Tiny query encoding: %20 for spaces, like a plain query string. */
function encodeQueryEntries(entries: [string, string][]): string {
  return entries
    .filter(([, value]) => value !== "")
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join("&");
}

/**
 * iCalendar timestamps use their own compact form. A datetime-local
 * value like 2026-03-01T10:30 becomes the floating stamp
 * 20260301T103000; no timezone is added without the user asking.
 */
function icsStamp(value: string): string | null {
  const trimmed = value.trim();
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(
    trimmed,
  );
  if (match) {
    const [, y, m, d, hh, mm, ss] = match as unknown as string[];
    return `${y}${m}${d}T${hh}${mm}${ss ?? "00"}`;
  }
  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
  if (dateOnly) {
    const [, y, m, d] = dateOnly as unknown as string[];
    return `${y}${m}${d}T000000`;
  }
  return null;
}

/** Escape per the ZXing Wi-Fi spec: \ ; , : " get a backslash prefix. */
function escapeWifi(value: string): string {
  return value.replace(/([\\;,:"])/g, "\\$1");
}

function normalizeUrl(raw: string): string {
  return /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(raw) ? raw : `https://${raw}`;
}

export const socialPlatforms: { value: string; label: string; base: string }[] = [
  { value: "instagram", label: "Instagram", base: "https://instagram.com/" },
  { value: "x", label: "X (Twitter)", base: "https://x.com/" },
  { value: "facebook", label: "Facebook", base: "https://facebook.com/" },
  { value: "linkedin", label: "LinkedIn", base: "https://linkedin.com/in/" },
  { value: "youtube", label: "YouTube", base: "https://youtube.com/@" },
  { value: "tiktok", label: "TikTok", base: "https://tiktok.com/@" },
  { value: "pinterest", label: "Pinterest", base: "https://pinterest.com/" },
  { value: "github", label: "GitHub", base: "https://github.com/" },
];

/*
  Encoders assume their format-invariant checks already passed through
  the per-type validators below. They return "" when a required field
  is missing so encodePayload reports it as invalid overall.
*/

const encoders: Record<QrTypeSlug, (values: FieldValues) => string> = {
  url: (values) => (isBlank(values.url) ? "" : normalizeUrl(String(values.url).trim())),
  text: (values) => String(values.text ?? "").trim(),
  email: (values) => {
    const to = String(values.to ?? "").trim();
    if (!to) return "";
    const query = encodeQueryEntries([
      ["subject", String(values.subject ?? "")],
      ["body", String(values.body ?? "")],
    ]);
    return `mailto:${to}${query ? `?${query}` : ""}`;
  },
  phone: (values) => {
    const number = normalizePhone(String(values.number ?? ""));
    return number ? `tel:${number}` : "";
  },
  sms: (values) => {
    const number = normalizePhone(String(values.number ?? ""));
    return number ? `SMSTO:${number}:${values.message ?? ""}` : "";
  },
  wifi: (values) => {
    const ssid = String(values.ssid ?? "");
    if (!ssid) return "";
    const security = String(values.security ?? "WPA");
    const hidden = values.hidden ? "true" : "false";
    if (security === "nopass") {
      return `WIFI:T:nopass;S:${escapeWifi(ssid)};H:${hidden};;`;
    }
    const password = String(values.password ?? "");
    return `WIFI:T:${security};S:${escapeWifi(ssid)};P:${escapeWifi(password)};H:${hidden};;`;
  },
  vcard: (values) => {
    const firstName = String(values.firstName ?? "").trim();
    const lastName = String(values.lastName ?? "").trim();
    if (!firstName && !lastName) return "";
    const lines = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `N:${lastName};${firstName};;;`,
      `FN:${`${firstName} ${lastName}`.trim()}`,
    ];
    if (!isBlank(values.org)) lines.push(`ORG:${values.org}`);
    if (!isBlank(values.title)) lines.push(`TITLE:${values.title}`);
    if (!isBlank(values.phone)) lines.push(`TEL;TYPE=CELL:${values.phone}`);
    if (!isBlank(values.email)) lines.push(`EMAIL:${values.email}`);
    if (!isBlank(values.website)) lines.push(`URL:${values.website}`);
    if (!isBlank(values.address)) lines.push(`ADR;TYPE=HOME:;;${values.address};;;;`);
    lines.push("END:VCARD");
    return lines.join("\r\n");
  },
  location: (values) => {
    const lat = String(values.lat ?? "").trim();
    const lng = String(values.lng ?? "").trim();
    return lat && lng ? `geo:${lat},${lng}` : "";
  },
  event: (values) => {
    const title = String(values.title ?? "").trim();
    if (!title) return "";
    const start = values.start ? icsStamp(String(values.start)) : "";
    if (start === null) return "";
    const end = values.end ? icsStamp(String(values.end)) : start;
    if (end === null) return "";
    const lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Signet//QR generator//EN",
      "BEGIN:VEVENT",
      `SUMMARY:${title}`,
    ];
    if (!isBlank(values.location)) lines.push(`LOCATION:${values.location}`);
    if (!isBlank(values.description)) lines.push(`DESCRIPTION:${values.description}`);
    lines.push(`DTSTART:${start}`, `DTEND:${end}`, "END:VEVENT", "END:VCALENDAR");
    return lines.join("\n");
  },
  upi: (values) => {
    const pa = String(values.pa ?? "").trim();
    if (!pa) return "";
    const query = encodeQueryEntries([
      ["pa", pa],
      ["pn", String(values.pn ?? "")],
      ["am", String(values.am ?? "")],
      ["cu", "INR"],
      ["tn", String(values.tn ?? "")],
    ]);
    return `upi://pay?${query}`;
  },
  review: (values) => String(values.link ?? "").trim(),
  social: (values) => {
    const platform = socialPlatforms.find(
      (item) => item.value === values.platform,
    );
    const handle = String(values.handle ?? "").trim().replace(/^@/, "");
    return platform && handle ? `${platform.base}${handle}` : "";
  },
  "app-store": (values) => String(values.link ?? "").trim(),
};

/*
  Per-type validators return specific, fixable error messages. Empty
  required fields are handled generically by the field registry, so
  validators here only check shapes and ranges.
*/

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const isoUrlHostPattern = /^[a-z0-9][a-z0-9.-]*[a-z0-9]$/i;

const validators: Partial<
  Record<QrTypeSlug, (values: FieldValues) => FieldErrors | null>
> = {
  url: (values) => {
    const raw = String(values.url ?? "").trim();
    if (!raw) return null;
    try {
      const parsed = new URL(normalizeUrl(raw));
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        return {
          url: "Use a web address like example.com/menu.",
        };
      }
      if (!isoUrlHostPattern.test(parsed.hostname)) {
        return { url: "Use a web address like example.com/menu." };
      }
      return null;
    } catch {
      return { url: "Use a web address like example.com/menu." };
    }
  },
  email: (values) => {
    const to = String(values.to ?? "").trim();
    if (!emailPattern.test(to)) {
      return { to: "Use an email address like a.person@business.example." };
    }
    return null;
  },
  phone: (values) => {
    const number = normalizePhone(String(values.number ?? ""));
    if (!/^\+?\d{7,15}$/.test(number)) {
      return {
        number: "Use a phone number with digits, spaces or dashes only.",
      };
    }
    return null;
  },
  sms: (values) => {
    const number = normalizePhone(String(values.number ?? ""));
    if (!/^\+?\d{7,15}$/.test(number)) {
      return {
        number: "Use a phone number with digits, spaces or dashes only.",
      };
    }
    return null;
  },
  vcard: (values) => {
    const email = String(values.email ?? "");
    if (email && !emailPattern.test(email)) {
      return { email: "Use a valid email or leave the field empty." };
    }
    return null;
  },
  location: (values) => {
    if (isBlank(values.lat) || isBlank(values.lng)) return null;
    const lat = Number(values.lat);
    const lng = Number(values.lng);
    const errors: FieldErrors = {};
    if (!Number.isFinite(lat) || lat < -90 || lat > 90) {
      errors.lat = "Latitude is a number between -90 and 90.";
    }
    if (!Number.isFinite(lng) || lng < -180 || lng > 180) {
      errors.lng = "Longitude is a number between -180 and 180.";
    }
    return Object.keys(errors).length > 0 ? errors : null;
  },
  event: (values) => {
    const errors: FieldErrors = {};
    if (!isBlank(values.start) && Number.isNaN(new Date(String(values.start)).getTime())) {
      errors.start = "Use the date picker or a recognisable date string.";
    }
    if (!isBlank(values.end) && Number.isNaN(new Date(String(values.end)).getTime())) {
      errors.end = "Use the date picker or a recognisable date string.";
    }
    return Object.keys(errors).length > 0 ? errors : null;
  },
  upi: (values) => {
    const errors: FieldErrors = {};
    const pa = String(values.pa ?? "").trim();
    if (pa && !pa.includes("@")) {
      errors.pa = "A UPI ID looks like name@bank, for example shop@upi.";
    }
    if (!isBlank(values.am)) {
      const amount = Number(values.am);
      if (!Number.isFinite(amount) || amount <= 0) {
        errors.am = "Amount is a positive number. Leave it empty and the customer types the amount.";
      }
    }
    return Object.keys(errors).length > 0 ? errors : null;
  },
  review: (values) => {
    const link = String(values.link ?? "").trim();
    if (!link) return null;
    if (/^https?:\/\//i.test(link)) return null;
    return {
      link: `Use your Google review page URL, or a writereview link with your Place ID, like https://search.google.com/local/writereview?placeid=YOUR_ID`,
    };
  },
  "app-store": (values) => {
    const link = String(values.link ?? "").trim();
    if (!link) return null;
    if (/^https?:\/\/(apps\.apple\.com|play\.google\.com)/i.test(link)) {
      return null;
    }
    return {
      link: "Use an App Store or Google Play listing URL, like https://apps.apple.com/app/id123 or https://play.google.com/store/apps/details?id=com.example.app.",
    };
  },
};

/**
 * Encode one type's field values to the final QR string. Returns either
 * the payload or per-field error messages; the generator shows these
 * inline next to the fields.
 */
export function encodePayload(
  type: QrTypeSlug,
  values: FieldValues,
): EncodeResult {
  let errors: FieldErrors | null = null;
  const validator = validators[type];
  if (validator) {
    errors = validator(values) ?? null;
  }

  const payload = encoders[type](values);
  if (payload === "" && !errors) {
    // Missing required field: the registry marks it, encodePayload only
    // needs to fail invalid overall without naming more errors.
    errors = {};
  }

  const ok =
    payload !== "" && (!errors || Object.keys(errors).length === 0);
  if (ok) {
    return { ok: true, payload, errors: null };
  }
  return { ok: false, payload: null, errors: errors ?? {} };
}
