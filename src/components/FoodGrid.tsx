const FoodGrid = () => {
  return (
    <section className="py-8 my-4">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            Populära rätter nära dig
          </h2>
          <div className="flex gap-2 w-full sm:w-auto">
            <select className="px-3 py-2 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm w-full sm:w-auto">
              <option>Sortera efter</option>
              <option>Närmast</option>
              <option>Högst betyg</option>
              <option>Lägst pris</option>
              <option>Senast tillagd</option>
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Rätter kommer att visas här när kockar lägger till dem */}
        </div>
        
        <div className="text-center mt-8 text-muted-foreground">
          <p>Inga rätter tillgängliga just nu</p>
        </div>
      </div>
    </section>
  );
};

export default FoodGrid;