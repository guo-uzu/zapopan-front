const formatDataDate = (dateRange: Date): string => {
    const day = String(dateRange.getUTCDate()).padStart(2, "0");
    const month = String(dateRange.getUTCMonth() + 1).padStart(2, "0");
    return `${dateRange.getUTCFullYear()}-${month}-${day}`;
};

const formatDateUI = (date: Date | undefined): string | undefined => {
    if (date) {
        const day = String(date.getUTCDate()).padStart(2, "0");
        const month = String(date.getUTCMonth() + 1).padStart(2, "0");
        return `${day}/${month}/${date.getUTCFullYear()}`;
    }
};

export { formatDataDate, formatDateUI };
