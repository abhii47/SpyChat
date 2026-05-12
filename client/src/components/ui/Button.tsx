interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    isLoading?: boolean,
    variant?: 'primary' | 'ghost'
}

const Button = ({
    children,
    isLoading,
    variant = 'primary',
    disabled,
    ...props
}: ButtonProps) => {
    const baseClasses = `
        w-full py-3 px-4 rounded-xl
        font-semibold text-sm
        transition-all duration-200
        flex items-center justify-center gap-2
        disabled:opacity-50 disabled:cursor-not-allowed
    `
    const variantClasses = {
        primary: 'bg-blue-600 hover:bg-blue-500 text-white',
        ghost:   'bg-transparent border border-slate-700 hover:bg-slate-800 text-slate-300',
    }

    return (
        <button
            {...props}
            disabled={isLoading || disabled}
            className={`${baseClasses} ${variantClasses[variant]}`}
        >
            {/* Loading spinner */}
            {isLoading && (
                <div className="w-4 h-4 border-2 border-white
                                border-t-transparent rounded-full animate-spin" />
            )}
            {children}
        </button>
    )
}

export default Button