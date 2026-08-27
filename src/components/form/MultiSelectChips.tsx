import { useState, type KeyboardEvent } from 'react';
import { Check, Plus } from 'lucide-react';
import type { Option } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/** شرائح اختيار متعدد قابلة للتبديل، مع إمكانية إضافة قيمة مخصّصة. */
export function MultiSelectChips({
  options,
  value,
  onChange,
  allowCustom = false,
  placeholder = 'أضف خياراً آخر...',
}: {
  options: Option[];
  value: string[];
  onChange: (v: string[]) => void;
  allowCustom?: boolean;
  placeholder?: string;
}) {
  const [customText, setCustomText] = useState('');

  // خيارات مضافة من المستخدم لا تظهر ضمن القائمة الأصلية
  const customOptions: Option[] = value
    .filter((v) => !options.some((o) => o.value === v))
    .map((v) => ({ value: v, label: v }));

  const allOptions = [...options, ...customOptions];

  function toggle(optionValue: string) {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  }

  function addCustom() {
    const trimmed = customText.trim();
    if (!trimmed) return;
    if (!value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }
    setCustomText('');
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCustom();
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {allOptions.map((option) => {
          const selected = value.includes(option.value);
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => toggle(option.value)}
              aria-pressed={selected}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold transition-colors duration-200',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                selected
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-white text-foreground/90 hover:border-primary/30'
              )}
            >
              {selected && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
              {option.label}
            </button>
          );
        })}
      </div>

      {allowCustom && (
        <div className="flex items-center gap-2">
          <Input
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="h-10 flex-1"
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={addCustom}
            disabled={!customText.trim()}
            aria-label="إضافة"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
