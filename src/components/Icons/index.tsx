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

