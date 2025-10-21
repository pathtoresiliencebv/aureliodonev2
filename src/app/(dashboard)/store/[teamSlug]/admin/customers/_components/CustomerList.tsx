import { db } from '@/db';
import { customerTable, teamTable, orderTable } from '@/db/schema';
import { eq, desc, and, like, gte, lte, sql } from 'drizzle-orm';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency } from '@/utils/format-currency';
import { formatDate } from '@/utils/format-date';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  Eye,
  Edit,
  Mail,
  Phone,
  ShoppingBag,
  User,
  Calendar,
  DollarSign
} from "lucide-react";

interface CustomerListProps {
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

export async function CustomerList({ teamSlug, searchParams }: CustomerListProps) {
  const team = await db.query.teamTable.findFirst({
    where: (team, { eq }) => eq(team.slug, teamSlug),
  });

  if (!team) {
    return <p>Team not found.</p>;
  }

  // Build where conditions
  const whereConditions = [eq(customerTable.teamId, team.id)];

  if (searchParams.search) {
    whereConditions.push(
      sql`(${customerTable.firstName} || ' ' || ${customerTable.lastName} || ' ' || ${customerTable.email} LIKE ${`%${searchParams.search}%`})`
    );
  }

  if (searchParams.dateFrom) {
    whereConditions.push(gte(customerTable.createdAt, new Date(searchParams.dateFrom)));
  }

  if (searchParams.dateTo) {
    whereConditions.push(lte(customerTable.createdAt, new Date(searchParams.dateTo)));
  }

  // Get customers with order statistics
  const customers = await db
    .select({
      id: customerTable.id,
      email: customerTable.email,
      firstName: customerTable.firstName,
      lastName: customerTable.lastName,
      createdAt: customerTable.createdAt,
      defaultShippingAddress: customerTable.defaultShippingAddress,
      defaultBillingAddress: customerTable.defaultBillingAddress,
      totalOrders: sql<number>`COALESCE(COUNT(${orderTable.id}), 0)`,
      totalSpent: sql<number>`COALESCE(SUM(${orderTable.totalAmount}), 0)`,
    })
    .from(customerTable)
    .leftJoin(orderTable, eq(orderTable.customerId, customerTable.id))
    .where(and(...whereConditions))
    .groupBy(customerTable.id)
    .orderBy(desc(customerTable.createdAt))
    .limit(50);

  if (customers.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <h3 className="text-lg font-semibold mb-2">No customers found</h3>
          <p className="text-muted-foreground">
            {searchParams.search || searchParams.dateFrom || searchParams.dateTo
              ? "Try adjusting your filters to see more results."
              : "Customers will appear here once they start placing orders."
            }
          </p>
        </CardContent>
      </Card>
    );
  }

  const getCustomerSegment = (totalSpent: number, totalOrders: number) => {
    if (totalSpent >= 1000 || totalOrders >= 10) {
      return { label: "VIP", variant: "default" as const };
    } else if (totalSpent >= 500 || totalOrders >= 5) {
      return { label: "Loyal", variant: "secondary" as const };
    } else if (totalSpent >= 100 || totalOrders >= 2) {
      return { label: "Regular", variant: "outline" as const };
    } else {
      return { label: "New", variant: "outline" as const };
    }
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    const first = firstName?.charAt(0)?.toUpperCase() || '';
    const last = lastName?.charAt(0)?.toUpperCase() || '';
    return first + last || '?';
  };

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Orders</TableHead>
            <TableHead>Total Spent</TableHead>
            <TableHead>Segment</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => {
            const segment = getCustomerSegment(customer.totalSpent, customer.totalOrders);
            const fullName = `${customer.firstName || ''} ${customer.lastName || ''}`.trim() || 'Guest';

            return (
              <TableRow key={customer.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="" />
                      <AvatarFallback>{getInitials(customer.firstName, customer.lastName)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{fullName}</div>
                      <div className="text-sm text-muted-foreground">
                        ID: {customer.id.slice(-8)}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Mail className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">{customer.email}</span>
                    </div>
                    {customer.defaultShippingAddress?.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {customer.defaultShippingAddress.phone}
                        </span>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{customer.totalOrders}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{formatCurrency(customer.totalSpent)}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={segment.variant}>{segment.label}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm">{formatDate(customer.createdAt)}</span>
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
                      <DropdownMenuItem onClick={() => window.location.href = `/store/${teamSlug}/admin/customers/${customer.id}`}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => window.location.href = `/store/${teamSlug}/admin/customers/${customer.id}/edit`}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Customer
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Mail className="h-4 w-4 mr-2" />
                        Send Email
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <ShoppingBag className="h-4 w-4 mr-2" />
                        View Orders
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <User className="h-4 w-4 mr-2" />
                        Add to Segment
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
