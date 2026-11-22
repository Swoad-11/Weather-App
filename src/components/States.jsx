/* eslint-disable react/prop-types */
import { useLocation } from "../context";
import { LocateIcon, RefreshIcon } from "./Icons";

const Block = ({ className }) => <div className={`glass-card animate-pulse ${className}`} />;

export function Skeleton({ message }) {
  return (
    <div className="grid gap-4 lg:grid-cols-3" aria-busy="true" aria-label={message}>
      <div className="glass-card relative min-h-[340px] animate-pulse p-8 lg:col-span-2">
        <div className="h-7 w-48 rounded-lg bg-white/15" />
        <div className="mt-3 h-4 w-64 rounded bg-white/10" />
        <div className="mt-10 flex items-center gap-6">
          <div className="h-32 w-32 rounded-full bg-white/10" />
          <div className="h-28 w-40 rounded-2xl bg-white/15" />
        </div>
        <p className="absolute bottom-6 left-8 text-sm text-white/70">{message}</p>
      </div>
      <Block className="min-h-[340px]" />
      <Block className="h-56 lg:col-span-3" />
      <div className="grid gap-4 sm:grid-cols-2 lg:col-span-3 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Block key={i} className="h-44" />
        ))}
      </div>
    </div>
  );
}

export function ErrorState({ error, onRetry }) {
  const { locate } = useLocation();
  return (
    <div className="glass-card mx-auto mt-10 max-w-md p-8 text-center">
      <div className="text-5xl">⛅</div>
      <h2 className="mt-4 text-xl font-semibold">Couldn&apos;t load the weather</h2>
      <p className="mt-2 text-sm text-white/70">{error?.message || "Something went wrong."}</p>
      <div className="mt-6 flex justify-center gap-3">
        <button onClick={onRetry} className="btn-primary">
          <RefreshIcon size={16} /> Try again
        </button>
        <button onClick={locate} className="btn-ghost">
          <LocateIcon size={16} /> My location
        </button>
      </div>
    </div>
  );
}
