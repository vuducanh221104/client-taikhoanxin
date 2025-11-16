/**
 * Accessibility utilities
 */

export const generateAriaLabel = (action: string, target?: string): string => {
    if (target) {
        return `${action} ${target}`;
    }
    return action;
};

export const generateAriaDescribedBy = (id: string, description?: string): string | undefined => {
    if (description) {
        return `${id}-description`;
    }
    return undefined;
};

export const focusElement = (element: HTMLElement | null): void => {
    if (element) {
        element.focus();
    }
};

export const trapFocus = (container: HTMLElement): (() => void) => {
    const focusableElements = container.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e: KeyboardEvent) => {
        if (e.key !== 'Tab') return;

        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement?.focus();
            }
        } else {
            if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement?.focus();
            }
        }
    };

    container.addEventListener('keydown', handleTabKey);

    return () => {
        container.removeEventListener('keydown', handleTabKey);
    };
};

export const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite'): void => {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;

    document.body.appendChild(announcement);

    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
};

