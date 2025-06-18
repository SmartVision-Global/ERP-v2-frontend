import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/global-config';

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
  warehouse: icon('ic-warehouse'),
  plus: icon('ic-plus'),
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
        // info: <Label>v{CONFIG.appVersion}</Label>,
      },
      // { title: 'Two', path: paths.dashboard.two, icon: ICONS.ecommerce },
      // { title: 'Three', path: paths.dashboard.three, icon: ICONS.analytics },
      {
        title: 'Gestion magasinage',
        path: '/dashboard/store',
        icon: ICONS.warehouse,
        children: [
          {
            title: 'Matières premières',
            path: paths.dashboard.storeManagement.root,
            children: [
              { title: 'Stocks', path: paths.dashboard.storeManagement.rawMaterial.root },
              {
                title: 'Suivie des produits',
                path: paths.dashboard.storeManagement.rawMaterial.operations,
              },
              {
                title: 'Lieu de stockage',
                path: paths.dashboard.storeManagement.rawMaterial.storageArea,
              },
              {
                title: 'Entrée de stock',
                path: paths.dashboard.storeManagement.rawMaterial.initialStorage,
              },
              {
                title: 'Bon de sortie',
                path: paths.dashboard.storeManagement.rawMaterial.exitSlips,
              },
              {
                title: 'Intégrations',
                path: paths.dashboard.storeManagement.rawMaterial.integrations,
              },
              {
                title: 'Bons de transfert',
                path: paths.dashboard.storeManagement.rawMaterial.transferSlips,
              },
            ],
          },
          // {
          //   title: 'Pièces de rechange',
          //   path: paths.dashboard.storeManagement.root.root,
          //   children: [
          //     { title: 'Stocks', path: paths.dashboard.storeManagement.rawMaterial.root },
          //     {
          //       title: 'Lieu de stockage',
          //       path: paths.dashboard.storeManagement.rawMaterial.storageArea,
          //     },
          //     {
          //       title: 'Entrée de stock',
          //       path: paths.dashboard.storeManagement.rawMaterial.initialStorage,
          //     },
          //     {
          //       title: 'Bon de sortie',
          //       path: paths.dashboard.storeManagement.rawMaterial.exitSlip,
          //     },
          //     {
          //       title: 'Intégrations',
          //       path: paths.dashboard.storeManagement.rawMaterial.integrations,
          //     },
          //     {
          //       title: 'Bons de transfert',
          //       path: paths.dashboard.storeManagement.rawMaterial.transferSlips,
          //     },
          //   ],
          // },
          // {
          //   title: 'Outillage',
          //   path: paths.dashboard.storeManagement.root.root,
          //   children: [
          //     { title: 'Stocks', path: paths.dashboard.storeManagement.rawMaterial.root },
          //     {
          //       title: 'Lieu de stockage',
          //       path: paths.dashboard.storeManagement.rawMaterial.storageArea,
          //     },
          //     {
          //       title: 'Entrée de stock',
          //       path: paths.dashboard.storeManagement.rawMaterial.initialStorage,
          //     },
          //     {
          //       title: 'Bon de sortie',
          //       path: paths.dashboard.storeManagement.rawMaterial.exitSlip,
          //     },
          //     {
          //       title: 'Intégrations',
          //       path: paths.dashboard.storeManagement.rawMaterial.integrations,
          //     },
          //     {
          //       title: 'Bons de transfert',
          //       path: paths.dashboard.storeManagement.rawMaterial.transferSlips,
          //     },
          //   ],
          // },
          // {
          //   title: 'Fournitures',
          //   path: paths.dashboard.storeManagement.root.root,
          //   children: [
          //     { title: 'Stocks', path: paths.dashboard.storeManagement.rawMaterial.root },
          //     {
          //       title: 'Lieu de stockage',
          //       path: paths.dashboard.storeManagement.rawMaterial.storageArea,
          //     },
          //     {
          //       title: 'Entrée de stock',
          //       path: paths.dashboard.storeManagement.rawMaterial.initialStorage,
          //     },
          //     {
          //       title: 'Bon de sortie',
          //       path: paths.dashboard.storeManagement.rawMaterial.exitSlip,
          //     },
          //     {
          //       title: 'Intégrations',
          //       path: paths.dashboard.storeManagement.rawMaterial.integrations,
          //     },
          //     {
          //       title: 'Bons de transfert',
          //       path: paths.dashboard.storeManagement.rawMaterial.transferSlips,
          //     },
          //   ],
          // },
        ],
      },
      {
        title: 'Expression de besoins',
        path: paths.dashboard.expressionOfNeeds.root,
        icon: ICONS.plus,
        children: [{ title: 'B.E.B', path: paths.dashboard.expressionOfNeeds.beb.root }],
      },
      {
        title: 'Resssources humaines',
        path: '/dashboard/humain-ressource',
        icon: ICONS.user,
        children: [
          // Fonction
          {
            title: 'Fonction',
            path: '/dashboard/humain-ressource/fonction',
            children: [
              { title: 'Tâches et responsabilités', path: paths.dashboard.rh.fonction.taskResp },
              { title: 'Parcours professionnel', path: paths.dashboard.rh.fonction.careerPath },
              { title: 'Fonctions', path: paths.dashboard.rh.fonction.fonctions },
            ],
          },
          // Personnel
          {
            title: 'Personnel',
            path: paths.dashboard.rh.personal.root,
            children: [
              { title: 'Liste', path: paths.dashboard.rh.personal.root },
              { title: 'Dossier', path: paths.dashboard.rh.personal.documents },
              // { title: 'Bloque', path: paths.dashboard.rh.personal.bloc },
              // { title: 'DAS', path: paths.dashboard.rh.personal.das },
            ],
          },
          // Parametrage RH
          {
            title: 'Parametrage RH',
            // path: paths.dashboard.rh.rhSettings.root,
            path: '/dashboard/humain-ressource/settings',

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
          // Demandes
          // {
          //   title: 'Les Demandes',
          //   // path: paths.dashboard.rh.demandes.root,
          //   path: '/dashboard/humain-ressource/demandes',

          //   children: [
          //     { title: 'Demande de sortie', path: paths.dashboard.rh.demandes.sortie },
          //     { title: 'Demande de conge', path: paths.dashboard.rh.demandes.conge },
          //     { title: 'Demande de recuperation', path: paths.dashboard.rh.demandes.recuperation },
          //     { title: 'Demande de pret', path: paths.dashboard.rh.demandes.pret },
          //     { title: "Demande d'aide", path: paths.dashboard.rh.demandes.aide },
          //   ],
          // },
          // HSE
          // {
          //   title: 'HSE',
          //   // path: paths.dashboard.rh.demandes.root,
          //   path: '/dashboard/humain-ressource/hse',

          //   children: [
          //     {
          //       title: 'Les équipements de protection individuelle (EPI)',
          //       path: paths.dashboard.rh.hse.epi,
          //     },
          //     { title: 'Décharge', path: paths.dashboard.rh.hse.discharge },
          //   ],
          // },
          // Traitement
          {
            title: 'Traitement',
            // path: paths.dashboard.rh.entries.root,
            path: '/dashboard/humain-ressource/treatment',

            children: [
              {
                title: "Changement d'emplacement-Affectation",
                path: paths.dashboard.rh.treatment.locationAssignment,
                // caption: "Changement d'emplacement-Affectation",
              },
              {
                title: 'Décision de promotion - Retrogradation',
                path: paths.dashboard.rh.treatment.promotionDemotion,
              },
              {
                title: 'Renouvellement du contrat',
                path: paths.dashboard.rh.treatment.renewalContract,
              },
              {
                title: 'Fin de relation de travail',
                path: paths.dashboard.rh.treatment.endRelationship,
              },
            ],
          },
          // Gestion Equipe
          // {
          //   title: 'Gestion Equipe',
          //   // path: paths.dashboard.rh.entries.root,
          //   path: '/dashboard/humain-ressource/team-management',

          //   children: [
          //     {
          //       title: 'Equipe',
          //       path: paths.dashboard.rh.teamManagement.team,
          //     },
          //     {
          //       title: "Programme d'équipe",
          //       path: paths.dashboard.rh.teamManagement.teamProgram,
          //     },
          //   ],
          // },
          // gestion paies
          {
            title: 'Gestion Paies',
            // path: paths.dashboard.rh.entries.root,
            path: '/dashboard/humain-ressource/payroll-management',

            children: [
              {
                title: 'Préparation paie',
                path: paths.dashboard.rh.payrollManagement.preparation,
              },
              {
                title: 'Calcul de la paie',
                path: paths.dashboard.rh.payrollManagement.calculation,
              },
            ],
          },
          // les ecritures
          {
            title: 'Les Ecritures',
            // path: paths.dashboard.rh.entries.root,
            path: '/dashboard/humain-ressource/entries',

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
          {
            title: 'Déclaration para-fiscal',
            // path: paths.dashboard.rh.entries.root,
            path: '/dashboard/humain-ressource/para-tax-declaration',

            children: [
              { title: 'DAS', path: paths.dashboard.rh.paraTaxDeclaration.das },
              { title: 'DAC', path: paths.dashboard.rh.paraTaxDeclaration.dac },
            ],
          },
          //
        ],
      },
      {
        title: 'Achat et approvisionnement',
        path: '/dashboard/purchase-supply',
        icon: ICONS.order,
        children: [
          {
            title: "Demande d'achat",
            path: paths.dashboard.purchaseSupply.purchaseOrder.root,
          },
          {
            title: 'Traitement DA',
            path: paths.dashboard.purchaseSupply.processingDa.root,
          },
        ],
      },
      {
        title: 'Paramètres',
        path: '/dashboard/settings',
        icon: ICONS.folder,
        children: [
          {
            title: "Paramètrage d'identification",
            path: paths.dashboard.settings.identification.root,
            children: [
              {
                title: 'Unités mesure, Dimensions, Ateliers ...',
                path: paths.dashboard.settings.identification.globalSettings,
              },
              {
                title: 'Matières premières',
                path: paths.dashboard.settings.identification.rawMaterials,
              },
              {
                title: 'Pièces de rechange',
                path: paths.dashboard.settings.identification.spareParts,
              },
              { title: 'Outillage', path: paths.dashboard.settings.identification.tools },
              { title: 'Fournitures', path: paths.dashboard.settings.identification.supplies },
            ],
          },
          {
            title: 'Sociétés',
            path: paths.dashboard.settings.society.root,
          },
          // sites
          {
            title: 'General Settings',
            path: paths.dashboard.settings.generalSettings.root,
          },
          {
            title: 'Sites',
            path: paths.dashboard.settings.site.root,
          },

          {
            title: 'Ateliers',
            path: paths.dashboard.settings.workshop.root,
          },
          {
            title: 'Machines',
            path: paths.dashboard.settings.machine.root,
          },
          {
            title: 'Services',
            path: paths.dashboard.settings.service.root,
          },
          {
            title: 'Magasins',
            path: paths.dashboard.settings.store.root,
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
