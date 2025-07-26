import { Button } from "@/components/ui/button";

const categories = [
  { name: "Husmanskost", emoji: "🥘", count: 24 },
  { name: "Pasta & Risotto", emoji: "🍝", count: 18 },
  { name: "Soppor", emoji: "🍲", count: 15 },
  { name: "Bakverk", emoji: "🥧", count: 31 },
  { name: "Vegetariskt", emoji: "🥗", count: 22 },
  { name: "Internationellt", emoji: "🌮", count: 19 },
  { name: "Desserter", emoji: "🍰", count: 12 },
  { name: "Frukost", emoji: "🥞", count: 9 },
];

const Categories = () => {
  return (
    <section className="py-12 bg-secondary/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-foreground">
          Populära kategorier
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((category) => (
            <Button
              key={category.name}
              variant="outline"
              className="h-auto py-4 px-3 flex flex-col items-center gap-2 bg-white hover:bg-gradient-primary hover:text-white hover:border-primary transition-all duration-300 hover:shadow-card hover:scale-105 group"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">
                {category.emoji}
              </span>
              <span className="text-xs font-medium text-center leading-tight">
                {category.name}
              </span>
              <span className="text-xs text-muted-foreground group-hover:text-white/80">
                {category.count} rätter
              </span>
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;