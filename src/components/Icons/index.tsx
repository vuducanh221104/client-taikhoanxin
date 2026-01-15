// Re-export Lucide React icons with the same names for compatibility
import {
    Search,
    User,
    ShoppingCart,
    Heart,
    Eye,
    EyeOff,
    Flame,
    Percent,
    Briefcase,
    CreditCard,
    Menu,
    Newspaper,
    Gift,
    Handshake,
    Calculator,
    FileText,
    GraduationCap,
    Brain,
    Image as LucideImage,
    Cloud,
    Play,
    ChevronLeft,
    ChevronRight,
    ChevronUp,
    X,
    Clock,
    ArrowUpRight,
    Mail,
    Phone,
    Facebook,
    Instagram,
    Youtube,
    Send,
    Minus,
    Plus,
    Star,
    CheckCircle,
    Check,
    Copy,
    Diamond,
    MessageCircle,
    QrCode,
    ScanLine,
    Wallet,
    ChevronDown,
    Filter,
    RotateCcw,
    LogOut,
    Download,
    Lock,
    Share2,
    Trash2,
    MapPin,
    Pencil,
    Calendar,
    History,
    Settings,
    XCircle,
    AlertCircle,
    Info,
    ShoppingBag,
    Package,
    Inbox,
    FileSearch,
    Frown,
    Home,
    Loader2,
    Key,
    Moon,
    Sun,
    Truck,
    ShieldCheck,
    Tag,
    Bell,
    BarChart3,
    Users,
    LayoutDashboard,
    FileText as DocumentText,
    Wrench,
} from 'lucide-react';
import React from 'react';

// Helper function to wrap Lucide icons with consistent props
const createIcon = (
    IconComponent: React.ComponentType<any>,
    defaultSize: number = 24
): React.FC<React.SVGProps<SVGSVGElement> & { size?: number }> => {
    const IconWrapper: React.FC<React.SVGProps<SVGSVGElement> & { size?: number }> = ({
        className,
        size,
        ...props
    }) => (
        <IconComponent className={className} size={size || defaultSize} {...props} />
    );

    IconWrapper.displayName =
        IconComponent.displayName || IconComponent.name || 'Icon';

    return IconWrapper;
};

// Create icons with default size 24
export const SearchIcon = createIcon(Search);
export const UserIcon = createIcon(User);
export const CartIcon = createIcon(ShoppingCart);
export const HeartIcon = createIcon(Heart);
export const EyeIcon = createIcon(Eye, 20);
export const FlameIcon = createIcon(Flame, 20);
export const PercentIcon = createIcon(Percent, 20);
export const BriefcaseIcon = createIcon(Briefcase, 20);
export const CreditCardIcon = createIcon(CreditCard, 20);
export const MenuIcon = createIcon(Menu);
export const NewsIcon = createIcon(Newspaper, 20);
export const GiftIcon = createIcon(Gift, 20);
export const HandshakeIcon = createIcon(Handshake, 20);
export const CalculatorIcon = createIcon(Calculator, 20);
export const OfficeIcon = createIcon(FileText, 20);
export const GraduationIcon = createIcon(GraduationCap, 20);
export const BrainIcon = createIcon(Brain, 20);
export const ImageIcon = createIcon(LucideImage, 20);
export const CloudIcon = createIcon(Cloud, 20);
export const PlayIcon = createIcon(Play, 20);
export const ChevronLeftIcon = createIcon(ChevronLeft);
export const ChevronRightIcon = createIcon(ChevronRight, 16);
export const ChevronUpIcon = createIcon(ChevronUp);
export const CloseIcon = createIcon(X);
export const ClockIcon = createIcon(Clock);
export const ArrowUpRightIcon = createIcon(ArrowUpRight, 16);
export const EyeOffIcon = createIcon(EyeOff);
export const MailIcon = createIcon(Mail, 20);
export const PhoneIcon = createIcon(Phone, 20);
export const FacebookIcon = createIcon(Facebook);
export const InstagramIcon = createIcon(Instagram);
export const YoutubeIcon = createIcon(Youtube);
export const TelegramIcon = createIcon(Send); // Using Send icon for Telegram
export const SendIcon = createIcon(Send);
export const MinusIcon = createIcon(Minus);
export const PlusIcon = createIcon(Plus);
export const XIcon = createIcon(X);
export const TrashIcon = createIcon(Trash2);
export const StarIcon = createIcon(Star);
export const ShoppingCartIcon = createIcon(ShoppingCart);
export const CheckCircleIcon = createIcon(CheckCircle);
export const CheckIcon = createIcon(Check);
export const CopyIcon = createIcon(Copy);
export const DiamondIcon = createIcon(Diamond, 16);
export const MessageCircleIcon = createIcon(MessageCircle, 16);
export const QrCodeIcon = createIcon(QrCode);
export const ScanLineIcon = createIcon(ScanLine);
export const WalletIcon = createIcon(Wallet);
export const ChevronDownIcon = createIcon(ChevronDown);
export const FilterIcon = createIcon(Filter);
export const RotateCcwIcon = createIcon(RotateCcw);
export const LogOutIcon = createIcon(LogOut, 18);
export const LockIcon = createIcon(Lock, 20);
export const ShareIcon = createIcon(Share2, 20);
export const MapPinIcon = createIcon(MapPin, 20);
export const FileTextIcon = createIcon(FileText, 20);
export const PencilIcon = createIcon(Pencil, 16);
export const CalendarIcon = createIcon(Calendar, 18);
export const HistoryIcon = createIcon(History, 18);
export const SettingsIcon = createIcon(Settings, 18);
export const XCircleIcon = createIcon(XCircle, 20);
export const AlertCircleIcon = createIcon(AlertCircle, 20);
export const InfoIcon = createIcon(Info, 20);
export const ShoppingBagIcon = createIcon(ShoppingBag, 20);
export const PackageIcon = createIcon(Package, 20);
export const InboxIcon = createIcon(Inbox, 20);
export const FileSearchIcon = createIcon(FileSearch, 20);
export const FrownIcon = createIcon(Frown, 20);
export const HomeIcon = createIcon(Home, 20);
export const LoaderIcon = createIcon(Loader2, 20);
export const KeyIcon = createIcon(Key, 20);
export const MoonIcon = createIcon(Moon, 20);
export const SunIcon = createIcon(Sun, 20);
export const PaperPlaneIcon = createIcon(Send, 20); // Alias for Send icon
export const TruckIcon = createIcon(Truck, 16);
export const ShieldCheckIcon = createIcon(ShieldCheck, 16);
export const TagIcon = createIcon(Tag, 16);
export const BellIcon = createIcon(Bell, 20);
export const BarChartIcon = createIcon(BarChart3, 20);
export const UsersIcon = createIcon(Users, 20);
export const DashboardIcon = createIcon(LayoutDashboard, 20);
export const DocumentTextIcon = createIcon(DocumentText, 20);
export const ChartBarIcon = createIcon(BarChart3, 20);
export const DownloadIcon = createIcon(Download, 20);
export const ToolIcon = createIcon(Wrench, 20);

// Category Icon - Using Grid icon from Lucide
import { Grid, List, ArrowUpDown } from 'lucide-react';
export const CategoryIcon = createIcon(Grid, 20);
export const GridIcon = createIcon(Grid, 20);
export const ListIcon = createIcon(List, 20);
export const SortIcon = createIcon(ArrowUpDown, 20);

// Windows Icon - Custom (Lucide doesn't have Windows icon)
// Updated to match the design with overlapping windows
export const WindowsIcon = ({ className, size = 20, ...props }: React.SVGProps<SVGSVGElement> & { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} {...props}>
        <path d="M3 3h8v8H3V3z" fill="currentColor" />
        <path d="M13 3h8v8h-8V3z" fill="currentColor" />
        <path d="M3 13h8v8H3v-8z" fill="currentColor" />
        <path d="M13 13h8v8h-8v-8z" fill="currentColor" />
    </svg>
);

// VNPAY QR Icon - Custom
export const VnpayQrIcon = ({ className, size = 32, ...props }: React.SVGProps<SVGSVGElement> & { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className} {...props}>
        <rect width="64" height="64" rx="8" fill="#1e40af" />
        <text x="32" y="20" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">VNPAY</text>
        <text x="32" y="32" textAnchor="middle" fill="white" fontSize="8">QR</text>
        <rect x="18" y="38" width="28" height="28" rx="2" fill="white" />
        <rect x="22" y="42" width="4" height="4" fill="#1e40af" />
        <rect x="38" y="42" width="4" height="4" fill="#1e40af" />
        <rect x="22" y="58" width="4" height="4" fill="#1e40af" />
        <rect x="38" y="58" width="4" height="4" fill="#1e40af" />
    </svg>
);

// Online Banking QR Icon - Custom
export const OnlineBankingQrIcon = ({ className, size = 32, ...props }: React.SVGProps<SVGSVGElement> & { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className} {...props}>
        <rect width="64" height="64" rx="8" fill="#e74c3c" />
        <text x="32" y="16" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">ONLINE</text>
        <text x="32" y="24" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">BANKING</text>
        <rect x="18" y="30" width="28" height="28" rx="2" fill="white" />
        <rect x="22" y="34" width="4" height="4" fill="#e74c3c" />
        <rect x="38" y="34" width="4" height="4" fill="#e74c3c" />
        <rect x="22" y="50" width="4" height="4" fill="#e74c3c" />
        <rect x="38" y="50" width="4" height="4" fill="#e74c3c" />
    </svg>
);

// Viettel Icon - Custom
export const ViettelIcon = ({ className, size = 32, ...props }: React.SVGProps<SVGSVGElement> & { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className} {...props}>
        <ellipse cx="32" cy="32" rx="30" ry="28" fill="#10b981" />
        <text x="32" y="38" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">VIETTEL</text>
    </svg>
);

// Visa/Mastercard/JCB Icon - Custom
export const CardPaymentIcon = ({ className, size = 32, ...props }: React.SVGProps<SVGSVGElement> & { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className} {...props}>
        <rect width="64" height="40" rx="4" fill="#ef4444" />
        <text x="32" y="28" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">VISA</text>
        <circle cx="48" cy="12" r="6" fill="#f97316" />
        <circle cx="54" cy="12" r="6" fill="#3b82f6" />
    </svg>
);

// Zalo Icon
export const ZaloIcon = ({ className, size = 20, ...props }: React.SVGProps<SVGSVGElement> & { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 256 256" fill="none" className={className} {...props}>
        <g
            fill="#ffffffff"
            fillRule="nonzero"
            style={{ mixBlendMode: 'normal' }}
        >
            <g transform="scale(5.12,5.12)">
                <path d="M9,4c-2.74952,0 -5,2.25048 -5,5v32c0,2.74952 2.25048,5 5,5h32c2.74952,0 5,-2.25048 5,-5v-32c0,-2.74952 -2.25048,-5 -5,-5zM9,6h6.58008c-3.57109,3.71569 -5.58008,8.51808 -5.58008,13.5c0,5.16 2.11016,10.09984 5.91016,13.83984c0.12,0.21 0.21977,1.23969 -0.24023,2.42969c-0.29,0.75 -0.87023,1.72961 -1.99023,2.09961c-0.43,0.14 -0.70969,0.56172 -0.67969,1.01172c0.03,0.45 0.36078,0.82992 0.80078,0.91992c2.87,0.57 4.72852,-0.2907 6.22852,-0.9707c1.35,-0.62 2.24133,-1.04047 3.61133,-0.48047c2.8,1.09 5.77938,1.65039 8.85938,1.65039c4.09369,0 8.03146,-0.99927 11.5,-2.88672v3.88672c0,1.66848 -1.33152,3 -3,3h-32c-1.66848,0 -3,-1.33152 -3,-3v-32c0,-1.66848 1.33152,-3 3,-3zM33,15c0.55,0 1,0.45 1,1v9c0,0.55 -0.45,1 -1,1c-0.55,0 -1,-0.45 -1,-1v-9c0,-0.55 0.45,-1 1,-1zM18,16h5c0.36,0 0.70086,0.19953 0.88086,0.51953c0.17,0.31 0.15875,0.69977 -0.03125,1.00977l-4.04883,6.4707h3.19922c0.55,0 1,0.45 1,1c0,0.55 -0.45,1 -1,1h-5c-0.36,0 -0.70086,-0.19953 -0.88086,-0.51953c-0.17,-0.31 -0.15875,-0.69977 0.03125,-1.00977l4.04883,-6.4707h-3.19922c-0.55,0 -1,-0.45 -1,-1c0,-0.55 0.45,-1 1,-1zM27.5,19c0.61,0 1.17945,0.16922 1.68945,0.44922c0.18,-0.26 0.46055,-0.44922 0.81055,-0.44922c0.55,0 1,0.45 1,1v5c0,0.55 -0.45,1 -1,1c-0.35,0 -0.63055,-0.18922 -0.81055,-0.44922c-0.51,0.28 -1.07945,0.44922 -1.68945,0.44922c-1.93,0 -3.5,-1.57 -3.5,-3.5c0,-1.93 1.57,-3.5 3.5,-3.5zM38.5,19c1.93,0 3.5,1.57 3.5,3.5c0,1.93 -1.57,3.5 -3.5,3.5c-1.93,0 -3.5,-1.57 -3.5,-3.5c0,-1.93 1.57,-3.5 3.5,-3.5zM27.5,21c-0.10375,0 -0.20498,0.01131 -0.30273,0.03125c-0.19551,0.03988 -0.37754,0.11691 -0.53711,0.22461c-0.15957,0.1077 -0.2966,0.24473 -0.4043,0.4043c-0.10769,0.15957 -0.18473,0.3416 -0.22461,0.53711c-0.01994,0.09775 -0.03125,0.19898 -0.03125,0.30273c0,0.10375 0.01131,0.20498 0.03125,0.30273c0.01994,0.09775 0.04805,0.19149 0.08594,0.28125c0.03789,0.08977 0.08482,0.17607 0.13867,0.25586c0.05385,0.07979 0.11578,0.15289 0.18359,0.2207c0.06781,0.06781 0.14092,0.12975 0.2207,0.18359c0.15957,0.10769 0.3416,0.18473 0.53711,0.22461c0.09775,0.01994 0.19898,0.03125 0.30273,0.03125c0.10375,0 0.20498,-0.01131 0.30273,-0.03125c0.68428,-0.13959 1.19727,-0.7425 1.19727,-1.46875c0,-0.83 -0.67,-1.5 -1.5,-1.5zM38.5,21c-0.10375,0 -0.20498,0.01131 -0.30273,0.03125c-0.09775,0.01994 -0.19149,0.04805 -0.28125,0.08594c-0.08977,0.03789 -0.17607,0.08482 -0.25586,0.13867c-0.07979,0.05385 -0.15289,0.11578 -0.2207,0.18359c-0.13562,0.13563 -0.24648,0.29703 -0.32227,0.47656c-0.03789,0.08976 -0.066,0.1835 -0.08594,0.28125c-0.01994,0.09775 -0.03125,0.19898 -0.03125,0.30273c0,0.10375 0.01131,0.20498 0.03125,0.30273c0.01994,0.09775 0.04805,0.19149 0.08594,0.28125c0.03789,0.08977 0.08482,0.17607 0.13867,0.25586c0.05385,0.07979 0.11578,0.15289 0.18359,0.2207c0.06781,0.06781 0.14092,0.12975 0.2207,0.18359c0.07979,0.05385 0.16609,0.10078 0.25586,0.13867c0.08976,0.03789 0.1835,0.066 0.28125,0.08594c0.09775,0.01994 0.19898,0.03125 0.30273,0.03125c0.10375,0 0.20498,-0.01131 0.30273,-0.03125c0.68428,-0.13959 1.19727,-0.7425 1.19727,-1.46875c0,-0.83 -0.67,-1.5 -1.5,-1.5z"></path>
            </g>
        </g>
    </svg>
);
