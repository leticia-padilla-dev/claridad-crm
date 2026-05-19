import type { CatalogLink, CatalogLinkType } from "../types";

export const catalogLinkTypes: { value: CatalogLinkType; label: string }[] = [
  { value: "catalog", label: "catalog" },
  { value: "link", label: "link" },
  { value: "campaign", label: "campaign" },
  { value: "promotion", label: "promotion" },
] as const;

export const defaultCatalogLinkType: CatalogLinkType =
  catalogLinkTypes[1].value;

export const translateCatalogLinkTypeLabel = (
  choice: { label: string },
  translate: (key: string, options?: Record<string, unknown>) => string,
) =>
  translate(`resources.catalog_links.inputs.types.${choice.label}`, {
    _: choice.label,
  });

export const translateCatalogLinkBusinessLineLabel = (
  choice: { value: string; label?: string },
  translate: (key: string, options?: Record<string, unknown>) => string,
) =>
  translate(
    choice.label ??
      `resources.catalog_links.inputs.business_lines.${choice.value}`,
    {
      _: choice.value,
    },
  );

export const catalogLinkRowClassName = (record: CatalogLink) => {
  if (!record.active) return "opacity-60";
  return undefined;
};

const URL_PATTERN = /^https?:\/\/[\S]+$/i;

export const isValidCatalogLinkUrl = (value?: string | null): boolean => {
  if (value == null) return false;
  const trimmed = value.trim();
  if (trimmed.length === 0) return false;
  return URL_PATTERN.test(trimmed);
};

export const normalizeCatalogLinkPayload = <T extends Partial<CatalogLink>>(
  data: T,
): T => {
  const trimText = (value?: string | null) => {
    if (value == null) return value ?? null;
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  };

  return {
    ...data,
    title: data.title?.trim() ?? "",
    url: data.url?.trim() ?? "",
    business_line: data.business_line ?? null,
    campaign: trimText(data.campaign) ?? null,
    notes: trimText(data.notes) ?? null,
  };
};
