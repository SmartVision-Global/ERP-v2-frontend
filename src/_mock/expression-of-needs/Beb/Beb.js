export const NATURE_OPTIONS = [
    { label: 'Entrée', value: "1" },
    { label: 'Sortie', value: 2 },
];

export const BEB_NATURE_OPTIONS = [
    { label: 'Demande d\'achat', value: "1" },
    { label: 'Demande de sortie', value: "2" },
   
]

export const STATUS_OPTIONS = [
    { label: 'En cours', value: 1, color: 'warning'},
    { label: 'Validé', value: 2, color: 'success' },
    { label: 'Annulé', value: 3, color: 'error' },
];  
export const TWO_STATUS_OPTIONS = [
    { label: 'En attente', value: 1, color: 'warning'},
    { label: 'Confirmé', value: 2, color: 'success' },
   
];  

export const ORDER_STATUS_OPTIONS = [
    { value: '', label: 'Selectionner' },
    { value: '1', label: 'En attente' },
    { value: '2', label: 'En cours' },
    { value: '3', label: 'En traitement' },
    { value: '4', label: 'Partielle' },
    { value: '5', label: 'Commandée' },
    { value: '6', label: 'Satisfait' },
    { value: '7', label: 'Validé' },
    { value: '8', label: 'Annulé' },
  ];


export const PRODUCT_TYPE_OPTIONS = [
    { label: 'Matière première', value: "1" , color: 'primary'},
    { label: 'Équipement', value: "2" , color: 'secondary'},
    { label: 'Outil', value: "3" , color: 'success'},
    { label: 'Fourniture', value: "4" , color: 'warning'},
    { label: 'Flotte', value: "5" , color: 'error'},
    { label: 'Service', value: "6" , color: 'info'},
    { label: 'Autre', value: "7" , color: 'default'},
];

export const PRIORITY_OPTIONS = [
    { label: 'Faible', value: "1" , color: 'primary'},
    { label: 'Normale', value: "2" , color: 'secondary'},
    { label: 'Élevée', value: "3" , color: 'success'},
    { label: 'Urgente', value: "4" , color: 'warning'},
];
