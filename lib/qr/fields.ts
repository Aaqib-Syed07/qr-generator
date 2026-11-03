import type { FieldValues, QrTypeSlug } from "./payload";
import { encodePayload } from "./payload";

/*
  The type registry per docs/PRD.md P1-2: form fields, validation notes
  and payload assembly for the 13 launch types. The generator renders
  every type's form from these definitions, so a new type is a new
  entry, not a new component.
*/

export type TextFieldDef = {
  kind: "text" | "textarea" | "url" | "email" | "tel" | "number" | "date" | "datetime-local";
  id: string;
  label: string;
  required: boolean;
  placeholder?: string;
  helper?: string;
};

export type SelectDef = {
  kind: "select";
  id: string;
  label: string;
  required: boolean;
  helper?: string;
  options: { value: string; label: string }[];
};

export type SwitchDef = {
  kind: "switch";
  id: string;
  label: string;
  helper?: string;
};

export type FieldDef = TextFieldDef | SelectDef | SwitchDef;

export type TypeDefinition = {
  slug: QrTypeSlug;
  fields: FieldDef[];
  /** Prefilled values for the first render of a fresh code. */
  defaults: Record<string, string | boolean>;
  /** Long form like vCard: the panel collapses to a single summary tab. */
  summaryLabel?: string;
};

const REQUIRED_MARK = "Required.";

const smallSecurityOptions = [
  { value: "WPA", label: "WPA or WPA2, most networks" },
  { value: "WEP", label: "WEP, older routers" },
  { value: "nopass", label: "Open, no password" },
];

export const typeDefinitions: Record<QrTypeSlug, TypeDefinition> = {
  url: {
    slug: "url",
    fields: [
      {
        kind: "url",
        id: "url",
        label: "Destination URL",
        required: true,
        placeholder: "https://example.com/menu",
        helper: "This link is what the code opens. A short link like example.com fits better in a smaller code.",
      },
    ],
    defaults: { url: "" },
  },
  text: {
    slug: "text",
    fields: [
      {
        kind: "textarea",
        id: "text",
        label: "Message",
        required: true,
        placeholder: "Welcome! Today's special",
        helper: "Shown as plain text when scanned. Keep it short so the code stays dense.",
      },
    ],
    defaults: { text: "" },
  },
  email: {
    slug: "email",
    fields: [
      {
        kind: "email",
        id: "to",
        label: "To",
        required: true,
        placeholder: "hello@cafe.example",
        helper: REQUIRED_MARK + " The scanner opens a new email to this address.",
      },
      {
        kind: "text",
        id: "subject",
        label: "Subject",
        required: false,
        placeholder: "Table booking",
        helper: "Pre-filled, the customer can still change it.",
      },
      {
        kind: "textarea",
        id: "body",
        label: "Message",
        required: false,
        placeholder: "Hi, I would like to book a table for",
      },
    ],
    defaults: { to: "", subject: "", body: "" },
  },
  phone: {
    slug: "phone",
    fields: [
      {
        kind: "tel",
        id: "number",
        label: "Phone number",
        required: true,
        placeholder: "+91 98765 43210",
        helper: REQUIRED_MARK + " Digits, spaces and dashes are fine. One tap to dial.",
      },
    ],
    defaults: { number: "" },
  },
  sms: {
    slug: "sms",
    fields: [
      {
        kind: "tel",
        id: "number",
        label: "Phone number",
        required: true,
        placeholder: "+91 98765 43210",
        helper: REQUIRED_MARK,
      },
      {
        kind: "textarea",
        id: "message",
        label: "Text message",
        required: false,
        placeholder: "Feedback STOP to opt out",
        helper: "Pre-filled, the customer can still change it.",
      },
    ],
    defaults: { number: "", message: "" },
  },
  wifi: {
    slug: "wifi",
    fields: [
      {
        kind: "text",
        id: "ssid",
        label: "Network name, SSID",
        required: true,
        placeholder: "Cafe Guest WiFi",
        helper: REQUIRED_MARK + " Exactly as written on the router label.",
      },
      {
        kind: "select",
        id: "security",
        label: "Security type",
        required: true,
        helper: "WPA or WPA2 fits almost every network. Check the router label.",
        options: smallSecurityOptions,
      },
      {
        kind: "text",
        id: "password",
        label: "Password",
        required: false,
        placeholder: "",
        helper: "Encoded into the code, not stored. Hidden network passwords are never kept in the browser history.",
      },
      {
        kind: "switch",
        id: "hidden",
        label: "Network is hidden",
        helper: "Only turn on if the router label says hidden.",
      },
    ],
    defaults: { ssid: "", security: "WPA", password: "", hidden: false },
    summaryLabel: "Wi-Fi details",
  },
  vcard: {
    slug: "vcard",
    fields: [
      {
        kind: "text",
        id: "firstName",
        label: "First name",
        required: true,
        placeholder: "Asha",
        helper: "Fill at least one of first and last name.",
      },
      {
        kind: "text",
        id: "lastName",
        label: "Last name",
        required: true,
        placeholder: "Rao",
      },
      {
        kind: "text",
        id: "org",
        label: "Business or organisation",
        required: false,
        placeholder: "Asha Textiles",
      },
      {
        kind: "text",
        id: "title",
        label: "Job title",
        required: false,
        placeholder: "Owner",
      },
      {
        kind: "tel",
        id: "phone",
        label: "Mobile number",
        required: false,
        placeholder: "+91 98765 43210",
      },
      {
        kind: "email",
        id: "email",
        label: "Email",
        required: false,
        placeholder: "asha@ashatextiles.example",
      },
      {
        kind: "url",
        id: "website",
        label: "Website",
        required: false,
        placeholder: "https://ashatextiles.example",
      },
      {
        kind: "textarea",
        id: "address",
        label: "Shop address",
        required: false,
        placeholder: "12, Main Road, Coimbatore",
      },
    ],
    defaults: {
      firstName: "",
      lastName: "",
      org: "",
      title: "",
      phone: "",
      email: "",
      website: "",
      address: "",
    },
    summaryLabel: "Contact details",
  },
  location: {
    slug: "location",
    fields: [
      {
        kind: "text",
        id: "lat",
        label: "Latitude",
        required: true,
        placeholder: "11.016844",
        helper: "Between -90 and 90. Google Maps shows it as the first number after the @ sign.",
      },
      {
        kind: "text",
        id: "lng",
        label: "Longitude",
        required: true,
        placeholder: "76.955833",
        helper: "Between -180 and 180, the second number after the @ sign.",
      },
    ],
    defaults: { lat: "", lng: "" },
  },
  event: {
    slug: "event",
    fields: [
      {
        kind: "text",
        id: "title",
        label: "Event name",
        required: true,
        placeholder: "Sunday workshop",
        helper: REQUIRED_MARK,
      },
      {
        kind: "datetime-local",
        id: "start",
        label: "Starts",
        required: true,
        helper: REQUIRED_MARK,
      },
      {
        kind: "datetime-local",
        id: "end",
        label: "Ends",
        required: false,
        helper: "Leave empty for a same time event.",
      },
      {
        kind: "text",
        id: "location",
        label: "Venue",
        required: false,
        placeholder: "Community hall, MG Road",
      },
      {
        kind: "textarea",
        id: "description",
        label: "Details",
        required: false,
        placeholder: "Bring your laptop.",
      },
    ],
    defaults: { title: "", start: "", end: "", location: "", description: "" },
  },
  upi: {
    slug: "upi",
    fields: [
      {
        kind: "text",
        id: "pa",
        label: "UPI ID",
        required: true,
        placeholder: "shop@upi",
        helper: REQUIRED_MARK + " Copy it from your UPI app. The code only opens a payment sheet, it never moves money by itself.",
      },
      {
        kind: "text",
        id: "pn",
        label: "Payee name",
        required: false,
        placeholder: "Asha Textiles",
        helper: "Shown on the payment confirmation screen.",
      },
      {
        kind: "number",
        id: "am",
        label: "Fixed amount in rupees",
        required: false,
        placeholder: "199",
        helper: "Leave empty and the customer types the amount.",
      },
      {
        kind: "text",
        id: "tn",
        label: "Note",
        required: false,
        placeholder: "Table 4 order",
        helper: "Appears as the payment reference.",
      },
    ],
    defaults: { pa: "", pn: "", am: "", tn: "" },
  },
  review: {
    slug: "review",
    fields: [
      {
        kind: "url",
        id: "link",
        label: "Your review link",
        required: true,
        placeholder: "https://search.google.com/local/writereview?placeid=YOUR_PLACE_ID",
        helper: "Find it in your Google Business Profile: the review button URL, or a writereview link with your Place ID. Any Google Maps link that opens your listing works too.",
      },
    ],
    defaults: { link: "" },
  },
  social: {
    slug: "social",
    fields: [
      {
        kind: "select",
        id: "platform",
        label: "Platform",
        required: true,
        helper: "The link opens the profile, in the app when installed.",
        options: [
          { value: "instagram", label: "Instagram" },
          { value: "x", label: "X (Twitter)" },
          { value: "facebook", label: "Facebook" },
          { value: "linkedin", label: "LinkedIn" },
          { value: "youtube", label: "YouTube" },
          { value: "tiktok", label: "TikTok" },
          { value: "pinterest", label: "Pinterest" },
          { value: "github", label: "GitHub" },
        ],
      },
      {
        kind: "text",
        id: "handle",
        label: "Username or handle",
        required: true,
        placeholder: "ashatextiles",
        helper: "Without the @ sign and without the full URL.",
      },
    ],
    defaults: { platform: "instagram", handle: "" },
  },
  "app-store": {
    slug: "app-store",
    fields: [
      {
        kind: "url",
        id: "link",
        label: "Store listing URL",
        required: true,
        placeholder: "https://play.google.com/store/apps/details?id=com.example.app",
        helper: "An App Store or Google Play page for one app, both platforms ship their part of the link.",
      },
    ],
    defaults: { link: "" },
  },
};

/**
 * Full encode pass for the generator: merge defaults with the user's
 * values, run the type encoder and return the payload or inline errors.
 */
export function buildPayload(
  type: QrTypeSlug,
  values: Partial<Record<string, string | boolean>>,
): ReturnType<typeof encodePayload> {
  const merged: FieldValues = { ...typeDefinitions[type].defaults, ...values };
  return encodePayload(type, merged);
}

/** True when every required field for a type has a non-empty value. */
export function requiredFieldsMissing(
  type: QrTypeSlug,
  values: Partial<Record<string, string | boolean>>,
): string[] {
  const merged = { ...typeDefinitions[type].defaults, ...values };
  const missing: string[] = [];
  for (const field of typeDefinitions[type].fields) {
    // Switches are toggles, never mandatory gates.
    if (!("required" in field)) continue;
    if (!field.required) continue;
    const value = merged[field.id];
    if (value === undefined || String(value).trim() === "") {
      missing.push(field.id);
    }
  }
  return missing;
}
