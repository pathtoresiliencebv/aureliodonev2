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

interface MediaFiltersProps {
  teamSlug: string;
  searchParams: {
    view?: string;
    search?: string;
    type?: string;
    dateFrom?: string;
    dateTo?: string;
    sort?: string;
  };
}

export function MediaFilters({ teamSlug, searchParams }: MediaFiltersProps) {
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

    router.push(`/store/${teamSlug}/admin/media?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push(`/store/${teamSlug}/admin/media`);
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
          <Label htmlFor="search">Search Files</Label>
          <Input
            id="search"
            placeholder="File name, type..."
            defaultValue={searchParams.search || ''}
            onChange={(e) => updateFilters({ search: e.target.value })}
          />
        </div>

        {/* File Type Filter */}
        <div className="space-y-2">
          <Label>File Type</Label>
          <Select
            value={searchParams.type || ''}
            onValueChange={(value) => updateFilters({ type: value || undefined })}
          >
            <SelectTrigger>
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All types</SelectItem>
              <SelectItem value="image">Images</SelectItem>
              <SelectItem value="video">Videos</SelectItem>
              <SelectItem value="document">Documents</SelectItem>
              <SelectItem value="audio">Audio</SelectItem>
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
              <SelectItem value="size_large">Size: Large to Small</SelectItem>
              <SelectItem value="size_small">Size: Small to Large</SelectItem>
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
              onClick={() => updateFilters({ type: 'image' })}
            >
              Images Only
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              onClick={() => updateFilters({ type: 'video' })}
            >
              Videos Only
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
