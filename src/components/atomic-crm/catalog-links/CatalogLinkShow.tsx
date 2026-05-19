import { Show } from "@/components/admin/show";
import { RecordField } from "@/components/admin/record-field";
import { UrlField } from "@/components/admin/url-field";
import { DateField } from "@/components/admin/date-field";
import { Badge } from "@/components/ui/badge";
import { useTranslate } from "ra-core";

import type { CatalogLink } from "../types";
import {
  catalogLinkTypes,
  translateCatalogLinkTypeLabel,
} from "./catalogLinkModel";
import {
  contactBusinessLines,
  translateContactBusinessLineLabel,
} from "../contacts/contactModel";

export const CatalogLinkShow = () => {
  const translate = useTranslate();

  return (
    <Show>
      <div className="flex flex-col gap-4">
        <RecordField source="title" />
        <RecordField source="url" field={UrlField} />
        <RecordField
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
        <RecordField
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
        <RecordField source="campaign" />
        <RecordField
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
        <RecordField source="notes" />
        <RecordField source="created_at" field={DateField} />
      </div>
    </Show>
  );
};

