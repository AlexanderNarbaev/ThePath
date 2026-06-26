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
  const [errors, setErrors] = useState<Record<string, string>>({});

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
        setErrorMsg(data.message || `${t('contact.error', lang)} (${res.status})`);
      }
    } catch (err: any) {
      setStatus('error');
      setErrorMsg(`${t('contact.error_net', lang)}: ${err.message || ''}`);
    }
  }

  function insertTag(tag: string, sample: string) {
    const textarea = document.getElementById('cf-message') as HTMLTextAreaElement;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = message.substring(0, start);
    const selected = message.substring(start, end) || sample;
    const after = message.substring(end);
    setMessage(before + `<${tag}>${selected}</${tag}>` + after);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        before.length + `<${tag}>`.length,
        before.length + `<${tag}>${selected}`.length,
      );
    }, 0);
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
    <form class="cf-form" onSubmit={handleSubmit} novalidate>
      <div class="cf-row">
        <label class="cf-field">
          <span class="cf-label">{t('contact.name', lang)}</span>
          <div class={`cf-box${errors.name ? ' cf-box-err' : ''}`}>
            <input
              type="text"
              value={name}
              onInput={e => { setName((e.target as HTMLInputElement).value); setErrors(e => ({...e, name: ''})); }}
              placeholder={t('contact.name_ph', lang)}
              class="cf-input"
            />
          </div>
          {errors.name && <span class="cf-val-err">{errors.name}</span>}
        </label>
        <label class="cf-field">
          <span class="cf-label">{t('contact.email', lang)}</span>
          <div class={`cf-box${errors.email ? ' cf-box-err' : ''}`}>
            <input
              type="email"
              value={email}
              onInput={e => { setEmail((e.target as HTMLInputElement).value); setErrors(e => ({...e, email: ''})); }}
              placeholder="email@example.com"
              class="cf-input"
            />
          </div>
          {errors.email && <span class="cf-val-err">{errors.email}</span>}
        </label>
      </div>

      <label class="cf-field">
        <span class="cf-label">{t('contact.subject', lang)}</span>
        <div class={`cf-box${errors.subject ? ' cf-box-err' : ''}`}>
          <input
            type="text"
            value={subject}
            onInput={e => { setSubject((e.target as HTMLInputElement).value); setErrors(e => ({...e, subject: ''})); }}
            placeholder={t('contact.subject_ph', lang)}
            class="cf-input"
          />
        </div>
        {errors.subject && <span class="cf-val-err">{errors.subject}</span>}
      </label>

      <label class="cf-field">
        <span class="cf-label">{t('contact.message', lang)}</span>
        <div class={`cf-box${errors.message ? ' cf-box-err' : ''}`}>
          <div class="cf-toolbar">
            <button type="button" class="cf-tb-btn" title="Bold" onClick={() => insertTag('b', lang === 'ru' ? 'жирный' : 'bold')}>B</button>
            <button type="button" class="cf-tb-btn" title="Italic" onClick={() => insertTag('i', lang === 'ru' ? 'курсив' : 'italic')}>I</button>
            <button type="button" class="cf-tb-btn" title="Link" onClick={() => insertTag('a href=""', lang === 'ru' ? 'ссылка' : 'link')}>🔗</button>
            <button type="button" class="cf-tb-btn" title="Code" onClick={() => insertTag('code', 'code')}>&lt;/&gt;</button>
            <button type="button" class="cf-tb-btn" title="Blockquote" onClick={() => insertTag('blockquote', lang === 'ru' ? 'цитата' : 'quote')}>❝</button>
          </div>
          <textarea
            id="cf-message"
            value={message}
            onInput={e => { setMessage((e.target as HTMLTextAreaElement).value); setErrors(e => ({...e, message: ''})); }}
            placeholder={t('contact.message_ph', lang)}
            rows={6}
            class="cf-input cf-textarea"
          />
          <div class="cf-preview" dangerouslySetInnerHTML={{ __html: message || `<span style="opacity:0.4">${t('contact.preview', lang)}</span>` }} />
        </div>
        {errors.message && <span class="cf-val-err">{errors.message}</span>}
      </label>

      <input type="text" name="_honey" style="display:none" autocomplete="off" />

      <div class="cf-footer">
        <button type="submit" disabled={status === 'sending'} class="cf-btn">
          {status === 'sending' ? t('contact.sending', lang) : t('contact.send', lang)}
        </button>
        {status === 'error' && (
          <div class="cf-error-block">
            <p class="cf-error">{errorMsg}</p>
            <p class="cf-error-hint" dangerouslySetInnerHTML={{ __html: t('contact.fallback', lang) }} />
          </div>
        )}
      </div>
    </form>
  );
}
