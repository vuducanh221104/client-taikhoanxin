/**
 * Export data to CSV format
 */
export const exportToCSV = (data: any[], filename: string) => {
    if (!data || data.length === 0) {
        console.warn('No data to export');
        return;
    }

    // Get headers from first object
    const headers = Object.keys(data[0]);
    
    // Create CSV content
    const csvContent = [
        // Header row
        headers.join(','),
        // Data rows
        ...data.map(row => 
            headers.map(header => {
                const value = row[header];
                // Handle values that contain commas or quotes
                if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                    return `"${value.replace(/"/g, '""')}"`;
                }
                return value;
            }).join(',')
        )
    ].join('\n');

    // Create blob and download
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

/**
 * Export data to JSON format
 */
export const exportToJSON = (data: any[], filename: string) => {
    if (!data || data.length === 0) {
        console.warn('No data to export');
        return;
    }

    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.json`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

/**
 * Format data for export with Vietnamese formatting
 */
export const formatDataForExport = (data: any[]) => {
    return data.map(item => {
        const formatted: any = {};
        
        Object.keys(item).forEach(key => {
            const value = item[key];
            
            // Format dates
            if (value instanceof Date) {
                formatted[key] = value.toLocaleDateString('vi-VN');
            }
            // Format numbers with Vietnamese locale
            else if (typeof value === 'number') {
                formatted[key] = value.toLocaleString('vi-VN');
            }
            // Keep other values as is
            else {
                formatted[key] = value;
            }
        });
        
        return formatted;
    });
};
