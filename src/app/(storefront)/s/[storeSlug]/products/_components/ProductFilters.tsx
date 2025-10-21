"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { X } from "lucide-react";

interface ProductFiltersProps {
  storeSlug: string;
  searchParams: {
    page?: string;
    search?: string;
    category?: string;
    price_min?: string;
    price_max?: string;
    sort?: string;
  };
}

// Mock data - in real implementation, this would come from the database
const categories = [
  { id: "cat_1", name: "T-Shirts", count: 24 },
  { id: "cat_2", name: "Jeans", count: 18 },
  { id: "cat_3", name: "Accessories", count: 32 },
  { id: "cat_4", name: "Shoes", count: 15 },
  { id: "cat_5", name: "Bags", count: 8 },
];

const brands = [
  { id: "brand_1", name: "Nike", count: 12 },
  { id: "brand_2", name: "Adidas", count: 8 },
  { id: "brand_3", name: "Puma", count: 6 },
  { id: "brand_4", name: "Under Armour", count: 4 },
];

const sizes = [
  { id: "size_s", name: "S", count: 15 },
  { id: "size_m", name: "M", count: 23 },
  { id: "size_l", name: "L", count: 18 },
  { id: "size_xl", name: "XL", count: 12 },
];

export function ProductFilters({ storeSlug, searchParams }: ProductFiltersProps) {
  const router = useRouter();
  const urlSearchParams = useSearchParams();
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.category ? searchParams.category.split(",") : []
  );
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

  const updateFilters = () => {
    const params = new URLSearchParams(urlSearchParams);

    // Reset page when filters change
    params.delete("page");

    // Update category filter
    if (selectedCategories.length > 0) {
      params.set("category", selectedCategories.join(","));
    } else {
      params.delete("category");
    }

    // Update price filter
    if (priceRange[0] > 0 || priceRange[1] < 200) {
      params.set("price_min", priceRange[0].toString());
      params.set("price_max", priceRange[1].toString());
    } else {
      params.delete("price_min");
      params.delete("price_max");
    }

    router.push(`/s/${storeSlug}/products?${params.toString()}`);
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSelectedSizes([]);
    setPriceRange([0, 200]);

    const params = new URLSearchParams();
    router.push(`/s/${storeSlug}/products?${params.toString()}`);
  };

  const toggleCategory = (categoryId: string) => {
    const newCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(id => id !== categoryId)
      : [...selectedCategories, categoryId];
    setSelectedCategories(newCategories);
  };

  const toggleBrand = (brandId: string) => {
    const newBrands = selectedBrands.includes(brandId)
      ? selectedBrands.filter(id => id !== brandId)
      : [...selectedBrands, brandId];
    setSelectedBrands(newBrands);
  };

  const toggleSize = (sizeId: string) => {
    const newSizes = selectedSizes.includes(sizeId)
      ? selectedSizes.filter(id => id !== sizeId)
      : [...selectedSizes, sizeId];
    setSelectedSizes(newSizes);
  };

  const hasActiveFilters = selectedCategories.length > 0 ||
    selectedBrands.length > 0 ||
    selectedSizes.length > 0 ||
    priceRange[0] > 0 ||
    priceRange[1] < 200;

  return (
    <div className="space-y-6">
      {/* Active Filters */}
      {hasActiveFilters && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Active Filters</CardTitle>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-1" />
                Clear All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {selectedCategories.map(categoryId => {
              const category = categories.find(c => c.id === categoryId);
              return (
                <div key={categoryId} className="flex items-center justify-between">
                  <span className="text-sm">{category?.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleCategory(categoryId)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              );
            })}
            {priceRange[0] > 0 || priceRange[1] < 200 ? (
              <div className="flex items-center justify-between">
                <span className="text-sm">
                  ${priceRange[0]} - ${priceRange[1]}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPriceRange([0, 200])}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : null}
          </CardContent>
        </Card>
      )}

      {/* Price Range */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Price Range</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>${priceRange[0]} - ${priceRange[1]}</Label>
            <Slider
              value={priceRange}
              onValueChange={setPriceRange}
              max={200}
              step={5}
              className="w-full"
            />
          </div>
          <Button onClick={updateFilters} className="w-full">
            Apply Filters
          </Button>
        </CardContent>
      </Card>

      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={category.id}
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={() => toggleCategory(category.id)}
              />
              <Label
                htmlFor={category.id}
                className="text-sm font-normal cursor-pointer flex-1"
              >
                {category.name}
              </Label>
              <span className="text-xs text-muted-foreground">
                ({category.count})
              </span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Brands */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Brands</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {brands.map((brand) => (
            <div key={brand.id} className="flex items-center space-x-2">
              <Checkbox
                id={brand.id}
                checked={selectedBrands.includes(brand.id)}
                onCheckedChange={() => toggleBrand(brand.id)}
              />
              <Label
                htmlFor={brand.id}
                className="text-sm font-normal cursor-pointer flex-1"
              >
                {brand.name}
              </Label>
              <span className="text-xs text-muted-foreground">
                ({brand.count})
              </span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Sizes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Sizes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {sizes.map((size) => (
            <div key={size.id} className="flex items-center space-x-2">
              <Checkbox
                id={size.id}
                checked={selectedSizes.includes(size.id)}
                onCheckedChange={() => toggleSize(size.id)}
              />
              <Label
                htmlFor={size.id}
                className="text-sm font-normal cursor-pointer flex-1"
              >
                {size.name}
              </Label>
              <span className="text-xs text-muted-foreground">
                ({size.count})
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
