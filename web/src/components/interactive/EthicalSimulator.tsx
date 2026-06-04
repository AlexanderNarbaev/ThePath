import { useState } from 'preact/hooks';
import { t, type Lang } from '../../i18n/ui';

interface Props { lang: Lang; }

interface Scenario {
  id: string;
  title: Record<string, string>;
  text: Record<string, string>;
  options: {
    label: Record<string, string>;
    scores: [number, number, number];
  }[];
}

const scenarios: Scenario[] = [
  {
    id: 'whistleblower',
    title: { ru: 'Информатор', en: 'Whistleblower' },
    text: {
      ru: 'Вы работаете в корпорации и обнаружили, что продукт наносит вред потребителям. Руководство игнорирует ваши предупреждения. Что вы сделаете?',
      en: 'You work at a corporation and discover that a product harms consumers. Management ignores your warnings. What do you do?',
    },
    options: [
      { label: { ru: 'Передам информацию журналистам анонимно', en: 'Leak info to journalists anonymously' }, scores: [3, 2, 1] },
      { label: { ru: 'Попробую ещё раз убедить руководство, собрав доказательства', en: 'Try to convince management again with evidence' }, scores: [2, 1, 3] },
      { label: { ru: 'Уволюсь и забуду — это не моя проблема', en: 'Quit and forget — not my problem' }, scores: [0, 0, 0] },
    ],
  },
  {
    id: 'ai_weapon',
    title: { ru: 'Автономное оружие', en: 'Autonomous Weapon' },
    text: {
      ru: 'Вас, инженера ИИ, просят разработать алгоритм для автономного дрона, который будет принимать решения о применении силы без участия человека. Это удвоит вашу зарплату.',
      en: 'You, an AI engineer, are asked to develop an algorithm for an autonomous drone that will make lethal force decisions without human input. It doubles your salary.',
    },
    options: [
      { label: { ru: 'Откажусь — автономное оружие без человека нарушает запрет «Не убивай»', en: 'Refuse — autonomous weapons without humans violate "Do Not Kill"' }, scores: [1, 3, 2] },
      { label: { ru: 'Соглашусь, но потребую аудит безопасности', en: 'Accept but demand safety audit' }, scores: [1, 1, 1] },
      { label: { ru: 'Соглашусь — это всего лишь работа', en: 'Accept — it\'s just a job' }, scores: [0, 0, 0] },
    ],
  },
  {
    id: 'migrant',
    title: { ru: 'Беженец у двери', en: 'Refugee at the Door' },
    text: {
      ru: 'Зимняя ночь. К вашему дому приходит семья беженцев и просит убежища. По закону вы не имеете права их приютить. У них ребёнок.',
      en: 'Winter night. A refugee family comes to your door asking for shelter. By law you cannot host them. They have a child.',
    },
    options: [
      { label: { ru: 'Приютить — человеческая жизнь выше закона', en: 'Shelter them — human life above law' }, scores: [3, 0, 1] },
      { label: { ru: 'Вызвать социальные службы и передать им тёплые вещи', en: 'Call social services and give them warm clothes' }, scores: [2, 2, 2] },
      { label: { ru: 'Отказать — закон есть закон', en: 'Refuse — law is law' }, scores: [0, 1, 1] },
    ],
  },
  {
    id: 'legacy',
    title: { ru: 'Наследство', en: 'Inheritance' },
    text: {
      ru: 'Вы получили крупное наследство. У вас есть выбор: вложить в экологичный бизнес (окупаемость 15 лет) или в акции нефтяной компании (окупаемость 3 года).',
      en: 'You received a large inheritance. You can invest in a sustainable business (15-year ROI) or oil company stocks (3-year ROI).',
    },
    options: [
      { label: { ru: 'Вложить в экологичный бизнес — думаю на 7 поколений', en: 'Invest in sustainable business — thinking 7 generations ahead' }, scores: [2, 1, 3] },
      { label: { ru: 'Разделить: 50% в экологию, 50% в нефть', en: 'Split: 50% sustainable, 50% oil' }, scores: [1, 2, 2] },
      { label: { ru: 'Вложить в нефть — деньги нужны сейчас', en: 'Invest in oil — need money now' }, scores: [0, 0, 0] },
    ],
  },
  {
    id: 'surveillance',
    title: { ru: 'Слежка', en: 'Surveillance' },
    text: {
      ru: 'Государство предлагает вашей IT-компании контракт на систему массовой слежки. Это спасёт компанию от банкротства и сохранит 200 рабочих мест.',
      en: 'The state offers your IT company a contract for a mass surveillance system. It will save the company from bankruptcy and preserve 200 jobs.',
    },
    options: [
      { label: { ru: 'Откажусь — массовая слежка это порабощение', en: 'Refuse — mass surveillance is enslavement' }, scores: [1, 3, 2] },
      { label: { ru: 'Приму, но встрою ограничения и публичный аудит', en: 'Accept but build in limits and public audit' }, scores: [1, 2, 3] },
      { label: { ru: 'Приму — рабочие места важнее', en: 'Accept — jobs are more important' }, scores: [0, 1, 0] },
    ],
  },
  {
    id: 'truth',
    title: { ru: 'Трудная правда', en: 'Hard Truth' },
    text: {
      ru: 'Ваш близкий друг совершил серьёзную ошибку, о которой никто не знает. Признание разрушит его карьеру и семью. Молчание сохранит статус-кво.',
      en: 'Your close friend made a serious mistake that no one knows about. Confession will destroy his career and family. Silence preserves the status quo.',
    },
    options: [
      { label: { ru: 'Поговорить с другом и убедить его признаться самому', en: 'Talk to friend and convince him to confess himself' }, scores: [2, 2, 3] },
      { label: { ru: 'Сохранить тайну — дружба важнее', en: 'Keep the secret — friendship matters more' }, scores: [2, 0, 1] },
      { label: { ru: 'Сообщить о нарушении анонимно', en: 'Report the violation anonymously' }, scores: [1, 2, 2] },
    ],
  },
];

const results = [
  {
    id: 'compassion',
    title: { ru: 'Милосердие', en: 'Compassion' },
    high: { ru: 'Вы ставите живого человека выше правил. Ваш путь — милосердие.', en: 'You put the living person above rules. Your path is compassion.' },
    low: { ru: 'Вы склонны следовать правилам даже в ущерб живым людям. Помните: закон служит человеку, а не наоборот.', en: 'You tend to follow rules even at cost to living people. Remember: law serves people, not the reverse.' },
  },
  {
    id: 'justice',
    title: { ru: 'Справедливость', en: 'Justice' },
    high: { ru: 'Вы готовы отстаивать принципы даже ценой личного комфорта. Ваш путь — справедливость.', en: 'You are ready to defend principles even at personal cost. Your path is justice.' },
    low: { ru: 'Вы склонны избегать конфронтации с системой. Иногда принципы требуют смелости.', en: 'You tend to avoid confrontation with the system. Sometimes principles require courage.' },
  },
  {
    id: 'wisdom',
    title: { ru: 'Мудрость', en: 'Wisdom' },
    high: { ru: 'Вы мыслите долгосрочно и видите сложность ситуаций. Ваш путь — мудрость.', en: 'You think long-term and see the complexity of situations. Your path is wisdom.' },
    low: { ru: 'Вы склонны к простым решениям сложных проблем. Мир сложнее бинарного выбора.', en: 'You tend toward simple solutions for complex problems. The world is more than binary choices.' },
  },
];

export default function EthicalSimulator({ lang }: Props) {
  const [step, setStep] = useState<'start' | number | 'result'>('start');
  const [scores, setScores] = useState<[number, number, number]>([0, 0, 0]);

  function handleAnswer(optionScores: [number, number, number]) {
    const newScores: [number, number, number] = [
      scores[0] + optionScores[0],
      scores[1] + optionScores[1],
      scores[2] + optionScores[2],
    ];
    setScores(newScores);
    const nextIdx = typeof step === 'number' ? step + 1 : 0;
    if (nextIdx >= scenarios.length) {
      setStep('result');
    } else {
      setStep(nextIdx);
    }
  }

  function reset() {
    setStep('start');
    setScores([0, 0, 0]);
  }

  const maxPossible = scenarios.length * 3;

  if (step === 'start') {
    return (
      <div class="simulator">
        <h2>{t('simulator.title', lang)}</h2>
        <p class="sim-subtitle">{t('simulator.subtitle', lang)}</p>
        <button class="sim-btn" onClick={() => setStep(0)}>{t('simulator.start', lang)}</button>
      </div>
    );
  }

  if (step === 'result') {
    const hash = `c${scores[0]}-j${scores[1]}-w${scores[2]}`;
    const shareUrl = `${window.location.origin}${window.location.pathname}?s=${hash}`;
    const maxPerScale = maxPossible / 3;
    const pcts = scores.map(s => Math.round((s / maxPerScale) * 100));

    return (
      <div class="simulator sim-result">
        <h2>{t('simulator.title', lang)}</h2>
        <div class="sim-scales">
          {results.map((r, i) => (
            <div class="sim-scale">
              <div class="sim-scale-label">{r.title[lang]}</div>
              <div class="sim-scale-bar">
                <div class="sim-scale-fill" style={`width:${Math.min(pcts[i], 100)}%`} />
              </div>
              <div class="sim-scale-text">{pcts[i] >= 60 ? r.high[lang] : r.low[lang]}</div>
            </div>
          ))}
        </div>
        <div class="sim-actions">
          <button class="sim-btn" onClick={() => { navigator.clipboard.writeText(shareUrl); alert(t('simulator.copied', lang)); }}>{t('simulator.share', lang)}</button>
          <button class="sim-btn sim-btn-secondary" onClick={reset}>{t('simulator.retry', lang)}</button>
        </div>
      </div>
    );
  }

  const current = scenarios[step as number];
  return (
    <div class="simulator">
      <div class="sim-progress">{t('compass.progress', lang).replace('{current}', String((step as number) + 1)).replace('{total}', String(scenarios.length))}</div>
      <h3>{current.title[lang]}</h3>
      <p class="sim-text">{current.text[lang]}</p>
      <div class="sim-options">
        {current.options.map((opt) => (
          <button class="sim-option" onClick={() => handleAnswer(opt.scores)}>
            {opt.label[lang]}
          </button>
        ))}
      </div>
    </div>
  );
}
