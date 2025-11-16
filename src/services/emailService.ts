// Email service for sending order confirmation emails
// In production, this would integrate with a real email service like SendGrid, AWS SES, etc.

interface OrderProduct {
    id: string;
    productName: string;
    quantity: number;
    price: number;
}

interface OrderEmailData {
    orderCode: string;
    orderDate: string;
    customerEmail: string;
    products: OrderProduct[];
    totalAmount: number;
    paymentMethod: string;
}

export const sendOrderConfirmationEmail = async (orderData: OrderEmailData): Promise<boolean> => {
    try {
        // In production, this would call your backend API endpoint
        // which would then use an email service to send the actual email
        
        console.log('📧 Sending order confirmation email...');
        console.log('To:', orderData.customerEmail);
        console.log('Order Code:', orderData.orderCode);
        
        // Simulate API call
        const response = await fetch('/api/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                to: orderData.customerEmail,
                subject: `Xác nhận đơn hàng #${orderData.orderCode} - Tài Khoản Xịn`,
                template: 'order-confirmation',
                data: orderData,
            }),
        }).catch(() => {
            // If API doesn't exist yet, just log it
            console.log('✅ Email would be sent in production');
            return { ok: true };
        });

        return response.ok;
    } catch (error) {
        console.error('❌ Error sending email:', error);
        return false;
    }
};

export const generateOrderEmailHTML = (orderData: OrderEmailData): string => {
    const formatPrice = (amount: number): string => {
        return amount.toLocaleString('vi-VN') + 'đ';
    };

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return `
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Xác nhận đơn hàng</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: #3b82f6;
            color: white;
            padding: 30px 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .content {
            background: #fff;
            padding: 30px 20px;
            border: 1px solid #e5e7eb;
            border-top: none;
        }
        .greeting {
            font-size: 16px;
            margin-bottom: 20px;
        }
        .order-info {
            background: #f9fafb;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }
        .order-info h2 {
            margin-top: 0;
            font-size: 18px;
            color: #111827;
        }
        .info-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #e5e7eb;
        }
        .info-row:last-child {
            border-bottom: none;
        }
        .info-label {
            color: #6b7280;
        }
        .info-value {
            font-weight: 600;
            color: #111827;
        }
        .products {
            margin: 20px 0;
        }
        .product-item {
            padding: 15px;
            border: 1px solid #e5e7eb;
            border-radius: 6px;
            margin-bottom: 10px;
        }
        .product-name {
            font-weight: 600;
            color: #111827;
            margin-bottom: 5px;
        }
        .product-details {
            color: #6b7280;
            font-size: 14px;
        }
        .total {
            background: #eff6ff;
            padding: 15px 20px;
            border-radius: 8px;
            margin: 20px 0;
            text-align: right;
        }
        .total-label {
            font-size: 16px;
            color: #1e40af;
        }
        .total-amount {
            font-size: 24px;
            font-weight: 700;
            color: #1e40af;
        }
        .note {
            background: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .footer {
            text-align: center;
            padding: 20px;
            color: #6b7280;
            font-size: 14px;
        }
        .button {
            display: inline-block;
            background: #3b82f6;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 6px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Shop Tài Khoản Xịn</h1>
    </div>
    
    <div class="content">
        <div class="greeting">
            <strong>Xin chào ${orderData.customerEmail.split('@')[0]},</strong>
        </div>
        
        <p>Chúng tôi đã nhận được đơn hàng của bạn và đang xử lý. Dưới đây là thông tin chi tiết về đơn hàng của bạn:</p>
        
        <div class="order-info">
            <h2>Thông tin đơn hàng</h2>
            <div class="info-row">
                <span class="info-label">Mã đơn hàng:</span>
                <span class="info-value">#${orderData.orderCode}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Ngày đặt hàng:</span>
                <span class="info-value">${formatDate(orderData.orderDate)}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Phương thức thanh toán:</span>
                <span class="info-value">${orderData.paymentMethod}</span>
            </div>
        </div>
        
        <h2>Sản phẩm đã đặt</h2>
        <div class="products">
            ${orderData.products.map(product => `
                <div class="product-item">
                    <div class="product-name">${product.productName}</div>
                    <div class="product-details">
                        Số lượng: ${product.quantity} × ${formatPrice(product.price)} = ${formatPrice(product.price * product.quantity)}
                    </div>
                </div>
            `).join('')}
        </div>
        
        <div class="total">
            <div class="total-label">Tổng cộng:</div>
            <div class="total-amount">${formatPrice(orderData.totalAmount)}</div>
        </div>
        
        <div class="note">
            <strong>Lưu ý:</strong> Sau khi thanh toán được xác nhận, thông tin tài khoản sẽ được gửi đến email của bạn trong vòng 5-10 phút. Vui lòng kiểm tra cả hộp thư spam nếu không thấy email.
        </div>
        
        <center>
            <a href="https://taikhoanxin.com/account/orders/${orderData.orderCode}" class="button">
                Xem chi tiết đơn hàng
            </a>
        </center>
        
        <p>Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi qua email <a href="mailto:support@taikhoanxin.com">support@taikhoanxin.com</a></p>
        
        <p>Cảm ơn bạn đã tin tưởng và mua hàng tại <strong>Tài Khoản Xịn</strong>!</p>
    </div>
    
    <div class="footer">
        <p>Email này được gửi tự động, vui lòng không trả lời email này.</p>
        <p>© 2024 Tài Khoản Xịn. All rights reserved.</p>
    </div>
</body>
</html>
    `;
};
