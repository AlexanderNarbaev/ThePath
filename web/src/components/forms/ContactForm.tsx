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

  function validate(): boolean {
    if (!name.trim()) { setStatus('error'); setErrorMsg(t('contact.val_name', lang)); return false; }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setStatus('error'); setErrorMsg(t('contact.val_email_long', lang)); return false; }
    if (!subject.trim()) { setStatus('error'); setErrorMsg(t('contact.val_subject', lang)); return false; }
    if (!message.trim()) { setStatus('error'); setErrorMsg(t('contact.val_message', lang)); return false; }
    return true;
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
        setErrorMsg(data.message || t('contact.error', lang));
      }
    } catch {
      setStatus('error');
      setErrorMsg(t('contact.error_net', lang));
    }
  }

  if (status === 'sent') {
    return (
      <div class="cf-done">
        <div class="cf-done-mark">✓</div>
        <h2>{t('contact.sent', lang)}</h2>
        <p>{t('contact.sent_desc', lang)}</p>
      </div>
    );
  }

  return (
    <form class="cf-form" onSubmit={handleSubmit} novalidate>
      <div class="cf-grp">
        <label class="cf-lbl">{t('contact.name', lang)}</label>
        <input type="text" value={name} onInput={e => setName((e.target as HTMLInputElement).value)} placeholder={t('contact.name_ph', lang)} class="cf-inp" />
      </div>
      <div class="cf-grp">
        <label class="cf-lbl">{t('contact.email', lang)}</label>
        <input type="email" value={email} onInput={e => setEmail((e.target as HTMLInputElement).value)} placeholder="email@example.com" class="cf-inp" />
      </div>
      <div class="cf-grp">
        <label class="cf-lbl">{t('contact.subject', lang)}</label>
        <input type="text" value={subject} onInput={e => setSubject((e.target as HTMLInputElement).value)} placeholder={t('contact.subject_ph', lang)} class="cf-inp" />
      </div>
      <div class="cf-grp">
        <label class="cf-lbl">{t('contact.message', lang)}</label>
        <textarea value={message} onInput={e => setMessage((e.target as HTMLTextAreaElement).value)} placeholder={t('contact.message_ph', lang)} rows={7} class="cf-inp" />
      </div>

      <input type="text" name="_honey" style="display:none" autocomplete="off" />

      <button type="submit" disabled={status === 'sending'} class="cf-btn">
        {status === 'sending' ? t('contact.sending', lang) : t('contact.send', lang)}
      </button>

      {status === 'error' && (
        <p class="cf-err" dangerouslySetInnerHTML={{ __html: errorMsg + ' &nbsp;|&nbsp; ' + t('contact.fallback', lang) }} />
      )}
    </form>
  );
}
