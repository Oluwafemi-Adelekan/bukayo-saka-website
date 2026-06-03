'use client'

interface VimeoCoverProps {
  id: string
  className?: string
}

export function VimeoCover({ id, className = "" }: VimeoCoverProps) {
  return (
    <div 
      className={`relative w-full h-full overflow-hidden pointer-events-none ${className}`}
      style={{ containerType: 'size' }}
    >
      <iframe
        src={`https://player.vimeo.com/video/${id}?background=1&quality=1080p&dnt=1`}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: '100cqw',
          height: '56.25cqw',
          minHeight: '100cqh',
          minWidth: '177.77cqh',
        }}
        frameBorder="0"
        allow="autoplay; fullscreen; picture-in-picture"
      />
    </div>
  )
}
