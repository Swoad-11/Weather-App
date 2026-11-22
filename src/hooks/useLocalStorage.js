import { useEffect, useState } from "react";

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

const useLocalStorage = (storageKey, initialValue) => {
  const [value, setValue] = useState(() => read(storageKey, initialValue));

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(value));
    } catch {
      /* storage unavailable (private mode) — keep in memory only */
    }
  }, [value, storageKey]);

  return [value, setValue];
};

export default useLocalStorage;
