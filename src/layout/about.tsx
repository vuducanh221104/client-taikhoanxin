'use client';

import React from 'react';
import classNames from 'classnames/bind';
import styles from '@/app/(user)/about/page.module.scss';

const cx = classNames.bind(styles);

export default function AboutLayout() {
    return (
        <div className={cx('about-page')}>
            <div className={cx('about-container')}>
                {/* Hero Section */}
                <div className={cx('hero-section')}>
                    <h1 className={cx('hero-title')}>Về Chúng Tôi</h1>
                    <p className={cx('hero-subtitle')}>
                        Tài Khoản Xịn - Nền tảng cung cấp tài khoản số uy tín hàng đầu Việt Nam
                    </p>
                </div>

                {/* Main Content */}
                <div className={cx('content-section')}>
                    {/* Introduction */}
                    <section className={cx('content-block')}>
                        <h2 className={cx('section-title')}>Giới Thiệu</h2>
                        <div className={cx('section-content')}>
                            <p>
                                Tài Khoản Xịn tự hào là nền tảng cung cấp tài khoản số uy tín hàng đầu Việt Nam. 
                                Chúng tôi cam kết mang đến cho khách hàng những dịch vụ chất lượng cao, giá cả hợp lý 
                                và trải nghiệm mua sắm tuyệt vời nhất.
                            </p>
                            <p>
                                Với hơn 10,000+ tài khoản đa dạng từ các thương hiệu nổi tiếng như Windows, Office, 
                                Adobe, Netflix, Spotify, và nhiều dịch vụ khác, chúng tôi đáp ứng mọi nhu cầu của bạn.
                            </p>
                        </div>
                    </section>

                    {/* Mission */}
                    <section className={cx('content-block')}>
                        <h2 className={cx('section-title')}>Sứ Mệnh</h2>
                        <div className={cx('section-content')}>
                            <p>
                                Sứ mệnh của chúng tôi là cung cấp các giải pháp tài khoản số chất lượng cao, 
                                giúp khách hàng tiếp cận dễ dàng với các dịch vụ công nghệ hàng đầu thế giới. 
                                Chúng tôi đặt chất lượng, uy tín và sự hài lòng của khách hàng lên hàng đầu.
                            </p>
                        </div>
                    </section>

                    {/* Values */}
                    <section className={cx('content-block')}>
                        <h2 className={cx('section-title')}>Giá Trị Cốt Lõi</h2>
                        <div className={cx('values-grid')}>
                            <div className={cx('value-item')}>
                                <h3 className={cx('value-title')}>Uy Tín</h3>
                                <p className={cx('value-description')}>
                                    Chúng tôi cam kết cung cấp các tài khoản chính hãng, đảm bảo chất lượng và an toàn cho khách hàng.
                                </p>
                            </div>
                            <div className={cx('value-item')}>
                                <h3 className={cx('value-title')}>Chất Lượng</h3>
                                <p className={cx('value-description')}>
                                    Mỗi sản phẩm đều được kiểm tra kỹ lưỡng trước khi giao đến tay khách hàng.
                                </p>
                            </div>
                            <div className={cx('value-item')}>
                                <h3 className={cx('value-title')}>Dịch Vụ</h3>
                                <p className={cx('value-description')}>
                                    Hỗ trợ khách hàng 24/7 với đội ngũ CSKH chuyên nghiệp, nhiệt tình.
                                </p>
                            </div>
                            <div className={cx('value-item')}>
                                <h3 className={cx('value-title')}>Giá Cả</h3>
                                <p className={cx('value-description')}>
                                    Cung cấp mức giá cạnh tranh, hợp lý với nhiều ưu đãi hấp dẫn.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Why Choose Us */}
                    <section className={cx('content-block')}>
                        <h2 className={cx('section-title')}>Tại Sao Chọn Tài Khoản Xịn?</h2>
                        <div className={cx('features-list')}>
                            <div className={cx('feature-item')}>
                                <div className={cx('feature-icon')}>✓</div>
                                <div className={cx('feature-content')}>
                                    <h3 className={cx('feature-title')}>Hơn 10,000+ Tài Khoản</h3>
                                    <p>Kho tài khoản đa dạng, phong phú đáp ứng mọi nhu cầu</p>
                                </div>
                            </div>
                            <div className={cx('feature-item')}>
                                <div className={cx('feature-icon')}>✓</div>
                                <div className={cx('feature-content')}>
                                    <h3 className={cx('feature-title')}>Giao Hàng Nhanh</h3>
                                    <p>Nhận tài khoản ngay sau khi thanh toán thành công</p>
                                </div>
                            </div>
                            <div className={cx('feature-item')}>
                                <div className={cx('feature-icon')}>✓</div>
                                <div className={cx('feature-content')}>
                                    <h3 className={cx('feature-title')}>Hỗ Trợ 24/7</h3>
                                    <p>Đội ngũ CSKH luôn sẵn sàng hỗ trợ bạn mọi lúc, mọi nơi</p>
                                </div>
                            </div>
                            <div className={cx('feature-item')}>
                                <div className={cx('feature-icon')}>✓</div>
                                <div className={cx('feature-content')}>
                                    <h3 className={cx('feature-title')}>Bảo Hành Đầy Đủ</h3>
                                    <p>Cam kết bảo hành và hỗ trợ trong suốt thời gian sử dụng</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Contact CTA */}
                    <section className={cx('cta-section')}>
                        <h2 className={cx('cta-title')}>Liên Hệ Với Chúng Tôi</h2>
                        <p className={cx('cta-text')}>
                            Nếu bạn có bất kỳ câu hỏi nào, đừng ngần ngại liên hệ với chúng tôi. 
                            Chúng tôi luôn sẵn sàng hỗ trợ bạn!
                        </p>
                        <a href="/contact" className={cx('cta-button')}>
                            Liên Hệ Ngay
                        </a>
                    </section>
                </div>
            </div>
        </div>
    );
}

