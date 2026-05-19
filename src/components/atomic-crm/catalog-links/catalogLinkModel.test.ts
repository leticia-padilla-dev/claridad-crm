import { describe, expect, it } from "vitest";

import type { CatalogLink } from "../types";
import {
  catalogLinkRowClassName,
  catalogLinkTypes,
  defaultCatalogLinkType,
  isValidCatalogLinkUrl,
  normalizeCatalogLinkPayload,
} from "./catalogLinkModel";

const makeRecord = (overrides: Partial<CatalogLink> = {}): CatalogLink => ({
  id: 1,
  title: "Sample",
  url: "https://example.com",
  type: "link",
  business_line: null,
  campaign: null,
  active: true,
  notes: null,
  ...overrides,
});

describe("catalogLinkModel", () => {
  describe("defaults and choices", () => {
    it("defines four supported types", () => {
      expect(catalogLinkTypes.map((choice) => choice.value)).toEqual([
        "catalog",
        "link",
        "campaign",
        "promotion",
      ]);
    });

    it("uses 'link' as the default type", () => {
      expect(defaultCatalogLinkType).toBe("link");
    });
  });

  describe("isValidCatalogLinkUrl", () => {
    it("accepts http and https URLs", () => {
      expect(isValidCatalogLinkUrl("https://example.com")).toBe(true);
      expect(isValidCatalogLinkUrl("http://example.com/x?y=1")).toBe(true);
    });

    it("rejects empty, null, or non-http URLs", () => {
      expect(isValidCatalogLinkUrl(null)).toBe(false);
      expect(isValidCatalogLinkUrl(undefined)).toBe(false);
      expect(isValidCatalogLinkUrl("")).toBe(false);
      expect(isValidCatalogLinkUrl("   ")).toBe(false);
      expect(isValidCatalogLinkUrl("ftp://example.com")).toBe(false);
      expect(isValidCatalogLinkUrl("example.com")).toBe(false);
    });
  });

  describe("normalizeCatalogLinkPayload", () => {
    it("trims title, url, campaign and notes", () => {
      const result = normalizeCatalogLinkPayload<Partial<CatalogLink>>({
        title: "  My title  ",
        url: "  https://example.com  ",
        type: "link",
        campaign: "  Verano 2026  ",
        notes: "  hello  ",
        active: true,
      });

      expect(result.title).toBe("My title");
      expect(result.url).toBe("https://example.com");
      expect(result.campaign).toBe("Verano 2026");
      expect(result.notes).toBe("hello");
    });

    it("converts empty strings into null for optional fields", () => {
      const result = normalizeCatalogLinkPayload<Partial<CatalogLink>>({
        title: "x",
        url: "https://example.com",
        type: "link",
        campaign: "   ",
        notes: "",
        active: true,
      });

      expect(result.campaign).toBeNull();
      expect(result.notes).toBeNull();
    });

    it("preserves business_line as null when not provided", () => {
      const result = normalizeCatalogLinkPayload<Partial<CatalogLink>>({
        title: "x",
        url: "https://example.com",
        type: "link",
        active: true,
      });

      expect(result.business_line).toBeNull();
    });
  });

  describe("catalogLinkRowClassName", () => {
    it("dims inactive rows", () => {
      expect(catalogLinkRowClassName(makeRecord({ active: false }))).toBe(
        "opacity-60",
      );
    });

    it("returns undefined for active rows", () => {
      expect(
        catalogLinkRowClassName(makeRecord({ active: true })),
      ).toBeUndefined();
    });
  });
});
