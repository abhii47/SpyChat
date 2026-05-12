interface AvatarProps {
    src:string | null
    name:string
    size?: 'sm' | 'md' | 'lg' | 'xl'
    isOnline?: boolean
}

const sizeMap = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-20 h-20 text-2xl',
}

const Avatar = ({src, name, size="md", isOnline }:AvatarProps) => {
    const initials = name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    return (
        <div className="relative inline-block flex-shrink-0">
      {src ? (
        <img
          src={src}
          alt={name}
          className={`${sizeMap[size]} rounded-full object-cover`}
        />
      ) : (
        // No avatar → colored circle with initials
        <div className={`
          ${sizeMap[size]} rounded-full
          bg-gradient-to-br from-blue-500 to-blue-700
          flex items-center justify-center
          font-semibold text-white
        `}>
          {initials}
        </div>
      )}

      {/* Online badge — green dot */}
      {isOnline !== undefined && (
        <span className={`
          absolute bottom-0 right-0
          w-3 h-3 rounded-full border-2 border-slate-900
          ${isOnline ? 'bg-green-500' : 'bg-slate-500'}
        `} />
      )}
    </div>
    )
}

export default Avatar