import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter, MapPin, Star, DollarSign } from "lucide-react";

interface SearchFilters {
  query: string;
  category: string;
  priceRange: string;
  rating: string;
  location: string;
  sortBy: string;
}

interface SearchAndFiltersProps {
  onFiltersChange: (filters: SearchFilters) => void;
  activeFilters: SearchFilters;
}

const categories = [
  "Alla kategorier",
  "Huvudrätter", 
  "Förrätter",
  "Efterrätter",
  "Sallader",
  "Soppor",
  "Pasta",
  "Vegetariskt",
  "Veganskt",
  "Glutenfritt"
];

const priceRanges = [
  { label: "Alla priser", value: "" },
  { label: "Under 75 kr", value: "0-75" },
  { label: "75-100 kr", value: "75-100" },
  { label: "100-150 kr", value: "100-150" },
  { label: "Över 150 kr", value: "150+" }
];

const ratings = [
  { label: "Alla betyg", value: "" },
  { label: "4.5+ stjärnor", value: "4.5" },
  { label: "4.0+ stjärnor", value: "4.0" },
  { label: "3.5+ stjärnor", value: "3.5" }
];

const sortOptions = [
  { label: "Relevans", value: "relevance" },
  { label: "Högsta betyg", value: "rating" },
  { label: "Lägsta pris", value: "price-low" },
  { label: "Högsta pris", value: "price-high" },
  { label: "Närmast", value: "distance" },
  { label: "Nyast", value: "newest" }
];

const SearchAndFilters = ({ onFiltersChange, activeFilters }: SearchAndFiltersProps) => {
  const [showFilters, setShowFilters] = useState(false);

  const updateFilter = (key: keyof SearchFilters, value: string) => {
    const newFilters = { ...activeFilters, [key]: value };
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters: SearchFilters = {
      query: "",
      category: "",
      priceRange: "",
      rating: "",
      location: "",
      sortBy: "relevance"
    };
    onFiltersChange(clearedFilters);
  };

  const getActiveFilterCount = () => {
    return Object.entries(activeFilters).filter(([key, value]) => 
      value && value !== "" && key !== "sortBy"
    ).length;
  };

  return (
    <div className="space-y-4">
      {/* Huvudsökning */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="text"
                placeholder="Sök efter rätter, kockar eller ingredienser..."
                value={activeFilters.query}
                onChange={(e) => updateFilter('query', e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex-1 relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="text"
                placeholder="Ange stad eller område..."
                value={activeFilters.location}
                onChange={(e) => updateFilter('location', e.target.value)}
                className="pl-10"
              />
            </div>
            <Button 
              variant="outline" 
              onClick={() => setShowFilters(!showFilters)}
              className="relative"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filter
              {getActiveFilterCount() > 0 && (
                <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs">
                  {getActiveFilterCount()}
                </Badge>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Avancerade filter */}
      {showFilters && (
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Kategori</label>
                <Select value={activeFilters.category} onValueChange={(value) => updateFilter('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Välj kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category === "Alla kategorier" ? "" : category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Prisintervall</label>
                <Select value={activeFilters.priceRange} onValueChange={(value) => updateFilter('priceRange', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Välj pris" />
                  </SelectTrigger>
                  <SelectContent>
                    {priceRanges.map((range) => (
                      <SelectItem key={range.value} value={range.value}>
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          {range.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Minimibetyg</label>
                <Select value={activeFilters.rating} onValueChange={(value) => updateFilter('rating', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Välj betyg" />
                  </SelectTrigger>
                  <SelectContent>
                    {ratings.map((rating) => (
                      <SelectItem key={rating.value} value={rating.value}>
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-500" />
                          {rating.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Sortera efter</label>
                <Select value={activeFilters.sortBy} onValueChange={(value) => updateFilter('sortBy', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex flex-wrap gap-2">
                {activeFilters.category && (
                  <Badge variant="secondary" className="cursor-pointer" onClick={() => updateFilter('category', '')}>
                    {activeFilters.category} ✕
                  </Badge>
                )}
                {activeFilters.priceRange && (
                  <Badge variant="secondary" className="cursor-pointer" onClick={() => updateFilter('priceRange', '')}>
                    {priceRanges.find(r => r.value === activeFilters.priceRange)?.label} ✕
                  </Badge>
                )}
                {activeFilters.rating && (
                  <Badge variant="secondary" className="cursor-pointer" onClick={() => updateFilter('rating', '')}>
                    {ratings.find(r => r.value === activeFilters.rating)?.label} ✕
                  </Badge>
                )}
                {activeFilters.location && (
                  <Badge variant="secondary" className="cursor-pointer" onClick={() => updateFilter('location', '')}>
                    📍 {activeFilters.location} ✕
                  </Badge>
                )}
              </div>
              
              {getActiveFilterCount() > 0 && (
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  Rensa alla filter
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SearchAndFilters;