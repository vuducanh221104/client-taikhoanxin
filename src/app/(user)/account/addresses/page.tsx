'use client';

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState } from '@/redux/store';
import AccountSidebar from '@/components/AccountSidebar/AccountSidebar';
import classNames from 'classnames/bind';
import styles from './page.module.scss';
import { PlusIcon, PencilIcon, TrashIcon, CheckCircleIcon } from '@/components/Icons';
import Toast, { ToastType } from '@/components/Toast/Toast';
import { useConfirm } from '@/components/ConfirmDialog';

const cx = classNames.bind(styles);

interface Address {
    id: string;
    fullName: string;
    phone: string;
    province: string;
    district: string;
    ward: string;
    street: string;
    isDefault: boolean;
}

export default function AddressesPage() {
    const router = useRouter();
    const currentUser = useSelector((state: RootState) => state.auth.login.currentUser);
    const { confirm } = useConfirm();

    // Address list - In production, fetch from API
    const [addresses, setAddresses] = useState<Address[]>([]);

    const [showAddForm, setShowAddForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    
    // Form state
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        province: '',
        district: '',
        ward: '',
        street: '',
        isDefault: false,
    });

    // Toast state
    const [toast, setToast] = useState<{ show: boolean; message: string; type: ToastType }>({
        show: false,
        message: '',
        type: 'success',
    });

    // Form errors state
    const [errors, setErrors] = useState({
        fullName: '',
        phone: '',
        province: '',
        district: '',
        ward: '',
        street: '',
    });

    const showToast = (message: string, type: ToastType = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => {
            setToast({ show: false, message: '', type: 'success' });
        }, 3000);
    };

    // Mock data for dropdowns
    const provinces = ['Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ'];
    const districts = ['Quận 1', 'Quận 2', 'Quận 3', 'Quận Hoàn Kiếm', 'Quận Ba Đình'];
    const wards = ['Phường 1', 'Phường 2', 'Phường Hàng Bạc', 'Phường Hàng Đào', 'Phường Cửa Nam'];

    // Redirect to login if not authenticated
    React.useEffect(() => {
        if (!currentUser) {
            router.push('/auth/login');
        }
    }, [currentUser, router]);

    if (!currentUser) {
        return null;
    }

    const handleSetDefault = (id: string) => {
        setAddresses(addresses.map(addr => ({
            ...addr,
            isDefault: addr.id === id,
        })));
        showToast('Đã đặt làm địa chỉ mặc định', 'success');
    };

    const handleDelete = async (id: string) => {
        const confirmed = await confirm({
            title: 'Xóa địa chỉ',
            message: 'Bạn có chắc chắn muốn xóa địa chỉ này?',
            variant: 'danger',
            confirmText: 'Xóa',
            cancelText: 'Hủy',
        });
        
        if (confirmed) {
            setAddresses(addresses.filter(addr => addr.id !== id));
            showToast('Đã xóa địa chỉ thành công', 'success');
        }
    };

    const handleEdit = (id: string) => {
        const address = addresses.find(addr => addr.id === id);
        if (address) {
            setFormData({
                fullName: address.fullName,
                phone: address.phone,
                province: address.province,
                district: address.district,
                ward: address.ward,
                street: address.street,
                isDefault: address.isDefault,
            });
        }
        setErrors({
            fullName: '',
            phone: '',
            province: '',
            district: '',
            ward: '',
            street: '',
        });
        setEditingId(id);
        setShowAddForm(true);
    };

    const handleAddNew = () => {
        setFormData({
            fullName: '',
            phone: '',
            province: '',
            district: '',
            ward: '',
            street: '',
            isDefault: false,
        });
        setErrors({
            fullName: '',
            phone: '',
            province: '',
            district: '',
            ward: '',
            street: '',
        });
        setEditingId(null);
        setShowAddForm(true);
    };

    const handleFormChange = (field: keyof typeof formData, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user types
        if (field !== 'isDefault' && errors[field as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validate form
        const newErrors = {
            fullName: !formData.fullName ? 'Vui lòng nhập họ và tên' : '',
            phone: !formData.phone ? 'Vui lòng nhập số điện thoại' : '',
            province: !formData.province ? 'Vui lòng chọn tỉnh/thành phố' : '',
            district: !formData.district ? 'Vui lòng chọn quận/huyện' : '',
            ward: !formData.ward ? 'Vui lòng chọn phường/xã' : '',
            street: !formData.street ? 'Vui lòng nhập số nhà, tên đường' : '',
        };
        
        setErrors(newErrors);
        
        // Check if there are any errors
        if (Object.values(newErrors).some(error => error !== '')) {
            return;
        }

        if (editingId) {
            // Update existing address
            setAddresses(addresses.map(addr => 
                addr.id === editingId 
                    ? { ...formData, id: editingId }
                    : formData.isDefault ? { ...addr, isDefault: false } : addr
            ));
            showToast('Cập nhật địa chỉ thành công', 'success');
        } else {
            // Add new address
            const newAddress: Address = {
                ...formData,
                id: Date.now().toString(),
            };
            
            if (formData.isDefault) {
                setAddresses([newAddress, ...addresses.map(addr => ({ ...addr, isDefault: false }))]);
            } else {
                setAddresses([...addresses, newAddress]);
            }
            showToast('Thêm địa chỉ mới thành công', 'success');
        }
        
        setShowAddForm(false);
    };

    return (
        <div className={cx('addresses-page')}>
            {/* Toast Notification */}
            {toast.show && (
                <div className={cx('toast-wrapper')}>
                    <Toast
                        id="address-toast"
                        message={toast.message}
                        type={toast.type}
                        onClose={() => setToast({ ...toast, show: false })}
                    />
                </div>
            )}
            
            <div className={cx('addresses-container')}>
                {/* Sidebar */}
                <AccountSidebar activeItem="account" />

                {/* Main Content */}
                <div className={cx('addresses-content')}>
                    <div className={cx('addresses-header')}>
                        <h2 className={cx('page-title')}>Địa chỉ của tôi</h2>
                        <button
                            type="button"
                            className={cx('add-button')}
                            onClick={handleAddNew}
                        >
                            <PlusIcon size={18} />
                            Thêm địa chỉ mới
                        </button>
                    </div>

                    {/* Address List */}
                    <div className={cx('addresses-list')}>
                        {addresses.length === 0 ? (
                            <div className={cx('empty-state')}>
                                <p>Bạn chưa có địa chỉ nào</p>
                                <button
                                    type="button"
                                    className={cx('add-first-button')}
                                    onClick={handleAddNew}
                                >
                                    Thêm địa chỉ đầu tiên
                                </button>
                            </div>
                        ) : (
                            addresses.map((address) => (
                                <div
                                    key={address.id}
                                    className={cx('address-card', {
                                        'is-default': address.isDefault,
                                    })}
                                >
                                    <div className={cx('address-info')}>
                                        <div className={cx('address-header')}>
                                            <h3 className={cx('address-name')}>
                                                {address.fullName}
                                            </h3>
                                            {address.isDefault && (
                                                <span className={cx('default-badge')}>
                                                    Mặc định
                                                </span>
                                            )}
                                        </div>
                                        <p className={cx('address-phone')}>
                                            Điện thoại: {address.phone}
                                        </p>
                                        <p className={cx('address-detail')}>
                                            {address.street}, {address.ward}, {address.district}, {address.province}
                                        </p>
                                    </div>

                                    <div className={cx('address-actions')}>
                                        <button
                                            type="button"
                                            className={cx('action-button', 'edit')}
                                            onClick={() => handleEdit(address.id)}
                                        >
                                            <PencilIcon size={16} />
                                            Sửa
                                        </button>
                                        {!address.isDefault && (
                                            <>
                                                <button
                                                    type="button"
                                                    className={cx('action-button', 'delete')}
                                                    onClick={() => handleDelete(address.id)}
                                                >
                                                    <TrashIcon size={16} />
                                                    Xóa
                                                </button>
                                                <button
                                                    type="button"
                                                    className={cx('action-button', 'set-default')}
                                                    onClick={() => handleSetDefault(address.id)}
                                                >
                                                    <CheckCircleIcon size={16} />
                                                    Đặt làm mặc định
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Add/Edit Form Modal */}
                    {showAddForm && (
                        <div className={cx('modal-overlay')} onClick={() => setShowAddForm(false)}>
                            <div className={cx('modal-content')} onClick={(e) => e.stopPropagation()}>
                                <div className={cx('modal-header')}>
                                    <h3>{editingId ? 'Sửa địa chỉ' : 'Thêm địa chỉ mới'}</h3>
                                    <button
                                        type="button"
                                        className={cx('modal-close')}
                                        onClick={() => setShowAddForm(false)}
                                    >
                                        ×
                                    </button>
                                </div>
                                <form className={cx('address-form')} onSubmit={handleSubmit}>
                                    <div className={cx('form-group', { 'has-error': errors.fullName })}>
                                        <label>Họ và tên</label>
                                        <input 
                                            type="text" 
                                            placeholder="Nhập họ và tên"
                                            value={formData.fullName}
                                            onChange={(e) => handleFormChange('fullName', e.target.value)}
                                        />
                                        {errors.fullName && (
                                            <span className={cx('error-message')}>{errors.fullName}</span>
                                        )}
                                    </div>
                                    <div className={cx('form-group', { 'has-error': errors.phone })}>
                                        <label>Số điện thoại</label>
                                        <input 
                                            type="tel" 
                                            placeholder="Nhập số điện thoại"
                                            value={formData.phone}
                                            onChange={(e) => handleFormChange('phone', e.target.value)}
                                        />
                                        {errors.phone && (
                                            <span className={cx('error-message')}>{errors.phone}</span>
                                        )}
                                    </div>
                                    <div className={cx('form-row')}>
                                        <div className={cx('form-group', { 'has-error': errors.province })}>
                                            <label>Tỉnh/Thành phố</label>
                                            <select
                                                value={formData.province}
                                                onChange={(e) => handleFormChange('province', e.target.value)}
                                            >
                                                <option value="">Chọn tỉnh/thành phố</option>
                                                {provinces.map(p => (
                                                    <option key={p} value={p}>{p}</option>
                                                ))}
                                            </select>
                                            {errors.province && (
                                                <span className={cx('error-message')}>{errors.province}</span>
                                            )}
                                        </div>
                                        <div className={cx('form-group', { 'has-error': errors.district })}>
                                            <label>Quận/Huyện</label>
                                            <select
                                                value={formData.district}
                                                onChange={(e) => handleFormChange('district', e.target.value)}
                                            >
                                                <option value="">Chọn quận/huyện</option>
                                                {districts.map(d => (
                                                    <option key={d} value={d}>{d}</option>
                                                ))}
                                            </select>
                                            {errors.district && (
                                                <span className={cx('error-message')}>{errors.district}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className={cx('form-row')}>
                                        <div className={cx('form-group', { 'has-error': errors.ward })}>
                                            <label>Phường/Xã</label>
                                            <select
                                                value={formData.ward}
                                                onChange={(e) => handleFormChange('ward', e.target.value)}
                                            >
                                                <option value="">Chọn phường/xã</option>
                                                {wards.map(w => (
                                                    <option key={w} value={w}>{w}</option>
                                                ))}
                                            </select>
                                            {errors.ward && (
                                                <span className={cx('error-message')}>{errors.ward}</span>
                                            )}
                                        </div>
                                        <div className={cx('form-group', { 'has-error': errors.street })}>
                                            <label>Số nhà, tên đường</label>
                                            <input 
                                                type="text" 
                                                placeholder="Nhập số nhà, tên đường"
                                                value={formData.street}
                                                onChange={(e) => handleFormChange('street', e.target.value)}
                                            />
                                            {errors.street && (
                                                <span className={cx('error-message')}>{errors.street}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className={cx('form-group', 'checkbox-group')}>
                                        <label>
                                            <input 
                                                type="checkbox"
                                                checked={formData.isDefault}
                                                onChange={(e) => handleFormChange('isDefault', e.target.checked)}
                                            />
                                            <span>Đặt làm địa chỉ mặc định</span>
                                        </label>
                                    </div>
                                    <div className={cx('form-actions')}>
                                        <button
                                            type="button"
                                            className={cx('cancel-button')}
                                            onClick={() => setShowAddForm(false)}
                                        >
                                            Hủy
                                        </button>
                                        <button type="submit" className={cx('submit-button')}>
                                            {editingId ? 'Cập nhật' : 'Thêm mới'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
