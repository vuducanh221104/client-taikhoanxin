'use client';

import React from 'react';
import classNames from 'classnames/bind';
import styles from './page.module.scss';

const cx = classNames.bind(styles);

export default function PrivacyPage() {
    return (
        <div className={cx('privacy-page')}>
            <div className={cx('privacy-container')}>
                {/* Hero Section */}
                <div className={cx('hero-section')}>
                    <h1 className={cx('hero-title')}>Chính Sách Bảo Mật</h1>
                    <p className={cx('hero-subtitle')}>
                        Chúng tôi cam kết bảo vệ thông tin cá nhân và quyền riêng tư của bạn
                    </p>
                </div>

                {/* Content */}
                <div className={cx('content-section')}>
                    <section className={cx('content-block')}>
                        <h2 className={cx('section-title')}>1. Giới Thiệu</h2>
                        <div className={cx('section-content')}>
                            <p>
                                Tài Khoản Xịn ("chúng tôi", "của chúng tôi" hoặc "công ty") cam kết bảo vệ và tôn trọng 
                                quyền riêng tư của bạn. Chính sách bảo mật này giải thích cách chúng tôi thu thập, sử dụng, 
                                tiết lộ và bảo vệ thông tin cá nhân của bạn khi bạn sử dụng trang web của chúng tôi.
                            </p>
                        </div>
                    </section>

                    <section className={cx('content-block')}>
                        <h2 className={cx('section-title')}>2. Thông Tin Chúng Tôi Thu Thập</h2>
                        <div className={cx('section-content')}>
                            <h3 className={cx('subsection-title')}>2.1. Thông Tin Cá Nhân</h3>
                            <p>Chúng tôi có thể thu thập các thông tin sau:</p>
                            <ul className={cx('content-list')}>
                                <li>Tên, địa chỉ email, số điện thoại</li>
                                <li>Địa chỉ giao hàng và thanh toán</li>
                                <li>Thông tin tài khoản (tên người dùng, mật khẩu)</li>
                                <li>Thông tin thanh toán (số thẻ, thông tin ngân hàng)</li>
                            </ul>

                            <h3 className={cx('subsection-title')}>2.2. Thông Tin Tự Động Thu Thập</h3>
                            <p>Chúng tôi có thể tự động thu thập:</p>
                            <ul className={cx('content-list')}>
                                <li>Địa chỉ IP và thông tin trình duyệt</li>
                                <li>Cookie và công nghệ theo dõi tương tự</li>
                                <li>Thông tin về thiết bị bạn sử dụng</li>
                                <li>Dữ liệu sử dụng trang web (trang bạn truy cập, thời gian truy cập)</li>
                            </ul>
                        </div>
                    </section>

                    <section className={cx('content-block')}>
                        <h2 className={cx('section-title')}>3. Cách Chúng Tôi Sử Dụng Thông Tin</h2>
                        <div className={cx('section-content')}>
                            <p>Chúng tôi sử dụng thông tin của bạn để:</p>
                            <ul className={cx('content-list')}>
                                <li>Cung cấp, duy trì và cải thiện dịch vụ của chúng tôi</li>
                                <li>Xử lý đơn hàng và giao dịch của bạn</li>
                                <li>Gửi thông báo về đơn hàng và cập nhật dịch vụ</li>
                                <li>Trả lời câu hỏi và hỗ trợ khách hàng</li>
                                <li>Gửi thông tin marketing và khuyến mãi (với sự đồng ý của bạn)</li>
                                <li>Phát hiện và ngăn chặn gian lận, lạm dụng và các hoạt động bất hợp pháp</li>
                                <li>Tuân thủ các nghĩa vụ pháp lý</li>
                            </ul>
                        </div>
                    </section>

                    <section className={cx('content-block')}>
                        <h2 className={cx('section-title')}>4. Chia Sẻ Thông Tin</h2>
                        <div className={cx('section-content')}>
                            <p>Chúng tôi có thể chia sẻ thông tin của bạn với:</p>
                            <ul className={cx('content-list')}>
                                <li><strong>Nhà cung cấp dịch vụ:</strong> Các bên thứ ba giúp chúng tôi vận hành trang web và cung cấp dịch vụ</li>
                                <li><strong>Đối tác thanh toán:</strong> Để xử lý thanh toán của bạn</li>
                                <li><strong>Cơ quan pháp luật:</strong> Khi được yêu cầu bởi luật pháp hoặc để bảo vệ quyền lợi của chúng tôi</li>
                                <li><strong>Với sự đồng ý của bạn:</strong> Trong các trường hợp khác khi bạn đã đồng ý</li>
                            </ul>
                        </div>
                    </section>

                    <section className={cx('content-block')}>
                        <h2 className={cx('section-title')}>5. Bảo Mật Thông Tin</h2>
                        <div className={cx('section-content')}>
                            <p>
                                Chúng tôi sử dụng các biện pháp bảo mật kỹ thuật và tổ chức phù hợp để bảo vệ thông tin cá nhân 
                                của bạn khỏi truy cập, sử dụng, tiết lộ, thay đổi hoặc phá hủy trái phép. Tuy nhiên, không có phương 
                                thức truyền tải qua Internet hoặc lưu trữ điện tử nào là 100% an toàn.
                            </p>
                        </div>
                    </section>

                    <section className={cx('content-block')}>
                        <h2 className={cx('section-title')}>6. Quyền Của Bạn</h2>
                        <div className={cx('section-content')}>
                            <p>Bạn có quyền:</p>
                            <ul className={cx('content-list')}>
                                <li>Truy cập và yêu cầu sao chép thông tin cá nhân của bạn</li>
                                <li>Yêu cầu chỉnh sửa hoặc xóa thông tin cá nhân</li>
                                <li>Từ chối xử lý thông tin cá nhân của bạn</li>
                                <li>Rút lại sự đồng ý bất cứ lúc nào</li>
                                <li>Khiếu nại với cơ quan bảo vệ dữ liệu</li>
                            </ul>
                        </div>
                    </section>

                    <section className={cx('content-block')}>
                        <h2 className={cx('section-title')}>7. Cookie</h2>
                        <div className={cx('section-content')}>
                            <p>
                                Chúng tôi sử dụng cookie và công nghệ theo dõi tương tự để cải thiện trải nghiệm của bạn, 
                                phân tích cách bạn sử dụng trang web và hỗ trợ các nỗ lực marketing của chúng tôi. 
                                Bạn có thể kiểm soát cookie thông qua cài đặt trình duyệt của mình.
                            </p>
                        </div>
                    </section>

                    <section className={cx('content-block')}>
                        <h2 className={cx('section-title')}>8. Thay Đổi Chính Sách</h2>
                        <div className={cx('section-content')}>
                            <p>
                                Chúng tôi có thể cập nhật chính sách bảo mật này theo thời gian. Chúng tôi sẽ thông báo cho bạn 
                                về bất kỳ thay đổi nào bằng cách đăng chính sách mới trên trang này và cập nhật ngày "Cập nhật lần cuối" 
                                ở cuối trang này.
                            </p>
                        </div>
                    </section>

                    <section className={cx('content-block')}>
                        <h2 className={cx('section-title')}>9. Liên Hệ</h2>
                        <div className={cx('section-content')}>
                            <p>
                                Nếu bạn có bất kỳ câu hỏi nào về chính sách bảo mật này, vui lòng liên hệ với chúng tôi:
                            </p>
                            <ul className={cx('contact-list')}>
                                <li><strong>Email:</strong> <a href="mailto:privacy@taikhoanxin.com">privacy@taikhoanxin.com</a></li>
                                <li><strong>Điện thoại:</strong> <a href="tel:+84901234567">090 123 4567</a></li>
                                <li><strong>Địa chỉ:</strong> 123 Đường ABC, Phường XYZ, Quận 1, TP. Hồ Chí Minh</li>
                            </ul>
                        </div>
                    </section>

                    <section className={cx('content-block', 'last-updated')}>
                        <p className={cx('update-text')}>
                            <strong>Cập nhật lần cuối:</strong> {new Date().toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}

