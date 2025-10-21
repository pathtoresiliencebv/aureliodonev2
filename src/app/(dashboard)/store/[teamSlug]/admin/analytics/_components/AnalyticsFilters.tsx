"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Filter, X, Calendar as CalendarIcon, TrendingUp, TrendingDown, BarChart3, PieChart } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface AnalyticsFiltersProps {
  teamSlug: string;
  searchParams: {
    period?: string;
    dateFrom?: string;
    dateTo?: string;
    metric?: string;
    compare?: string;
  };
}

export function AnalyticsFilters({ teamSlug, searchParams }: AnalyticsFiltersProps) {
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

    router.push(`/store/${teamSlug}/admin/analytics?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push(`/store/${teamSlug}/admin/analytics`);
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
        {/* Time Period */}
        <div className="space-y-2">
          <Label>Time Period</Label>
          <Select
            value={searchParams.period || '30d'}
            onValueChange={(value) => updateFilters({ period: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
              <SelectItem value="1y">Last Year</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Custom Date Range */}
        {searchParams.period === 'custom' && (
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
        )}

        {/* Metrics */}
        <div className="space-y-2">
          <Label>Metrics</Label>
          <Select
            value={searchParams.metric || 'revenue'}
            onValueChange={(value) => updateFilters({ metric: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="revenue">Revenue</SelectItem>
              <SelectItem value="orders">Orders</SelectItem>
              <SelectItem value="customers">Customers</SelectItem>
              <SelectItem value="products">Products</SelectItem>
              <SelectItem value="conversion">Conversion Rate</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Comparison */}
        <div className="space-y-2">
          <Label>Comparison</Label>
          <Select
            value={searchParams.compare || 'none'}
            onValueChange={(value) => updateFilters({ compare: value === 'none' ? undefined : value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No Comparison</SelectItem>
              <SelectItem value="previous">Previous Period</SelectItem>
              <SelectItem value="year_ago">Same Period Last Year</SelectItem>
              <SelectItem value="custom">Custom Period</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Quick Filters */}
        <div className="space-y-2">
          <Label>Quick Filters</Label>
          <div className="space-y-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              onClick={() => updateFilters({ period: '7d' })}
            >
              <TrendingUp className="mr-2 h-4 w-4 text-green-500" />
              Last 7 Days
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              onClick={() => updateFilters({ period: '30d' })}
            >
              <BarChart3 className="mr-2 h-4 w-4 text-blue-500" />
              Last 30 Days
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              onClick={() => updateFilters({ period: '90d' })}
            >
              <PieChart className="mr-2 h-4 w-4 text-purple-500" />
              Last 90 Days
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              onClick={() => updateFilters({ period: '1y' })}
            >
              <TrendingDown className="mr-2 h-4 w-4 text-orange-500" />
              Last Year
            </Button>
          </div>
        </div>

        {/* Chart Types */}
        <div className="space-y-2">
          <Label>Chart Type</Label>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Checkbox id="line-chart" defaultChecked />
              <Label htmlFor="line-chart" className="text-sm">Line Chart</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="bar-chart" />
              <Label htmlFor="bar-chart" className="text-sm">Bar Chart</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="pie-chart" />
              <Label htmlFor="pie-chart" className="text-sm">Pie Chart</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="area-chart" />
              <Label htmlFor="area-chart" className="text-sm">Area Chart</Label>
            </div>
          </div>
        </div>

        {/* Export Options */}
        <div className="space-y-2">
          <Label>Export Options</Label>
          <div className="space-y-1">
            <Button variant="outline" size="sm" className="w-full justify-start">
              <TrendingUp className="mr-2 h-4 w-4" />
              Export as CSV
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <BarChart3 className="mr-2 h-4 w-4" />
              Export as PDF
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <PieChart className="mr-2 h-4 w-4" />
              Export as Image
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


