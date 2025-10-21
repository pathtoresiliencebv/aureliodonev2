"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Filter, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface CustomerFiltersProps {
  teamSlug: string;
  searchParams: {
    page?: string;
    search?: string;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
    sort?: string;
    segment?: string;
  };
}

export function CustomerFilters({ teamSlug, searchParams }: CustomerFiltersProps) {
  const router = useRouter();
  const urlSearchParams = useSearchParams();
  const [dateFrom, setDateFrom] = useState<Date | undefined>(
    searchParams.dateFrom ? new Date(searchParams.dateFrom) : undefined
  );
  const [dateTo, setDateTo] = useState<Date | undefined>(
    searchParams.dateTo ? new Date(searchParams.dateTo) : undefined
  );

  const updateFilters = (newParams: Record<string, string | undefined>) => {
    const params = new URLSearchParams(urlSearchParams);

    Object.entries(newParams).forEach(([key, value]) => {
      if (value && value !== '') {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    router.push(`/store/${teamSlug}/admin/customers?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push(`/store/${teamSlug}/admin/customers`);
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
          <Label htmlFor="search">Search Customers</Label>
          <Input
            id="search"
            placeholder="Name, email..."
            defaultValue={searchParams.search || ''}
            onChange={(e) => updateFilters({ search: e.target.value })}
          />
        </div>

        {/* Customer Segment */}
        <div className="space-y-2">
          <Label>Customer Segment</Label>
          <Select
            value={searchParams.segment || ''}
            onValueChange={(value) => updateFilters({ segment: value || undefined })}
          >
            <SelectTrigger>
              <SelectValue placeholder="All segments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All segments</SelectItem>
              <SelectItem value="new">New Customers</SelectItem>
              <SelectItem value="regular">Regular Customers</SelectItem>
              <SelectItem value="loyal">Loyal Customers</SelectItem>
              <SelectItem value="vip">VIP Customers</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Date Range */}
        <div className="space-y-2">
          <Label>Date Range</Label>
          <div className="space-y-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dateFrom && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateFrom ? format(dateFrom, "PPP") : "From date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dateFrom}
                  onSelect={(date) => {
                    setDateFrom(date);
                    updateFilters({
                      dateFrom: date ? date.toISOString().split('T')[0] : undefined
                    });
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dateTo && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateTo ? format(dateTo, "PPP") : "To date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dateTo}
                  onSelect={(date) => {
                    setDateTo(date);
                    updateFilters({
                      dateTo: date ? date.toISOString().split('T')[0] : undefined
                    });
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Sort */}
        <div className="space-y-2">
          <Label>Sort By</Label>
          <Select
            value={searchParams.sort || 'newest'}
            onValueChange={(value) => updateFilters({ sort: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="name_asc">Name A-Z</SelectItem>
              <SelectItem value="name_desc">Name Z-A</SelectItem>
              <SelectItem value="spent_high">Total Spent: High to Low</SelectItem>
              <SelectItem value="spent_low">Total Spent: Low to High</SelectItem>
              <SelectItem value="orders_high">Orders: High to Low</SelectItem>
              <SelectItem value="orders_low">Orders: Low to High</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Quick Filters */}
        <div className="space-y-2">
          <Label>Quick Filters</Label>
          <div className="space-y-1">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              onClick={() => updateFilters({ segment: 'vip' })}
            >
              VIP Customers
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              onClick={() => updateFilters({ segment: 'loyal' })}
            >
              Loyal Customers
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              onClick={() => {
                const today = new Date();
                const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                updateFilters({
                  dateFrom: weekAgo.toISOString().split('T')[0],
                  dateTo: today.toISOString().split('T')[0]
                });
              }}
            >
              Last 7 Days
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              onClick={() => {
                const today = new Date();
                const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
                updateFilters({
                  dateFrom: monthAgo.toISOString().split('T')[0],
                  dateTo: today.toISOString().split('T')[0]
                });
              }}
            >
              Last 30 Days
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
