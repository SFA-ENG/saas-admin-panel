import {
  MapPinIcon,
  TrophyIcon,
  FlagIcon,
  ChevronDownIcon,
  InfoIcon,
  CheckCircleIcon,
  ClockIcon,
  TargetIcon,
  BookOpenIcon,
  Calendar,
  Award,
  Layers,
  User,
  Users,
  Medal,
  FileText,
} from "lucide-react";

// Icon component wrappers
export const Trophy = ({ size, className }) => (
  <TrophyIcon size={size} className={className} />
);

export const Globe = ({ size, className }) => (
  <div className={className}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="2" y1="12" x2="22" y2="12"></line>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
    </svg>
  </div>
);

export const BarChart = ({ size, className }) => (
  <div className={className}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="20" x2="18" y2="10"></line>
      <line x1="12" y1="20" x2="12" y2="4"></line>
      <line x1="6" y1="20" x2="6" y2="14"></line>
      <line x1="2" y1="20" x2="22" y2="20"></line>
    </svg>
  </div>
);

export const MapPin = ({ size, className }) => (
  <div className={className}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
      <circle cx="12" cy="10" r="3"></circle>
    </svg>
  </div>
);

// Export other Lucide icons directly
export {
  MapPinIcon,
  FlagIcon,
  ChevronDownIcon,
  InfoIcon,
  CheckCircleIcon,
  ClockIcon,
  TargetIcon,
  BookOpenIcon,
  Calendar,
  Award,
  Layers,
  User,
  Users,
  Medal,
  FileText,
}; 