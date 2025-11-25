'use client';

import React, { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './PasswordSecurity.module.scss';
import { CurrentUser } from '@/types/client';
import { EyeIcon, EyeOffIcon } from '@/components/Icons';
import { changePassword } from '@/services/authService';
import { useToast } from '@/hooks/useToast';

const cx = classNames.bind(styles);

interface PasswordSecurityProps {
    user: CurrentUser;
}

const PasswordSecurity: React.FC<PasswordSecurityProps> = ({ user }) => {
    const { showSuccess, showError } = useToast();
    
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    
    // Temporarily hidden - Two-Factor Security
    // const [securityData, setSecurityData] = useState({
    //     paymentAuth: 'all-ip', // 'all-ip' | 'specific-ip'
    //     loginAuth: 'no-otp', // 'no-otp' | 'otp-required'
    //     authMethod: 'email', // 'email' | 'sms' | 'app'
    // });

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');
    // Temporarily hidden - Two-Factor Security
    // const [securityError, setSecurityError] = useState('');
    // const [securitySuccess, setSecuritySuccess] = useState('');
    const [currentPasswordError, setCurrentPasswordError] = useState('');
    const [newPasswordError, setNewPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [touchedCurrentPassword, setTouchedCurrentPassword] = useState(false);
    const [touchedNewPassword, setTouchedNewPassword] = useState(false);

    const calculatePasswordStrength = (password: string) => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
        if (password.match(/\d/)) strength++;
        if (password.match(/[^a-zA-Z\d]/)) strength++;
        return strength;
    };

    const passwordStrength = calculatePasswordStrength(passwordData.newPassword);

    const getPasswordStrengthText = () => {
        switch (passwordStrength) {
            case 0:
            case 1:
                return { text: 'Yếu', color: '#f44336' };
            case 2:
                return { text: 'Trung bình', color: '#ff9800' };
            case 3:
            case 4:
                return { text: 'Mạnh', color: '#4caf50' };
            default:
                return { text: '', color: '#e0e0e0' };
        }
    };

    const strengthInfo = getPasswordStrengthText();

    const validateNewPassword = (password: string) => {
        if (!password || password.trim() === '') {
            return 'Vui lòng điền vào trường này';
        }
        if (password.length < 8) {
            return 'Mật khẩu phải có ít nhất 8 ký tự';
        }
        return '';
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError('');
        setPasswordSuccess('');
        setTouchedCurrentPassword(true);
        setTouchedNewPassword(true);

        // Validate current password
        if (!passwordData.currentPassword || passwordData.currentPassword.trim() === '') {
            setCurrentPasswordError('Vui lòng điền vào trường này');
            return;
        }
        setCurrentPasswordError('');

        // Validate new password
        const newPasswordValidation = validateNewPassword(passwordData.newPassword);
        if (newPasswordValidation) {
            setNewPasswordError(newPasswordValidation);
            return;
        }
        setNewPasswordError('');

        // Validate confirm password
        if (!passwordData.confirmPassword) {
            setConfirmPasswordError('Vui lòng điền vào trường này');
            return;
        }
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setConfirmPasswordError('Mật khẩu không khớp');
            setPasswordError('Mật khẩu xác nhận không khớp!');
            return;
        }
        setConfirmPasswordError('');

        setLoading(true);

        try {
            // Call API to change password
            const response = await changePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
            });

            if (response.success) {
                setPasswordSuccess('Đổi mật khẩu thành công!');
                showSuccess('Đổi mật khẩu thành công!');
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                setCurrentPasswordError('');
                setNewPasswordError('');
                setConfirmPasswordError('');
                setTouchedCurrentPassword(false);
                setTouchedNewPassword(false);
            } else {
                throw new Error(response.message || 'Đổi mật khẩu thất bại');
            }
        } catch (err: any) {
            const errorMessage = err?.response?.data?.message || err?.message || 'Có lỗi xảy ra. Vui lòng thử lại!';
            setPasswordError(errorMessage);
            showError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Temporarily hidden - Two-Factor Security
    // const handleSecuritySubmit = async (e: React.FormEvent) => {
    //     e.preventDefault();
    //     setSecurityError('');
    //     setSecuritySuccess('');

    //     setLoading(true);

    //     try {
    //         // TODO: Call API to update security settings
    //         await new Promise(resolve => setTimeout(resolve, 1000));
    //         setSecuritySuccess('Cập nhật bảo mật hai lớp thành công!');
    //     } catch (err: any) {
    //         setSecurityError(err?.message || 'Có lỗi xảy ra. Vui lòng thử lại!');
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    return (
        <div className={cx('password-security')}>
            {/* Header */}
            <div className={cx('security-header')}>
                <h1 className={cx('security-title')}>Mật khẩu & Bảo mật</h1>
                <p className={cx('security-subtitle')}>
                    Vì sự an toàn, Tài Khoản Xịn khuyến khích khách hàng sử dụng mật khẩu mạnh
                </p>
            </div>

            <div className={cx('security-content')}>
                {/* Change Password Section */}
                <div className={cx('change-password-section')}>
                    <h2 className={cx('section-title')}>Đổi mật khẩu</h2>
                    
                    <form onSubmit={handlePasswordSubmit} className={cx('password-form')} noValidate>
                        {passwordError && (
                            <div className={cx('error-message')}>
                                <span className={cx('error-icon')}>⚠️</span>
                                {passwordError}
                            </div>
                        )}

                        {passwordSuccess && (
                            <div className={cx('success-message')}>
                                <span className={cx('success-icon')}>✓</span>
                                {passwordSuccess}
                            </div>
                        )}

                        <div className={cx('form-group')}>
                            <label htmlFor="currentPassword" className={cx('form-label')}>
                                Mật khẩu hiện tại <span className={cx('required')}>*</span>
                            </label>
                            <div className={cx('password-wrapper')}>
                                <input
                                    id="currentPassword"
                                    type={showCurrentPassword ? 'text' : 'password'}
                                    className={cx('form-input', {
                                        'input-error': touchedCurrentPassword && currentPasswordError,
                                    })}
                                    placeholder="Nhập mật khẩu hiện tại"
                                    value={passwordData.currentPassword}
                                    onChange={(e) => {
                                        setPasswordData({ ...passwordData, currentPassword: e.target.value });
                                        if (touchedCurrentPassword) {
                                            setCurrentPasswordError(!e.target.value ? 'Vui lòng điền vào trường này' : '');
                                        }
                                    }}
                                    onBlur={() => {
                                        setTouchedCurrentPassword(true);
                                        setCurrentPasswordError(!passwordData.currentPassword ? 'Vui lòng điền vào trường này' : '');
                                    }}
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    className={cx('password-toggle')}
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    tabIndex={-1}
                                >
                                    {showCurrentPassword ? <EyeIcon size={20} /> : <EyeOffIcon size={20} />}
                                </button>
                            </div>
                            {touchedCurrentPassword && currentPasswordError && (
                                <span className={cx('form-error-hint')}>{currentPasswordError}</span>
                            )}
                        </div>

                        <div className={cx('form-group')}>
                            <label htmlFor="newPassword" className={cx('form-label')}>
                                Mật khẩu mới <span className={cx('required')}>*</span>
                            </label>
                            <div className={cx('password-wrapper')}>
                                <input
                                    id="newPassword"
                                    type={showNewPassword ? 'text' : 'password'}
                                    className={cx('form-input', {
                                        'input-error': touchedNewPassword && newPasswordError,
                                    })}
                                    placeholder="Mật khẩu mới"
                                    value={passwordData.newPassword}
                                    onChange={(e) => {
                                        setPasswordData({ ...passwordData, newPassword: e.target.value });
                                        if (touchedNewPassword) {
                                            setNewPasswordError(validateNewPassword(e.target.value));
                                        }
                                    }}
                                    onBlur={() => {
                                        setTouchedNewPassword(true);
                                        setNewPasswordError(validateNewPassword(passwordData.newPassword));
                                    }}
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    className={cx('password-toggle')}
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    tabIndex={-1}
                                >
                                    {showNewPassword ? <EyeIcon size={20} /> : <EyeOffIcon size={20} />}
                                </button>
                            </div>
                            {touchedNewPassword && newPasswordError && (
                                <span className={cx('form-error-hint')}>{newPasswordError}</span>
                            )}
                            {passwordData.newPassword && !newPasswordError && (
                                <div className={cx('password-strength')}>
                                    <div className={cx('strength-bar')}>
                                        <div
                                            className={cx('strength-fill')}
                                            style={{
                                                width: `${(passwordStrength / 4) * 100}%`,
                                                backgroundColor: strengthInfo.color,
                                            }}
                                        ></div>
                                    </div>
                                    <span className={cx('strength-text')} style={{ color: strengthInfo.color }}>
                                        {strengthInfo.text}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className={cx('form-group')}>
                            <label htmlFor="confirmPassword" className={cx('form-label')}>
                                Nhập lại mật khẩu mới
                            </label>
                            <div className={cx('password-wrapper')}>
                                <input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    className={cx('form-input', {
                                        'input-error': touchedNewPassword && confirmPasswordError,
                                    })}
                                    placeholder="Nhập lại mật khẩu mới"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => {
                                        setPasswordData({ ...passwordData, confirmPassword: e.target.value });
                                        if (touchedNewPassword) {
                                            const error = !e.target.value 
                                                ? 'Vui lòng điền vào trường này'
                                                : (e.target.value !== passwordData.newPassword ? 'Mật khẩu không khớp' : '');
                                            setConfirmPasswordError(error);
                                        }
                                    }}
                                    onBlur={() => {
                                        setTouchedNewPassword(true);
                                        const error = !passwordData.confirmPassword 
                                            ? 'Vui lòng điền vào trường này'
                                            : (passwordData.confirmPassword !== passwordData.newPassword ? 'Mật khẩu không khớp' : '');
                                        setConfirmPasswordError(error);
                                    }}
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    className={cx('password-toggle')}
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    tabIndex={-1}
                                >
                                    {showConfirmPassword ? <EyeIcon size={20} /> : <EyeOffIcon size={20} />}
                                </button>
                            </div>
                            {touchedNewPassword && confirmPasswordError && (
                                <span className={cx('form-error-hint')}>{confirmPasswordError}</span>
                            )}
                        </div>

                        <button type="submit" className={cx('save-button')} disabled={loading}>
                            {loading ? (
                                <>
                                    <span className={cx('loading-spinner')}></span>
                                    Đang lưu...
                                </>
                            ) : (
                                'Lưu thay đổi'
                            )}
                        </button>
                    </form>
                </div>

                {/* Password Requirements Section */}
                <div className={cx('password-requirements-section')}>
                    <h3 className={cx('requirements-title')}>Mật khẩu của bạn</h3>
                    <ul className={cx('requirements-list')}>
                        <li>Phải từ 8 ký tự trở lên</li>
                        <li>Nên có ít nhất 1 số hoặc 1 ký tự đặc biệt</li>
                        <li>Không nên giống với mật khẩu được sử dụng gần đây</li>
                    </ul>
                </div>
            </div>

            {/* Two-Factor Security Section - Temporarily hidden */}
            {/* <div className={cx('two-factor-section')}>
                <h2 className={cx('section-title')}>Bảo mật hai lớp</h2>
                <p className={cx('section-description')}>
                    Sử dụng xác thực hai lớp giúp tài khoản của bạn an toàn hơn, tránh được các giao dịch được thực hiện trái phép
                </p>

                <form onSubmit={handleSecuritySubmit} className={cx('security-form')} noValidate>
                    {securityError && (
                        <div className={cx('error-message')}>
                            <span className={cx('error-icon')}>⚠️</span>
                            {securityError}
                        </div>
                    )}

                    {securitySuccess && (
                        <div className={cx('success-message')}>
                            <span className={cx('success-icon')}>✓</span>
                            {securitySuccess}
                        </div>
                    )}

                    <div className={cx('security-settings')}>
                        <div className={cx('form-group')}>
                            <label htmlFor="paymentAuth" className={cx('form-label')}>
                                Xác thực khi thanh toán
                            </label>
                            <select
                                id="paymentAuth"
                                className={cx('form-select')}
                                value={securityData.paymentAuth}
                                onChange={(e) => setSecurityData({ ...securityData, paymentAuth: e.target.value })}
                                disabled={loading}
                            >
                                <option value="all-ip">Áp dụng với mọi IP</option>
                                <option value="specific-ip">Chỉ áp dụng với IP cụ thể</option>
                            </select>
                        </div>

                        <div className={cx('form-group')}>
                            <label htmlFor="loginAuth" className={cx('form-label')}>
                                Xác thực khi đăng nhập
                            </label>
                            <select
                                id="loginAuth"
                                className={cx('form-select')}
                                value={securityData.loginAuth}
                                onChange={(e) => setSecurityData({ ...securityData, loginAuth: e.target.value })}
                                disabled={loading}
                            >
                                <option value="no-otp">Không sử dụng OTP</option>
                                <option value="otp-required">Yêu cầu OTP</option>
                            </select>
                        </div>

                        <div className={cx('form-group')}>
                            <label htmlFor="authMethod" className={cx('form-label')}>
                                Phương thức xác thực
                            </label>
                            <select
                                id="authMethod"
                                className={cx('form-select')}
                                value={securityData.authMethod}
                                onChange={(e) => setSecurityData({ ...securityData, authMethod: e.target.value })}
                                disabled={loading}
                            >
                                <option value="email">Bảo mật bằng Email</option>
                                <option value="sms">Bảo mật bằng SMS</option>
                                <option value="app">Bảo mật bằng App</option>
                            </select>
                        </div>
                    </div>

                    <button type="submit" className={cx('continue-button')} disabled={loading}>
                        {loading ? (
                            <>
                                <span className={cx('loading-spinner')}></span>
                                Đang xử lý...
                            </>
                        ) : (
                            'Tiếp tục'
                        )}
                    </button>
                </form>
            </div> */}
        </div>
    );
};

export default PasswordSecurity;

