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
    // two: `${ROOTS.DASHBOARD}/two`,
    // three: `${ROOTS.DASHBOARD}/three`,
    rh: {
      personal: {
        root: `${ROOTS.DASHBOARD}/humain-ressource/personal`,
        newPersonel: `${ROOTS.DASHBOARD}/humain-ressource/personal/new`,
        editPersonel: (id) => `${ROOTS.DASHBOARD}/humain-ressource/personal/${id}/edit`,
        documents: `${ROOTS.DASHBOARD}/humain-ressource/personal/documents`,
        bloc: `${ROOTS.DASHBOARD}/humain-ressource/personal/bloc`,
        das: `${ROOTS.DASHBOARD}/humain-ressource/personal/das`,
        newPersonelDocument: `${ROOTS.DASHBOARD}/humain-ressource/personal/documents/new`,
      },
      fonction: {
        root: `${ROOTS.DASHBOARD}/humain-ressource/fonction/task-responsabilities`,
        taskResp: `${ROOTS.DASHBOARD}/humain-ressource/fonction/task-responsabilities`,
        newTask: `${ROOTS.DASHBOARD}/humain-ressource/fonction/task-responsabilities/new`,
        editTask: (id) =>
          `${ROOTS.DASHBOARD}/humain-ressource/fonction/task-responsabilities/${id}/edit`,

        careerPath: `${ROOTS.DASHBOARD}/humain-ressource/fonction/career-path`,
        newCareerPath: `${ROOTS.DASHBOARD}/humain-ressource/fonction/career-path/new`,
        editCarrerPath: (id) =>
          `${ROOTS.DASHBOARD}/humain-ressource/fonction/career-path/${id}/edit`,

        fonctions: `${ROOTS.DASHBOARD}/humain-ressource/fonction/fonctions`,
        newFonctions: `${ROOTS.DASHBOARD}/humain-ressource/fonction/fonctions/new`,
        editFonction: (id) => `${ROOTS.DASHBOARD}/humain-ressource/fonction/fonctions/${id}/edit`,
      },
      rhSettings: {
        root: `${ROOTS.DASHBOARD}/humain-ressource/settings/identification`,
        identification: `${ROOTS.DASHBOARD}/humain-ressource/settings/identification`,
        // newIdentification: `${ROOTS.DASHBOARD}/humain-ressource/settings/identification/new`,

        zones: `${ROOTS.DASHBOARD}/humain-ressource/settings/zones`,
        newZone: `${ROOTS.DASHBOARD}/humain-ressource/settings/zones/new`,
        editZone: (id) => `${ROOTS.DASHBOARD}/humain-ressource/settings/zones/${id}/edit`,
        workPrograms: `${ROOTS.DASHBOARD}/humain-ressource/settings/work-programs`,
        newWorkPrograms: `${ROOTS.DASHBOARD}/humain-ressource/settings/work-programs/new`,
        editWorkPrograms: (id) =>
          `${ROOTS.DASHBOARD}/humain-ressource/settings/work-programs/${id}/edit`,

        deductionsCompensation: `${ROOTS.DASHBOARD}/humain-ressource/settings/deductions-compensation`,
        newdeductionsCompensation: `${ROOTS.DASHBOARD}/humain-ressource/settings/deductions-compensation/new`,
        editDeductionsCompensation: (id) =>
          `${ROOTS.DASHBOARD}/humain-ressource/settings/deductions-compensation/${id}/edit`,

        salaryGrid: `${ROOTS.DASHBOARD}/humain-ressource/settings/salary-grid`,
        newSalaryGrid: `${ROOTS.DASHBOARD}/humain-ressource/settings/salary-grid/new`,
        editSalaryGrid: (id) =>
          `${ROOTS.DASHBOARD}/humain-ressource/settings/salary-grid/${id}/edit`,

        cnasRate: `${ROOTS.DASHBOARD}/humain-ressource/settings/cnas-rate`,
        newCnasRate: `${ROOTS.DASHBOARD}/humain-ressource/settings/cnas-rate/new`,
        editCnasRate: (id) => `${ROOTS.DASHBOARD}/humain-ressource/settings/cnas-rate/${id}/edit`,

        agencies: `${ROOTS.DASHBOARD}/humain-ressource/settings/agencies`,
        newAgencies: `${ROOTS.DASHBOARD}/humain-ressource/settings/agencies/new`,
        editAgencies: (id) => `${ROOTS.DASHBOARD}/humain-ressource/settings/agencies/${id}/edit`,
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
        editSocialLoan: (id) =>
          `${ROOTS.DASHBOARD}/humain-ressource/entries/social-loan/${id}/edit`,

        leaveAbsence: `${ROOTS.DASHBOARD}/humain-ressource/entries/leave-absence`,
        newLeaveAbsence: `${ROOTS.DASHBOARD}/humain-ressource/entries/leave-absence/new`,
        editLeaveAbsence: (id) =>
          `${ROOTS.DASHBOARD}/humain-ressource/entries/leave-absence/${id}/edit`,

        permanence: `${ROOTS.DASHBOARD}/humain-ressource/entries/permanence`,
        newPermanence: `${ROOTS.DASHBOARD}/humain-ressource/entries/permanence/new`,
        editPermanence: (id) => `${ROOTS.DASHBOARD}/humain-ressource/entries/permanence/${id}/edit`,

        overtime: `${ROOTS.DASHBOARD}/humain-ressource/entries/overtime`,
        newOvertime: `${ROOTS.DASHBOARD}/humain-ressource/entries/overtime/new`,
        editOvertime: (id) => `${ROOTS.DASHBOARD}/humain-ressource/entries/overtime/${id}/edit`,

        recovery: `${ROOTS.DASHBOARD}/humain-ressource/entries/recovery`,
        newRecovery: `${ROOTS.DASHBOARD}/humain-ressource/entries/recovery/new`,
        editRecovery: (id) => `${ROOTS.DASHBOARD}/humain-ressource/entries/recovery/${id}/edit`,
      },
      treatment: {
        root: `${ROOTS.DASHBOARD}/humain-ressource/treatment/location-assignment`,

        locationAssignment: `${ROOTS.DASHBOARD}/humain-ressource/treatment/location-assignment`,
        newLocationAssignment: `${ROOTS.DASHBOARD}/humain-ressource/treatment/location-assignment/new`,
        editLocationAssignment: (id) =>
          `${ROOTS.DASHBOARD}/humain-ressource/treatment/location-assignment/${id}/edit`,

        promotionDemotion: `${ROOTS.DASHBOARD}/humain-ressource/treatment/promotion-demotion`,
        newPromotionDemotion: `${ROOTS.DASHBOARD}/humain-ressource/treatment/promotion-demotion/new`,
        editPromotionDemotion: (id) =>
          `${ROOTS.DASHBOARD}/humain-ressource/treatment/promotion-demotion/${id}/edit`,

        renewalContract: `${ROOTS.DASHBOARD}/humain-ressource/treatment/renewal-contract`,
        newRenewalContract: `${ROOTS.DASHBOARD}/humain-ressource/treatment/renewal-contract/new`,
        editRenewalContract: (id) =>
          `${ROOTS.DASHBOARD}/humain-ressource/treatment/renewal-contract/${id}/edit`,

        endRelationship: `${ROOTS.DASHBOARD}/humain-ressource/treatment/end-relationship`,
        newEndRelationship: `${ROOTS.DASHBOARD}/humain-ressource/treatment/end-relationship/new`,
        editEndRelationship: (id) =>
          `${ROOTS.DASHBOARD}/humain-ressource/treatment/end-relationship/${id}/edit`,
      },
      hse: {
        root: `${ROOTS.DASHBOARD}/humain-ressource/hse/epi`,

        epi: `${ROOTS.DASHBOARD}/humain-ressource/hse/epi`,
        newEpi: `${ROOTS.DASHBOARD}/humain-ressource/hse/epi/new`,

        discharge: `${ROOTS.DASHBOARD}/humain-ressource/hse/discharge`,
        newDischarge: `${ROOTS.DASHBOARD}/humain-ressource/hse/discharge/new`,
      },
      teamManagement: {
        root: `${ROOTS.DASHBOARD}/humain-ressource/team-management/team`,

        team: `${ROOTS.DASHBOARD}/humain-ressource/team-management/team`,
        newTeam: `${ROOTS.DASHBOARD}/humain-ressource/team-management/team/new`,

        teamProgram: `${ROOTS.DASHBOARD}/humain-ressource/team-management/team-program`,
        newtTeamProgram: `${ROOTS.DASHBOARD}/humain-ressource/team-management/team-program/new`,
      },
      payrollManagement: {
        root: `${ROOTS.DASHBOARD}/humain-ressource/payroll-management/calculation`,

        calculation: `${ROOTS.DASHBOARD}/humain-ressource/payroll-management/calculation`,
        newCalculation: `${ROOTS.DASHBOARD}/humain-ressource/payroll-management/calculation/new`,
        payroll: (id) =>
          `${ROOTS.DASHBOARD}/humain-ressource/payroll-management/calculation/${id}/payroll`,

        payrollDetails: (id) =>
          `${ROOTS.DASHBOARD}/humain-ressource/payroll-management/calculation/${id}/details`,

        preparation: `${ROOTS.DASHBOARD}/humain-ressource/payroll-management/preparation`,
        newPreparation: `${ROOTS.DASHBOARD}/humain-ressource/payroll-management/preparation/new`,
        editMonth: (id) =>
          `${ROOTS.DASHBOARD}/humain-ressource/payroll-management/preparation/${id}/edit`,
        preparationDetails: (id) =>
          `${ROOTS.DASHBOARD}/humain-ressource/payroll-management/preparation/${id}/details`,
      },
      paraTaxDeclaration: {
        root: `${ROOTS.DASHBOARD}/humain-ressource/para-tax-declaration/das`,

        das: `${ROOTS.DASHBOARD}/humain-ressource/para-tax-declaration/das`,
        dasDetails: (id, year) =>
          `${ROOTS.DASHBOARD}/humain-ressource/para-tax-declaration/das/details/${id}/${year}`,

        newDas: `${ROOTS.DASHBOARD}/humain-ressource/para-tax-declaration/das/new`,

        dac: `${ROOTS.DASHBOARD}/humain-ressource/para-tax-declaration/dac`,
        newDac: `${ROOTS.DASHBOARD}/humain-ressource/para-tax-declaration/dac/new`,
      },
    },
    purchaseSupply: {
      purchaseOrder: {
        root: `${ROOTS.DASHBOARD}/purchase-supply/purchase-order`,
        newPurchaseOrder: `${ROOTS.DASHBOARD}/purchase-supply/purchase-order/new`,
        editPurchaseOrder: (id) => `${ROOTS.DASHBOARD}/purchase-supply/purchase-order/${id}/edit`,
      },
      processingDa: {
        root: `${ROOTS.DASHBOARD}/purchase-supply/processing-da`,
      },
    },
    user: {
      root: `${ROOTS.DASHBOARD}/user`,
      new: `${ROOTS.DASHBOARD}/user/new`,
      list: `${ROOTS.DASHBOARD}/user/list`,
      cards: `${ROOTS.DASHBOARD}/user/cards`,
      profile: `${ROOTS.DASHBOARD}/user/profile`,
      account: `${ROOTS.DASHBOARD}/user/account`,
      edit: (id) => `${ROOTS.DASHBOARD}/user/${id}/edit`,
      demo: {
        edit: `${ROOTS.DASHBOARD}/user/${1}/edit`,
      },
    },
    storeManagement: {
      root: `${ROOTS.DASHBOARD}/store-management`,
      rawMaterial: {
        root: `${ROOTS.DASHBOARD}/store-management/raw-material`,
        stocks: `${ROOTS.DASHBOARD}/store-management/raw-material`,
        newStock: `${ROOTS.DASHBOARD}/store-management/raw-material/new`,
        editStock: (id) => `${ROOTS.DASHBOARD}/store-management/raw-material/${id}/edit`,

        operations: `${ROOTS.DASHBOARD}/store-management/raw-material/operations`,
        

        storageArea: `${ROOTS.DASHBOARD}/store-management/raw-material/storage-area`,
        newStorageArea: `${ROOTS.DASHBOARD}/store-management/raw-material/storage-area/new`,
        initialStorage: `${ROOTS.DASHBOARD}/store-management/raw-material/initial-storage`,
        newInitialStorage: `${ROOTS.DASHBOARD}/store-management/raw-material/initial-storage/new`,
        exitSlips: `${ROOTS.DASHBOARD}/store-management/raw-material/exit-slip`,
        newExitSlip: `${ROOTS.DASHBOARD}/store-management/raw-material/exit-slip/new`,
        editExitSlip: (id) =>
          `${ROOTS.DASHBOARD}/store-management/raw-material/exit-slips/${id}/edit`,
        integrations: `${ROOTS.DASHBOARD}/store-management/raw-material/integrations`,
        newIntegration: `${ROOTS.DASHBOARD}/store-management/raw-material/integrations/new`,
        editIntegration: (id) =>
          `${ROOTS.DASHBOARD}/store-management/raw-material/integrations/${id}/edit`,
        transferSlips: `${ROOTS.DASHBOARD}/store-management/raw-material/transfer-slip`,
        newTransferSlip: `${ROOTS.DASHBOARD}/store-management/raw-material/transfer-slip/new`,
        editTransferSlip: (id) =>
          `${ROOTS.DASHBOARD}/store-management/raw-material/transfer-slip/${id}/edit`,
        nonMovingProducts: `${ROOTS.DASHBOARD}/store-management/raw-material/non-moving-products`,
      },

      loanBorrowing: {
        root: `${ROOTS.DASHBOARD}/store-management`,
        third: `${ROOTS.DASHBOARD}/store-management/third`,
        newThird: `${ROOTS.DASHBOARD}/store-management/third/new`,
        editThird: (id) => `${ROOTS.DASHBOARD}/store-management/third/${id}/edit`,
        borrowing: `${ROOTS.DASHBOARD}/store-management/borrowing`,
        newBorrowing: `${ROOTS.DASHBOARD}/store-management/borrowing/new`,
        editBorrowing: (id) => `${ROOTS.DASHBOARD}/store-management/borrowing/${id}/edit`,
        
        borrowingReturn: `${ROOTS.DASHBOARD}/store-management/borrowing-return`,
        newBorrowingReturn: `${ROOTS.DASHBOARD}/store-management/borrowing-return/new`,
        editBorrowingReturn: (id) => `${ROOTS.DASHBOARD}/store-management/borrowing-return/${id}/edit`,
      },
    },
    store: {
      // rawMaterials: {
      root: `${ROOTS.DASHBOARD}/store/raw-materials`,
      //   // stocks: `${ROOTS.DASHBOARD}/store/raw-materials/stocks`,
      //   newStock: `${ROOTS.DASHBOARD}/store/raw-materials/stocks/new`,
      //   editStock: (id) => `${ROOTS.DASHBOARD}/store/raw-materials/stocks/${id}/edit`,
      //   storageArea: `${ROOTS.DASHBOARD}/store/raw-materials/storage-area`,
      //   newStorageArea: `${ROOTS.DASHBOARD}/store/raw-materials/storage-area/new`,
      //   initialStorage: `${ROOTS.DASHBOARD}/store/raw-materials/initial-storage`,
      //   newInitialStorage: `${ROOTS.DASHBOARD}/store/raw-materials/initial-storage/new`,
      //   exitSlip: `${ROOTS.DASHBOARD}/store/raw-materials/exit-slip`,
      //   newExitSlip: `${ROOTS.DASHBOARD}/store/raw-materials/exit-slip/new`,
      //   editExitSlip: (id) => `${ROOTS.DASHBOARD}/store/raw-materials/exit-slip/${id}/edit`,
      //   integrations: `${ROOTS.DASHBOARD}/store/raw-materials/integrations`,
      //   newIntegration: `${ROOTS.DASHBOARD}/store/raw-materials/integrations/new`,
      //   editIntegration: (id) => `${ROOTS.DASHBOARD}/store/raw-materials/integrations/${id}/edit`,
      //   transferSlip: `${ROOTS.DASHBOARD}/store/raw-materials/transfer-slip`,
      //   newTransferSlip: `${ROOTS.DASHBOARD}/store/raw-materials/transfer-slip/new`,
      //   editTransferSlip: (id) => `${ROOTS.DASHBOARD}/store/raw-materials/transfer-slip/${id}/edit`,
      // },
      spareParts: {
        root: `${ROOTS.DASHBOARD}/store/spare-parts`,
        list: `${ROOTS.DASHBOARD}/store/spare-parts/list`,
        settings: `${ROOTS.DASHBOARD}/store/spare-parts/settings`,
      },
      tools: `${ROOTS.DASHBOARD}/store/tools`,
      supplies: `${ROOTS.DASHBOARD}/store/supplies`,
    },
    expressionOfNeeds: {
      root: `${ROOTS.DASHBOARD}/expression-of-needs`,
      beb: {
        root: `${ROOTS.DASHBOARD}/expression-of-needs/beb`,
        new: `${ROOTS.DASHBOARD}/expression-of-needs/beb/new`,
        edit: (id) => `${ROOTS.DASHBOARD}/expression-of-needs/beb/${id}/edit`,
      },
      bmb: {},
    },

    settings: {
      generalSettings: {
        root: `${ROOTS.DASHBOARD}/settings/general-settings`,
      },
      site: {
        root: `${ROOTS.DASHBOARD}/settings/site`,
        newSite: `${ROOTS.DASHBOARD}/settings/site/new`,
        editSite: (id) => `${ROOTS.DASHBOARD}/settings/site/${id}/edit`,
      },
      service: {
        root: `${ROOTS.DASHBOARD}/settings/service`,
        newService: `${ROOTS.DASHBOARD}/settings/service/new`,
        editService: (id) => `${ROOTS.DASHBOARD}/settings/service/${id}/edit`,
      },
      // enterprise: {
      //   root: `${ROOTS.DASHBOARD}/settings/enterprise`,
      //   newEnterprise: `${ROOTS.DASHBOARD}/settings/enterprise/new`,
      // },
      workshop: {
        root: `${ROOTS.DASHBOARD}/settings/workshop`,
        newWorkshop: `${ROOTS.DASHBOARD}/settings/workshop/new`,
        editWorkshop: (id) => `${ROOTS.DASHBOARD}/settings/workshop/${id}/edit`,
      },
      machine: {
        root: `${ROOTS.DASHBOARD}/settings/machine`,
        newMachine: `${ROOTS.DASHBOARD}/settings/machine/new`,
        editMachine: (id) => `${ROOTS.DASHBOARD}/settings/machine/${id}/edit`,
      },
      society: {
        root: `${ROOTS.DASHBOARD}/settings/society`,
        newSociety: `${ROOTS.DASHBOARD}/settings/society/new`,
        editSociety: (id) => `${ROOTS.DASHBOARD}/settings/society/${id}/edit`,
      },
      store: {
        root: `${ROOTS.DASHBOARD}/settings/store`,
        newStore: `${ROOTS.DASHBOARD}/settings/store/new`,
      },
      validationCircuit: {
        root: `${ROOTS.DASHBOARD}/settings/validation-circuit`,
        details: (target_action) => `${ROOTS.DASHBOARD}/settings/validation-circuit/${target_action}`,
      },
      identification: {
        root: `${ROOTS.DASHBOARD}/settings/identification`,
        globalSettings: `${ROOTS.DASHBOARD}/settings/identification/global-settings`,
        rawMaterials: `${ROOTS.DASHBOARD}/settings/identification/raw-materials`,
        spareParts: `${ROOTS.DASHBOARD}/settings/identification/spare-parts`,
        tools: `${ROOTS.DASHBOARD}/settings/identification/tools`,
        supplies: `${ROOTS.DASHBOARD}/settings/identification/supplies`,
      },
    },
    group: {
      root: `${ROOTS.DASHBOARD}/group`,
      five: `${ROOTS.DASHBOARD}/group/five`,
      six: `${ROOTS.DASHBOARD}/group/six`,
    },
  },
};
