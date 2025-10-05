import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { apiClient } from "@/lib/api";
import { getErrorMessage } from "@/lib/error-utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { emailBatchSchema, type EmailBatchFormData } from "@/schemas/validation.schemas";
import { Layout } from "@/components/Layout";
import { RichTextEditor } from "@/components/RichTextEditor";
import { FileUpload } from "@/components/FileUpload";
import { DelaySelector } from "@/components/DelaySelector";
import { ErrorAlert, SuccessAlert } from "@/components/ErrorAlert";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  IconMail,
  IconClock,
  IconUsers,
  IconFileText,
  IconSend,
  IconArrowLeft,
} from "@tabler/icons-react";

export const EmailComposer = () => {
  // LocalStorage hooks for persistence
  const [storedBatchName, setStoredBatchName] = useLocalStorage("emailComposer_batchName", "");
  const [storedSubject, setStoredSubject] = useLocalStorage("emailComposer_subject", "");
  const [storedEmailContent, setStoredEmailContent] = useLocalStorage("emailComposer_emailContent", "");
  const [storedDelay, setStoredDelay] = useLocalStorage("emailComposer_delay", "5");
  const [storedEmailsPerBatch, setStoredEmailsPerBatch] = useLocalStorage("emailComposer_emailsPerBatch", "50");
  const [storedScheduleTime, setStoredScheduleTime] = useLocalStorage<"NOW" | "SCHEDULED">("emailComposer_scheduleTime", "NOW");

  const [emailContent, setEmailContent] = useState(storedEmailContent);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

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
      scheduleTime: storedScheduleTime,
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

  useEffect(() => {
    if (scheduleTime === "NOW" || scheduleTime === "SCHEDULED") {
      setStoredScheduleTime(scheduleTime);
    }
  }, [scheduleTime, setStoredScheduleTime]);

  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file);
    setSubmitError(null);
  };

  const onSubmit = async (data: EmailBatchFormData) => {
    if (!selectedFile) {
      setSubmitError("Please select a CSV or Excel file with email addresses");
      return;
    }

    // Validate email content length
    if (!emailContent.trim()) {
      setSubmitError("Please write your email content");
      return;
    }
    if (emailContent.length < 10) {
      setSubmitError("Composed email cannot be empty (minimum 10 characters)");
      return;
    }
    if (emailContent.length > 10000) {
      setSubmitError("Composed email must be less than 10000 characters");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("batchName", data.batchName);
      formData.append("composedEmail", emailContent);
      formData.append("delayBetweenEmails", data.delayBetweenEmails);
      formData.append("emailsPerBatch", data.emailsPerBatch);
      formData.append("subject", data.subject);

      // Handle schedule time
      if (
        data.scheduleTime === "SCHEDULED" &&
        data.scheduledDate &&
        data.scheduledTime
      ) {
        const scheduledDateTime = new Date(
          `${data.scheduledDate}T${data.scheduledTime}`
        );
        formData.append("scheduleTime", scheduledDateTime.toISOString());
      } else {
        formData.append("scheduleTime", "NOW");
      }

      const result = await apiClient.createEmailBatch(formData);
      const successMessage = `Email batch "${
        data.batchName
      }" created successfully! ${
        (result as { totalEmails: number }).totalEmails || 0
      } emails queued.`;
      setSubmitSuccess(successMessage);
      toast.success(successMessage);

      // Reset file selection only
      setSelectedFile(null);
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);

      // Handle batch size validation errors with helpful suggestions
      if (errorMessage.includes("Batch size") && errorMessage.includes("cannot be greater than")) {
        // Extract the suggested batch size from error message
        const match = errorMessage.match(/Please set batch size to (\d+) or less/);
        if (match) {
          const suggestedSize = match[1];
          setValue("emailsPerBatch", suggestedSize);
          setSubmitError(`${errorMessage}\n\nBatch size has been automatically adjusted to ${suggestedSize}. Please try again.`);
          toast.error(`Batch size adjusted to ${suggestedSize} emails`);
        } else {
          setSubmitError(errorMessage);
          toast.error(errorMessage);
        }
      } else {
        setSubmitError(errorMessage);
        toast.error(errorMessage);
      }

      console.error("Email batch creation error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout title="Email Composer">
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <Link to="/">
              <Button
                variant="ghost"
                className="mb-4 text-gray-600 hover:text-gray-900"
              >
                <IconArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>

            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-700 to-amber-800 rounded-xl flex items-center justify-center">
                <IconMail className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Email Composer
                </h1>
                <p className="text-gray-600">
                  Create and schedule email campaigns
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Email Content */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <IconFileText className="w-5 h-5" />
                      Email Content
                    </CardTitle>
                    <CardDescription>
                      Create your email content using the rich text editor
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
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

                    <div>
                      <Label>Email Content</Label>
                      <div className="mt-2">
                        <RichTextEditor
                          content={emailContent}
                          onChange={setEmailContent}
                          placeholder="Start writing your email content here..."
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* File Upload */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <IconUsers className="w-5 h-5" />
                      Email Recipients
                    </CardTitle>
                    <CardDescription>
                      Upload a CSV or Excel file containing email addresses
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FileUpload
                      onFileSelect={handleFileSelect}
                      selectedFile={selectedFile}
                      acceptedTypes={[".csv", ".xlsx", ".xls"]}
                      acceptedTypeNames={["CSV", "Excel"]}
                      maxSizeInMB={10}
                      disabled={isSubmitting}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Settings Panel */}
              <div className="space-y-6">
                {/* Batch Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle>Batch Settings</CardTitle>
                    <CardDescription>
                      Configure your email campaign
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="batchName">Campaign Name</Label>
                      <Input
                        id="batchName"
                        placeholder={`e.g: Spring Sale - ${new Date().getFullYear()}`}
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
                  </CardContent>
                </Card>

                {/* Schedule Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <IconClock className="w-5 h-5" />
                      Schedule
                    </CardTitle>
                    <CardDescription>When to send the emails</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Send Time</Label>
                      <Select
                        value={scheduleTime}
                        onValueChange={(value) =>
                          setValue("scheduleTime", value as "NOW" | "SCHEDULED")
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
                      <>
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
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* Submit Button */}
                <Card>
                  <CardContent className="pt-6">
                    {submitError && (
                      <div className="mb-4">
                        <ErrorAlert
                          error={submitError}
                          title="Campaign Creation Failed"
                          onDismiss={() => setSubmitError(null)}
                        />
                      </div>
                    )}

                    {submitSuccess && (
                      <div className="mb-4">
                        <SuccessAlert
                          message={submitSuccess}
                          title="Campaign Created Successfully"
                          onDismiss={() => setSubmitSuccess(null)}
                        />
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-primary hover:bg-primary/90"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Creating Campaign...
                        </>
                      ) : (
                        <>
                          <IconSend className="w-4 h-4 mr-2" />
                          Create Email Campaign
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};
