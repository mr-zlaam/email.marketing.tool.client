import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  IconMail,
  IconClock,
  IconUsers,
  IconAlertCircle,
  IconPlayerPlay,
  IconPlayerPause,
  IconLoader2,
} from "@tabler/icons-react";
import { apiClient } from "@/lib/api";
import type {
  GetUploadsWithBatchesResponse,
  EmailUpload,
} from "@/types/api.types";

export const CampaignList = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["uploads-with-batches"],
    queryFn: () => apiClient.getUploadsWithBatches(1, 10),
  });

  const pauseBatchMutation = useMutation({
    mutationFn: (batchId: string) => apiClient.pauseBatch(batchId),
    onSuccess: () => {
      toast.success("Batch paused successfully");
      queryClient.invalidateQueries({ queryKey: ["uploads-with-batches"] });
    },
    onError: (error: unknown) => {
      const errorMessage =
        (error as { message?: string })?.message || "Failed to pause batch";
      toast.error(errorMessage);
    },
  });

  const resumeBatchMutation = useMutation({
    mutationFn: (batchId: string) => apiClient.resumeBatch(batchId),
    onSuccess: () => {
      toast.success("Batch resumed successfully");
      queryClient.invalidateQueries({ queryKey: ["uploads-with-batches"] });
    },
    onError: (error: unknown) => {
      const errorMessage =
        (error as { message?: string })?.message || "Failed to resume batch";
      toast.error(errorMessage);
    },
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "paused":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Email Campaigns</CardTitle>
          <CardDescription>Your email marketing campaigns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-3 text-gray-600">Loading campaigns...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Email Campaigns</CardTitle>
          <CardDescription>Your email marketing campaigns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <IconAlertCircle className="w-12 h-12 text-red-500 mb-4" />
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Failed to load campaigns
              </h3>
              <p className="text-gray-600">
                {(error as { message?: string })?.message ||
                  "An error occurred while fetching campaigns"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const response = data as GetUploadsWithBatchesResponse;
  const uploads = response?.data?.uploads || [];

  if (uploads.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Email Campaigns</CardTitle>
          <CardDescription>Your email marketing campaigns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <IconMail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No campaigns yet
            </h3>
            <p className="text-gray-600 mb-6">
              Create your first email marketing campaign to get started.
            </p>
            <Link to="/create-campaign">
              <Button className="bg-primary hover:bg-primary/90">
                <IconMail className="w-4 h-4 mr-2" />
                Create Your First Campaign
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Email Campaigns</CardTitle>
          <CardDescription>Your email marketing campaigns</CardDescription>
        </div>
        <Link to="/create-campaign">
          <Button size="sm">
            <IconMail className="w-4 h-4 mr-2" />
            New Campaign
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {uploads.map((upload: EmailUpload) => (
            <div
              key={upload.id}
              className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                    <IconMail className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {upload.uploadedFileName}
                    </h4>
                    <p className="text-sm text-gray-500">
                      Uploaded by {upload.uploadedBy} •{" "}
                      {formatDate(upload.createdAt)}
                    </p>
                  </div>
                </div>
                {upload.status === "completed" && (
                  <Badge className={getStatusColor(upload.status)}>
                    {upload.status}
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4 mb-3">
                <div className="flex items-center space-x-2">
                  <IconUsers className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-blue-600">
                    {upload.remainingEmails} remaining emails total
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <IconClock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-green-700">
                    {upload.batches.length > 0
                      ? "1 active batch"
                      : "No active batch"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <IconMail className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    Uploaded by {upload.uploadedBy}
                  </span>
                </div>
              </div>

              {upload.batches.length > 0 && (
                <div className="border-t pt-3">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Active Batch:
                  </p>
                  {upload.batches.map((batch) => (
                    <div
                      key={batch.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-600 font-medium">
                          {batch.batchName}
                        </span>
                        <Badge
                          className={`${getStatusColor(batch.status)} text-xs`}
                        >
                          {batch.status}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-blue-600 text-xs">
                          {batch.emailsPerBatch} per batch
                        </span>
                        {(batch.status === "processing" ||
                          batch.status === "paused") && (
                          <div className="flex items-center space-x-1">
                            {batch.status === "processing" ? (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  pauseBatchMutation.mutate(batch.batchId)
                                }
                                disabled={pauseBatchMutation.isPending}
                                className="h-6 w-6 p-0"
                              >
                                {pauseBatchMutation.isPending ? (
                                  <IconLoader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  <IconPlayerPause className="w-3 h-3" />
                                )}
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  resumeBatchMutation.mutate(batch.batchId)
                                }
                                disabled={resumeBatchMutation.isPending}
                                className="h-6 w-6 p-0"
                              >
                                {resumeBatchMutation.isPending ? (
                                  <IconLoader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  <IconPlayerPlay className="w-3 h-3" />
                                )}
                              </Button>
                            )}
                            {upload.totalEmails > 0 &&
                              batch.status === "paused" && (
                                <Link
                                  to={`/existing-campaigns?uploadId=${upload.id}`}
                                >
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-6 px-2 text-xs"
                                  >
                                    Update & Resume
                                  </Button>
                                </Link>
                              )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {upload.batches.length === 0 && (
                <div className="border-t pt-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                      No batch created yet for this upload
                    </p>
                    <Link to={`/existing-campaigns?uploadId=${upload.id}`}>
                      <Button size="sm" variant="outline">
                        <IconPlayerPlay className="w-3 h-3 mr-1" />
                        Create Batch
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
