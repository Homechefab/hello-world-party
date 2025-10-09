import { useState } from 'react';
import PaymentComponent from '@/components/PaymentComponent';

const PreviewLayout = () => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={`min-h-screen p-8 ${darkMode ? 'dark' : ''}`}>
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Component Preview</h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded"
          >
            Toggle {darkMode ? 'Light' : 'Dark'} Mode
          </button>
        </div>
        
        <div className="bg-background text-foreground p-8 rounded-lg border">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Payment Component</h2>
            <p className="text-muted-foreground">A reusable payment processing interface</p>
          </div>
          <div className="p-4 bg-muted/40 rounded-lg">
            <PaymentComponent 
              dishTitle="Mormors köttbullar"
              dishPrice={89}
              quantity={2}
              pickupTime="18:00"
              pickupAddress="Hornsgatan 45, Stockholm"
              specialRequests="Extra lingonsylt tack!"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewLayout;