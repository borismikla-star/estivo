import React, { useState } from 'react';
import { MessageSquare, X, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { base44 } from '@/api/base44Client';

const BUILD_TIMESTAMP = import.meta.env.VITE_BUILD_TIMESTAMP || 'dev';

export default function FeedbackButton({ user }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) return;
    setSending(true);
    const body = [
      `From: ${user?.email || 'anonymous'}`,
      `Page: ${window.location.href}`,
      `Build: ${BUILD_TIMESTAMP}`,
      ``,
      message,
    ].join('\n');
    await base44.integrations.Core.SendEmail({
      to: 'feedback@estivo.io',
      subject: `[Feedback] ${user?.email || 'anonymous'}`,
      body,
    });
    setSending(false);
    setSent(true);
    setMessage('');
    setTimeout(() => { setOpen(false); setSent(false); }, 2000);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        <MessageSquare className="h-3.5 w-3.5" />
        Feedback / Report issue
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl shadow-xl p-5 w-full max-w-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">Feedback / Report issue</h3>
              <button onClick={() => setOpen(false)}><X className="h-4 w-4 text-muted-foreground" /></button>
            </div>
            {sent ? (
              <p className="text-sm text-green-600 font-medium py-4 text-center">Thank you! Message sent.</p>
            ) : (
              <>
                <Textarea
                  placeholder="Describe the issue or leave feedback…"
                  rows={4}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  className="text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Sent from: {user?.email || 'anonymous'} · {window.location.pathname}
                </p>
                <Button size="sm" className="w-full gap-2" onClick={handleSend} disabled={sending || !message.trim()}>
                  {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  Send
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}