import { describe, expect, it } from "vitest";

import { cleanupContactForCreate, cleanupContactForEdit } from "./contactModel";
import { buildContact } from "@/test/StoryWrapper";

describe("contactModel", () => {
  it("keeps business lines interest when provided", () => {
    const result = cleanupContactForCreate(
      buildContact({
        allergies_or_needs: "Sensitive skin",
        birthday: "1990-03-08",
        business_lines_interest: ["mary-kay", "incruises"],
        city: "Madrid",
        preferences: "Prefers skincare sets",
        whatsapp: "+34123456789",
      }),
    );

    expect(result).toMatchObject({
      allergies_or_needs: "Sensitive skin",
      birthday: "1990-03-08",
      business_lines_interest: ["mary-kay", "incruises"],
      city: "Madrid",
      preferences: "Prefers skincare sets",
      whatsapp: "+34123456789",
    });
  });

  it("normalizes empty profile fields to null on edit", () => {
    const result = cleanupContactForEdit(
      buildContact({
        allergies_or_needs: "   ",
        birthday: "",
        business_lines_interest: [],
        city: " ",
        preferences: "",
        whatsapp: "",
      }),
    );

    expect(result).toMatchObject({
      allergies_or_needs: null,
      birthday: null,
      business_lines_interest: null,
      city: null,
      preferences: null,
      whatsapp: null,
    });
  });
});
