import { useState } from 'preact/hooks';
import { t, type Lang } from '../../i18n/ui';

interface Props {
  lang: Lang;
  web3Key: string;
}

export default function ContactForm({ lang, web3Key }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const recipient = lang === 'ru'
    ? 'alexander.narbayev@yandex.ru'
    : 'alexander.narbayev@gmail.com';

  async function handleSubmit(e: Event) {
    e.preventDefault();
    setStatus('sending');

    try {
      const formData = new FormData();
      formData.append('access_key', web3Key);
      formData.append('name', name);
      formData.append('email', email);
      formData.append('subject', `[${lang.toUpperCase()}] ${subject}`);
      formData.append('message', message);
      formData.append('from_name', 'Spiral Contact Form');
      formData.append('replyto', email);

      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        setStatus('sent');
        setName(''); setEmail(''); setSubject(''); setMessage('');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  if (status === 'sent') {
    return <div class="contact-success">{t('contact.sent', lang)}</div>;
  }

  return (
    <form class="contact-form" onSubmit={handleSubmit}>
      <label>
        <span>{t('contact.name', lang)}</span>
        <input type="text" value={name} onInput={e => setName((e.target as HTMLInputElement).value)} required />
      </label>
      <label>
        <span>{t('contact.email', lang)}</span>
        <input type="email" value={email} onInput={e => setEmail((e.target as HTMLInputElement).value)} required />
      </label>
      <label>
        <span>{t('contact.subject', lang)}</span>
        <input type="text" value={subject} onInput={e => setSubject((e.target as HTMLInputElement).value)} required />
      </label>
      <label>
        <span>{t('contact.message', lang)}</span>
        <textarea value={message} onInput={e => setMessage((e.target as HTMLTextAreaElement).value)} rows={5} required />
      </label>
      <button type="submit" disabled={status === 'sending'}>
        {status === 'sending' ? t('contact.sending', lang) : t('contact.send', lang)}
      </button>
      {status === 'error' && <p class="contact-error">{t('contact.error', lang)}</p>}
    </form>
  );
}
