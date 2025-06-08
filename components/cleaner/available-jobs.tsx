"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar,
  Clock,
  MapPin,
  Star,
  Home,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";

interface Job {
  id: string;
  bookingId: string;
  serviceType: string;
  date: string;
  time: string;
  address: string;
  bedrooms: number;
  bathrooms: number;
  totalPrice: number;
  priority: string;
  customer: {
    name: string;
    phone: string;
    rating: number;
  };
  extras: Array<{
    extra: {
      name: string;
      price: number;
    };
  }>;
}

interface AvailableJobsProps {
  cleanerId: string;
}

export function AvailableJobs({ cleanerId }: AvailableJobsProps) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchAvailableJobs();
  }, [cleanerId]);

  const fetchAvailableJobs = async () => {
    try {
      const response = await fetch(
        `/api/cleaner/jobs?cleanerId=${cleanerId}&type=available`
      );
      const data = await response.json();

      if (data.success) {
        setJobs(data.jobs);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptJob = async (jobId: string) => {
    setActionLoading(jobId);
    try {
      const response = await fetch(`/api/cleaner/jobs/${jobId}/accept`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cleanerId }),
      });

      const data = await response.json();

      if (data.success) {
        // Remove job from available list
        setJobs(jobs.filter((job) => job.id !== jobId));
      }
    } catch (error) {
      console.error("Error accepting job:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeclineJob = async (jobId: string) => {
    setActionLoading(jobId);
    try {
      const response = await fetch(`/api/cleaner/jobs/${jobId}/decline`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cleanerId }),
      });

      const data = await response.json();

      if (data.success) {
        // Remove job from available list
        setJobs(jobs.filter((job) => job.id !== jobId));
      }
    } catch (error) {
      console.error("Error declining job:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "urgent":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "normal":
        return "bg-blue-100 text-blue-800";
      case "low":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getServiceTypeIcon = (serviceType: string) => {
    switch (serviceType.toLowerCase()) {
      case "regular":
        return "🧹";
      case "deep":
        return "✨";
      case "tenancy":
        return "📦";
      case "office":
        return "🏢";
      default:
        return "🧽";
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Available Jobs
          </h3>
          <p className="text-gray-600 text-center">
            There are currently no jobs available in your area. Check back later
            for new opportunities.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {jobs.map((job) => (
        <Card
          key={job.id}
          className="hover:shadow-lg transition-shadow duration-200"
        >
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="text-2xl">
                  {getServiceTypeIcon(job.serviceType)}
                </div>
                <div>
                  <CardTitle className="text-lg">
                    {job.serviceType.charAt(0).toUpperCase() +
                      job.serviceType.slice(1)}{" "}
                    Cleaning
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={getPriorityColor(job.priority)}>
                      {job.priority}
                    </Badge>
                    <Badge variant="outline">#{job.bookingId}</Badge>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">
                  £{job.totalPrice}
                </div>
                <div className="text-sm text-gray-500">Total Payment</div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Job Details */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>
                    {format(new Date(job.date), "EEEE, MMMM do, yyyy")}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span>{job.time}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="truncate">{job.address}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Home className="h-4 w-4 text-gray-500" />
                  <span>
                    {job.bedrooms} bed, {job.bathrooms} bath
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {/* Customer Info */}
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>
                      {job.customer.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-sm">
                      {job.customer.name}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-400 fill-current" />
                      <span className="text-xs text-gray-600">
                        {job.customer.rating}/5
                      </span>
                    </div>
                  </div>
                </div>

                {/* Extras */}
                {job.extras.length > 0 && (
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-1">
                      Extras:
                    </div>
                    <div className="space-y-1">
                      {job.extras.map((extra, index) => (
                        <div
                          key={index}
                          className="flex justify-between text-xs"
                        >
                          <span>{extra.extra.name}</span>
                          <span className="text-green-600">
                            +£{extra.extra.price}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              <Button
                onClick={() => handleAcceptJob(job.id)}
                disabled={actionLoading === job.id}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                {actionLoading === job.id ? "Accepting..." : "Accept Job"}
              </Button>
              <Button
                variant="outline"
                onClick={() => handleDeclineJob(job.id)}
                disabled={actionLoading === job.id}
                className="flex-1 text-red-600 border-red-600 hover:bg-red-50"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Decline
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
