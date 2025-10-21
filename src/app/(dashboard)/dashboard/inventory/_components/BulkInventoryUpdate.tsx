"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Package, 
  Plus, 
  Minus, 
  Equal,
  Save,
  X,
  AlertTriangle,
  CheckCircle
} from "lucide-react";

const bulkUpdateSchema = z.object({
  operation: z.enum(["set", "add", "subtract"]),
  value: z.number().min(0, "Value must be positive"),
  reason: z.string().min(1, "Reason is required"),
  notes: z.string().optional(),
  selectedItems: z.array(z.string()).min(1, "Select at least one item"),
});

type BulkUpdateData = z.infer<typeof bulkUpdateSchema>;

interface BulkInventoryUpdateProps {
  inventoryItems: any[];
  onSubmit: (data: BulkUpdateData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function BulkInventoryUpdate({ inventoryItems, onSubmit, onCancel, isLoading = false }: BulkInventoryUpdateProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<BulkUpdateData>({
    resolver: zodResolver(bulkUpdateSchema),
    defaultValues: {
      operation: "set",
      value: 0,
      reason: "",
      notes: "",
      selectedItems: [],
    },
  });

  const operation = watch("operation");
  const value = watch("value");

  const toggleItemSelection = (itemId: string) => {
    const newSelection = selectedItems.includes(itemId)
      ? selectedItems.filter(id => id !== itemId)
      : [...selectedItems, itemId];
    
    setSelectedItems(newSelection);
    setValue("selectedItems", newSelection);
  };

  const selectAll = () => {
    const allIds = inventoryItems.map(item => item.id);
    setSelectedItems(allIds);
    setValue("selectedItems", allIds);
  };

  const clearSelection = () => {
    setSelectedItems([]);
    setValue("selectedItems", []);
  };

  const getOperationIcon = (op: string) => {
    switch (op) {
      case "set":
        return <Equal className="h-4 w-4" />;
      case "add":
        return <Plus className="h-4 w-4" />;
      case "subtract":
        return <Minus className="h-4 w-4" />;
      default:
        return <Equal className="h-4 w-4" />;
    }
  };

  const getOperationDescription = (op: string) => {
    switch (op) {
      case "set":
        return "Set stock to specific value";
      case "add":
        return "Add to current stock";
      case "subtract":
        return "Subtract from current stock";
      default:
        return "";
    }
  };

  const getPreviewValue = (item: any) => {
    switch (operation) {
      case "set":
        return value;
      case "add":
        return item.stock + value;
      case "subtract":
        return Math.max(0, item.stock - value);
      default:
        return item.stock;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={onCancel}>
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Bulk Inventory Update</h1>
          <p className="text-muted-foreground">
            Update multiple inventory items at once
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Operation Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Update Operation</CardTitle>
            <CardDescription>
              Choose how to update the selected inventory items
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="operation">Operation Type</Label>
                <Select onValueChange={(value) => setValue("operation", value as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select operation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="set">Set Stock</SelectItem>
                    <SelectItem value="add">Add Stock</SelectItem>
                    <SelectItem value="subtract">Subtract Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="value">Value</Label>
                <Input
                  id="value"
                  type="number"
                  {...register("value", { valueAsNumber: true })}
                  placeholder="0"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reason">Reason *</Label>
                <Input
                  id="reason"
                  {...register("reason")}
                  placeholder="e.g., Received shipment"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2 p-4 bg-muted rounded-lg">
              {getOperationIcon(operation)}
              <span className="font-medium">{getOperationDescription(operation)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Item Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Select Items</CardTitle>
            <CardDescription>
              Choose which inventory items to update
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Button type="button" variant="outline" onClick={selectAll}>
                Select All
              </Button>
              <Button type="button" variant="outline" onClick={clearSelection}>
                Clear Selection
              </Button>
            </div>
            
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {inventoryItems.map((item) => (
                <div
                  key={item.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedItems.includes(item.id)
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => toggleItemSelection(item.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => toggleItemSelection(item.id)}
                        className="h-4 w-4"
                      />
                      <div>
                        <h4 className="font-medium">{item.product}</h4>
                        <p className="text-sm text-muted-foreground">SKU: {item.sku}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">Current:</span>
                        <span className="font-medium">{item.stock}</span>
                      </div>
                      {selectedItems.includes(item.id) && (
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-sm text-muted-foreground">New:</span>
                          <span className="font-medium text-primary">
                            {getPreviewValue(item)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {selectedItems.includes(item.id) && (
                    <div className="mt-2 flex items-center space-x-2">
                      <Badge variant="secondary" className="text-xs">
                        {operation === "set" ? "Set to" : operation === "add" ? "Add" : "Subtract"} {value}
                      </Badge>
                      {getPreviewValue(item) < item.minStock && (
                        <Badge variant="destructive" className="text-xs">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Below minimum
                        </Badge>
                      )}
                      {getPreviewValue(item) === 0 && (
                        <Badge variant="destructive" className="text-xs">
                          <X className="h-3 w-3 mr-1" />
                          Out of stock
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {selectedItems.length > 0 && (
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="font-medium">
                    {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
            <CardDescription>
              Provide additional details about this bulk update
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  {...register("notes")}
                  placeholder="Add any additional notes about this bulk update"
                  rows={3}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary */}
        {selectedItems.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Update Summary</CardTitle>
              <CardDescription>
                Review the changes before applying
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-primary">{selectedItems.length}</div>
                    <div className="text-sm text-muted-foreground">Items to Update</div>
                  </div>
                  
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-primary">{operation.toUpperCase()}</div>
                    <div className="text-sm text-muted-foreground">Operation</div>
                  </div>
                  
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-primary">{value}</div>
                    <div className="text-sm text-muted-foreground">Value</div>
                  </div>
                </div>
                
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-800">
                      Warning: This action will update {selectedItems.length} inventory items. This cannot be undone.
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isLoading || selectedItems.length === 0}
          >
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? "Updating..." : `Update ${selectedItems.length} Items`}
          </Button>
        </div>
      </form>
    </div>
  );
}
