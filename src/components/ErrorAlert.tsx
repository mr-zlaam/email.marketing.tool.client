import { AlertCircle, XCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ErrorAlertProps {
  error: string | null;
  title?: string;
  onDismiss?: () => void;
}

export const ErrorAlert = ({ error, title = "Error", onDismiss }: ErrorAlertProps) => {
  if (!error) return null;

  return (
    <Alert variant="destructive" className="relative">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle className="font-semibold">{title}</AlertTitle>
      <AlertDescription className="mt-2">
        {error}
      </AlertDescription>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="absolute top-3 right-3 text-red-600 hover:text-red-800 transition-colors"
          aria-label="Dismiss error"
        >
          <XCircle className="h-4 w-4" />
        </button>
      )}
    </Alert>
  );
};

interface SuccessAlertProps {
  message: string | null;
  title?: string;
  onDismiss?: () => void;
}

export const SuccessAlert = ({ message, title = "Success", onDismiss }: SuccessAlertProps) => {
  if (!message) return null;

  return (
    <Alert className="border-green-200 bg-green-50 text-green-900 relative">
      <AlertCircle className="h-4 w-4 text-green-600" />
      <AlertTitle className="font-semibold text-green-900">{title}</AlertTitle>
      <AlertDescription className="mt-2 text-green-800">
        {message}
      </AlertDescription>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="absolute top-3 right-3 text-green-600 hover:text-green-800 transition-colors"
          aria-label="Dismiss message"
        >
          <XCircle className="h-4 w-4" />
        </button>
      )}
    </Alert>
  );
};
