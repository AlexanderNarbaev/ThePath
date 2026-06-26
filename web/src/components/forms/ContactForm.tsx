import { useState, useRef, useEffect } from 'preact/hooks';
import { t, type Lang } from '../../i18n/ui';

interface Props { lang: Lang; web3Key: string; }

function BoldIcon() { return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="cf-icon"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/></svg>); }
function ItalicIcon() { return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="cf-icon"><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></svg>); }
function LinkIcon() { return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="cf-icon"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>); }
function CodeIcon() { return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="cf-icon"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>); }
function QuoteIcon() { return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="cf-icon"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>); }
function ClearIcon() { return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="cf-icon"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14"/></svg>); }
function SentIcon() { return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="cf-sent-icon"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>); }

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

  function getMessage(): string { return editorRef.current?.innerHTML || ''; }

  useEffect(() => {
    if (editorRef.current) setEditorEmpty(!editorRef.current.textContent?.trim());
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
    const url = prompt(lang === 'ru' ? 'URL ссылки:' : 'Link URL:', 'https://');
    if (!url) return;
    if (sel && !sel.isCollapsed) { exec('createLink', url); return; }
    const text = prompt(lang === 'ru' ? 'Текст ссылки:' : 'Link text:', url || '');
    if (text) {
      editorRef.current?.focus();
      document.execCommand('insertHTML', false, `<a href="${url}">${text}</a>`);
      setEditorEmpty(false);
    }
  }

  function insertCode() {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed) return;
    const text = sel.toString();
    editorRef.current?.focus();
    document.execCommand('insertHTML', false, `<code>${text}</code>`);
    setEditorEmpty(false);
  }

  function insertQuote() {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed) return;
    const text = sel.toString();
    editorRef.current?.focus();
    document.execCommand('insertHTML', false, `<blockquote><p>${text}</p></blockquote>`);
    setEditorEmpty(false);
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
    setStatus('sending'); setErrorMsg('');
    try {
      const fd = new FormData();
      fd.append('access_key', web3Key);
      fd.append('name', name);
      fd.append('email', email);
      fd.append('subject', `[${lang.toUpperCase()}] ${subject}`);
      fd.append('message', getMessage());
      fd.append('from_name', 'Spiral Contact Form');
      fd.append('replyto', email);
      fd.append('botcheck', '');
      const res = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: fd });
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
        <SentIcon />
        <h2>{t('contact.sent', lang)}</h2>
        <p>{t('contact.sent_desc', lang)}</p>
      </div>
    );
  }

  const tb = (cmd: string, label: string, icon: any) => (
    <button
      type="button"
      class={`cf-tb-btn${activeFormats.has(cmd) ? ' cf-tb-active' : ''}`}
      onClick={() => exec(cmd)}
      title={label}
    >
      {icon}
      <span class="cf-tb-text">{label}</span>
    </button>
  );

  const tbIcon = (label: string, icon: any, onClick: () => void) => (
    <button type="button" class="cf-tb-btn" onClick={onClick} title={label}>
      {icon}
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
            {tb('bold', lang === 'ru' ? 'Жирный' : 'Bold', <BoldIcon />)}
            {tb('italic', lang === 'ru' ? 'Курсив' : 'Italic', <ItalicIcon />)}
            <span class="cf-tb-sep" />
            {tbIcon(lang === 'ru' ? 'Ссылка' : 'Link', <LinkIcon />, insertLink)}
            {tbIcon(lang === 'ru' ? 'Код' : 'Code', <CodeIcon />, insertCode)}
            {tbIcon(lang === 'ru' ? 'Цитата' : 'Quote', <QuoteIcon />, insertQuote)}
            <span class="cf-tb-spacer" />
            <button type="button" class="cf-tb-btn cf-tb-clear" onClick={() => exec('removeFormat')} title={lang === 'ru' ? 'Очистить форматирование' : 'Clear formatting'}>
              <ClearIcon />
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
