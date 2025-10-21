"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Filter, X, AlertTriangle, Package, TrendingUp, TrendingDown } from "lucide-react";

interface InventoryFiltersProps {
  teamSlug: string;
  searchParams: {
    page?: string;
    search?: string;
    status?: string;
    category?: string;
    sort?: string;
    lowStock?: string;
  };
}

export function InventoryFilters({ teamSlug, searchParams }: InventoryFiltersProps) {
  const router = useRouter();
  const urlSearchParams = useSearchParams();

  const updateFilters = (newParams: Record<string, string | undefined>) => {
    const params = new URLSearchParams(urlSearchParams);

    Object.entries(newParams).forEach(([key, value]) => {
      if (value && value !== '') {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    router.push(`/store/${teamSlug}/admin/inventory?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push(`/store/${teamSlug}/admin/inventory`);
  };

  const hasActiveFilters = Object.values(searchParams).some(value => value && value !== '');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Filter className="mr-2 h-4 w-4" />
          Filters
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="ml-auto h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search">Search Products</Label>
          <Input
            id="search"
            placeholder="Product name, SKU..."
            defaultValue={searchParams.search || ''}
            onChange={(e) => updateFilters({ search: e.target.value })}
          />
        </div>

        {/* Stock Status */}
        <div className="space-y-2">
          <Label>Stock Status</Label>
          <Select
            value={searchParams.status || ''}
            onValueChange={(value) => updateFilters({ status: value || undefined })}
          >
            <SelectTrigger>
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All statuses</SelectItem>
              <SelectItem value="in_stock">In Stock</SelectItem>
              <SelectItem value="low_stock">Low Stock</SelectItem>
              <SelectItem value="out_of_stock">Out of Stock</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label>Category</Label>
          <Select
            value={searchParams.category || ''}
            onValueChange={(value) => updateFilters({ category: value || undefined })}
          >
            <SelectTrigger>
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All categories</SelectItem>
              <SelectItem value="clothing">Clothing</SelectItem>
              <SelectItem value="electronics">Electronics</SelectItem>
              <SelectItem value="home">Home & Garden</SelectItem>
              <SelectItem value="sports">Sports & Outdoors</SelectItem>
              <SelectItem value="books">Books</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sort */}
        <div className="space-y-2">
          <Label>Sort By</Label>
          <Select
            value={searchParams.sort || 'name_asc'}
            onValueChange={(value) => updateFilters({ sort: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name_asc">Name A-Z</SelectItem>
              <SelectItem value="name_desc">Name Z-A</SelectItem>
              <SelectItem value="stock_high">Stock: High to Low</SelectItem>
              <SelectItem value="stock_low">Stock: Low to High</SelectItem>
              <SelectItem value="value_high">Value: High to Low</SelectItem>
              <SelectItem value="value_low">Value: Low to High</SelectItem>
              <SelectItem value="updated_desc">Last Updated</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Quick Filters */}
        <div className="space-y-2">
          <Label>Quick Filters</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="low-stock"
                checked={searchParams.lowStock === 'true'}
                onCheckedChange={(checked) => updateFilters({ lowStock: checked ? 'true' : undefined })}
              />
              <Label htmlFor="low-stock" className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                Low Stock Only
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="out-of-stock"
                checked={searchParams.status === 'out_of_stock'}
                onCheckedChange={(checked) => updateFilters({ status: checked ? 'out_of_stock' : undefined })}
              />
              <Label htmlFor="out-of-stock" className="flex items-center gap-2">
                <Package className="h-4 w-4 text-red-500" />
                Out of Stock Only
              </Label>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-2">
          <Label>Quick Actions</Label>
          <div className="space-y-1">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              onClick={() => updateFilters({ status: 'low_stock' })}
            >
              <AlertTriangle className="mr-2 h-4 w-4 text-orange-500" />
              Low Stock Alert
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              onClick={() => updateFilters({ status: 'out_of_stock' })}
            >
              <Package className="mr-2 h-4 w-4 text-red-500" />
              Out of Stock
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              onClick={() => updateFilters({ sort: 'stock_low' })}
            >
              <TrendingDown className="mr-2 h-4 w-4 text-blue-500" />
              Lowest Stock First
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              onClick={() => updateFilters({ sort: 'value_high' })}
            >
              <TrendingUp className="mr-2 h-4 w-4 text-green-500" />
              Highest Value First
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
