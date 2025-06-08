// components/dashboard/stats-cards.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Star, DollarSign } from "lucide-react";

interface StatsCardsProps {
  stats?: {
    totalSpent: number;
    averageRating: number;
    moneySaved: number;
  };
  totalBookings?: number;
}

export function StatsCards({ stats, totalBookings = 0 }: StatsCardsProps) {
  return (
    <div className="grid md:grid-cols-3 gap-6 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalBookings}</div>
          <p className="text-xs text-muted-foreground">
            {totalBookings === 0
              ? "Get started with your first booking"
              : "All time bookings"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Money Saved</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">£{stats?.moneySaved || 0}</div>
          <p className="text-xs text-muted-foreground">Compared to agencies</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
          <Star className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats?.averageRating || "N/A"}
          </div>
          <p className="text-xs text-muted-foreground">From your cleaners</p>
        </CardContent>
      </Card>
    </div>
  );
}
