interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label:string,
    error?:string
}

const Input = ({label, error, ...props}:InputProps) => {
    return (
    <div className="flex flex-col gap-1">
      {/* Label */}
      <label className="text-sm text-slate-400 font-medium">
        {label}
      </label>

      {/* Input field */}
      <input
        {...props}
        className={`
          w-full px-4 py-3 rounded-xl
          bg-slate-800 text-white
          border transition-colors duration-200
          placeholder:text-slate-500
          outline-none
          ${error
            ? 'border-red-500 focus:border-red-400'   // error state
            : 'border-slate-700 focus:border-blue-500' // normal state
          }
        `}
      />

      {/* Error message */}
      {error && (
        <p className="text-xs text-red-400 mt-0.5">
          {error}
        </p>
      )}
    </div>
  )
}

export default Input