import { useRef, useState, type ChangeEvent, type DragEvent } from 'react';
import { FileText, Loader2, UploadCloud, RefreshCw, AlertCircle } from 'lucide-react';
import { uploadCv, removeCv, SubmissionError } from '@/lib/submissions';
import { cn } from '@/lib/utils';

const ACCEPTED_EXTENSIONS = ['pdf', 'doc', 'docx'];

function extensionOf(nameOrPath: string): string {
  return nameOrPath.split('.').pop()?.toLowerCase() ?? '';
}

/** منطقة سحب وإفلات لرفع السيرة الذاتية، مع حالة رفع واستبدال. */
export function CvUpload({
  value,
  onChange,
  error,
}: {
  value?: string;
  onChange: (path: string) => void;
  error?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedName, setUploadedName] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setLocalError(null);
    const ext = extensionOf(file.name);
    if (!ACCEPTED_EXTENSIONS.includes(ext)) {
      setLocalError('صيغة الملف غير مدعومة. يُقبل PDF أو DOC أو DOCX فقط.');
      return;
    }

    const previousPath = value;
    setUploading(true);
    try {
      const path = await uploadCv(file);
      if (previousPath) {
        removeCv(previousPath).catch(() => {
          /* تجاهل فشل حذف الملف القديم — لا يؤثر على تجربة المستخدم */
        });
      }
      setUploadedName(file.name);
      onChange(path);
    } catch (err) {
      setLocalError(err instanceof SubmissionError ? err.message : 'تعذّر رفع الملف. حاول مرة أخرى.');
    } finally {
      setUploading(false);
    }
  }

  function openPicker() {
    inputRef.current?.click();
  }

  function onInputChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) void handleFile(file);
    e.target.value = '';
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) void handleFile(file);
  }

  const displayError = error ?? localError ?? undefined;
  const hasFile = Boolean(value);

  return (
    <div className="flex flex-col gap-2">
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx"
        className="hidden"
        onChange={onInputChange}
      />

      {!hasFile && (
        <div
          role="button"
          tabIndex={0}
          onClick={uploading ? undefined : openPicker}
          onKeyDown={(e) => {
            if (!uploading && (e.key === 'Enter' || e.key === ' ')) {
              e.preventDefault();
              openPicker();
            }
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          className={cn(
            'flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-colors duration-200',
            isDragging ? 'border-primary bg-primary/5' : 'border-border bg-secondary/30 hover:border-primary/40',
            uploading && 'pointer-events-none opacity-70',
            displayError && 'border-destructive/40'
          )}
        >
          {uploading ? (
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          ) : (
            <UploadCloud className="h-8 w-8 text-primary" strokeWidth={1.75} />
          )}
          <div className="flex flex-col gap-1">
            <p className="text-sm font-semibold text-foreground">
              {uploading ? 'جارٍ رفع الملف...' : 'اسحب وأفلت السيرة الذاتية هنا'}
            </p>
            {!uploading && <p className="text-xs text-muted-foreground">أو اضغط للاختيار من جهازك — PDF, DOC, DOCX</p>}
          </div>
        </div>
      )}

      {hasFile && (
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-primary/30 bg-primary/5 px-4 py-3.5">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-sm font-semibold text-foreground">
                {uploadedName ?? 'تم رفع السيرة الذاتية'}
              </span>
              <span className="text-xs text-muted-foreground">تم الرفع بنجاح</span>
            </div>
          </div>
          <button
            type="button"
            onClick={openPicker}
            disabled={uploading}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary/10 disabled:opacity-50"
          >
            {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
            استبدال
          </button>
        </div>
      )}

      {displayError && (
        <p className="flex items-center gap-1.5 text-xs font-medium text-destructive">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          {displayError}
        </p>
      )}
    </div>
  );
}
