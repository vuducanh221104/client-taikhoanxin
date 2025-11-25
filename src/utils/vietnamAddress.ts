/**
 * Vietnam Address Utility
 * Helper functions to work with vietnam-provinces
 */

// Dynamic import for CommonJS module compatibility
let vietnamProvinces: any;

// Lazy load the module
const getVietnamProvinces = () => {
    if (!vietnamProvinces) {
        vietnamProvinces = require('vietnam-provinces');
    }
    return vietnamProvinces;
};

export interface AddressOption {
    value: string;
    text: string;
}

/**
 * Get all provinces
 */
export const getProvinces = (): AddressOption[] => {
    const vp = getVietnamProvinces();
    const provinces = vp.getProvinces();
    
    return provinces.map((province: any) => ({
        value: province.code,
        text: province.name,
    })).sort((a: AddressOption, b: AddressOption) => a.text.localeCompare(b.text, 'vi'));
};

/**
 * Get districts by province code
 */
export const getDistricts = (provinceCode: string): AddressOption[] => {
    if (!provinceCode) {
        return [];
    }
    
    const vp = getVietnamProvinces();
    const districts = vp.getDistricts(provinceCode);
    
    return districts.map((district: any) => ({
        value: district.code,
        text: district.name,
    })).sort((a: AddressOption, b: AddressOption) => a.text.localeCompare(b.text, 'vi'));
};

/**
 * Get wards by district code (only need district code, not province code)
 */
export const getWards = (districtCode: string): AddressOption[] => {
    if (!districtCode) {
        return [];
    }
    
    const vp = getVietnamProvinces();
    const wards = vp.getWards(districtCode);
    
    return wards.map((ward: any) => ({
        value: ward.code,
        text: ward.name,
    })).sort((a: AddressOption, b: AddressOption) => a.text.localeCompare(b.text, 'vi'));
};

/**
 * Get province name by code
 */
export const getProvinceName = (provinceCode: string): string => {
    if (!provinceCode) {
        return '';
    }
    const vp = getVietnamProvinces();
    const provinces = vp.getProvinces();
    const province = provinces.find((p: any) => p.code === provinceCode);
    return province?.name || '';
};

/**
 * Get district name by province code and district code
 */
export const getDistrictName = (provinceCode: string, districtCode: string): string => {
    if (!provinceCode || !districtCode) {
        return '';
    }
    const vp = getVietnamProvinces();
    const districts = vp.getDistricts(provinceCode);
    const district = districts.find((d: any) => d.code === districtCode);
    return district?.name || '';
};

/**
 * Get ward name by district code and ward code
 */
export const getWardName = (districtCode: string, wardCode: string): string => {
    if (!districtCode || !wardCode) {
        return '';
    }
    const vp = getVietnamProvinces();
    const wards = vp.getWards(districtCode);
    const ward = wards.find((w: any) => w.code === wardCode);
    return ward?.name || '';
};

