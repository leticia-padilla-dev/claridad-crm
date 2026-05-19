import { Create, SimpleForm } from "@/components/admin";
import { Card, CardContent } from "@/components/ui/card";

import { CatalogLinkFormContent } from "./CatalogLinkFormContent";
import { defaultCatalogLinkType } from "./catalogLinkModel";

export const CatalogLinkCreate = () => (
  <Create
    record={{
      type: defaultCatalogLinkType,
      active: true,
    }}
  >
    <Card>
      <CardContent>
        <SimpleForm>
          <CatalogLinkFormContent />
        </SimpleForm>
      </CardContent>
    </Card>
  </Create>
);
