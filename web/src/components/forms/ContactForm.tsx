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
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: Event) {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');

    try {
      const formData = new FormData();
      formData.append('access_key', web3Key);
      formData.append('name', name);
      formData.append('email', email);
      formData.append('subject', `[${lang.toUpperCase()}] ${subject}`);
      formData.append('message', message);
      formData.append('from_name', 'Spiral Contact Form');
      formData.append('replyto', email);
      formData.append('botcheck', '');

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
        setErrorMsg(data.message || t('contact.error', lang));
      }
    } catch {
      setStatus('error');
      setErrorMsg(t('contact.error', lang));
    }
  }

  if (status === 'sent') {
    return (
      <div class="cf-success">
        <div class="cf-success-icon">✓</div>
        <h2>{t('contact.sent', lang)}</h2>
        <p>{t('contact.sent_desc', lang)}</p>
      </div>
    );
  }

  return (
    <form class="cf-form" onSubmit={handleSubmit}>
      <div class="cf-row">
        <label class="cf-field">
          <span class="cf-label">{t('contact.name', lang)}</span>
          <input
            type="text"
            value={name}
            onInput={e => setName((e.target as HTMLInputElement).value)}
            placeholder={t('contact.name_ph', lang)}
            required
            class="cf-input"
          />
        </label>
        <label class="cf-field">
          <span class="cf-label">{t('contact.email', lang)}</span>
          <input
            type="email"
            value={email}
            onInput={e => setEmail((e.target as HTMLInputElement).value)}
            placeholder="email@example.com"
            required
            class="cf-input"
          />
        </label>
      </div>
      <label class="cf-field">
        <span class="cf-label">{t('contact.subject', lang)}</span>
        <input
          type="text"
          value={subject}
          onInput={e => setSubject((e.target as HTMLInputElement).value)}
          placeholder={t('contact.subject_ph', lang)}
          required
          class="cf-input"
        />
      </label>
      <label class="cf-field">
        <span class="cf-label">{t('contact.message', lang)}</span>
        <textarea
          value={message}
          onInput={e => setMessage((e.target as HTMLTextAreaElement).value)}
          placeholder={t('contact.message_ph', lang)}
          rows={5}
          required
          class="cf-input cf-textarea"
        />
      </label>

      <input type="text" name="_honey" style="display:none" autocomplete="off" />

      <div class="cf-footer">
        <button type="submit" disabled={status === 'sending'} class="cf-btn">
          {status === 'sending' ? t('contact.sending', lang) : t('contact.send', lang)}
        </button>
        {status === 'error' && <p class="cf-error">{errorMsg}</p>}
      </div>
    </form>
  );
}
