import { cn } from '../../lib/cn'

interface GradientTextProps {
  children: React.ReactNode
  className?: string
  from?: string
  via?: string
  to?: string
  animate?: boolean
}

export default function GradientText({
  children,
  className,
  from = '#f97316',
  via = '#ec4899',
  to = '#a855f7',
  animate = true,
}: GradientTextProps) {
  return (
    <span
      className={cn(
        'bg-clip-text text-transparent',
        animate && 'animate-gradient-shift bg-[length:200%_200%]',
        className,
      )}
      style={{
        backgroundImage: `linear-gradient(135deg, ${from}, ${via}, ${to})`,
      }}
    >
      {children}
    </span>
  )
}
