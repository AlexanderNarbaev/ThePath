export interface StudyPath {
  id: string;
  name: Record<'ru' | 'en', string>;
  time: Record<'ru' | 'en', string>;
  audience: Record<'ru' | 'en', string>;
  modules: number[];
  optional?: number[];
  recommended?: number[];
  description: Record<'ru' | 'en', string>;
}

export const paths: StudyPath[] = [
  {
    id: 'quickstart',
    name: { ru: 'Быстрый старт', en: 'Quick Start' },
    time: { ru: '~2 часа', en: '~2 hours' },
    audience: { ru: 'Все', en: 'Everyone' },
    modules: [0, 3, 5],
    description: { ru: 'Познакомьтесь с ядром и основными практиками', en: 'Get to know the core and basic practices' },
  },
  {
    id: 'mentor',
    name: { ru: 'Наставник', en: 'Mentor' },
    time: { ru: '15–20 часов', en: '15–20 hours' },
    audience: { ru: 'Наставники', en: 'Mentors' },
    modules: [0, 2, 3, 4, 5, 9, 10],
    optional: [1, 8],
    description: { ru: 'Глубокое понимание системы и навыки фасилитации', en: 'Deep understanding of the system and facilitation skills' },
  },
  {
    id: 'coordinator',
    name: { ru: 'Координатор общин', en: 'Community Coordinator' },
    time: { ru: '25–30 часов', en: '25–30 hours' },
    audience: { ru: 'Координаторы', en: 'Coordinators' },
    modules: [0, 2, 3, 4, 5, 7, 8, 9, 10],
    description: { ru: 'Управление общиной, экономикой и внешними связями', en: 'Community management, economy, and external relations' },
  },
  {
    id: 'statesman',
    name: { ru: 'Государственный деятель', en: 'Statesman' },
    time: { ru: '30–40 часов', en: '30–40 hours' },
    audience: { ru: 'Политики, военные, судьи, дипломаты', en: 'Politicians, Military, Judges, Diplomats' },
    modules: [0, 2, 5, 6, 8, 13],
    recommended: [7, 10, 11],
    description: { ru: 'Применение принципов Спирали в государственной службе', en: 'Applying Spiral principles in public service' },
  },
  {
    id: 'deep',
    name: { ru: 'Глубокое изучение', en: 'Deep Study' },
    time: { ru: 'Свободный', en: 'Self-paced' },
    audience: { ru: 'Исследователи, энтузиасты', en: 'Researchers, Enthusiasts' },
    modules: [1, 6, 11, 12],
    description: { ru: 'Понимание философских оснований и глобального синтеза', en: 'Understanding philosophical foundations and global synthesis' },
  },
];
