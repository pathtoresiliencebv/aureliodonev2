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

interface OrderFiltersProps {
  teamSlug: string;
  searchParams: {
    page?: string;
    search?: string;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
    sort?: string;
  };
}

export function OrderFilters({ teamSlug, searchParams }: OrderFiltersProps) {
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

    router.push(`/store/${teamSlug}/admin/orders?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push(`/store/${teamSlug}/admin/orders`);
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
          <Label htmlFor="search">Search Orders</Label>
          <Input
            id="search"
            placeholder="Order number, customer name..."
            defaultValue={searchParams.search || ''}
            onChange={(e) => updateFilters({ search: e.target.value })}
          />
        </div>

        {/* Status Filter */}
        <div className="space-y-2">
          <Label>Order Status</Label>
          <Select
            value={searchParams.status || ''}
            onValueChange={(value) => updateFilters({ status: value || undefined })}
          >
            <SelectTrigger>
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
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
              <SelectItem value="total_high">Total: High to Low</SelectItem>
              <SelectItem value="total_low">Total: Low to High</SelectItem>
              <SelectItem value="customer">Customer Name</SelectItem>
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
              onClick={() => updateFilters({ status: 'pending' })}
            >
              Pending Orders
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              onClick={() => updateFilters({ status: 'shipped' })}
            >
              Shipped Orders
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
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
