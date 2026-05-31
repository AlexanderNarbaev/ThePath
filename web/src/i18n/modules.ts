export interface ModuleMeta {
  number: number;
  slug: string;
  title: Record<'ru' | 'en', string>;
  subtitle: Record<'ru' | 'en', string>;
  audience: Record<'ru' | 'en', string>;
  path: 'quickstart' | 'mentor' | 'coordinator' | 'statesman' | 'deep';
  version?: string;
}

export const modules: ModuleMeta[] = [
  { number: 0, slug: '0-canon', title: { ru: 'Канон Спирали', en: 'Canon of the Spiral' }, subtitle: { ru: 'Неизменное ядро системы', en: 'The Immutable Core' }, audience: { ru: 'Все', en: 'Everyone' }, path: 'quickstart', version: '2.1' },
  { number: 1, slug: '1-cosmology', title: { ru: 'Космология и миф', en: 'Cosmology and Myth' }, subtitle: { ru: 'Священная история Спирали Сознания', en: 'The Sacred History of the Spiral of Consciousness' }, audience: { ru: 'Все, изучающие', en: 'Everyone, Researchers' }, path: 'deep' },
  { number: 2, slug: '2-ethics', title: { ru: 'Этика и добродетели', en: 'Ethics and Virtues' }, subtitle: { ru: 'Кодекс чести, этика власти и силы', en: 'Code of Honor, Ethics of Power and Force' }, audience: { ru: 'Все, госслужащие', en: 'Everyone, Civil Servants' }, path: 'quickstart' },
  { number: 3, slug: '3-practices', title: { ru: 'Практики и ритуалы', en: 'Practices and Rituals' }, subtitle: { ru: 'От 3 минут в день до годовых праздников', en: 'From 3 Minutes a Day to Annual Festivals' }, audience: { ru: 'Все', en: 'Everyone' }, path: 'quickstart' },
  { number: 4, slug: '4-resilience', title: { ru: 'Устойчивость и антихрупкость', en: 'Resilience and Antifragility' }, subtitle: { ru: 'Кризисные планы, община в репрессивном государстве', en: 'Crisis Plans, Community Under Repressive State' }, audience: { ru: 'Наставники, координаторы', en: 'Mentors, Coordinators' }, path: 'mentor' },
  { number: 5, slug: '5-conflicts', title: { ru: 'Разрешение конфликтов', en: 'Conflict Resolution' }, subtitle: { ru: 'Круги примирения, медиация, арбитраж', en: 'Reconciliation Circles, Mediation, Arbitration' }, audience: { ru: 'Наставники, юристы', en: 'Mentors, Lawyers' }, path: 'quickstart' },
  { number: 6, slug: '6-technology', title: { ru: 'Технологии и этика', en: 'Technology and Ethics' }, subtitle: { ru: 'ИИ, цифровой суверенитет, биохакинг', en: 'AI, Digital Sovereignty, Biohacking' }, audience: { ru: 'Изучающие, координаторы, законодатели', en: 'Researchers, Coordinators, Legislators' }, path: 'deep' },
  { number: 7, slug: '7-economy', title: { ru: 'Экономика', en: 'Economy' }, subtitle: { ru: 'Кооперативный сектор, суверенные фонды', en: 'Cooperative Sector, Sovereign Funds' }, audience: { ru: 'Координаторы, предприниматели, госслужащие', en: 'Coordinators, Entrepreneurs, Civil Servants' }, path: 'coordinator' },
  { number: 8, slug: '8-politics', title: { ru: 'Политика и управление', en: 'Politics and Governance' }, subtitle: { ru: 'Социократия, гражданские ассамблеи, Совет будущего', en: 'Sociocracy, Citizens\' Assemblies, Council of the Future' }, audience: { ru: 'Координаторы, политики, госслужащие', en: 'Coordinators, Politicians, Civil Servants' }, path: 'coordinator' },
  { number: 9, slug: '9-psychology', title: { ru: 'Психология и здоровье', en: 'Psychology and Health' }, subtitle: { ru: 'Профилактика выгорания, работа с травмой', en: 'Burnout Prevention, Trauma Work' }, audience: { ru: 'Все, наставники, военные, врачи', en: 'Everyone, Mentors, Military, Doctors' }, path: 'mentor' },
  { number: 10, slug: '10-education', title: { ru: 'Образование и наставничество', en: 'Education and Mentoring' }, subtitle: { ru: 'Педагогика диалога, сертификация наставников', en: 'Dialogue Pedagogy, Mentor Certification' }, audience: { ru: 'Наставники, учителя', en: 'Mentors, Teachers' }, path: 'mentor' },
  { number: 11, slug: '11-synthesis', title: { ru: 'Глобальный синтез', en: 'Global Synthesis' }, subtitle: { ru: 'Цивилизационный диалог, Ubuntu и соборность', en: 'Civilizational Dialogue, Ubuntu and Sobornost' }, audience: { ru: 'Изучающие, дипломаты', en: 'Researchers, Diplomats' }, path: 'deep' },
  { number: 12, slug: '12-library', title: { ru: 'Библиотека Спирали', en: 'Library of the Spiral' }, subtitle: { ru: 'Аннотированная библиография', en: 'Annotated Bibliography' }, audience: { ru: 'Все', en: 'Everyone' }, path: 'deep' },
  { number: 13, slug: '13-platform', title: { ru: 'Цивилизационная платформа', en: 'Civilizational Platform' }, subtitle: { ru: 'Модель Этического государства', en: 'Model of the Ethical State' }, audience: { ru: 'Законодатели, госслужащие, координаторы', en: 'Legislators, Civil Servants, Coordinators' }, path: 'statesman' },
  { number: 14, slug: '14-production', title: { ru: 'Производство и регенеративная экономика', en: 'Production and Regenerative Economy' }, subtitle: { ru: 'Общинные мастерские, Repair Café, энергокооперативы', en: 'Community Workshops, Repair Café, Energy Cooperatives' }, audience: { ru: 'Координаторы, предприниматели, инженеры', en: 'Coordinators, Entrepreneurs, Engineers' }, path: 'coordinator' },
];
