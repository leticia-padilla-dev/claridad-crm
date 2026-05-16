import { Create, SimpleForm } from "@/components/admin";
import { Card, CardContent } from "@/components/ui/card";

import { AppointmentFormContent } from "./AppointmentFormContent";
import {
  defaultAppointmentStatus,
  defaultAppointmentType,
} from "./appointmentModel";

export const AppointmentCreate = () => (
  <Create
    record={{
      type: defaultAppointmentType,
      status: defaultAppointmentStatus,
      scheduled_at: new Date().toISOString(),
    }}
  >
    <Card>
      <CardContent>
        <SimpleForm>
          <AppointmentFormContent selectContact />
        </SimpleForm>
      </CardContent>
    </Card>
  </Create>
);
