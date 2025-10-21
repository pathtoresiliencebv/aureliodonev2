"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Upload,
  Download,
  Plus,
  Minus,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  X,
  FileSpreadsheet
} from "lucide-react";
import { toast } from "sonner";

interface BulkInventoryUpdateProps {
  teamSlug: string;
}

interface InventoryUpdate {
  productId: string;
  productName: string;
  currentStock: number;
  newStock: number;
  adjustment: number;
  status: 'pending' | 'processing' | 'success' | 'error';
  error?: string;
}

export function BulkInventoryUpdate({ teamSlug }: BulkInventoryUpdateProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [updateType, setUpdateType] = useState<'set' | 'add' | 'subtract'>('set');
  const [adjustmentValue, setAdjustmentValue] = useState<number>(0);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [updates, setUpdates] = useState<InventoryUpdate[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  // Mock products data
  const mockProducts = [
    { id: "1", name: "Premium T-Shirt", currentStock: 15, sku: "TSHIRT-001" },
    { id: "2", name: "Designer Jeans", currentStock: 8, sku: "JEANS-002" },
    { id: "3", name: "Running Shoes", currentStock: 3, sku: "SHOES-003" },
    { id: "4", name: "Baseball Cap", currentStock: 25, sku: "CAP-004" },
    { id: "5", name: "Hoodie", currentStock: 12, sku: "HOODIE-005" },
  ];

  const handleProductSelect = (productId: string, checked: boolean) => {
    if (checked) {
      setSelectedProducts([...selectedProducts, productId]);
    } else {
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(mockProducts.map(p => p.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const calculateNewStock = (currentStock: number, adjustment: number, type: string) => {
    switch (type) {
      case 'set':
        return adjustment;
      case 'add':
        return currentStock + adjustment;
      case 'subtract':
        return Math.max(0, currentStock - adjustment);
      default:
        return currentStock;
    }
  };

  const generateUpdates = () => {
    const newUpdates: InventoryUpdate[] = selectedProducts.map(productId => {
      const product = mockProducts.find(p => p.id === productId);
      if (!product) return null;

      const newStock = calculateNewStock(product.currentStock, adjustmentValue, updateType);
      const adjustment = newStock - product.currentStock;

      return {
        productId: product.id,
        productName: product.name,
        currentStock: product.currentStock,
        newStock,
        adjustment,
        status: 'pending' as const,
      };
    }).filter(Boolean) as InventoryUpdate[];

    setUpdates(newUpdates);
  };

  const processUpdates = async () => {
    setIsProcessing(true);
    setProgress(0);

    for (let i = 0; i < updates.length; i++) {
      const update = updates[i];

      // Simulate API call
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));

        setUpdates(prev => prev.map(u =>
          u.productId === update.productId
            ? { ...u, status: 'success' as const }
            : u
        ));

        setProgress(((i + 1) / updates.length) * 100);
      } catch (error) {
        setUpdates(prev => prev.map(u =>
          u.productId === update.productId
            ? { ...u, status: 'error' as const, error: 'Update failed' }
            : u
        ));
      }
    }

    setIsProcessing(false);
    toast.success(`Successfully updated ${updates.filter(u => u.status === 'success').length} products`);
  };

  const getStatusIcon = (status: InventoryUpdate['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'processing':
        return <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: InventoryUpdate['status']) => {
    switch (status) {
      case 'success':
        return <Badge variant="default" className="bg-green-500">Success</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      case 'processing':
        return <Badge variant="secondary">Processing</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Bulk Update
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold">Bulk Inventory Update</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setIsOpen(false);
              setUpdates([]);
              setSelectedProducts([]);
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <CardContent className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Update Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Update Type</Label>
              <Select value={updateType} onValueChange={(value: any) => setUpdateType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="set">Set to specific value</SelectItem>
                  <SelectItem value="add">Add to current stock</SelectItem>
                  <SelectItem value="subtract">Subtract from current stock</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>
                {updateType === 'set' ? 'New Stock Level' :
                 updateType === 'add' ? 'Amount to Add' : 'Amount to Subtract'}
              </Label>
              <Input
                type="number"
                value={adjustmentValue}
                onChange={(e) => setAdjustmentValue(parseInt(e.target.value) || 0)}
                min="0"
              />
            </div>

            <div className="space-y-2">
              <Label>Actions</Label>
              <div className="flex gap-2">
                <Button onClick={generateUpdates} disabled={selectedProducts.length === 0}>
                  Generate Updates
                </Button>
                <Button variant="outline" onClick={() => setSelectedProducts([])}>
                  Clear Selection
                </Button>
              </div>
            </div>
          </div>

          {/* Product Selection */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Select Products</h3>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="select-all"
                  checked={selectedProducts.length === mockProducts.length}
                  onCheckedChange={handleSelectAll}
                />
                <Label htmlFor="select-all">Select All</Label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
              {mockProducts.map((product) => (
                <div key={product.id} className="flex items-center space-x-2 p-2 border rounded">
                  <Checkbox
                    id={product.id}
                    checked={selectedProducts.includes(product.id)}
                    onCheckedChange={(checked) => handleProductSelect(product.id, checked as boolean)}
                  />
                  <Label htmlFor={product.id} className="flex-1">
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-muted-foreground">
                      SKU: {product.sku} • Current: {product.currentStock}
                    </div>
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Update Preview */}
          {updates.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Update Preview</h3>
                <div className="flex gap-2">
                  <Button
                    onClick={processUpdates}
                    disabled={isProcessing}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isProcessing ? 'Processing...' : 'Apply Updates'}
                  </Button>
                  <Button variant="outline" onClick={() => setUpdates([])}>
                    Clear Preview
                  </Button>
                </div>
              </div>

              {isProcessing && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Processing updates...</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}

              <div className="space-y-2 max-h-48 overflow-y-auto">
                {updates.map((update) => (
                  <div key={update.productId} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(update.status)}
                      <div>
                        <div className="font-medium">{update.productName}</div>
                        <div className="text-sm text-muted-foreground">
                          {update.currentStock} → {update.newStock}
                          {update.adjustment !== 0 && (
                            <span className={update.adjustment > 0 ? 'text-green-600' : 'text-red-600'}>
                              {' '}({update.adjustment > 0 ? '+' : ''}{update.adjustment})
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(update.status)}
                      {update.error && (
                        <span className="text-sm text-red-500">{update.error}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Import/Export */}
          <div className="border-t pt-4">
            <h3 className="font-medium mb-4">Import/Export</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Upload className="mr-2 h-4 w-4" />
                Import CSV
              </Button>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export Template
              </Button>
              <Button variant="outline" size="sm">
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Download Current Stock
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
