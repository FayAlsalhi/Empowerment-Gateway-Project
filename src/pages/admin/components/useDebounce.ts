import { useEffect, useState } from 'react';

/** يؤخر تحديث القيمة حتى يتوقف المستخدم عن الكتابة لفترة قصيرة (لتقليل نداءات البحث). */
export function useDebounce<T>(value: T, delayMs = 400): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}
