import { StripeCheckout } from './StripeCheckout';

export default {
  title: 'Payment/StripeCheckout',
  component: StripeCheckout,
};

// Exempel-produkter från Stripe
export const Kottbullar = () => (
  <StripeCheckout
    priceId="price_1SKl5741rPpIJXZ0RGnIxSzt"
    dishName="Köttbullar med potatismos"
    price={89}
    quantity={1}
    description="Klassiska svenska köttbullar med krämigt potatismos"
  />
);

export const Lasagne = () => (
  <StripeCheckout
    priceId="price_1SKl5O41rPpIJXZ0nSXiiEVh"
    dishName="Hemlagad Lasagne"
    price={149}
    quantity={2}
    description="Hemlagad lasagne med köttfärs och generösa lager av ost"
  />
);

export const ThaiCurry = () => (
  <StripeCheckout
    priceId="price_1SKl5j41rPpIJXZ0hISmjkUX"
    dishName="Thai Röd Curry"
    price={129}
    quantity={1}
    description="Kryddig thailändsk röd curry med kokosmjölk"
  />
);

export const MultiplePortions = () => (
  <div className="space-y-4 p-4">
    <h2 className="text-2xl font-bold">Flera portioner exempel</h2>
    <StripeCheckout
      priceId="price_1SKl5741rPpIJXZ0RGnIxSzt"
      dishName="Köttbullar med potatismos"
      price={89}
      quantity={3}
      description="3 portioner - perfekt för hela familjen!"
    />
  </div>
);
