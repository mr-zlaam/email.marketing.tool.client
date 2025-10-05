import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export interface DelayOption {
  label: string;
  value: string;
  seconds: number;
}

export const DELAY_OPTIONS: DelayOption[] = [
  { label: "No delay", value: "0", seconds: 0 },
  { label: "5 seconds", value: "5", seconds: 5 },
  { label: "30 seconds", value: "30", seconds: 30 },
  { label: "1 minute", value: "60", seconds: 60 },
  { label: "5 minutes", value: "300", seconds: 300 },
  { label: "20 minutes", value: "1200", seconds: 1200 },
  { label: "30 minutes", value: "1800", seconds: 1800 },
  { label: "1 hour", value: "3600", seconds: 3600 },
  { label: "5 hours", value: "18000", seconds: 18000 },
  { label: "24 hours", value: "86400", seconds: 86400 },
];

interface DelaySelectorProps {
  value?: string;
  onChange: (value: string) => void;
  label?: string;
  error?: string;
}

export const DelaySelector = ({
  value = "5",
  onChange,
  label = "Delay Between Emails",
  error
}: DelaySelectorProps) => {
  return (
    <div className="space-y-2">
      {label && <Label htmlFor="delay-selector">{label}</Label>}
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id="delay-selector" className={error ? "border-red-500" : ""}>
          <SelectValue placeholder="Select delay" />
        </SelectTrigger>
        <SelectContent>
          {DELAY_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};

// Utility function to convert seconds to human-readable format
export const secondsToLabel = (seconds: number): string => {
  const option = DELAY_OPTIONS.find(opt => opt.seconds === seconds);
  if (option) return option.label;

  // Fallback for custom values
  if (seconds === 0) return "No delay";
  if (seconds < 60) return `${seconds} seconds`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours`;
  return `${Math.floor(seconds / 86400)} days`;
};

// Utility function to get seconds from value
export const getSecondsFromValue = (value: string): number => {
  const option = DELAY_OPTIONS.find(opt => opt.value === value);
  return option ? option.seconds : parseInt(value) || 0;
};
