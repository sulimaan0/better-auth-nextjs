"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Briefcase, Calendar, Star } from "lucide-react";
import { CleanerStats } from "@/components/cleaner/cleaner-stats";
import { AvailableJobs } from "@/components/cleaner/available-jobs";
import { Footer } from "@/components/layout/footer";

// Mock cleaner ID - in real app, get from auth context
const MOCK_CLEANER_ID = "cleaner-1";

export default function CleanerDashboardPage() {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-8">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Cleaner Dashboard
            </h1>
            <p className="text-gray-600">
              Manage your cleaning jobs and track your performance
            </p>
          </div>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <Badge className="bg-green-100 text-green-800">
              ✅ Available for Work
            </Badge>
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2"
            >
              <RefreshCw
                className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <CleanerStats cleanerId={MOCK_CLEANER_ID} />

        {/* Main Content Tabs */}
        <Tabs defaultValue="available" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="available" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Available Jobs
            </TabsTrigger>
            <TabsTrigger value="my-jobs" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              My Jobs
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              Reviews
            </TabsTrigger>
          </TabsList>

          <TabsContent value="available" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Available Jobs
              </h2>
              <Badge variant="outline">Real-time updates</Badge>
            </div>
            <AvailableJobs cleanerId={MOCK_CLEANER_ID} />
          </TabsContent>

          <TabsContent value="my-jobs" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                My Accepted Jobs
              </h2>
            </div>
            {/* TODO: Add MyJobs component */}
            <div className="text-center py-12 text-gray-500">
              My Jobs component coming soon...
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Customer Reviews
              </h2>
            </div>
            {/* TODO: Add Reviews component */}
            <div className="text-center py-12 text-gray-500">
              Reviews component coming soon...
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="mt-20">
        <Footer />
      </div>
    </div>
  );
}
