'use client';

import React from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import LookupPage from '../LookupPage';

const OrderLookupWithCodePage = () => {
    const params = useParams();
    const searchParams = useSearchParams();
    const orderCode = params?.orderCode ? String(params.orderCode) : undefined;
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    return <LookupPage initialOrderCode={orderCode} initialEmail={email} initialToken={token} />;
};

export default OrderLookupWithCodePage;

