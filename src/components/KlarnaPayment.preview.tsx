import { KlarnaPayment } from './KlarnaPayment';

export default {
  title: 'Payment/KlarnaPayment',
  component: KlarnaPayment,
};

export const Default = () => (
  <KlarnaPayment
    dishTitle="Hemlagad Lasagne"
    dishPrice={149}
    quantity={2}
    onPaymentSuccess={() => console.log('Payment successful!')}
  />
);

export const SingleItem = () => (
  <KlarnaPayment
    dishTitle="Köttbullar med potatismos"
    dishPrice={99}
    quantity={1}
  />
);

export const HigherPrice = () => (
  <KlarnaPayment
    dishTitle="Lyxig Oxfilé"
    dishPrice={299}
    quantity={2}
    onPaymentSuccess={() => console.log('Payment successful!')}
  />
);