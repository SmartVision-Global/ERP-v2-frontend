import { _mock } from './_mock';

// ----------------------------------------------------------------------
export const ORDER_STATUS_OPTIONS = [
  { value: '', label: 'Selectionner' },
  { value: 'pending', label: 'En attente' },
  { value: 'inProgress', label: 'En cours' },
  { value: 'processing', label: 'En traitement' },
  { value: 'partial', label: 'Partielle' },
  { value: 'satisfied', label: 'Satisfait' },
  { value: 'validated', label: 'Validé' },
  { value: 'cancelled', label: 'Annulé' },
];
export const TYPE_OPTIONS_ORDER = [
  { value: '', label: 'Selectionner' },
  { value: 'mp', label: 'MP' },
  { value: 'pr_equipement', label: 'PR/Equipement' },
  { value: 'outillage', label: 'Outillage' },
  { value: 'fourniture', label: 'Fourniture' },
  { value: 'flotte', label: 'Flotte' },
  { value: 'service', label: 'Service' },
  { value: 'autres', label: 'Autres' },
];
export const PRIORITY_OPTIONS = [
  { value: '', label: 'Selectionner' },
  { value: 'basic', label: 'Base' },
  { value: 'normale', label: 'Normale' },
  { value: 'high', label: 'Haute' },
  { value: 'urgent', label: 'Urgente' },
  
];

const ITEMS = Array.from({ length: 3 }, (_, index) => ({
  id: _mock.id(index),
  sku: `16H9UR${index}`,
  quantity: index + 1,
  name: _mock.productName(index),
  coverUrl: _mock.image.product(index),
  price: _mock.number.price(index),
}));

export const _orders = Array.from({ length: 20 }, (_, index) => {
  const shipping = 10;

  const discount = 10;

  const taxes = 10;

  const items = (index % 2 && ITEMS.slice(0, 1)) || (index % 3 && ITEMS.slice(1, 3)) || ITEMS;

  const totalQuantity = items.reduce((accumulator, item) => accumulator + item.quantity, 0);

  const subtotal = items.reduce((accumulator, item) => accumulator + item.price * item.quantity, 0);

  const totalAmount = subtotal - shipping - discount + taxes;

  const customer = {
    id: _mock.id(index),
    name: _mock.fullName(index),
    email: _mock.email(index),
    avatarUrl: _mock.image.avatar(index),
    ipAddress: '192.158.1.38',
  };

  const delivery = { shipBy: 'DHL', speedy: 'Standard', trackingNumber: 'SPX037739199373' };

  const history = {
    orderTime: _mock.time(1),
    paymentTime: _mock.time(2),
    deliveryTime: _mock.time(3),
    completionTime: _mock.time(4),
    timeline: [
      { title: 'Delivery successful', time: _mock.time(1) },
      { title: 'Transporting to [2]', time: _mock.time(2) },
      { title: 'Transporting to [1]', time: _mock.time(3) },
      { title: 'The shipping unit has picked up the goods', time: _mock.time(4) },
      { title: 'Order has been created', time: _mock.time(5) },
    ],
  };

  return {
    id: _mock.id(index),
    orderNumber: `#601${index}`,
    createdAt: _mock.time(index),
    taxes,
    items,
    history,
    subtotal,
    shipping,
    discount,
    customer,
    delivery,
    totalAmount,
    totalQuantity,
    shippingAddress: {
      fullAddress: '19034 Verna Unions Apt. 164 - Honolulu, RI / 87535',
      phoneNumber: '365-374-4961',
    },
    payment: { cardType: 'mastercard', cardNumber: '**** **** **** 5678' },
    status:
      (index % 2 && 'completed') ||
      (index % 3 && 'pending') ||
      (index % 4 && 'cancelled') ||
      'refunded',
  };
});
