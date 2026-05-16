import { Clock } from "lucide-react";
import { useTranslate } from "ra-core";
import { Card } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

import { ActivityLog } from "../activity/ActivityLog";
import { COMPANY_CREATED, DEAL_CREATED, DEAL_NOTE_CREATED } from "../consts";

export function DashboardActivityLog() {
  const isMobile = useIsMobile();
  const translate = useTranslate();
  const hiddenTypes = [COMPANY_CREATED, DEAL_CREATED, DEAL_NOTE_CREATED];
  return (
    <div className="flex flex-col">
      <div className="flex items-center mb-4 md:mb-2">
        <div className="mr-3 flex">
          <Clock className="text-muted-foreground w-6 h-6" />
        </div>
        <h2 className="text-xl font-semibold text-muted-foreground">
          {translate("crm.dashboard.latest_activity", {
            _: "Latest Activity",
          })}
        </h2>
      </div>
      {isMobile ? (
        <ActivityLog pageSize={10} hiddenTypes={hiddenTypes} />
      ) : (
        <Card className="mb-2 p-6">
          <ActivityLog pageSize={10} hiddenTypes={hiddenTypes} />
        </Card>
      )}
    </div>
  );
}
