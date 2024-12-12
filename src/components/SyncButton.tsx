import React from "react";

interface SyncButtonProps {
  onSync: () => void;
  isPending: boolean;
  className?: string;
  label?: string;
}

const SyncButton: React.FC<SyncButtonProps> = ({
  onSync,
  isPending,
  className = "",
  label = "Sync"
}) => {
  return (
    <button
      onClick={onSync}
      disabled={isPending}
      className={`px-4 py-2 border border-white text-white rounded bg-transparent transition-colors hover:bg-white hover:text-black disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {isPending ? "Syncing..." : label}
    </button>
  );
};

export default SyncButton;
