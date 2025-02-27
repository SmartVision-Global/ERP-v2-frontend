// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
};

// ----------------------------------------------------------------------

export const paths = {
  faqs: '/faqs',
  minimalStore: 'https://mui.com/store/items/minimal-dashboard/',
  // AUTH
  auth: {
    amplify: {
      signIn: `${ROOTS.AUTH}/amplify/sign-in`,
      verify: `${ROOTS.AUTH}/amplify/verify`,
      signUp: `${ROOTS.AUTH}/amplify/sign-up`,
      updatePassword: `${ROOTS.AUTH}/amplify/update-password`,
      resetPassword: `${ROOTS.AUTH}/amplify/reset-password`,
    },
    jwt: {
      signIn: `${ROOTS.AUTH}/jwt/sign-in`,
      signUp: `${ROOTS.AUTH}/jwt/sign-up`,
    },
    firebase: {
      signIn: `${ROOTS.AUTH}/firebase/sign-in`,
      verify: `${ROOTS.AUTH}/firebase/verify`,
      signUp: `${ROOTS.AUTH}/firebase/sign-up`,
      resetPassword: `${ROOTS.AUTH}/firebase/reset-password`,
    },
    auth0: {
      signIn: `${ROOTS.AUTH}/auth0/sign-in`,
    },
    supabase: {
      signIn: `${ROOTS.AUTH}/supabase/sign-in`,
      verify: `${ROOTS.AUTH}/supabase/verify`,
      signUp: `${ROOTS.AUTH}/supabase/sign-up`,
      updatePassword: `${ROOTS.AUTH}/supabase/update-password`,
      resetPassword: `${ROOTS.AUTH}/supabase/reset-password`,
    },
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    two: `${ROOTS.DASHBOARD}/two`,
    three: `${ROOTS.DASHBOARD}/three`,
    rh: {
      personal: {
        root: `${ROOTS.DASHBOARD}/humain-ressource/personal`,
        newPersonel: `${ROOTS.DASHBOARD}/humain-ressource/personal/new`,
        documents: `${ROOTS.DASHBOARD}/humain-ressource/personal/documents`,
        bloc: `${ROOTS.DASHBOARD}/humain-ressource/personal/bloc`,
        das: `${ROOTS.DASHBOARD}/humain-ressource/personal/das`,
        newPersonelDocument: `${ROOTS.DASHBOARD}/humain-ressource/personal/documents/new`,
      },
      fonction: {
        root: `${ROOTS.DASHBOARD}/humain-ressource/fonction/task-responsabilities`,
        taskResp: `${ROOTS.DASHBOARD}/humain-ressource/fonction/task-responsabilities`,
        newTask: `${ROOTS.DASHBOARD}/humain-ressource/fonction/task-responsabilities/new`,
        careerPath: `${ROOTS.DASHBOARD}/humain-ressource/fonction/career-path`,
        newCareerPath: `${ROOTS.DASHBOARD}/humain-ressource/fonction/career-path/new`,
        fonctions: `${ROOTS.DASHBOARD}/humain-ressource/fonction/fonctions`,
        newFonctions: `${ROOTS.DASHBOARD}/humain-ressource/fonction/fonctions/new`,
      },
      rhSettings: {
        root: `${ROOTS.DASHBOARD}/humain-ressource/settings/identification`,
        identification: `${ROOTS.DASHBOARD}/humain-ressource/settings/identification`,
        // newIdentification: `${ROOTS.DASHBOARD}/humain-ressource/settings/identification/new`,

        zones: `${ROOTS.DASHBOARD}/humain-ressource/settings/zones`,
        newZone: `${ROOTS.DASHBOARD}/humain-ressource/settings/zones/new`,
        workPrograms: `${ROOTS.DASHBOARD}/humain-ressource/settings/work-programs`,
        newWorkPrograms: `${ROOTS.DASHBOARD}/humain-ressource/settings/work-programs/new`,
        deductionsCompensation: `${ROOTS.DASHBOARD}/humain-ressource/settings/deductions-compensation`,
        newdeductionsCompensation: `${ROOTS.DASHBOARD}/humain-ressource/settings/deductions-compensation/new`,
        salaryGrid: `${ROOTS.DASHBOARD}/humain-ressource/settings/salary-grid`,
        newSalaryGrid: `${ROOTS.DASHBOARD}/humain-ressource/settings/salary-grid/new`,
        cnasRate: `${ROOTS.DASHBOARD}/humain-ressource/settings/cnas-rate`,
        newCnasRate: `${ROOTS.DASHBOARD}/humain-ressource/settings/cnas-rate/new`,
        agencies: `${ROOTS.DASHBOARD}/humain-ressource/settings/agencies`,
        newAgencies: `${ROOTS.DASHBOARD}/humain-ressource/settings/agencies/new`,
      },
      demandes: {
        root: `${ROOTS.DASHBOARD}/humain-ressource/demandes`,
        sortie: `${ROOTS.DASHBOARD}/humain-ressource/demandes/sortie`,
        conge: `${ROOTS.DASHBOARD}/humain-ressource/demandes/conge`,
        recuperation: `${ROOTS.DASHBOARD}/humain-ressource/demandes/recuperation`,
        pret: `${ROOTS.DASHBOARD}/humain-ressource/demandes/pret`,
        aide: `${ROOTS.DASHBOARD}/humain-ressource/demandes/aide`,
      },
      entries: {
        root: `${ROOTS.DASHBOARD}/humain-ressource/entries/social-loan`,
        socialLoan: `${ROOTS.DASHBOARD}/humain-ressource/entries/social-loan`,
        newSocialLoan: `${ROOTS.DASHBOARD}/humain-ressource/entries/social-loan/new`,
        leaveAbsence: `${ROOTS.DASHBOARD}/humain-ressource/entries/leave-absence`,
        newLeaveAbsence: `${ROOTS.DASHBOARD}/humain-ressource/entries/leave-absence/new`,

        permanence: `${ROOTS.DASHBOARD}/humain-ressource/entries/permanence`,
        newPermanence: `${ROOTS.DASHBOARD}/humain-ressource/entries/permanence/new`,

        overtime: `${ROOTS.DASHBOARD}/humain-ressource/entries/overtime`,
        newOvertime: `${ROOTS.DASHBOARD}/humain-ressource/entries/overtime/new`,

        recovery: `${ROOTS.DASHBOARD}/humain-ressource/entries/recovery`,
        newRecovery: `${ROOTS.DASHBOARD}/humain-ressource/entries/recovery/new`,
      },
    },

    group: {
      root: `${ROOTS.DASHBOARD}/group`,
      five: `${ROOTS.DASHBOARD}/group/five`,
      six: `${ROOTS.DASHBOARD}/group/six`,
    },
  },
};
