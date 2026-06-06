'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { RefreshCw } from 'lucide-react';

const REFRESH_INTERVAL = 30; // seconds

export default function LiveRefresh() {
  const router = useRouter();
  const [secondsLeft, setSecondsLeft] = useState(REFRESH_INTERVAL);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const shouldRefreshRef = useRef(false);

  // Handle the actual refresh in a separate effect to avoid
  // calling router.refresh() during a state updater (render phase)
  useEffect(() => {
    if (shouldRefreshRef.current) {
      shouldRefreshRef.current = false;
      setIsRefreshing(true);
      router.refresh();
      setTimeout(() => setIsRefreshing(false), 800);
    }
  });

  // Countdown timer
  useEffect(() => {
    const tick = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          shouldRefreshRef.current = true;
          return REFRESH_INTERVAL;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(tick);
  }, []);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    router.refresh();
    setSecondsLeft(REFRESH_INTERVAL);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  return (
    <button
      onClick={handleManualRefresh}
      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 border border-emerald-100 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition-all active:scale-95 group"
      title={`Auto-refreshes in ${secondsLeft}s`}
    >
      <RefreshCw
        size={14}
        className={`transition-transform duration-700 ${isRefreshing ? 'animate-spin' : 'group-hover:rotate-180'}`}
      />
      <span className="flex items-center gap-1.5">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 animate-ping opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        Live
      </span>
    </button>
  );
}
