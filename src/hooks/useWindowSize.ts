import { useLayoutEffect, useState } from 'react';

interface WindowSize {
    width: number;
    height: number;
}

const useWindowSize = (): WindowSize => {
    const [windowSize, setWindowSize] = useState<WindowSize>({ width: 0, height: 0 });

    const handleSize = () => {
        if (typeof window !== 'undefined') {
            setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        }
    };

    useLayoutEffect(() => {
        handleSize();
        if (typeof window !== 'undefined') {
            window.addEventListener('resize', handleSize);
            return () => window.removeEventListener('resize', handleSize);
        }
    }, []);

    return windowSize;
};

export default useWindowSize;


