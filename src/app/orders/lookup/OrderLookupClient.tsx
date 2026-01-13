'use client';

import OrderLookupPage from '@/layout/orderLookup';

interface OrderLookupClientProps {
    initialOrderCode?: string | null;
    initialEmail?: string | null;
    initialToken?: string | null;
}

export default function OrderLookupClient({
    initialOrderCode,
    initialEmail,
    initialToken,
}: OrderLookupClientProps) {
    return (
        <OrderLookupPage
            initialOrderCode={initialOrderCode}
            initialEmail={initialEmail}
            initialToken={initialToken}
        />
    );
}

