import { describe, expect, it } from "vitest";
import { encodePayload, socialPlatforms } from "./payload";

/*
  Payload format tests per docs/PRD.md Phase 1: the parse formats are
  verified here against the pinned spec strings. The decode suite
  (decode.test.ts) is the second verification, end to end through
  rendered pixels; these tests pin the exact strings.
*/

describe("url", () => {
  it("adds https:// to a bare domain", () => {
    const result = encodePayload("url", { url: "example.com/menu" });
    expect(result).toEqual({ ok: true, payload: "https://example.com/menu", errors: null });
  });

  it("keeps an existing scheme", () => {
    expect(encodePayload("url", { url: "http://example.com" }).payload).toBe(
      "http://example.com",
    );
  });

  it("rejects junk", () => {
    expect(encodePayload("url", { url: "not a url,,,," })).toEqual({
      ok: false,
      payload: null,
      errors: { url: "Use a web address like example.com/menu." },
    });
  });

  it("requires non empty", () => {
    expect(encodePayload("url", { url: "" }).ok).toBe(false);
  });
});

describe("text", () => {
  it("trims and passes through", () => {
    expect(encodePayload("text", { text: "  hello  " }).payload).toBe("hello");
  });
});

describe("email", () => {
  it("builds mailto with subject and body encoded", () => {
    const result = encodePayload("email", {
      to: "a@b.example",
      subject: "Table booking",
      body: "two people",
    });
    expect(result.ok).toBe(true);
    expect(result.payload).toBe(
      "mailto:a@b.example?subject=Table%20booking&body=two%20people",
    );
  });

  it("rejects a bad address", () => {
    expect(encodePayload("email", { to: "nope" }).errors?.to).toBeDefined();
  });
});

describe("phone", () => {
  it("strips spaces and dashes into tel:", () => {
    expect(encodePayload("phone", { number: "+91 98765-43210" }).payload).toBe(
      "tel:+919876543210",
    );
  });
});

describe("sms", () => {
  it("uses the SMSTO format scanners expect", () => {
    expect(encodePayload("sms", { number: "9876543210", message: "Hi" }).payload).toBe(
      "SMSTO:9876543210:Hi",
    );
  });

  it("keeps the colon even when the message is empty", () => {
    expect(encodePayload("sms", { number: "9876543210" }).payload).toBe(
      "SMSTO:9876543210:",
    );
  });
});

describe("wifi", () => {
  it("produces the pinned format with escaping", () => {
    const result = encodePayload("wifi", {
      ssid: "Cafe\"Guest;WiFi,2",
      password: "p\\a;s,s:w\"d",
      security: "WPA",
      hidden: false,
    });
    expect(result.ok).toBe(true);
    expect(result.payload).toBe(
      'WIFI:T:WPA;S:Cafe\\"Guest\\;WiFi\\,2;P:p\\\\a\\;s\\,s\\:w\\"d;H:false;;',
    );
  });

  it("produces the open network variant without P", () => {
    expect(
      encodePayload("wifi", { ssid: "Free", security: "nopass" }).payload,
    ).toBe("WIFI:T:nopass;S:Free;H:false;;");
  });

  it("marks hidden networks", () => {
    expect(
      encodePayload("wifi", {
        ssid: "S",
        security: "WPA",
        password: "x",
        hidden: true,
      }).payload,
    ).toBe("WIFI:T:WPA;S:S;P:x;H:true;;");
  });
});

describe("vcard", () => {
  it("produces a vCard 3.0 contact", () => {
    const result = encodePayload("vcard", {
      firstName: "Asha",
      lastName: "Rao",
      org: "Asha Textiles",
      phone: "+91 98765 43210",
      email: "asha@ashatextiles.example",
    });
    expect(result.ok).toBe(true);
    expect(result.payload).toBe(
      [
        "BEGIN:VCARD",
        "VERSION:3.0",
        "N:Rao;Asha;;;",
        "FN:Asha Rao",
        "ORG:Asha Textiles",
        "TEL;TYPE=CELL:+91 98765 43210",
        "EMAIL:asha@ashatextiles.example",
        "END:VCARD",
      ].join("\r\n"),
    );
  });
});

describe("location", () => {
  it("builds geo:lat,lng", () => {
    expect(
      encodePayload("location", { lat: "11.016844", lng: "76.955833" }).payload,
    ).toBe("geo:11.016844,76.955833");
  });

  it("rejects out of range coordinates", () => {
    const result = encodePayload("location", { lat: "95", lng: "76" });
    expect(result.ok).toBe(false);
    expect(result.errors?.lat).toBeDefined();
  });
});

describe("event", () => {
  it("produces an iCalendar VEVENT", () => {
    const result = encodePayload("event", {
      title: "Sunday workshop",
      start: "2026-03-01T10:30",
      end: "2026-03-01T12:30",
    });
    expect(result.ok).toBe(true);
    expect(result.payload).toContain("BEGIN:VEVENT");
    expect(result.payload).toContain("SUMMARY:Sunday workshop");
    expect(result.payload).toContain("DTSTART:20260301T103000");
    expect(result.payload).toContain("DTEND:20260301T123000");
    expect(result.payload).toContain("END:VCALENDAR");
  });

  it("rejects a non date start", () => {
    expect(encodePayload("event", { title: "x", start: "someday" }).ok).toBe(false);
  });
});

describe("upi", () => {
  it("produces the pinned UPI format with cu=INR", () => {
    const result = encodePayload("upi", {
      pa: "shop@upi",
      pn: "Asha Textiles",
      am: "199.00",
      tn: "Table 4",
    });
    expect(result.ok).toBe(true);
    expect(result.payload).toBe(
      "upi://pay?pa=shop%40upi&pn=Asha%20Textiles&am=199.00&cu=INR&tn=Table%204",
    );
  });

  it("rejects a bad UPI id", () => {
    const result = encodePayload("upi", { pa: "shop", am: "10" });
    expect(result.errors?.pa).toBeDefined();
  });

  it("rejects nonsense amounts", () => {
    const result = encodePayload("upi", { pa: "a@b", am: "-3" });
    expect(result.errors?.am).toBeDefined();
  });
});

describe("review", () => {
  it("accepts the writereview format with a place id", () => {
    const result = encodePayload("review", {
      link: "https://search.google.com/local/writereview?placeid=ChIJbogus123",
    });
    expect(result.ok).toBe(true);
    expect(result.payload).toBe(
      "https://search.google.com/local/writereview?placeid=ChIJbogus123",
    );
  });

  it("never invents a place id from nothing", () => {
    expect(encodePayload("review", { link: "give me reviews" }).ok).toBe(false);
  });
});

describe("social", () => {
  it("joins platform base and handle", () => {
    expect(
      encodePayload("social", { platform: "instagram", handle: "@ashatextiles" })
        .payload,
    ).toBe(`${socialPlatforms[0]?.base}ashatextiles`);
  });
});

describe("app-store", () => {
  it("accepts play and app store urls", () => {
    expect(
      encodePayload("app-store", {
        link: "https://play.google.com/store/apps/details?id=com.example",
      }).ok,
    ).toBe(true);
    expect(
      encodePayload("app-store", {
        link: "https://example.com/fake/store",
      }).ok,
    ).toBe(false);
  });
});
