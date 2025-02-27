import { _mock } from './_mock';

// ----------------------------------------------------------------------

export const JOB_DETAILS_TABS = [
  { label: 'Job content', value: 'content' },
  { label: 'Candidates', value: 'candidates' },
];

export const JOB_SKILL_OPTIONS = [
  'UI',
  'UX',
  'Html',
  'JavaScript',
  'TypeScript',
  'Communication',
  'Problem Solving',
  'Leadership',
  'Time Management',
  'Adaptability',
  'Collaboration',
  'Creativity',
  'Critical Thinking',
  'Technical Skills',
  'Customer Service',
  'Project Management',
  'Problem Diagnosis',
];

export const JOB_WORKING_SCHEDULE_OPTIONS = [
  'Monday to Friday',
  'Weekend availability',
  'Day shift',
];

export const JOB_EMPLOYMENT_TYPE_OPTIONS = [
  { label: 'Full-time', value: 'Full-time' },
  { label: 'Part-time', value: 'Part-time' },
  { label: 'On demand', value: 'On demand' },
  { label: 'Negotiable', value: 'Negotiable' },
];

export const JOB_EXPERIENCE_OPTIONS = [
  { label: 'No experience', value: 'No experience' },
  { label: '1 year exp', value: '1 year exp' },
  { label: '2 year exp', value: '2 year exp' },
  { label: '> 3 year exp', value: '> 3 year exp' },
];

export const JOB_BENEFIT_OPTIONS = [
  { label: 'Free parking', value: 'Free parking' },
  { label: 'Bonus commission', value: 'Bonus commission' },
  { label: 'Travel', value: 'Travel' },
  { label: 'Device support', value: 'Device support' },
  { label: 'Health care', value: 'Health care' },
  { label: 'Training', value: 'Training' },
  { label: 'Health insurance', value: 'Health insurance' },
  { label: 'Retirement plans', value: 'Retirement plans' },
  { label: 'Paid time off', value: 'Paid time off' },
  { label: 'Flexible work schedule', value: 'Flexible work schedule' },
];

export const JOB_PUBLISH_OPTIONS = [
  { label: 'Published', value: 'published' },
  { label: 'Draft', value: 'draft' },
];

export const JOB_SORT_OPTIONS = [
  { label: 'Latest', value: 'latest' },
  { label: 'Popular', value: 'popular' },
  { label: 'Oldest', value: 'oldest' },
];

const CANDIDATES = Array.from({ length: 12 }, (_, index) => ({
  id: _mock.id(index),
  role: _mock.role(index),
  name: _mock.fullName(index),
  avatarUrl: _mock.image.avatar(index),
}));

const CONTENT = `
<h6>Job description</h6>

<p>Occaecati est et illo quibusdam accusamus qui. Incidunt aut et molestiae ut facere aut. Est quidem iusto praesentium excepturi harum nihil tenetur facilis. Ut omnis voluptates nihil accusantium doloribus eaque debitis.</p>

<h6>Key responsibilities</h6>

<ul>
  <li>Working with agency for design drawing detail, quotation and local production.</li>
  <li>Produce window displays, signs, interior displays, floor plans and special promotions displays.</li>
  <li>Change displays to promote new product launches and reflect festive or seasonal themes.</li>
  <li>Planning and executing the open/renovation/ closing store procedure.</li>
  <li>Follow‐up store maintenance procedure and keep updating SKU In &amp; Out.</li>
  <li>Monitor costs and work within budget.</li>
  <li>Liaise with suppliers and source elements.</li>
</ul>

<h6>Why You'll love working here</h6>

<ul>
  <li>Working with agency for design drawing detail, quotation and local production.</li>
  <li>Produce window displays, signs, interior displays, floor plans and special promotions displays.</li>
  <li>Change displays to promote new product launches and reflect festive or seasonal themes.</li>
  <li>Planning and executing the open/renovation/ closing store procedure.</li>
  <li>Follow‐up store maintenance procedure and keep updating SKU In &amp; Out.</li>
  <li>Monitor costs and work within budget.</li>
  <li>Liaise with suppliers and source elements.</li>
</ul>
`;

export const _jobs = Array.from({ length: 18 }, (_, index) => {
  const publish = index % 3 ? 'published' : 'draft';

  const salary = {
    type: (index % 5 && 'Custom') || 'Hourly',
    price: _mock.number.price(index),
    negotiable: _mock.boolean(index),
  };

  const benefits = JOB_BENEFIT_OPTIONS.slice(0, 3).map((option) => option.label);

  const experience =
    JOB_EXPERIENCE_OPTIONS.map((option) => option.label)[index] || JOB_EXPERIENCE_OPTIONS[1].label;

  const employmentTypes = (index % 2 && ['Part-time']) ||
    (index % 3 && ['On demand']) ||
    (index % 4 && ['Negotiable']) || ['Full-time'];

  const company = {
    name: _mock.companyNames(index),
    logo: _mock.image.company(index),
    phoneNumber: _mock.phoneNumber(index),
    fullAddress: _mock.fullAddress(index),
  };

  return {
    id: _mock.id(index),
    salary,
    publish,
    company,
    benefits,
    experience,
    employmentTypes,
    content: CONTENT,
    candidates: CANDIDATES,
    role: _mock.role(index),
    title: _mock.jobTitle(index),
    createdAt: _mock.time(index),
    expiredDate: _mock.time(index),
    skills: JOB_SKILL_OPTIONS.slice(0, 3),
    totalViews: _mock.number.nativeL(index),
    locations: [_mock.countryNames(1), _mock.countryNames(2)],
    workingSchedule: JOB_WORKING_SCHEDULE_OPTIONS.slice(0, 2),
  };
});

export const _RhSettingsIdent = [
  {
    id: 1,
    title: 'Entreprises',
    can_add: false,
    icon: 'mdi:company',
    uuid: '1',
    items: [
      {
        id: 1,
        title: 'SARL EL DIOUANE IMPORT EXPORT',
        category: 'IMPORT-EXPORT',
        adress: 'CENTRE COMMUNE BIR HADDADA',
      },
      {
        id: 2,
        title: 'SARL EL DIOUANE IMPORT EXPORT ( Fabrication)',
        category: 'FABRICATION DE POMPES ET DE MATERIEL HYDRAULI',
        adress: 'Chott groupe 39 section 12 commune AIN OULMENE',
      },
      {
        id: 3,
        title: 'SARL DS POWER MOTORS',
        category: 'CONCESSIONNAIRE MOTOCYCLE',
        adress: '1èr Etage Section 13 Gr 86 Bir HADDADA',
      },
      {
        id: 4,
        title: 'SARL DS POWER MOTORS',
        category: 'CONCESSIONNAIRE MOTOCYCLE',
        adress: '1èr Etage Section 13 Gr 86 Bir HADDADA',
      },
      {
        id: 5,
        title: 'SARL DS POWER MOTORS',
        category: 'CONCESSIONNAIRE MOTOCYCLE',
        adress: '1èr Etage Section 13 Gr 86 Bir HADDADA',
      },
    ],
  },
  {
    id: 2,
    uuid: '2',

    title: 'Directions',
    can_add: true,
    icon: 'mdi:direct-current',
    items: [
      {
        id: 1,
        title: 'Direction générale',
        category: 'Direction générale',
      },
      {
        id: 2,
        title: 'Division industrie',
        category: 'Division industrie',
      },
      {
        id: 3,
        title: 'Division marches',
        category: 'Division marches',
      },
      {
        id: 4,
        title: 'Division support',
        category: 'Division support',
      },
    ],
  },
  {
    id: 3,
    uuid: '3',

    title: 'Ateliers',
    can_add: false,
    icon: 'mdi:direct-current',

    items: [],
  },
  {
    id: 4,
    uuid: '4',

    title: 'Filiales',
    can_add: true,
    icon: 'mdi:direct-current',

    items: [
      {
        id: 1,
        title: 'Non défini',
      },
      {
        id: 2,
        title: 'ELDIOUANE FABRICATION POMPE',
        category: 'ELDIOUANE FABRICATION POMPE',
      },
      {
        id: 3,
        title: 'ELDIOUANE IMP-EXP',
        category: 'ELDIOUANE IMP-EXP',
      },
      {
        id: 4,
        title: 'CONCESSIONNAIRE MOTOCYCLE',
        category: 'CONCESSIONNAIRE MOTOCYCLE',
      },
    ],
  },
  {
    id: 5,
    uuid: '5',

    title: 'Divisions',
    can_add: true,
    icon: 'mdi:direct-current',

    items: [
      {
        id: 1,
        title: 'Non défini',
      },
    ],
  },
  {
    id: 6,
    uuid: '6',

    title: 'Départements',
    can_add: true,
    icon: 'mdi:building',
    items: [
      {
        id: 1,
        title: 'Achats et approvisionnements',
        category: 'Achats et approvisionnements',
      },
    ],
  },
  {
    id: 7,
    uuid: '7',

    title: 'Sections',
    can_add: true,
    icon: 'mdi:view-list',
    items: [
      {
        id: 1,
        title: 'Equipe A',
        category: 'Equipe A',
      },
    ],
  },
  {
    id: 8,
    uuid: '8',

    title: 'Nationalités',
    can_add: true,
    icon: 'mdi:flag',
    items: [
      {
        id: 1,
        title: 'Algérienne',
        category: 'Algerian nationality law is regulated by the Constitution of Algeria',
      },
    ],
  },
  {
    id: 9,
    uuid: '9',

    title: 'Catégories EPI',
    can_add: true,
    icon: 'mdi:shield-user',
    items: [
      {
        id: 1,
        title: 'Protection du corps',
        category: 'Protection du corps',
      },
    ],
  },
  {
    id: 10,
    uuid: '10',

    title: 'Normes de conformité EPI',
    can_add: true,
    icon: 'mdi:user-box-outline',
    items: [
      {
        id: 1,
        title: 'Protection du corps',
        category: 'Protection du corps',
      },
    ],
  },
  {
    id: 11,
    uuid: '11',

    title: 'Grades',
    can_add: true,
    icon: 'mdi:chart-areaspline-variant',
    items: [
      {
        id: 1,
        title: 'Protection du corps',
        category: 'Protection du corps',
      },
    ],
  },
  {
    id: 12,
    uuid: '2',
    title: 'Banques',
    can_add: true,
    icon: 'mdi:bank',
    items: [
      {
        id: 1,
        title: 'BNA',
        category: 'BNA',
      },
    ],
  },
  {
    id: 13,
    uuid: '13',

    title: "Type d'équipe",
    can_add: true,
    icon: 'mdi:users-group',
    items: [
      {
        id: 1,
        title: 'Administration',
      },
    ],
  },
  {
    id: 14,
    uuid: '14',

    title: 'Catégorie socio-professionnelle',
    can_add: true,
    icon: 'mdi:cabin-a-frame',
    items: [
      {
        id: 1,
        title: 'C',
        category: 'Cadre',
      },
    ],
  },
  {
    id: 15,
    uuid: '15',

    title: 'Échelons',
    can_add: true,
    icon: 'mdi:format-list-numbered',
    items: [
      {
        id: 1,
        title: '1',
        category: '1',
      },
    ],
  },
  {
    id: 16,
    uuid: '16',

    title: 'Niveau de la grille salariale',
    can_add: true,
    icon: 'mdi:format-list-numbered',

    items: [
      {
        id: 1,
        title: 'NIV-1',
        category: 'Niveau 1',
      },
    ],
  },
  {
    id: 17,
    uuid: '17',

    title: 'Motifs - Sortie, Congé et Récupération',
    can_add: true,
    icon: 'mdi:content-copy',
    items: [
      {
        id: 1,
        title: 'Démission',
        category: 'Démission',
      },
    ],
  },
  {
    id: 18,
    uuid: '18',

    title: 'Motifs - Prêt et Aide',
    can_add: true,
    icon: 'mdi:content-copy',

    items: [],
  },
];
