
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ApiAnalyticsChart } from "@/components/analytics/ApiAnalyticsChart";

const ApiAnalyticsCard = () => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">API Usage</CardTitle>
        <CardDescription>
          Number of API calls in the last 30 days
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[300px] pt-0 px-4">
        <ApiAnalyticsChart />
      </CardContent>
    </Card>
  );
};

export default ApiAnalyticsCard;
