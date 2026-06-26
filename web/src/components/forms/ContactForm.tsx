import { useState, useRef, useEffect } from 'preact/hooks';
import { t, type Lang } from '../../i18n/ui';

interface Props { lang: Lang; web3Key: string; }

export default function ContactForm({ lang, web3Key }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const editorRef = useRef<HTMLDivElement>(null);
  const [editorEmpty, setEditorEmpty] = useState(true);
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set());

  function getMessage(): string {
    return editorRef.current?.innerHTML || '';
  }

  useEffect(() => {
    if (editorRef.current) {
      setEditorEmpty(!editorRef.current.textContent?.trim());
    }
  }, []);

  function exec(cmd: string, val?: string) {
    editorRef.current?.focus();
    document.execCommand(cmd, false, val);
    setEditorEmpty(!editorRef.current?.textContent?.trim());
    updateActiveFormats();
  }

  function updateActiveFormats() {
    const fmts = new Set<string>();
    if (document.queryCommandState('bold')) fmts.add('bold');
    if (document.queryCommandState('italic')) fmts.add('italic');
    setActiveFormats(fmts);
  }

  function insertLink() {
    const sel = window.getSelection();
    if (sel && !sel.isCollapsed) {
      const url = prompt(lang === 'ru' ? 'URL ссылки:' : 'Link URL:', 'https://');
      if (url) { exec('createLink', url); }
    } else {
      const url = prompt(lang === 'ru' ? 'URL ссылки:' : 'Link URL:', 'https://');
      const text = prompt(lang === 'ru' ? 'Текст ссылки:' : 'Link text:', url || '');
      if (url && text) {
        editorRef.current?.focus();
        document.execCommand('insertHTML', false, `<a href="${url}">${text}</a>`);
        setEditorEmpty(false);
      }
    }
  }

  function insertCode() {
    const sel = window.getSelection();
    if (sel && !sel.isCollapsed) {
      const text = sel.toString();
      editorRef.current?.focus();
      document.execCommand('insertHTML', false, `<code>${text}</code>`);
      setEditorEmpty(false);
    }
  }

  function insertQuote() {
    const sel = window.getSelection();
    if (sel && !sel.isCollapsed) {
      const text = sel.toString();
      editorRef.current?.focus();
      document.execCommand('insertHTML', false, `<blockquote>${text}</blockquote>`);
      setEditorEmpty(false);
    }
  }

  function validate(): boolean {
    const e: Record<string, string> = {};
    const msg = editorRef.current?.textContent?.trim() || '';
    if (!name.trim()) e.name = t('contact.val_required', lang);
    if (!email.trim()) e.email = t('contact.val_required', lang);
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = t('contact.val_email', lang);
    if (!subject.trim()) e.subject = t('contact.val_required', lang);
    if (!msg) e.message = t('contact.val_required', lang);
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
      formData.append('message', getMessage());
      formData.append('from_name', 'Spiral Contact Form');
      formData.append('replyto', email);
      formData.append('botcheck', '');
      const res = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success) {
        setStatus('sent');
        setName(''); setEmail(''); setSubject('');
        if (editorRef.current) editorRef.current.innerHTML = '';
        setEditorEmpty(true);
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
        <div class="cf-success-icon">✓</div>
        <h2>{t('contact.sent', lang)}</h2>
        <p>{t('contact.sent_desc', lang)}</p>
      </div>
    );
  }

  const tb = (cmd: string, label: string, icon: string, title: string) => (
    <button
      type="button"
      class={`cf-tb-btn${activeFormats.has(cmd) ? ' cf-tb-active' : ''}`}
      onClick={() => exec(cmd)}
      title={title}
    >
      <span class="cf-tb-icon">{icon}</span>
      <span class="cf-tb-text">{label}</span>
    </button>
  );

  return (
    <form class="cf-form" onSubmit={handleSubmit} novalidate>
      <div class="cf-row">
        <label class="cf-field">
          <span class="cf-label">{t('contact.name', lang)}</span>
          <div class={`cf-box${errors.name ? ' cf-box-err' : ''}`}>
            <input type="text" value={name} onInput={e => { setName((e.target as HTMLInputElement).value); setErrors(p => ({...p, name: ''})); }} placeholder={t('contact.name_ph', lang)} class="cf-input" />
          </div>
          {errors.name && <span class="cf-val-err">{errors.name}</span>}
        </label>
        <label class="cf-field">
          <span class="cf-label">{t('contact.email', lang)}</span>
          <div class={`cf-box${errors.email ? ' cf-box-err' : ''}`}>
            <input type="email" value={email} onInput={e => { setEmail((e.target as HTMLInputElement).value); setErrors(p => ({...p, email: ''})); }} placeholder="email@example.com" class="cf-input" />
          </div>
          {errors.email && <span class="cf-val-err">{errors.email}</span>}
        </label>
      </div>

      <label class="cf-field">
        <span class="cf-label">{t('contact.subject', lang)}</span>
        <div class={`cf-box${errors.subject ? ' cf-box-err' : ''}`}>
          <input type="text" value={subject} onInput={e => { setSubject((e.target as HTMLInputElement).value); setErrors(p => ({...p, subject: ''})); }} placeholder={t('contact.subject_ph', lang)} class="cf-input" />
        </div>
        {errors.subject && <span class="cf-val-err">{errors.subject}</span>}
      </label>

      <label class="cf-field">
        <span class="cf-label">{t('contact.message', lang)}</span>
        <div class={`cf-box cf-editor-box${errors.message ? ' cf-box-err' : ''}`}>
          <div class="cf-toolbar">
            {tb('bold', lang === 'ru' ? 'Жирный' : 'Bold', 'B', lang === 'ru' ? 'Жирный (Ctrl+B)' : 'Bold (Ctrl+B)')}
            {tb('italic', lang === 'ru' ? 'Курсив' : 'Italic', 'I', lang === 'ru' ? 'Курсив (Ctrl+I)' : 'Italic (Ctrl+I)')}
            <span class="cf-tb-sep" />
            <button type="button" class="cf-tb-btn" onClick={insertLink} title={lang === 'ru' ? 'Вставить ссылку' : 'Insert link'}>
              <span class="cf-tb-icon">🔗</span>
              <span class="cf-tb-text">{lang === 'ru' ? 'Ссылка' : 'Link'}</span>
            </button>
            <button type="button" class="cf-tb-btn" onClick={insertCode} title={lang === 'ru' ? 'Вставить код' : 'Insert code'}>
              <span class="cf-tb-icon">&lt;/&gt;</span>
              <span class="cf-tb-text">{lang === 'ru' ? 'Код' : 'Code'}</span>
            </button>
            <button type="button" class="cf-tb-btn" onClick={insertQuote} title={lang === 'ru' ? 'Цитата' : 'Quote'}>
              <span class="cf-tb-icon">❝</span>
              <span class="cf-tb-text">{lang === 'ru' ? 'Цитата' : 'Quote'}</span>
            </button>
            <span class="cf-tb-sep" />
            <button type="button" class="cf-tb-btn cf-tb-clear" onClick={() => exec('removeFormat')} title={lang === 'ru' ? 'Очистить форматирование' : 'Clear formatting'}>
              <span class="cf-tb-icon">↺</span>
              <span class="cf-tb-text">{lang === 'ru' ? 'Очистить' : 'Clear'}</span>
            </button>
          </div>
          <div
            ref={editorRef}
            class="cf-editor"
            contenteditable
            data-placeholder={t('contact.message_ph', lang)}
            onInput={() => { setEditorEmpty(!editorRef.current?.textContent?.trim()); setErrors(p => ({...p, message: ''})); }}
            onKeyUp={updateActiveFormats}
            onMouseUp={updateActiveFormats}
          />
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
