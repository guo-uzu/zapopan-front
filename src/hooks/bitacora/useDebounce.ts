import { useState, useEffect } from "react";

export const useDebouncedValue = (value: T, delay: number) => {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);
    return debounced;
};

export default useDebouncedValue;
