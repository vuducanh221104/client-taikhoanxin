'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import classNames from 'classnames/bind';
import styles from './Footer.module.scss';
import { MailIcon, PhoneIcon, ClockIcon, FacebookIcon, InstagramIcon, YoutubeIcon, TelegramIcon } from '@/components/Icons';

const cx = classNames.bind(styles);

const Footer: React.FC = () => {
    return (
        <footer className={cx('footer-wrapper')}>
            <div className={cx('footer-container')}>
                <div className={cx('footer-content')}>
                    {/* Logo & Description */}
                    <div className={cx('footer-column', 'footer-about')}>
                        <Link href="/" className={cx('footer-logo')}>
                            <Image
                                src="/logo/logo-xin.png"
                                alt="Tài Khoản Xịn"
                                width={140}
                                height={60}
                                className={cx('logo-image')}
                            />
                        </Link>
                        <p className={cx('footer-description')}>
                            Tài Khoản Xịn - Nền tảng cung cấp tài khoản số uy tín hàng đầu Việt Nam. 
                            Cam kết chất lượng, giá cả hợp lý và dịch vụ chuyên nghiệp.
                        </p>
                        {/* Social Media */}
                        <div className={cx('footer-social')}>
                            <a
                                href="https://facebook.com/taikhoanxincom"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={cx('social-link')}
                                aria-label="Facebook"
                            >
                                <FacebookIcon />
                            </a>
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={cx('social-link')}
                                aria-label="Instagram"
                            >
                                <InstagramIcon />
                            </a>
                            <a
                                href="https://youtube.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={cx('social-link')}
                                aria-label="YouTube"
                            >
                                <YoutubeIcon />
                            </a>
                            <a
                                href="https://t.me/taikhoanxin"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={cx('social-link')}
                                aria-label="Telegram"
                            >
                                <TelegramIcon />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className={cx('footer-column')}>
                        <h3 className={cx('footer-title')}>Liên kết nhanh</h3>
                        <ul className={cx('footer-links')}>
                            <li>
                                <Link href="/">Trang chủ</Link>
                            </li>
                            <li>
                                <Link href="/search">Tìm kiếm</Link>
                            </li>
                            <li>
                                <Link href="/products/new">Sản phẩm mới</Link>
                            </li>
                            <li>
                                <Link href="/products/best-selling">Bán chạy nhất</Link>
                            </li>
                            <li>
                                <Link href="/orders/lookup">Tra cứu đơn hàng</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div className={cx('footer-column')}>
                        <h3 className={cx('footer-title')}>Hỗ trợ</h3>
                        <ul className={cx('footer-links')}>
                            <li>
                                <Link href="/help">Trung tâm trợ giúp</Link>
                            </li>
                            <li>
                                <Link href="/help/getting-started/intro">Hướng dẫn sử dụng</Link>
                            </li>
                            <li>
                                <Link href="/help/policies/warranty">Chính sách bảo hành</Link>
                            </li>
                            <li>
                                <Link href="/help/policies/return">Chính sách đổi trả</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Information */}
                    <div className={cx('footer-column')}>
                        <h3 className={cx('footer-title')}>Thông tin</h3>
                        <ul className={cx('footer-links')}>
                            <li>
                                <Link href="/about">Về chúng tôi</Link>
                            </li>
                            <li>
                                <Link href="/contact">Liên hệ</Link>
                            </li>
                            <li>
                                <Link href="/privacy">Chính sách bảo mật</Link>
                            </li>
                            <li>
                                <Link href="/terms">Điều khoản sử dụng</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className={cx('footer-column')}>
                        <h3 className={cx('footer-title')}>Liên hệ</h3>
                        <ul className={cx('footer-contact')}>
                            <li>
                                <span className={cx('contact-icon', 'email')}>
                                    <MailIcon />
                                </span>
                                <span>Email: support@taikhoanxin.com</span>
                            </li>
                            <li>
                                <span className={cx('contact-icon', 'phone')}>
                                    <PhoneIcon />
                                </span>
                                <span>Hotline: 1900 1234</span>
                            </li>
                            <li>
                                <span className={cx('contact-icon', 'clock')}>
                                    <ClockIcon />
                                </span>
                                <span>Thời gian: 8:00 - 22:00 (Hàng ngày)</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar with Copyright and Payment Methods */}
                <div className={cx('footer-bottom')}>
                    <div className={cx('footer-bottom-left')}>
                        <p className={cx('footer-copyright')}>
                            © {new Date().getFullYear()} Tài Khoản Xịn. Tất cả quyền được bảo lưu.
                        </p>
                    </div>
                    <div className={cx('footer-payment-section')}>
                        <div className={cx('payment-methods')}>
                            <div className={cx('payment-method')} title="VNPay">
                                <Image 
                                    src="/payment/vnpay.png" 
                                    alt="VNPay" 
                                    width={48} 
                                    height={32}
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                        (e.target as HTMLImageElement).parentElement!.innerHTML = '<span style="font-size: 10px; color: #000;">VNPay</span>';
                                    }}
                                />
                            </div>
                            <div className={cx('payment-method')} title="Momo">
                                <Image 
                                    src="/payment/momo.png" 
                                    alt="Momo" 
                                    width={48} 
                                    height={32}
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                        (e.target as HTMLImageElement).parentElement!.innerHTML = '<span style="font-size: 10px; color: #000;">Momo</span>';
                                    }}
                                />
                            </div>
                            <div className={cx('payment-method')} title="ZaloPay">
                                <Image 
                                    src="/payment/zalopay.png" 
                                    alt="ZaloPay" 
                                    width={48} 
                                    height={32}
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                        (e.target as HTMLImageElement).parentElement!.innerHTML = '<span style="font-size: 10px; color: #000;">ZaloPay</span>';
                                    }}
                                />
                            </div>
                            <div className={cx('payment-method')} title="Visa">
                                <Image 
                                    src="/payment/visa.png" 
                                    alt="Visa" 
                                    width={48} 
                                    height={32}
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                        (e.target as HTMLImageElement).parentElement!.innerHTML = '<span style="font-size: 10px; color: #000;">Visa</span>';
                                    }}
                                />
                            </div>
                            <div className={cx('payment-method')} title="Mastercard">
                                <Image 
                                    src="/payment/mastercard.png" 
                                    alt="Mastercard" 
                                    width={48} 
                                    height={32}
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                        (e.target as HTMLImageElement).parentElement!.innerHTML = '<span style="font-size: 10px; color: #000;">MC</span>';
                                    }}
                                />
                            </div>
                            <div className={cx('payment-method')} title="JCB">
                                <Image 
                                    src="/payment/jcb.png" 
                                    alt="JCB" 
                                    width={48} 
                                    height={32}
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                        (e.target as HTMLImageElement).parentElement!.innerHTML = '<span style="font-size: 10px; color: #000;">JCB</span>';
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
