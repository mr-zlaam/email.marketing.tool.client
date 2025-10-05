import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { emailBatchSchema, type EmailBatchFormData } from "@/schemas/validation.schemas";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  IconMail,
  IconUsers,
  IconClock,
  IconArrowLeft,
  IconLoader2,
  IconFileText,
  IconTrash,
} from "@tabler/icons-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { apiClient } from "@/lib/api";
import { RichTextEditor } from "@/components/RichTextEditor";
import { DelaySelector } from "@/components/DelaySelector";
import { useAuth } from "@/context/AuthContext";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import type {
  GetUploadsWithBatchesResponse,
  EmailUpload,
  CreateEmailBatchResponse,
  DeleteCampaignResponse,
} from "@/types/api.types";

export const ExistingCampaigns = () => {
  // LocalStorage hooks for persistence
  const [storedBatchName, setStoredBatchName] = useLocalStorage("existingCampaigns_batchName", "");
  const [storedSubject, setStoredSubject] = useLocalStorage("existingCampaigns_subject", "");
  const [storedEmailContent, setStoredEmailContent] = useLocalStorage("existingCampaigns_emailContent", "");
  const [storedDelay, setStoredDelay] = useLocalStorage("existingCampaigns_delay", "5");
  const [storedEmailsPerBatch, setStoredEmailsPerBatch] = useLocalStorage("existingCampaigns_emailsPerBatch", "50");

  const [emailContent, setEmailContent] = useState(storedEmailContent);
  const [selectedUpload, setSelectedUpload] = useState<EmailUpload | null>(
    null
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [uploadToDelete, setUploadToDelete] = useState<EmailUpload | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAdmin } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<EmailBatchFormData>({
    resolver: zodResolver(emailBatchSchema),
    defaultValues: {
      batchName: storedBatchName,
      subject: storedSubject,
      scheduleTime: "NOW",
      delayBetweenEmails: storedDelay,
      emailsPerBatch: storedEmailsPerBatch,
    },
  });

  const scheduleTime = watch("scheduleTime");
  const batchName = watch("batchName");
  const subject = watch("subject");
  const delayBetweenEmails = watch("delayBetweenEmails");
  const emailsPerBatch = watch("emailsPerBatch");

  // Sync form values to localStorage
  useEffect(() => {
    setStoredBatchName(batchName || "");
  }, [batchName, setStoredBatchName]);

  useEffect(() => {
    setStoredSubject(subject || "");
  }, [subject, setStoredSubject]);

  useEffect(() => {
    setStoredEmailContent(emailContent);
  }, [emailContent, setStoredEmailContent]);

  useEffect(() => {
    setStoredDelay(delayBetweenEmails || "5");
  }, [delayBetweenEmails, setStoredDelay]);

  useEffect(() => {
    setStoredEmailsPerBatch(emailsPerBatch || "50");
  }, [emailsPerBatch, setStoredEmailsPerBatch]);

  // Fetch existing uploads
  const { data: uploadsData, isLoading } = useQuery({
    queryKey: ["uploads-with-batches"],
    queryFn: () => apiClient.getUploadsWithBatches(1, 50),
  });

  // Create batch mutation
  const createBatchMutation = useMutation({
    mutationFn: async (data: {
      uploadId: number;
      batchName: string;
      subject: string;
      composedEmail: string;
      delayBetweenEmails: string;
      emailsPerBatch: string;
      scheduleTime: string;
    }) => {
      const result = await apiClient.createEmailBatchFromExistingUpload(data);
      return result as CreateEmailBatchResponse;
    },
    onSuccess: (response: CreateEmailBatchResponse) => {
      const operation = response?.data?.operation || "created";
      const message = operation === "resumed" ? "Batch updated and resumed successfully!" : "Batch created successfully!";
      toast.success(message);
      queryClient.invalidateQueries({ queryKey: ["uploads-with-batches"] });
      navigate("/manage-campaigns");
    },
    onError: (error: unknown) => {
      const errorMessage =
        (error as { message?: string })?.message || "Failed to create batch";

      // Handle batch size validation errors for resume operation
      if (errorMessage.includes("Batch size") && errorMessage.includes("cannot be greater than remaining emails")) {
        // Extract the suggested batch size from error message
        const match = errorMessage.match(/Please set batch size to (\d+) or less/);
        if (match) {
          const suggestedSize = match[1];
          setValue("emailsPerBatch", suggestedSize);
          toast.error(`Only ${suggestedSize} emails remaining. Batch size adjusted automatically. Please try again.`);
        } else {
          toast.error(errorMessage);
        }
      } else if (errorMessage.includes("Batch size") && errorMessage.includes("cannot be greater than total emails")) {
        // Extract the suggested batch size from error message
        const match = errorMessage.match(/Please set batch size to (\d+) or less/);
        if (match) {
          const suggestedSize = match[1];
          setValue("emailsPerBatch", suggestedSize);
          toast.error(`Total emails: ${suggestedSize}. Batch size adjusted automatically. Please try again.`);
        } else {
          toast.error(errorMessage);
        }
      } else {
        toast.error(errorMessage);
      }
    },
  });

  // Delete campaign mutation (Admin only)
  const deleteCampaignMutation = useMutation({
    mutationFn: async (uploadId: number) => {
      const result = await apiClient.deleteCampaign(uploadId);
      return result as DeleteCampaignResponse;
    },
    onSuccess: (response: DeleteCampaignResponse) => {
      toast.success(response?.message || "Campaign deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["uploads-with-batches"] });
      setDeleteDialogOpen(false);
      setUploadToDelete(null);
      if (selectedUpload?.id === uploadToDelete?.id) {
        setSelectedUpload(null);
      }
    },
    onError: (error: unknown) => {
      const errorMessage =
        (error as { message?: string })?.message || "Failed to delete campaign";
      toast.error(errorMessage);
    },
  });

  const handleDeleteClick = (upload: EmailUpload, e: React.MouseEvent) => {
    e.stopPropagation();
    setUploadToDelete(upload);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (uploadToDelete) {
      deleteCampaignMutation.mutate(uploadToDelete.id);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const uploads =
    (uploadsData as GetUploadsWithBatchesResponse)?.data?.uploads || [];

  // Auto-select upload if uploadId is provided in URL
  useEffect(() => {
    const uploadId = searchParams.get("uploadId");
    if (uploadId && uploads.length > 0) {
      const upload = uploads.find((u) => u.id.toString() === uploadId);
      if (upload) {
        setSelectedUpload(upload);

        // Pre-fill form with existing batch data if available
        if (upload.batches.length > 0) {
          const batch = upload.batches[0];
          setValue("batchName", batch.batchName || "");
          setValue("subject", batch.subject || "");
          setValue(
            "delayBetweenEmails",
            (batch.delayBetweenEmails / 1000).toString()
          );
          setValue("emailsPerBatch", batch.emailsPerBatch.toString());
          setEmailContent(batch.composedEmail || "");
        } else {
          // No batch exists - try to load from localStorage (from EmailComposer)
          const savedEmail = localStorage.getItem("emailComposer_emailContent");
          const savedSubject = localStorage.getItem("emailComposer_subject");
          const savedBatchName = localStorage.getItem("emailComposer_batchName");

          if (savedEmail) {
            setEmailContent(JSON.parse(savedEmail));
          }
          if (savedSubject) {
            setValue("subject", JSON.parse(savedSubject));
          }
          if (savedBatchName) {
            setValue("batchName", JSON.parse(savedBatchName));
          }
        }
      }
    }
  }, [uploads, searchParams, setValue]);

  const onSubmit = (data: EmailBatchFormData) => {
    if (!selectedUpload) {
      toast.error("Please select a campaign first");
      return;
    }

    // Validate email content length
    if (!emailContent.trim()) {
      toast.error("Please write your email content");
      return;
    }
    if (emailContent.length < 10) {
      toast.error("Composed email cannot be empty (minimum 10 characters)");
      return;
    }
    if (emailContent.length > 10000) {
      toast.error("Composed email must be less than 10000 characters");
      return;
    }

    let scheduleTimeValue = "NOW";
    if (
      data.scheduleTime === "SCHEDULED" &&
      data.scheduledDate &&
      data.scheduledTime
    ) {
      const scheduledDateTime = new Date(
        `${data.scheduledDate}T${data.scheduledTime}`
      );
      scheduleTimeValue = scheduledDateTime.toISOString();
    }

    createBatchMutation.mutate({
      uploadId: selectedUpload.id,
      batchName: data.batchName,
      subject: data.subject,
      composedEmail: emailContent,
      delayBetweenEmails: data.delayBetweenEmails,
      emailsPerBatch: data.emailsPerBatch,
      scheduleTime: scheduleTimeValue,
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/create-campaign">
            <Button
              variant="ghost"
              className="mb-4 text-gray-600 hover:text-gray-900"
            >
              <IconArrowLeft className="w-4 h-4 mr-2" />
              Back to Create Campaign
            </Button>
          </Link>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-800 rounded-xl flex items-center justify-center">
              <IconFileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {selectedUpload
                  ? "Update Campaign Settings"
                  : "Select Campaign to Manage"}
              </h1>
              <p className="text-gray-600">
                {selectedUpload
                  ? "Update your campaign settings and resume email sending"
                  : "Select an existing campaign to pause, resume, or update settings"}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-5">
          {/* Campaign Selection - Left Side */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Select Campaign</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <IconLoader2 className="w-6 h-6 animate-spin" />
                    <span className="ml-2">Loading campaigns...</span>
                  </div>
                ) : uploads.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <IconMail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p>No existing campaigns found.</p>
                    <Link to="/email-composer">
                      <Button className="mt-4">
                        Create Your First Campaign
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {uploads.map((upload) => (
                      <Card
                        key={upload.id}
                        className={`cursor-pointer transition-all ${
                          selectedUpload?.id === upload.id
                            ? "ring-2 ring-green-500 border-green-500 bg-green-50"
                            : "hover:border-gray-300 hover:shadow-sm"
                        }`}
                        onClick={() => setSelectedUpload(upload)}
                      >
                        <CardContent className="p-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-gray-900 truncate">
                                {upload.uploadedFileName}
                              </h4>
                              <div className="flex items-center gap-2">
                                <Badge className={getStatusColor(upload.batches.length > 0 ? upload.batches[0].status : upload.status)}>
                                  {upload.batches.length > 0 ? upload.batches[0].status : upload.status}
                                </Badge>
                                {isAdmin && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                    onClick={(e) => handleDeleteClick(upload, e)}
                                    title="Delete campaign"
                                  >
                                    <IconTrash className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>
                            </div>
                            <p className="text-sm text-gray-500">
                              Uploaded {formatDate(upload.createdAt)} by{" "}
                              {upload.uploadedBy}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <IconUsers className="w-4 h-4" />
                                <span>{upload.totalEmails} total</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <IconClock className="w-4 h-4" />
                                <span>{upload.remainingEmails} remaining</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Batch Creation Form - Right Side */}
          <div className="lg:col-span-3">
            {selectedUpload ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Selected Campaign Info */}
                <Card>
                  <CardHeader>
                    <CardTitle>Campaign Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 className="font-medium text-green-900">
                        {selectedUpload.uploadedFileName}
                      </h4>
                      <p className="text-sm text-green-700 mt-1">
                        {selectedUpload.totalEmails} emails total • {selectedUpload.remainingEmails} remaining
                        {selectedUpload.batches.length > 0
                          ? ` • Current batch status: ${selectedUpload.batches[0].status}`
                          : " • No active batch"}
                      </p>
                      {selectedUpload.batches.length > 0 && (
                        <div className="mt-2 text-xs text-green-600">
                          Batch: {selectedUpload.batches[0].batchName} •
                          Processing {selectedUpload.batches[0].emailsPerBatch}{" "}
                          emails per batch
                        </div>
                      )}
                      {selectedUpload.remainingEmails > 0 && selectedUpload.remainingEmails < 100 && (
                        <div className="mt-2 text-xs text-amber-600 font-medium">
                          ⚠️ Only {selectedUpload.remainingEmails} emails remaining. Set batch size to {selectedUpload.remainingEmails} or less.
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Batch Details */}
                <Card>
                  <CardHeader>
                    <CardTitle>Batch Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="batchName">Batch Name</Label>
                        <Input
                          id="batchName"
                          placeholder="e.g. Follow-up Campaign Wave 2"
                          {...register("batchName")}
                          className="mt-1"
                        />
                        {errors.batchName && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors.batchName.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="subject">Subject Line</Label>
                        <Input
                          id="subject"
                          placeholder="Enter email subject"
                          {...register("subject")}
                          className="mt-1"
                        />
                        {errors.subject && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors.subject.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label>Email Content</Label>
                      <div className="mt-2">
                        <RichTextEditor
                          content={emailContent}
                          onChange={setEmailContent}
                          placeholder="Write your email content here..."
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Batch Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle>Batch Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="emailsPerBatch">Emails per Batch</Label>
                        <Input
                          id="emailsPerBatch"
                          type="number"
                          min="1"
                          max="1000"
                          {...register("emailsPerBatch")}
                          className="mt-1"
                        />
                        {errors.emailsPerBatch && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors.emailsPerBatch.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <DelaySelector
                          value={delayBetweenEmails}
                          onChange={(value) => setValue("delayBetweenEmails", value)}
                          label="Delay Between Emails"
                          error={errors.delayBetweenEmails?.message}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label>Send Time</Label>
                        <Select
                          value={scheduleTime}
                          onValueChange={(value) =>
                            setValue(
                              "scheduleTime",
                              value as "NOW" | "SCHEDULED"
                            )
                          }
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="NOW">Send Now</SelectItem>
                            <SelectItem value="SCHEDULED">
                              Schedule for Later
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {scheduleTime === "SCHEDULED" && (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="scheduledDate">Date</Label>
                            <Input
                              id="scheduledDate"
                              type="date"
                              {...register("scheduledDate")}
                              className="mt-1"
                              min={new Date().toISOString().split("T")[0]}
                            />
                          </div>
                          <div>
                            <Label htmlFor="scheduledTime">Time</Label>
                            <Input
                              id="scheduledTime"
                              type="time"
                              {...register("scheduledTime")}
                              className="mt-1"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Submit Button */}
                <div className="flex justify-end space-x-3">
                  <Link to="/create-campaign">
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                  </Link>
                  <Button
                    type="submit"
                    disabled={createBatchMutation.isPending}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {createBatchMutation.isPending ? (
                      <>
                        <IconLoader2 className="w-4 h-4 mr-2 animate-spin" />
                        {selectedUpload?.batches.length > 0
                          ? "Updating Campaign..."
                          : "Creating Campaign..."}
                      </>
                    ) : (
                      <>
                        <IconMail className="w-4 h-4 mr-2" />
                        {selectedUpload?.batches.length > 0
                          ? "Update & Resume Campaign"
                          : "Create Campaign"}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <IconMail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Select a Campaign
                    </h3>
                    <p className="text-gray-600">
                      Choose an existing campaign from the list to create a new
                      batch
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Campaign</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete campaign <strong>{uploadToDelete?.uploadedFileName}</strong>?
              <br /><br />
              This action will:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Remove all {uploadToDelete?.remainingEmails || 0} remaining email records</li>
                <li>Delete batch configuration and metadata</li>
                <li>Clear all queued jobs from the processing queue</li>
                <li>Remove Redis cache data</li>
              </ul>
              <br />
              <strong className="text-red-600">This action cannot be undone.</strong>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteCampaignMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={deleteCampaignMutation.isPending}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {deleteCampaignMutation.isPending ? (
                <>
                  <IconLoader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Campaign"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
