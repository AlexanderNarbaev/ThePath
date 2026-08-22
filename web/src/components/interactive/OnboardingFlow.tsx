import { useState, useEffect } from 'preact/hooks';
import { t, type Lang, type UIKey } from '../../i18n/ui';
import { BASE_PATH } from '../../constants';

interface Props { lang: Lang; }

interface Step { id: string; href: string; }

export default function OnboardingFlow({ lang }: Props) {
  const base = `${BASE_PATH}/${lang}`;
  const steps: Step[] = [
    { id: 'step1', href: `${base}/modules/0-canon` },
    { id: 'step2', href: `${base}/manifesto` },
    { id: 'step3', href: `${base}/#practices` },
    { id: 'step4', href: `${base}/simulator` },
    { id: 'step5', href: `${base}/map` },
  ];

  const [done, setDone] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setDone(JSON.parse(localStorage.getItem('spiral-onboarding') || '{}'));
  }, []);

  function toggle(id: string) {
    const next = { ...done, [id]: !done[id] };
    setDone(next);
    localStorage.setItem('spiral-onboarding', JSON.stringify(next));
  }

  function reset() {
    setDone({});
    localStorage.removeItem('spiral-onboarding');
  }

  const doneCount = steps.filter((s) => done[s.id]).length;
  const allDone = doneCount === steps.length;
  const pct = (doneCount / steps.length) * 100;

  return (
    <div class="onboarding">
      <div class="ob-progress-row">
        <span class="ob-progress-text">
          {t('onboarding.progress', lang).replace('{done}', String(doneCount)).replace('{total}', String(steps.length))}
        </span>
        {doneCount > 0 && (
          <button class="ob-reset" onClick={reset}>{t('onboarding.reset', lang)}</button>
        )}
      </div>
      <div class="ob-progress-bar"><div class="ob-progress-fill" style={`width:${pct}%`} /></div>

      {allDone && <div class="ob-done">{t('onboarding.done_all', lang)}</div>}

      <ol class="ob-steps">
        {steps.map((s, i) => (
          <li class={`ob-step ${done[s.id] ? 'done' : ''}`}>
            <label class="ob-check">
              <input type="checkbox" checked={done[s.id] || false} onChange={() => toggle(s.id)} />
              <span class="ob-num">{i + 1}</span>
            </label>
            <div class="ob-body">
              <div class="ob-step-title">{t(`onboarding.${s.id}.title` as UIKey, lang)}</div>
              <p class="ob-desc">{t(`onboarding.${s.id}.desc` as UIKey, lang)}</p>
              <span class="ob-time">{t(`onboarding.${s.id}.time` as UIKey, lang)} {t('onboarding.min', lang)}</span>
            </div>
            <a href={s.href} class="ob-go">{t('onboarding.go', lang)}</a>
          </li>
        ))}
      </ol>
    </div>
  );
}
