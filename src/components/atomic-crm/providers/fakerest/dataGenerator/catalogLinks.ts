import { datatype, lorem, random } from "faker/locale/en_US";

import type { CatalogLink, ContactBusinessLineValue } from "../../../types";
import type { Db } from "./types";
import { randomDate } from "./utils";
import { catalogLinkTypes } from "../../../catalog-links/catalogLinkModel";

const businessLines: ContactBusinessLineValue[] = [
  "mary-kay",
  "beyond-beauty",
  "incruises",
];

const sampleTitles = [
  "Catálogo de primavera",
  "Promo verano skincare",
  "Folleto wellness",
  "Linea premium",
  "Campaña aniversario",
  "Lanzamiento experiencia",
];

const sampleUrls = [
  "https://drive.google.com/file/d/example",
  "https://instagram.com/p/sample",
  "https://example.com/catalog.pdf",
  "https://example.com/promo",
];

const sampleCampaigns = [
  "Primavera 2026",
  "Aniversario YoliSkincare",
  "Wellness mes",
  "Cruise season",
  null,
  null,
];

export const generateCatalogLinks = (db: Db, size = 24) => {
  return Array.from(Array(size).keys()).map<CatalogLink>((id) => {
    const createdAt = randomDate(new Date("2025-01-01"), new Date()).toISOString();
    return {
      id,
      title: random.arrayElement(sampleTitles),
      url: random.arrayElement(sampleUrls),
      type: random.arrayElement(catalogLinkTypes).value,
      business_line: datatype.boolean()
        ? random.arrayElement(businessLines)
        : null,
      campaign: random.arrayElement(sampleCampaigns),
      active: datatype.boolean(),
      notes: datatype.boolean() ? lorem.sentence() : null,
      sales_id: db.sales[0]?.id ?? null,
      created_at: createdAt,
      updated_at: createdAt,
    };
  });
};
