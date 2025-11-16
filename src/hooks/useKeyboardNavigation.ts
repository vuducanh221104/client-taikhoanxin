'use client';

import { useEffect, useCallback } from 'react';

export interface KeyboardNavigationOptions {
    onEnter?: () => void;
    onEscape?: () => void;
    onArrowUp?: () => void;
    onArrowDown?: () => void;
    onArrowLeft?: () => void;
    onArrowRight?: () => void;
    enabled?: boolean;
    target?: HTMLElement | null;
}

export const useKeyboardNavigation = (options: KeyboardNavigationOptions) => {
    const {
        onEnter,
        onEscape,
        onArrowUp,
        onArrowDown,
        onArrowLeft,
        onArrowRight,
        enabled = true,
        target,
    } = options;

    const handleKeyDown = useCallback(
        (event: KeyboardEvent) => {
            if (!enabled) return;

            // Check if target is focused or event target is within target
            if (target && !target.contains(event.target as Node)) {
                return;
            }

            switch (event.key) {
                case 'Enter':
                    if (onEnter && !event.defaultPrevented) {
                        event.preventDefault();
                        onEnter();
                    }
                    break;
                case 'Escape':
                    if (onEscape && !event.defaultPrevented) {
                        event.preventDefault();
                        onEscape();
                    }
                    break;
                case 'ArrowUp':
                    if (onArrowUp && !event.defaultPrevented) {
                        event.preventDefault();
                        onArrowUp();
                    }
                    break;
                case 'ArrowDown':
                    if (onArrowDown && !event.defaultPrevented) {
                        event.preventDefault();
                        onArrowDown();
                    }
                    break;
                case 'ArrowLeft':
                    if (onArrowLeft && !event.defaultPrevented) {
                        event.preventDefault();
                        onArrowLeft();
                    }
                    break;
                case 'ArrowRight':
                    if (onArrowRight && !event.defaultPrevented) {
                        event.preventDefault();
                        onArrowRight();
                    }
                    break;
            }
        },
        [enabled, target, onEnter, onEscape, onArrowUp, onArrowDown, onArrowLeft, onArrowRight]
    );

    useEffect(() => {
        if (!enabled) return;

        const element = target || document;
        element.addEventListener('keydown', handleKeyDown);

        return () => {
            element.removeEventListener('keydown', handleKeyDown);
        };
    }, [enabled, target, handleKeyDown]);
};

