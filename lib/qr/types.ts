/*
  Slug and label list for the 13 launch QR types from docs/PRD.md.
  Form fields, validation and payload encoders arrive in P1-2. Phase 0
  uses these only for navigation and page titles.
*/

export type QrTypeListItem = {
  slug: string;
  label: string;
  description: string;
};

export const qrTypes: QrTypeListItem[] = [
  {
    slug: "url",
    label: "URL",
    description: "Send scanners to any web address.",
  },
  {
    slug: "text",
    label: "Text",
    description: "Show a plain message when scanned.",
  },
  {
    slug: "email",
    label: "Email",
    description: "Open a pre-filled email.",
  },
  {
    slug: "phone",
    label: "Phone",
    description: "Dial a number in one tap.",
  },
  {
    slug: "sms",
    label: "SMS",
    description: "Start a text message.",
  },
  {
    slug: "wifi",
    label: "Wi-Fi",
    description: "Connect guests to your Wi-Fi.",
  },
  {
    slug: "vcard",
    label: "vCard",
    description: "Save your contact details.",
  },
  {
    slug: "location",
    label: "Location",
    description: "Open a map position.",
  },
  {
    slug: "event",
    label: "Calendar event",
    description: "Add an event to a calendar.",
  },
  {
    slug: "upi",
    label: "UPI payment",
    description: "Let customers pay you by UPI.",
  },
  {
    slug: "review",
    label: "Google review",
    description: "Ask for Google reviews after a visit.",
  },
  {
    slug: "social",
    label: "Social profile",
    description: "Link to a social media profile.",
  },
  {
    slug: "app-store",
    label: "App store link",
    description: "Send people to your app or play store listing.",
  },
];

export function qrTypeBySlug(slug: string): QrTypeListItem | undefined {
  return qrTypes.find((type) => type.slug === slug);
}
