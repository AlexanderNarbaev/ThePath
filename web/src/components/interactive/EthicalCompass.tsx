import { useState } from 'preact/hooks';
import { t, type Lang } from '../../i18n/ui';

interface Props { lang: Lang; }

type Step = 'intro' | 'kill' | 'torture' | 'enslave' | 'self_defense' | 'imminent' | 'public_review' | 'result';

const steps: Record<Step, { title: Record<string, string>; text: Record<string, string>; options?: Record<string, { label: Record<string, string>; next: Step }> }> = {
  intro: {
    title: { ru: 'Этический компас', en: 'Ethical Compass' },
    text: {
      ru: 'Ты стоишь перед трудным решением. Этот инструмент не даст тебе ответ — он поможет задать правильные вопросы, основанные на трёх запретах Спирали.',
      en: 'You face a difficult decision. This tool won\'t give you the answer — it will help you ask the right questions based on the Spiral\'s three prohibitions.',
    },
    options: {
      kill: { label: { ru: 'Связано с причинением смерти', en: 'Involves taking a life' }, next: 'kill' },
      torture: { label: { ru: 'Связано с причинением боли или страдания', en: 'Involves inflicting pain or suffering' }, next: 'torture' },
      enslave: { label: { ru: 'Связано с ограничением свободы', en: 'Involves restricting freedom' }, next: 'enslave' },
    },
  },
  kill: {
    title: { ru: 'Первый запрет: Не убивай', en: 'First Prohibition: Do Not Kill' },
    text: {
      ru: 'Убийство умышленно запрещено. Но есть одно исключение: прямая, неминуемая, доказанная угроза жизни.',
      en: 'Intentional killing is prohibited. There is one exception: a direct, imminent, proven threat to life.',
    },
    options: {
      self_defense: { label: { ru: 'Это самооборона — угрожают мне или другому прямо сейчас', en: 'It\'s self-defense — someone threatens me or another right now' }, next: 'self_defense' },
      result: { label: { ru: 'Это не самооборона', en: 'It\'s not self-defense' }, next: 'result' },
    },
  },
  torture: {
    title: { ru: 'Второй запрет: Не пытай', en: 'Second Prohibition: Do Not Torture' },
    text: {
      ru: 'Пытки запрещены абсолютно. Никаких исключений. Ни для спасения жизней, ни для получения информации.',
      en: 'Torture is absolutely prohibited. No exceptions. Not to save lives, not to obtain information.',
    },
    options: {
      result: { label: { ru: 'Понял. Это под запретом.', en: 'Understood. This is prohibited.' }, next: 'result' },
    },
  },
  enslave: {
    title: { ru: 'Третий запрет: Не порабощай', en: 'Third Prohibition: Do Not Enslave' },
    text: {
      ru: 'Порабощение — принудительный труд, долговая кабала, лишение автономии — запрещено.',
      en: 'Enslavement — forced labor, debt bondage, deprivation of autonomy — is prohibited.',
    },
    options: {
      result: { label: { ru: 'Понял. Это под запретом.', en: 'Understood. This is prohibited.' }, next: 'result' },
    },
  },
  self_defense: {
    title: { ru: 'Самооборона: проверка условий', en: 'Self-Defense: Check Conditions' },
    text: {
      ru: 'Для применения смертельной силы в самообороне должны соблюдаться ВСЕ три условия.',
      en: 'For lethal force in self-defense, ALL three conditions must be met.',
    },
    options: {
      imminent: { label: { ru: 'Угроза прямая и происходит сейчас', en: 'Threat is direct and happening now' }, next: 'imminent' },
      result: { label: { ru: 'Угроза не прямая или уже миновала', en: 'Threat is not direct or has passed' }, next: 'result' },
    },
  },
  imminent: {
    title: { ru: 'Неминуемость и доказанность', en: 'Imminence and Proof' },
    text: {
      ru: 'Угроза должна быть неминуемой (происходит прямо сейчас, а не в будущем) и доказанной (есть свидетели, записи). После — обязательный публичный разбор.',
      en: 'Threat must be imminent (happening right now, not in the future) and proven (witnesses, records). After — mandatory public review.',
    },
    options: {
      public_review: { label: { ru: 'Условия соблюдены. Я готов к публичному разбору.', en: 'Conditions met. I am ready for public review.' }, next: 'public_review' },
      result: { label: { ru: 'Условия не соблюдены полностью', en: 'Conditions not fully met' }, next: 'result' },
    },
  },
  public_review: {
    title: { ru: 'Итог: допустимо', en: 'Result: Permissible' },
    text: {
      ru: 'Если все три условия соблюдены (прямая угроза, неминуемость, доказанность) и ты готов к публичному разбору — применение силы этически допустимо в рамках Спирали. Но помни: это исключение, а не норма. Каждый такой случай должен быть рассмотрен сообществом.',
      en: 'If all three conditions are met (direct threat, imminence, proof) and you are ready for public review — use of force is ethically permissible within the Spiral. But remember: this is an exception, not the norm. Each such case must be reviewed by the community.',
    },
  },
  result: {
    title: { ru: 'Итог: запрещено', en: 'Result: Prohibited' },
    text: {
      ru: 'То, что ты рассматриваешь, нарушает один из трёх запретов Спирали. Это не означает, что ситуация простая. Но этический компас Спирали указывает: этот путь закрыт. Ищи другие способы — через диалог, кооперацию, правовую систему, свидетельство.',
      en: 'What you\'re considering violates one of the Spiral\'s three prohibitions. This doesn\'t mean the situation is simple. But the Spiral\'s ethical compass points: this path is closed. Seek other ways — through dialogue, cooperation, legal system, witness.',
    },
  },
};

export default function EthicalCompass({ lang }: Props) {
  const [step, setStep] = useState<Step>('intro');

  const s = steps[step];

  return (
    <div class="ethical-compass">
      <h3>{s.title[lang]}</h3>
      <p class="ec-text">{s.text[lang]}</p>
      {s.options && (
        <div class="ec-options">
          {Object.entries(s.options).map(([key, opt]) => (
            <button class="ec-btn" onClick={() => setStep(opt.next)}>
              {opt.label[lang]}
            </button>
          ))}
        </div>
      )}
      {!s.options && (
        <button class="ec-reset" onClick={() => setStep('intro')}>
          {lang === 'ru' ? '← Новый вопрос' : '← New question'}
        </button>
      )}
    </div>
  );
}
