import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/global-config';

import { Label } from 'src/components/label';
import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`${CONFIG.assetsDir}/assets/icons/navbar/${name}.svg`} />;

const ICONS = {
  job: icon('ic-job'),
  blog: icon('ic-blog'),
  chat: icon('ic-chat'),
  mail: icon('ic-mail'),
  user: icon('ic-user'),
  file: icon('ic-file'),
  lock: icon('ic-lock'),
  tour: icon('ic-tour'),
  order: icon('ic-order'),
  label: icon('ic-label'),
  blank: icon('ic-blank'),
  kanban: icon('ic-kanban'),
  folder: icon('ic-folder'),
  course: icon('ic-course'),
  banking: icon('ic-banking'),
  booking: icon('ic-booking'),
  invoice: icon('ic-invoice'),
  product: icon('ic-product'),
  calendar: icon('ic-calendar'),
  disabled: icon('ic-disabled'),
  external: icon('ic-external'),
  menuItem: icon('ic-menu-item'),
  ecommerce: icon('ic-ecommerce'),
  analytics: icon('ic-analytics'),
  dashboard: icon('ic-dashboard'),
  parameter: icon('ic-parameter'),
};

// ----------------------------------------------------------------------

export const navData = [
  /**
   * Overview
   */
  {
    subheader: 'Overview',
    items: [
      {
        title: 'Dashboard',
        path: paths.dashboard.root,
        icon: ICONS.dashboard,
        info: <Label>v{CONFIG.appVersion}</Label>,
      },
      // { title: 'Two', path: paths.dashboard.two, icon: ICONS.ecommerce },
      // { title: 'Three', path: paths.dashboard.three, icon: ICONS.analytics },
      {
        title: 'resssources humaines',
        path: '/dashboard/humain-ressource',
        icon: ICONS.analytics,
        children: [
          {
            title: 'Fonction',
            path: paths.dashboard.rh.fonction.root,
            children: [
              { title: 'Tâches et responsabilités', path: paths.dashboard.rh.fonction.taskResp },
              { title: 'Parcours professionnel', path: paths.dashboard.rh.fonction.careerPath },
              { title: 'Fonctions', path: paths.dashboard.rh.fonction.fonctions },
            ],
          },
          {
            title: 'Personnel',
            path: paths.dashboard.rh.personal.root,
            children: [
              { title: 'Actif', path: paths.dashboard.rh.personal.root },
              { title: 'Documents', path: paths.dashboard.rh.personal.documents },
              { title: 'Bloque', path: paths.dashboard.rh.personal.bloc },
              { title: 'DAS', path: paths.dashboard.rh.personal.das },
            ],
          },
          {
            title: 'Parametrage RH',
            path: paths.dashboard.rh.rhSettings.root,
            children: [
              {
                title: "Parametrage d'identification",
                path: paths.dashboard.rh.rhSettings.identification,
              },
              { title: 'Zones', path: paths.dashboard.rh.rhSettings.zones },
              { title: 'Programmes de travail', path: paths.dashboard.rh.rhSettings.workPrograms },
              {
                title: 'Indemnités - Retenues',
                path: paths.dashboard.rh.rhSettings.deductionsCompensation,
              },
              {
                title: 'Grille de Salaire',
                path: paths.dashboard.rh.rhSettings.salaryGrid,
              },
              { title: 'Taux CNAS', path: paths.dashboard.rh.rhSettings.cnasRate },
              { title: 'Agences', path: paths.dashboard.rh.rhSettings.agencies },
            ],
          },
          {
            title: 'Les Demandes',
            path: paths.dashboard.rh.demandes.root,
            children: [
              { title: 'Demande de sortie', path: paths.dashboard.rh.demandes.sortie },
              { title: 'Demande de conge', path: paths.dashboard.rh.demandes.conge },
              { title: 'Demande de recuperation', path: paths.dashboard.rh.demandes.recuperation },
              { title: 'Demande de pret', path: paths.dashboard.rh.demandes.pret },
              { title: "Demande d'aide", path: paths.dashboard.rh.demandes.aide },
            ],
          },
          {
            title: 'Les Ecritures',
            path: paths.dashboard.rh.entries.root,
            children: [
              { title: 'Prets sociaux', path: paths.dashboard.rh.entries.socialLoan },
              { title: 'Conge - Absence', path: paths.dashboard.rh.entries.leaveAbsence },
              {
                title: 'Permanence - Jours supplementaires',
                path: paths.dashboard.rh.entries.permanence,
              },
              { title: 'Heures supplementaires', path: paths.dashboard.rh.entries.overtime },
              { title: 'Récupération', path: paths.dashboard.rh.entries.recovery },
            ],
          },
        ],
      },
    ],
  },
  /**
   * Management
   */
  // {
  //   subheader: 'Management',
  //   items: [
  //     {
  //       title: 'Group',
  //       path: paths.dashboard.group.root,
  //       icon: ICONS.user,
  //       children: [
  //         { title: 'Four', path: paths.dashboard.group.root },
  //         { title: 'Five', path: paths.dashboard.group.five },
  //         { title: 'Six', path: paths.dashboard.group.six },
  //       ],
  //     },
  //   ],
  // },
];
