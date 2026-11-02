/*
  Phase 0 mock data only. Real codes come from Supabase in Phase 2, and no
  real destination or personal data should ever be typed here.
*/

export type MockCodeStatus = "active" | "paused" | "suspended";

export type MockCode = {
  id: string;
  name: string;
  type: string;
  status: MockCodeStatus;
  scans30d: number;
  destination: string;
  short: string;
  created: string;
};

export function createMockCodes(): MockCode[] {
  return [
    {
      id: "menu",
      name: "Restaurant menu",
      type: "URL",
      status: "active",
      scans30d: 412,
      destination: "https://example.com/menu",
      short: "sign.ag/aX7q",
      created: "2026-09-14",
    },
    {
      id: "wifi",
      name: "Guest Wi-Fi",
      type: "Wi-Fi",
      status: "active",
      scans30d: 88,
      destination: "Encodes the network, never stored anywhere",
      short: "sign.ag/gK2m",
      created: "2026-08-02",
    },
    {
      id: "review",
      name: "Google review, table cards",
      type: "Google review",
      status: "paused",
      scans30d: 27,
      destination: "https://example.com/review",
      short: "sign.ag/bN9p",
      created: "2026-09-30",
    },
  ];
}

export type MockCodePoint = {
  label: string;
  value: number;
};

export function createMockScanDaily(): MockCodePoint[] {
  return [
    { label: "Mon", value: 12 },
    { label: "Tue", value: 18 },
    { label: "Wed", value: 9 },
    { label: "Thu", value: 24 },
    { label: "Fri", value: 31 },
    { label: "Sat", value: 40 },
    { label: "Sun", value: 22 },
  ];
}

export function createMockBreakdown(): MockCodePoint[] {
  return [
    { label: "Android", value: 63 },
    { label: "iOS", value: 35 },
    { label: "Other", value: 2 },
  ];
}
