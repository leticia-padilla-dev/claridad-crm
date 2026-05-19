import { regex, required, useTranslate } from "ra-core";

import { BooleanInput } from "@/components/admin/boolean-input";
import { SelectInput } from "@/components/admin/select-input";
import { TextInput } from "@/components/admin/text-input";

import {
  contactBusinessLines,
  translateContactBusinessLineLabel,
} from "../contacts/contactModel";
import {
  catalogLinkTypes,
  translateCatalogLinkTypeLabel,
} from "./catalogLinkModel";

const URL_PATTERN = /^https?:\/\/[\S]+$/i;

export const CatalogLinkFormContent = () => {
  const translate = useTranslate();

  const typeChoices = catalogLinkTypes.map((choice) => ({
    id: choice.value,
    name: translateCatalogLinkTypeLabel(choice, translate),
  }));

  const businessLineChoices = contactBusinessLines.map((choice) => ({
    id: choice.value,
    name: translateContactBusinessLineLabel(choice, translate),
  }));

  return (
    <div className="flex flex-col gap-4">
      <TextInput
        source="title"
        validate={required()}
        helperText={false}
      />

      <TextInput
        source="url"
        validate={[
          required(),
          regex(
            URL_PATTERN,
            "resources.catalog_links.validation.url_format",
          ),
        ]}
        helperText={false}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SelectInput
          source="type"
          validate={required()}
          choices={typeChoices}
          helperText={false}
        />
        <SelectInput
          source="business_line"
          choices={businessLineChoices}
          helperText={false}
        />
      </div>

      <TextInput source="campaign" helperText={false} />

      <BooleanInput source="active" helperText={false} />

      <TextInput source="notes" multiline helperText={false} />
    </div>
  );
};
