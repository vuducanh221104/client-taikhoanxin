'use client';

import React from 'react';
import classNames from 'classnames/bind';
import styles from '@/app/(user)/terms/page.module.scss';

const cx = classNames.bind(styles);

const TermsLayout: React.FC = () => {
    return (
        <div className={cx('terms-page')}>
            <div className={cx('terms-container')}>
                <div className={cx('hero-section')}>
                    <h1 className={cx('hero-title')}>Điều Khoản Sử Dụng</h1>
                    <p className={cx('hero-subtitle')}>
                        Vui lòng đọc kỹ các điều khoản sử dụng trước khi sử dụng dịch vụ của chúng tôi
                    </p>
                </div>

                <div className={cx('content-section')}>
                    <section className={cx('content-block')}>
                        <h2 className={cx('section-title')}>1. Chấp Nhận Điều Khoản</h2>
                        <div className={cx('section-content')}>
                            <p>
                                Bằng việc truy cập và sử dụng trang web Tài Khoản Xịn, bạn đồng ý tuân
                                thủ và bị ràng buộc bởi các điều khoản và điều kiện sử dụng này. Nếu bạn
                                không đồng ý với bất kỳ phần nào của các điều khoản này, vui lòng không
                                sử dụng dịch vụ của chúng tôi.
                            </p>
                        </div>
                    </section>

                    <section className={cx('content-block')}>
                        <h2 className={cx('section-title')}>2. Định Nghĩa</h2>
                        <div className={cx('section-content')}>
                            <ul className={cx('content-list')}>
                                <li>
                                    <strong>&quot;Chúng tôi&quot;, &quot;Công ty&quot;:</strong> Chỉ
                                    Tài Khoản Xịn và các đối tác liên quan
                                </li>
                                <li>
                                    <strong>&quot;Bạn&quot;, &quot;Người dùng&quot;, &quot;Khách
                                        hàng&quot;:</strong>{' '}
                                    Chỉ cá nhân hoặc tổ chức sử dụng dịch vụ của chúng tôi
                                </li>
                                <li>
                                    <strong>&quot;Dịch vụ&quot;:</strong> Tất cả các dịch vụ được cung
                                    cấp trên trang web của chúng tôi
                                </li>
                                <li>
                                    <strong>&quot;Nội dung&quot;:</strong> Tất cả thông tin, văn bản,
                                    hình ảnh, video và các tài liệu khác trên trang web
                                </li>
                            </ul>
                        </div>
                    </section>

                    <section className={cx('content-block')}>
                        <h2 className={cx('section-title')}>3. Sử Dụng Dịch Vụ</h2>
                        <div className={cx('section-content')}>
                            <h3 className={cx('subsection-title')}>3.1. Đăng Ký Tài Khoản</h3>
                            <p>
                                Để sử dụng một số tính năng của dịch vụ, bạn có thể cần đăng ký tài
                                khoản. Bạn đồng ý:
                            </p>
                            <ul className={cx('content-list')}>
                                <li>Cung cấp thông tin chính xác, đầy đủ và cập nhật</li>
                                <li>Bảo mật thông tin đăng nhập của bạn</li>
                                <li>
                                    Chịu trách nhiệm cho tất cả các hoạt động xảy ra dưới tài khoản của
                                    bạn
                                </li>
                                <li>
                                    Thông báo ngay lập tức nếu phát hiện sử dụng trái phép tài khoản
                                </li>
                            </ul>

                            <h3 className={cx('subsection-title')}>3.2. Quy Tắc Sử Dụng</h3>
                            <p>Bạn đồng ý không:</p>
                            <ul className={cx('content-list')}>
                                <li>Sử dụng dịch vụ cho mục đích bất hợp pháp hoặc trái pháp luật</li>
                                <li>Vi phạm quyền sở hữu trí tuệ của chúng tôi hoặc bên thứ ba</li>
                                <li>Truyền tải virus, malware hoặc mã độc hại</li>
                                <li>Cố gắng truy cập trái phép vào hệ thống của chúng tôi</li>
                                <li>
                                    Sử dụng dịch vụ để gây hại, quấy rối hoặc lừa đảo người khác
                                </li>
                            </ul>
                        </div>
                    </section>

                    <section className={cx('content-block')}>
                        <h2 className={cx('section-title')}>4. Mua Hàng và Thanh Toán</h2>
                        <div className={cx('section-content')}>
                            <h3 className={cx('subsection-title')}>4.1. Đặt Hàng</h3>
                            <p>
                                Khi bạn đặt hàng, bạn đồng ý mua sản phẩm theo giá và điều kiện được nêu
                                tại thời điểm đặt hàng. Chúng tôi bảo lưu quyền từ chối hoặc hủy đơn
                                hàng vì bất kỳ lý do nào.
                            </p>

                            <h3 className={cx('subsection-title')}>4.2. Thanh Toán</h3>
                            <p>
                                Bạn đồng ý thanh toán đầy đủ giá trị đơn hàng khi đặt hàng. Chúng tôi
                                chấp nhận thanh toán qua các phương thức được liệt kê trên trang web. Tất
                                cả giao dịch được xử lý một cách an toàn.
                            </p>

                            <h3 className={cx('subsection-title')}>4.3. Giao Hàng</h3>
                            <p>
                                Sau khi thanh toán thành công, chúng tôi sẽ giao tài khoản cho bạn trong
                                thời gian sớm nhất có thể. Thời gian giao hàng có thể thay đổi tùy thuộc
                                vào từng sản phẩm.
                            </p>
                        </div>
                    </section>

                    <section className={cx('content-block')}>
                        <h2 className={cx('section-title')}>5. Hoàn Tiền và Đổi Trả</h2>
                        <div className={cx('section-content')}>
                            <p>
                                Chính sách hoàn tiền và đổi trả được áp dụng theo từng trường hợp cụ
                                thể. Vui lòng liên hệ với chúng tôi để biết thêm chi tiết về chính sách
                                hoàn tiền cho sản phẩm bạn đã mua.
                            </p>
                            <p>
                                <strong>Lưu ý:</strong> Do tính chất đặc thù của sản phẩm số, một số sản
                                phẩm có thể không được hoàn tiền sau khi đã giao hàng thành công.
                            </p>
                        </div>
                    </section>

                    <section className={cx('content-block')}>
                        <h2 className={cx('section-title')}>6. Sở Hữu Trí Tuệ</h2>
                        <div className={cx('section-content')}>
                            <p>
                                Tất cả nội dung trên trang web, bao gồm nhưng không giới hạn ở văn bản,
                                đồ họa, logo, hình ảnh, video và phần mềm, là tài sản của Tài Khoản Xịn
                                hoặc được cấp phép sử dụng. Bạn không được sao chép, sửa đổi, phân phối
                                hoặc sử dụng nội dung này mà không có sự đồng ý bằng văn bản của chúng
                                tôi.
                            </p>
                        </div>
                    </section>

                    <section className={cx('content-block')}>
                        <h2 className={cx('section-title')}>7. Miễn Trừ Trách Nhiệm</h2>
                        <div className={cx('section-content')}>
                            <p>
                                Chúng tôi cung cấp dịch vụ &quot;như hiện tại&quot; và &quot;như có
                                sẵn&quot;. Chúng tôi không đảm bảo rằng:
                            </p>
                            <ul className={cx('content-list')}>
                                <li>Dịch vụ sẽ luôn hoạt động không bị gián đoạn hoặc không có lỗi</li>
                                <li>Các lỗi sẽ được sửa chữa ngay lập tức</li>
                                <li>Dịch vụ không chứa virus hoặc thành phần độc hại</li>
                            </ul>
                            <p>
                                Chúng tôi không chịu trách nhiệm cho bất kỳ thiệt hại nào phát sinh từ
                                việc sử dụng hoặc không thể sử dụng dịch vụ của chúng tôi.
                            </p>
                        </div>
                    </section>

                    <section className={cx('content-block')}>
                        <h2 className={cx('section-title')}>8. Giới Hạn Trách Nhiệm</h2>
                        <div className={cx('section-content')}>
                            <p>
                                Trong phạm vi tối đa được pháp luật cho phép, Tài Khoản Xịn sẽ không chịu
                                trách nhiệm cho bất kỳ thiệt hại gián tiếp, ngẫu nhiên, đặc biệt, hậu quả
                                hoặc thiệt hại phát sinh từ việc sử dụng hoặc không thể sử dụng dịch vụ
                                của chúng tôi.
                            </p>
                        </div>
                    </section>

                    <section className={cx('content-block')}>
                        <h2 className={cx('section-title')}>9. Chấm Dứt</h2>
                        <div className={cx('section-content')}>
                            <p>
                                Chúng tôi có quyền chấm dứt hoặc tạm ngưng quyền truy cập của bạn vào
                                dịch vụ ngay lập tức, mà không cần thông báo trước, nếu bạn vi phạm các
                                điều khoản sử dụng này.
                            </p>
                        </div>
                    </section>

                    <section className={cx('content-block')}>
                        <h2 className={cx('section-title')}>10. Thay Đổi Điều Khoản</h2>
                        <div className={cx('section-content')}>
                            <p>
                                Chúng tôi bảo lưu quyền sửa đổi các điều khoản này bất cứ lúc nào. Các
                                thay đổi sẽ có hiệu lực ngay sau khi được đăng trên trang web. Việc bạn
                                tiếp tục sử dụng dịch vụ sau khi các thay đổi có hiệu lực được coi là bạn
                                đã chấp nhận các thay đổi đó.
                            </p>
                        </div>
                    </section>

                    <section className={cx('content-block')}>
                        <h2 className={cx('section-title')}>11. Luật Áp Dụng</h2>
                        <div className={cx('section-content')}>
                            <p>
                                Các điều khoản này được điều chỉnh và giải thích theo pháp luật Việt
                                Nam. Bất kỳ tranh chấp nào phát sinh từ hoặc liên quan đến các điều khoản
                                này sẽ được giải quyết tại tòa án có thẩm quyền tại Việt Nam.
                            </p>
                        </div>
                    </section>

                    <section className={cx('content-block')}>
                        <h2 className={cx('section-title')}>12. Liên Hệ</h2>
                        <div className={cx('section-content')}>
                            <p>
                                Nếu bạn có bất kỳ câu hỏi nào về các điều khoản sử dụng này, vui lòng
                                liên hệ với chúng tôi:
                            </p>
                            <ul className={cx('contact-list')}>
                                <li>
                                    <strong>Email:</strong>{' '}
                                    <a href="mailto:legal@taikhoanxin.com">
                                        legal@taikhoanxin.com
                                    </a>
                                </li>
                                <li>
                                    <strong>Điện thoại:</strong>{' '}
                                    <a href="tel:+84901234567">090 123 4567</a>
                                </li>
                                <li>
                                    <strong>Địa chỉ:</strong> 123 Đường ABC, Phường XYZ, Quận 1, TP. Hồ
                                    Chí Minh
                                </li>
                            </ul>
                        </div>
                    </section>

                    <section className={cx('content-block', 'last-updated')}>
                        <p className={cx('update-text')}>
                            <strong>Cập nhật lần cuối:</strong>{' '}
                            {new Date().toLocaleDateString('vi-VN', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default TermsLayout;


