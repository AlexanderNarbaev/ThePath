import { useState } from 'preact/hooks';
import { t, type Lang } from '../../i18n/ui';

interface Props { lang: Lang; web3Key: string; }

export default function ContactForm({ lang, web3Key }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [charCount, setCharCount] = useState(0);

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = t('contact.val_required', lang);
    if (!email.trim()) e.email = t('contact.val_required', lang);
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = t('contact.val_email', lang);
    if (!subject.trim()) e.subject = t('contact.val_required', lang);
    if (!message.trim()) e.message = t('contact.val_required', lang);
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: Event) {
    e.preventDefault();
    if (!validate()) return;
    setStatus('sending'); setErrorMsg('');
    try {
      const fd = new FormData();
      fd.append('access_key', web3Key);
      fd.append('name', name);
      fd.append('email', email);
      fd.append('subject', `[${lang.toUpperCase()}] ${subject}`);
      fd.append('message', message);
      fd.append('from_name', 'Spiral Contact Form');
      fd.append('replyto', email);
      fd.append('botcheck', '');
      const res = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.success) {
        setStatus('sent');
        setName(''); setEmail(''); setSubject(''); setMessage('');
      } else {
        setStatus('error');
        setErrorMsg(data.message || `${t('contact.error', lang)} (${res.status})`);
      }
    } catch (err: any) {
      setStatus('error');
      setErrorMsg(`${t('contact.error_net', lang)}: ${err.message || ''}`);
    }
  }

  if (status === 'sent') {
    return (
      <div class="cf-success">
        <div class="cf-ok">✓</div>
        <h2>{t('contact.sent', lang)}</h2>
        <p>{t('contact.sent_desc', lang)}</p>
      </div>
    );
  }

  return (
    <form class="cf-form" onSubmit={handleSubmit} novalidate>
      <div class="cf-fields">
        <div class="cf-row">
          <div class={`cf-cell${errors.name ? ' cf-cell-err' : ''}`}>
            <input type="text" value={name} onInput={e => { setName((e.target as HTMLInputElement).value); setErrors(p => ({...p, name: ''})); }} class="cf-input" />
            <label class="cf-lbl">{t('contact.name', lang)}</label>
          </div>
          <div class={`cf-cell${errors.email ? ' cf-cell-err' : ''}`}>
            <input type="email" value={email} onInput={e => { setEmail((e.target as HTMLInputElement).value); setErrors(p => ({...p, email: ''})); }} class="cf-input" />
            <label class="cf-lbl">{t('contact.email', lang)}</label>
          </div>
        </div>
        <div class={`cf-cell${errors.subject ? ' cf-cell-err' : ''}`}>
          <input type="text" value={subject} onInput={e => { setSubject((e.target as HTMLInputElement).value); setErrors(p => ({...p, subject: ''})); }} class="cf-input" />
          <label class="cf-lbl">{t('contact.subject', lang)}</label>
        </div>
        <div class={`cf-cell cf-cell-area${errors.message ? ' cf-cell-err' : ''}`}>
          <textarea value={message} onInput={e => { setMessage((e.target as HTMLTextAreaElement).value); setCharCount((e.target as HTMLTextAreaElement).value.length); setErrors(p => ({...p, message: ''})); }} class="cf-input cf-textarea" rows={8} />
          <label class="cf-lbl">{t('contact.message', lang)}</label>
          <span class="cf-count">{charCount}</span>
        </div>
      </div>

      <input type="text" name="_honey" style="display:none" autocomplete="off" />

      <div class="cf-bottom">
        <button type="submit" disabled={status === 'sending'} class="cf-btn">
          {status === 'sending' ? t('contact.sending', lang) : t('contact.send', lang)}
        </button>
        {status === 'error' && (
          <p class="cf-error-inline" dangerouslySetInnerHTML={{ __html: t('contact.fallback', lang) }} />
        )}
      </div>
    </form>
  );
}
