import EmptyState from '@/components/EmptyState/EmptyState';

export default function NotFound() {
    return (
        <EmptyState
            type="not-found"
            title="404 - Không tìm thấy trang"
            description="Trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa. Vui lòng kiểm tra lại URL hoặc quay về trang chủ."
            actionLabel="Về trang chủ"
            actionHref="/"
            secondaryActionLabel="Liên hệ hỗ trợ"
            secondaryActionHref="/contact"
        />
    );
}
