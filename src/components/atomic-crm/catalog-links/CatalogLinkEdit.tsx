import { Edit, SimpleForm } from "@/components/admin";
import { Card, CardContent } from "@/components/ui/card";

import { CatalogLinkFormContent } from "./CatalogLinkFormContent";

export const CatalogLinkEdit = () => (
  <Edit>
    <Card>
      <CardContent>
        <SimpleForm>
          <CatalogLinkFormContent />
        </SimpleForm>
      </CardContent>
    </Card>
  </Edit>
);
