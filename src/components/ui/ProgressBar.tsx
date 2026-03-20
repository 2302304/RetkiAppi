import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
  showPercentage?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function ProgressBar({
  value,
  max,
  label,
  showPercentage = true,
  className,
  size = 'md',
}: ProgressBarProps) {
  const percentage = max > 0 ? Math.round((value / max) * 100) : 0;

  return (
    <div className={cn('space-y-1', className)}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center text-sm">
          {label && <span className="font-medium text-gray-700">{label}</span>}
          {showPercentage && (
            <span className="text-gray-500">
              {value} / {max} ({percentage}%)
            </span>
          )}
        </div>
      )}
      <div
        className={cn('w-full bg-gray-200 rounded-full overflow-hidden', {
          'h-2': size === 'sm',
          'h-3': size === 'md',
          'h-4': size === 'lg',
        })}
      >
        <div
          className="bg-green-600 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
