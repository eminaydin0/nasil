import { forwardRef, useId, useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

/**
 * TextField - tek kaynakli input/textarea/select
 * variants: input | textarea | select
 * sizes: sm | md | lg
 */
const SIZES = {
  sm: { input: 'py-2 text-xs', icon: 14, padIcon: 'pl-9 pr-3' },
  md: { input: 'py-2.5 text-sm', icon: 16, padIcon: 'pl-10 pr-3' },
  lg: { input: 'py-3 text-base', icon: 18, padIcon: 'pl-11 pr-3.5' },
};

const TONES = {
  default: 'border-warm-200 bg-cream-50 focus:border-orange-400 focus:bg-white',
  subtle: 'border-warm-200/70 bg-white focus:border-orange-400',
};

const TextField = forwardRef(function TextField(
  {
    as = 'input',
    type = 'text',
    label,
    hint,
    error,
    icon: Icon,
    rightAdornment,
    size = 'md',
    tone = 'default',
    fullWidth = true,
    rows = 3,
    className = '',
    inputClassName = '',
    options,
    children,
    id: idProp,
    required,
    ...rest
  },
  ref
) {
  const reactId = useId();
  const id = idProp || `tf-${reactId}`;
  const [reveal, setReveal] = useState(false);

  const s = SIZES[size] || SIZES.md;
  const t = TONES[tone] || TONES.default;
  const isPassword = type === 'password';
  const inputType = isPassword ? (reveal ? 'text' : 'password') : type;

  const errorClass = error
    ? 'border-rose-400 bg-rose-50/60 focus:border-rose-500'
    : t;

  const baseInput = `w-full rounded-xl border-2 text-charcoal-900 placeholder-warm-400 transition-all focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed ${s.input} ${errorClass} ${
    Icon ? s.padIcon : 'px-3.5'
  } ${isPassword || rightAdornment ? 'pr-10' : ''} ${inputClassName}`;

  const wrap = fullWidth ? 'w-full' : '';

  let field;
  if (as === 'textarea') {
    field = (
      <textarea
        id={id}
        ref={ref}
        rows={rows}
        className={`${baseInput} resize-none`}
        required={required}
        {...rest}
      />
    );
  } else if (as === 'select') {
    field = (
      <select id={id} ref={ref} className={baseInput} required={required} {...rest}>
        {options
          ? options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))
          : children}
      </select>
    );
  } else {
    field = (
      <input
        id={id}
        ref={ref}
        type={inputType}
        className={baseInput}
        required={required}
        {...rest}
      />
    );
  }

  return (
    <div className={`${wrap} ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-warm-700"
        >
          {label}
          {required && <span className="text-orange-500">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-warm-400">
            <Icon size={s.icon} aria-hidden="true" />
          </span>
        )}
        {field}
        {isPassword && (
          <button
            type="button"
            onClick={() => setReveal((r) => !r)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-warm-400 transition-colors hover:text-orange-500"
            tabIndex={-1}
            aria-label={reveal ? 'Şifreyi gizle' : 'Şifreyi göster'}
          >
            {reveal ? <EyeOff size={s.icon} /> : <Eye size={s.icon} />}
          </button>
        )}
        {!isPassword && rightAdornment && (
          <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-warm-400">
            {rightAdornment}
          </span>
        )}
      </div>
      {(hint || error) && (
        <div
          className={`mt-1.5 flex items-start gap-1.5 text-xs ${
            error ? 'text-rose-600' : 'text-warm-500'
          }`}
        >
          {error && <AlertCircle size={12} className="mt-0.5 shrink-0" />}
          <span>{error || hint}</span>
        </div>
      )}
    </div>
  );
});

export default TextField;
