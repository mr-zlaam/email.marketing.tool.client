import { useState } from 'react';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { RichTextEditor } from '@/components/RichTextEditor';
import { FileUpload } from '@/components/FileUpload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  IconMail,
  IconClock,
  IconUsers,
  IconFileText,
  IconSend,
  IconArrowLeft,
} from '@tabler/icons-react';

const emailBatchSchema = z.object({
  batchName: z.string().min(1, 'Batch name is required'),
  subject: z.string().min(1, 'Subject is required'),
  scheduleTime: z.enum(['NOW', 'SCHEDULED']),
  scheduledDate: z.string().optional(),
  scheduledTime: z.string().optional(),
  delayBetweenEmails: z.string().min(1, 'Delay is required'),
  emailsPerBatch: z.string().min(1, 'Emails per batch is required'),
});

type EmailBatchFormData = z.infer<typeof emailBatchSchema>;

interface EmailComposerProps {
  onBack: () => void;
}

export const EmailComposer = ({ onBack }: EmailComposerProps) => {
  const [emailContent, setEmailContent] = useState('');
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
      scheduleTime: 'NOW',
      delayBetweenEmails: '5',
      emailsPerBatch: '50',
    },
  });

  const scheduleTime = watch('scheduleTime');

  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file);
    setSubmitError(null);
  };

  const onSubmit = async (data: EmailBatchFormData) => {
    if (!selectedFile) {
      setSubmitError('Please select a CSV or Excel file with email addresses');
      return;
    }

    if (!emailContent.trim()) {
      setSubmitError('Please write your email content');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('batchName', data.batchName);
      formData.append('composedEmail', emailContent); // Updated to match backend
      formData.append('delayBetweenEmails', data.delayBetweenEmails);
      formData.append('emailsPerBatch', data.emailsPerBatch);

      // Handle schedule time
      if (data.scheduleTime === 'SCHEDULED' && data.scheduledDate && data.scheduledTime) {
        const scheduledDateTime = new Date(`${data.scheduledDate}T${data.scheduledTime}`);
        formData.append('scheduleTime', scheduledDateTime.toISOString());
      } else {
        formData.append('scheduleTime', 'NOW');
      }

      const result = await apiClient.createEmailBatch(formData);
      const successMessage = `Email batch "${data.batchName}" created successfully! ${result.totalEmails || 0} emails queued.`;
      setSubmitSuccess(successMessage);
      toast.success(successMessage);

      // Reset form
      setSelectedFile(null);
      setEmailContent('');
      setValue('batchName', '');
      setValue('subject', '');
      setValue('scheduleTime', 'NOW');
      setValue('delayBetweenEmails', '5');
      setValue('emailsPerBatch', '50');
    } catch (error: unknown) {
      const errorMessage = (error as { message?: string })?.message || 'Failed to create email batch. Please try again.';
      setSubmitError(errorMessage);
      toast.error(errorMessage);
      console.error('Email batch creation error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-4 text-gray-600 hover:text-gray-900"
          >
            <IconArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-700 to-amber-800 rounded-xl flex items-center justify-center">
              <IconMail className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Email Composer</h1>
              <p className="text-gray-600">Create and schedule email campaigns</p>
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
                      {...register('subject')}
                      className="mt-1"
                    />
                    {errors.subject && (
                      <p className="mt-1 text-sm text-red-500">{errors.subject.message}</p>
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
                    acceptedTypes={['.csv', '.xlsx', '.xls']}
                    acceptedTypeNames={['CSV', 'Excel']}
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
                      placeholder="e.g. Newsletter Nov 2024"
                      {...register('batchName')}
                      className="mt-1"
                    />
                    {errors.batchName && (
                      <p className="mt-1 text-sm text-red-500">{errors.batchName.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="emailsPerBatch">Emails per Batch</Label>
                    <Input
                      id="emailsPerBatch"
                      type="number"
                      min="1"
                      max="1000"
                      {...register('emailsPerBatch')}
                      className="mt-1"
                    />
                    {errors.emailsPerBatch && (
                      <p className="mt-1 text-sm text-red-500">{errors.emailsPerBatch.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="delayBetweenEmails">Delay Between Emails (seconds)</Label>
                    <Input
                      id="delayBetweenEmails"
                      type="number"
                      min="1"
                      max="3600"
                      {...register('delayBetweenEmails')}
                      className="mt-1"
                    />
                    {errors.delayBetweenEmails && (
                      <p className="mt-1 text-sm text-red-500">{errors.delayBetweenEmails.message}</p>
                    )}
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
                  <CardDescription>
                    When to send the emails
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Send Time</Label>
                    <Select value={scheduleTime} onValueChange={(value) => setValue('scheduleTime', value as 'NOW' | 'SCHEDULED')}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NOW">Send Now</SelectItem>
                        <SelectItem value="SCHEDULED">Schedule for Later</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {scheduleTime === 'SCHEDULED' && (
                    <>
                      <div>
                        <Label htmlFor="scheduledDate">Date</Label>
                        <Input
                          id="scheduledDate"
                          type="date"
                          {...register('scheduledDate')}
                          className="mt-1"
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      <div>
                        <Label htmlFor="scheduledTime">Time</Label>
                        <Input
                          id="scheduledTime"
                          type="time"
                          {...register('scheduledTime')}
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
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-700">{submitError}</p>
                    </div>
                  )}

                  {submitSuccess && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-700">{submitSuccess}</p>
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
  );
};