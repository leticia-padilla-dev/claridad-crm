import { Edit, SimpleForm } from "@/components/admin";
import { Card, CardContent } from "@/components/ui/card";

import { AppointmentFormContent } from "./AppointmentFormContent";

export const AppointmentEdit = () => (
  <Edit>
    <Card>
      <CardContent>
        <SimpleForm>
          <AppointmentFormContent />
        </SimpleForm>
      </CardContent>
    </Card>
  </Edit>
);
