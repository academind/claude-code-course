'use client';

import { useActionState, useState, useEffect, useRef } from 'react';
import { toggleSharing } from '@/app/notes/[id]/actions';

interface ShareToggleProps {
  noteId: string;
  initialIsPublic: boolean;
  initialSlug: string | null;
}

export function ShareToggle({ noteId, initialIsPublic, initialSlug }: ShareToggleProps) {
  const [state, formAction, isPending] = useActionState(toggleSharing, {
    success: true,
    isPublic: initialIsPublic,
    slug: initialSlug,
  });

  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState('');
  const dialogRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const isPublic = state.isPublic ?? initialIsPublic;
  const slug = state.slug ?? initialSlug;

  const publicUrl = slug && origin ? `${origin}/p/${slug}` : null;

  async function copyToClipboard() {
    if (!publicUrl) return;
    await navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleToggleClick() {
    if (isPublic) {
      // Disabling sharing - no confirmation needed
      formRef.current?.requestSubmit();
    } else {
      // Enabling sharing - show confirmation dialog
      dialogRef.current?.showModal();
    }
  }

  function handleConfirmShare() {
    dialogRef.current?.close();
    formRef.current?.requestSubmit();
  }

  return (
    <div className='border-t border-border pt-6 mt-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h3 className='font-medium'>Public Sharing</h3>
          <p className='text-sm text-foreground/60'>
            {isPublic ? 'Anyone with the link can view this note' : 'Only you can view this note'}
          </p>
        </div>
        <form ref={formRef} action={formAction}>
          <input type='hidden' name='noteId' value={noteId} />
          <input type='hidden' name='enable' value={isPublic ? 'false' : 'true'} />
          <button
            type='button'
            onClick={handleToggleClick}
            disabled={isPending}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              isPublic ? 'bg-green-600' : 'bg-foreground/20'
            } ${isPending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isPublic ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </form>
      </div>

      <dialog
        ref={dialogRef}
        className='fixed inset-0 m-auto p-6 rounded-lg backdrop:bg-black/50 max-w-sm bg-white dark:bg-gray-900 text-foreground'
      >
        <h2 className='text-lg font-semibold mb-2'>Enable Public Sharing</h2>
        <p className='text-foreground/70 mb-4'>
          This will make your note accessible to anyone with the link. Are you sure you want to
          continue?
        </p>
        <div className='flex gap-2 justify-end'>
          <button
            type='button'
            onClick={() => dialogRef.current?.close()}
            className='px-4 py-2 text-sm border border-border rounded-lg bg-transparent hover:bg-gray-200 dark:hover:bg-gray-700'
          >
            Cancel
          </button>
          <button
            type='button'
            onClick={handleConfirmShare}
            className='px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700'
          >
            Enable Sharing
          </button>
        </div>
      </dialog>

      {isPublic && publicUrl && (
        <div className='mt-4 flex items-center gap-2'>
          <input
            type='text'
            readOnly
            value={publicUrl}
            className='flex-1 px-3 py-2 bg-foreground/5 border border-border rounded text-sm'
          />
          <button
            type='button'
            onClick={copyToClipboard}
            className='px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors'
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      )}

      {state.error && <p className='mt-2 text-sm text-red-600'>{state.error}</p>}
    </div>
  );
}
