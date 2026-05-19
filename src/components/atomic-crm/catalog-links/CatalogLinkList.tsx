import { useTranslate } from "ra-core";
import { ExternalLink } from "lucide-react";

import { CreateButton, DateField, List } from "@/components/admin";
import { DataTable } from "@/components/admin/data-table";
import { SearchInput } from "@/components/admin/search-input";
import { SelectInput } from "@/components/admin/select-input";
import { Badge } from "@/components/ui/badge";

import { TopToolbar } from "../layout/TopToolbar";
import {
  contactBusinessLines,
  translateContactBusinessLineLabel,
} from "../contacts/contactModel";
import type { CatalogLink } from "../types";
import {
  catalogLinkRowClassName,
  catalogLinkTypes,
  translateCatalogLinkTypeLabel,
} from "./catalogLinkModel";

const CatalogLinkListActions = () => (
  <TopToolbar>
    <CreateButton label="resources.catalog_links.action.new" />
  </TopToolbar>
);

const useCatalogLinkFilters = () => {
  const translate = useTranslate();

  const typeChoices = catalogLinkTypes.map((choice) => ({
    id: choice.value,
    name: translateCatalogLinkTypeLabel(choice, translate),
  }));

  const businessLineChoices = contactBusinessLines.map((choice) => ({
    id: choice.value,
    name: translateContactBusinessLineLabel(choice, translate),
  }));

  return [
    <SearchInput key="q" source="q" alwaysOn />,
    <SelectInput
      key="business_line"
      source="business_line"
      choices={businessLineChoices}
      emptyText="resources.catalog_links.filters.all_business_lines"
    />,
    <SelectInput
      key="type"
      source="type"
      choices={typeChoices}
      emptyText="resources.catalog_links.filters.all_types"
    />,
  ];
};

const UrlCell = ({ record }: { record: CatalogLink }) => {
  if (!record.url) return null;
  return (
    <a
      href={record.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(event) => event.stopPropagation()}
      className="inline-flex items-center gap-1 text-primary hover:underline"
    >
      <span className="max-w-[28ch] truncate">{record.url}</span>
      <ExternalLink className="h-3 w-3" aria-hidden />
    </a>
  );
};

export const CatalogLinkList = () => {
  const translate = useTranslate();
  const filters = useCatalogLinkFilters();

  return (
    <List
      actions={<CatalogLinkListActions />}
      filters={filters}
      sort={{ field: "created_at", order: "DESC" }}
    >
      <DataTable rowClick="edit" rowClassName={catalogLinkRowClassName}>
        <DataTable.Col source="title" />
        <DataTable.Col
          label="resources.catalog_links.fields.url"
          render={(record: CatalogLink) => <UrlCell record={record} />}
        />
        <DataTable.Col
          label="resources.catalog_links.fields.type"
          render={(record: CatalogLink) => {
            const match = catalogLinkTypes.find(
              (choice) => choice.value === record.type,
            );
            return match
              ? translateCatalogLinkTypeLabel(match, translate)
              : record.type;
          }}
        />
        <DataTable.Col
          label="resources.catalog_links.fields.business_line"
          render={(record: CatalogLink) => {
            if (!record.business_line) return null;
            const match = contactBusinessLines.find(
              (choice) => choice.value === record.business_line,
            );
            return match
              ? translateContactBusinessLineLabel(match, translate)
              : record.business_line;
          }}
        />
        <DataTable.Col source="campaign" />
        <DataTable.Col
          label="resources.catalog_links.fields.active"
          render={(record: CatalogLink) => (
            <Badge variant={record.active ? "default" : "outline"}>
              {translate(
                record.active
                  ? "resources.catalog_links.fields.active_yes"
                  : "resources.catalog_links.fields.active_no",
              )}
            </Badge>
          )}
        />
        <DataTable.Col source="created_at">
          <DateField source="created_at" showDate />
        </DataTable.Col>
      </DataTable>
    </List>
  );
};
