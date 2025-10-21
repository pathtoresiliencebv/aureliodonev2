import { db } from '@/db';
import { productTable, teamTable, inventoryTable } from '@/db/schema';
import { eq, desc, and, like, gte, lte, sql } from 'drizzle-orm';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency } from '@/utils/format-currency';
import { formatDate } from '@/utils/format-date';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Edit,
  Package,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Eye,
  Copy,
  Trash2
} from "lucide-react";
import Image from "next/image";

interface InventoryListProps {
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

export async function InventoryList({ teamSlug, searchParams }: InventoryListProps) {
  const team = await db.query.teamTable.findFirst({
    where: (team, { eq }) => eq(team.slug, teamSlug),
  });

  if (!team) {
    return <p>Team not found.</p>;
  }

  // Build where conditions
  const whereConditions = [eq(productTable.teamId, team.id)];

  if (searchParams.search) {
    whereConditions.push(like(productTable.name, `%${searchParams.search}%`));
  }

  if (searchParams.category) {
    whereConditions.push(eq(productTable.categoryId, searchParams.category));
  }

  // Get products with inventory data
  const products = await db.query.productTable.findMany({
    where: and(...whereConditions),
    orderBy: (product, { desc }) => [desc(product.createdAt)],
    limit: 50,
  });

  if (products.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <h3 className="text-lg font-semibold mb-2">No products found</h3>
          <p className="text-muted-foreground">
            {searchParams.search || searchParams.category
              ? "Try adjusting your filters to see more results."
              : "Add some products to start tracking inventory."
            }
          </p>
        </CardContent>
      </Card>
    );
  }

  const getStockStatus = (inventory: number, threshold: number = 10) => {
    if (inventory === 0) {
      return { label: "Out of Stock", variant: "destructive" as const, color: "text-red-600" };
    } else if (inventory <= threshold) {
      return { label: "Low Stock", variant: "secondary" as const, color: "text-orange-600" };
    } else {
      return { label: "In Stock", variant: "default" as const, color: "text-green-600" };
    }
  };

  const getStockPercentage = (current: number, threshold: number = 10) => {
    return Math.min((current / (threshold * 2)) * 100, 100);
  };

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Image</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Stock Level</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Value</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => {
            const stockStatus = getStockStatus(product.inventory);
            const stockPercentage = getStockPercentage(product.inventory);
            const inventoryValue = product.inventory * product.price;

            return (
              <TableRow key={product.id}>
                <TableCell>
                  {product.images && product.images.length > 0 ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      width={64}
                      height={64}
                      className="aspect-square rounded-md object-cover"
                    />
                  ) : (
                    <div className="aspect-square rounded-md bg-muted flex items-center justify-center text-sm text-muted-foreground">
                      No Image
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {product.sku || 'No SKU'}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-mono text-sm">{product.sku || '-'}</div>
                </TableCell>
                <TableCell>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{product.inventory}</span>
                      <span className="text-sm text-muted-foreground">units</span>
                    </div>
                    <div className="w-full">
                      <Progress value={stockPercentage} className="h-2" />
                      <div className="text-xs text-muted-foreground mt-1">
                        {stockPercentage.toFixed(1)}% of threshold
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Badge variant={stockStatus.variant}>{stockStatus.label}</Badge>
                    {product.inventory <= 10 && (
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div className="font-medium">{formatCurrency(inventoryValue)}</div>
                    <div className="text-muted-foreground">
                      {formatCurrency(product.price)} each
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-muted-foreground">
                    {formatDate(product.updatedAt)}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => window.location.href = `/store/${teamSlug}/admin/products/${product.id}`}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Product
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => window.location.href = `/store/${teamSlug}/admin/products/${product.id}/edit`}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Stock
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Package className="h-4 w-4 mr-2" />
                        Adjust Inventory
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Card>
  );
}
