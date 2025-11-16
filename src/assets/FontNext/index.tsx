import localFont from 'next/font/local';

// Chỉ load những font weights thực sự cần thiết để giảm preload warnings
export const harmonyOS = localFont({
    src: [
        {
            path: '../fonts/HarmonyOS_Sans_Regular.ttf',
            weight: '400',
            style: 'normal',
        },
        {
            path: '../fonts/HarmonyOS_Sans_Medium.ttf',
            weight: '500',
            style: 'normal',
        },
        {
            path: '../fonts/HarmonyOS_Sans_Bold.ttf',
            weight: '600 700',
            style: 'normal',
        },
    ],
    variable: '--font-harmony-os',
    display: 'optional', // Thay đổi từ 'swap' sang 'optional' để tránh preload warning
    preload: true,
    fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
    adjustFontFallback: 'Arial',
});

