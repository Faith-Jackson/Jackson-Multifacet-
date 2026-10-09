import { ChangeEvent } from "react";

interface CurrencyInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  prefix?: string;
}

export default function CurrencyInput({ value, onChange, placeholder, className, prefix }: CurrencyInputProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Strip all non-digit characters except for a single decimal point
    let val = e.target.value.replace(/[^0-9.]/g, '');
    
    // Prevent multiple decimal points
    const parts = val.split('.');
    if (parts.length > 2) {
      val = parts[0] + '.' + parts.slice(1).join('');
    }

    // Format with commas before the decimal part
    if (val) {
      const [intPart, decPart] = val.split('.');
      const formattedInt = new Intl.NumberFormat('en-US').format(parseInt(intPart || '0', 10));
      val = decPart !== undefined ? `${formattedInt}.${decPart}` : formattedInt;
    }

    // Pass the raw, unformatted value back to the parent to easily handle state logic
    // Actually, parent handles string (e.g. "1,000,000").
    onChange(val);
  };

  return (
    <div className="relative w-full">
      {prefix && (
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 font-bold z-10 pointer-events-none">
          {prefix}
        </span>
      )}
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className={className}
      />
    </div>
  );
}
