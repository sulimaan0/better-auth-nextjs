"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Calendar, Star, TrendingUp } from "lucide-react";

interface CleanerStatsProps {
  cleanerId: string;
}

interface Stats {
  stats: Record<string, number>;
  totalEarnings: number;
  averageRating: number;
}

export function CleanerStats({ cleanerId }: CleanerStatsProps) {
  const [stats, setStats] = useState<Stats>({
    stats: {},
    totalEarnings: 0,
    averageRating: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, [cleanerId]);

  const fetchStats = async () => {
    try {
      const response = await fetch(`/api/cleaner/stats?cleanerId=${cleanerId}`);
      const data = await response.json();

      if (data.success) {
        setStats(data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalJobs = Object.values(stats.stats).reduce(
    (sum, count) => sum + count,
    0
  );
  const completedJobs = stats.stats.completed || 0;
  const pendingJobs = stats.stats.accepted || 0;
  const completionRate = totalJobs > 0 ? (completedJobs / totalJobs) * 100 : 0;

  if (loading) {
    return (
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-4 gap-6 mb-8">
      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-green-800">
            Total Earnings
          </CardTitle>
          <DollarSign className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-900">
            £{stats.totalEarnings}
          </div>
          <p className="text-xs text-green-700">
            From {completedJobs} completed jobs
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-blue-800">
            Total Jobs
          </CardTitle>
          <Calendar className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-900">{totalJobs}</div>
          <div className="flex gap-1 mt-1">
            <Badge variant="outline" className="text-xs">
              {completedJobs} completed
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-yellow-800">
            Average Rating
          </CardTitle>
          <Star className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-900">
            {stats.averageRating.toFixed(1)}
          </div>
          <div className="flex items-center gap-1 mt-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < Math.floor(stats.averageRating)
                    ? "text-yellow-400 fill-current"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-purple-800">
            Completion Rate
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-900">
            {completionRate.toFixed(0)}%
          </div>
          <p className="text-xs text-purple-700">
            {pendingJobs > 0 && `${pendingJobs} jobs in progress`}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
