import "server-only";
import { getDB } from "@/db";
import {
  productTable,
  categoryTable,
  orderTable,
  customerTable,
  collectionTable,
  teamTable
} from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSaleorClientForTeam } from "@/utils/saleor-context";
import { PRODUCT_LIST, ORDER_LIST, CUSTOMER_LIST, CATEGORY_LIST, COLLECTION_LIST } from "@/lib/saleor/queries";

/**
 * Syncs products from Saleor to local database
 */
export async function syncProductsFromSaleor(teamId: string) {
  const client = await getSaleorClientForTeam(teamId);
  const db = getDB();

  try {
    // Get products from Saleor
    const { data } = await client.query({
      query: PRODUCT_LIST,
      variables: {
        first: 100, // Adjust based on needs
        channel: "default", // You might want to make this configurable
      },
    });

    const responseData = data as { products?: { edges?: Array<{ node: unknown }> } };

    if (!responseData?.products?.edges) {
      console.log(`No products found for team ${teamId}`);
      return { synced: 0, errors: [] };
    }

    const errors: string[] = [];
    let synced = 0;

    for (const edge of responseData.products.edges) {
        const product = edge.node as {
          id: string;
          name: string;
          description?: string;
          pricing?: {
            priceRange?: {
              start?: { gross?: { amount?: string; currency?: string } };
              stop?: { gross?: { amount?: string; currency?: string } };
            };
          };
          isAvailableForPurchase?: boolean;
          media?: Array<{ url: string }>;
          seoTitle?: string;
          seoDescription?: string;
        };

      try {
        // Check if product already exists
        const existingProduct = await db.query.productTable.findFirst({
          where: eq(productTable.saleorProductId, product.id),
        });

        const productData = {
          teamId,
          saleorProductId: product.id,
          name: product.name,
          description: product.description || '',
          price: Math.round(parseFloat(product.pricing?.priceRange?.start?.gross?.amount || '0') * 100), // Convert to cents
          compareAtPrice: product.pricing?.priceRange?.stop?.gross?.amount
            ? Math.round(parseFloat(product.pricing.priceRange.stop.gross.amount) * 100)
            : null,
          status: product.isAvailableForPurchase ? 'published' : 'draft',
          images: product.media?.map((media: { url: string }) => media.url) || [],
          metadata: {
            seoTitle: product.seoTitle,
            seoDescription: product.seoDescription,
            currency: product.pricing?.priceRange?.start?.gross?.currency || 'USD',
          },
        };

        if (existingProduct) {
          // Update existing product
          await db.update(productTable)
            .set(productData)
            .where(eq(productTable.id, existingProduct.id));
        } else {
          // Create new product
          await db.insert(productTable).values(productData);
        }

        synced++;
      } catch (error) {
        const errorMsg = `Failed to sync product ${product.id}: ${error instanceof Error ? error.message : 'Unknown error'}`;
        console.error(errorMsg);
        errors.push(errorMsg);
      }
    }

    return { synced, errors };
  } catch (error) {
    console.error(`Failed to sync products for team ${teamId}:`, error);
    throw error;
  }
}

/**
 * Syncs orders from Saleor to local database
 */
export async function syncOrdersFromSaleor(teamId: string) {
  const client = await getSaleorClientForTeam(teamId);
  const db = getDB();

  try {
    const { data } = await client.query({
      query: ORDER_LIST,
      variables: {
        first: 100,
      },
    });

    const responseData = data as { orders?: { edges?: Array<{ node: unknown }> } };

    if (!responseData?.orders?.edges) {
      console.log(`No orders found for team ${teamId}`);
      return { synced: 0, errors: [] };
    }

    const errors: string[] = [];
    let synced = 0;

    for (const edge of responseData.orders.edges) {
        const order = edge.node as {
          id: string;
          number: string;
          userEmail: string;
          status: string;
          shippingAddress?: {
            firstName?: string;
            lastName?: string;
          };
          billingAddress?: unknown;
          total?: { gross?: { amount?: string; currency?: string } };
          lines?: Array<{
            id: string;
            productName: string;
            variantName?: string;
            quantity: number;
            unitPrice?: { gross?: { amount?: string } };
            totalPrice?: { gross?: { amount?: string } };
          }>;
        };

      try {
        const existingOrder = await db.query.orderTable.findFirst({
          where: eq(orderTable.saleorOrderId, order.id),
        });

        const orderData = {
          teamId,
          saleorOrderId: order.id,
          orderNumber: order.number,
          customerEmail: order.userEmail,
          customerName: `${order.shippingAddress?.firstName || ''} ${order.shippingAddress?.lastName || ''}`.trim(),
          status: order.status.toLowerCase(),
          totalAmount: Math.round(parseFloat(order.total?.gross?.amount || '0') * 100),
          currency: order.total?.gross?.currency || 'USD',
          shippingAddress: order.shippingAddress,
          billingAddress: order.billingAddress as Record<string, unknown> | null,
          lineItems: order.lines?.map((line: {
            id: string;
            productName: string;
            variantName?: string;
            quantity: number;
            unitPrice?: { gross?: { amount?: string } };
            totalPrice?: { gross?: { amount?: string } };
          }) => ({
            id: line.id,
            productName: line.productName,
            variantName: line.variantName,
            quantity: line.quantity,
            unitPrice: line.unitPrice?.gross?.amount,
            totalPrice: line.totalPrice?.gross?.amount,
          })),
          fulfillmentStatus: 'unfulfilled', // Default, you might want to map this from Saleor
          paymentStatus: 'pending', // Default, you might want to map this from Saleor
        };

        if (existingOrder) {
          await db.update(orderTable)
            .set(orderData)
            .where(eq(orderTable.id, existingOrder.id));
        } else {
          await db.insert(orderTable).values(orderData);
        }

        synced++;
      } catch (error) {
        const errorMsg = `Failed to sync order ${order.id}: ${error instanceof Error ? error.message : 'Unknown error'}`;
        console.error(errorMsg);
        errors.push(errorMsg);
      }
    }

    return { synced, errors };
  } catch (error) {
    console.error(`Failed to sync orders for team ${teamId}:`, error);
    throw error;
  }
}

/**
 * Syncs customers from Saleor to local database
 */
export async function syncCustomersFromSaleor(teamId: string) {
  const client = await getSaleorClientForTeam(teamId);
  const db = getDB();

  try {
    const { data } = await client.query({
      query: CUSTOMER_LIST,
      variables: {
        first: 100,
      },
    });

    const responseData = data as { customers?: { edges?: Array<{ node: unknown }> } };

    if (!responseData?.customers?.edges) {
      console.log(`No customers found for team ${teamId}`);
      return { synced: 0, errors: [] };
    }

    const errors: string[] = [];
    let synced = 0;

    for (const edge of responseData.customers.edges) {
      const customer = edge.node as {
        id: string;
        email: string;
        firstName?: string;
        lastName?: string;
        isActive: boolean;
        dateJoined: string;
        defaultShippingAddress?: unknown;
        defaultBillingAddress?: unknown;
      };

      try {
        const existingCustomer = await db.query.customerTable.findFirst({
          where: eq(customerTable.saleorCustomerId, customer.id),
        });

        const customerData = {
          teamId,
          saleorCustomerId: customer.id,
          email: customer.email,
          firstName: customer.firstName,
          lastName: customer.lastName,
          defaultShippingAddress: customer.defaultShippingAddress as Record<string, unknown> | null,
          defaultBillingAddress: customer.defaultBillingAddress as Record<string, unknown> | null,
          totalOrders: 0, // You might want to calculate this
          totalSpent: 0, // You might want to calculate this
        };

        if (existingCustomer) {
          await db.update(customerTable)
            .set(customerData)
            .where(eq(customerTable.id, existingCustomer.id));
        } else {
          await db.insert(customerTable).values(customerData);
        }

        synced++;
      } catch (error) {
        const errorMsg = `Failed to sync customer ${customer.id}: ${error instanceof Error ? error.message : 'Unknown error'}`;
        console.error(errorMsg);
        errors.push(errorMsg);
      }
    }

    return { synced, errors };
  } catch (error) {
    console.error(`Failed to sync customers for team ${teamId}:`, error);
    throw error;
  }
}

/**
 * Syncs categories from Saleor to local database
 */
export async function syncCategoriesFromSaleor(teamId: string) {
  const client = await getSaleorClientForTeam(teamId);
  const db = getDB();

  try {
    const { data } = await client.query({
      query: CATEGORY_LIST,
      variables: {
        first: 100,
      },
    });

    const responseData = data as { categories?: { edges?: Array<{ node: unknown }> } };

    if (!responseData?.categories?.edges) {
      console.log(`No categories found for team ${teamId}`);
      return { synced: 0, errors: [] };
    }

    const errors: string[] = [];
    let synced = 0;

    for (const edge of responseData.categories.edges) {
      const category = edge.node as {
        id: string;
        name: string;
        slug: string;
        description?: string;
        parent?: { id: string } | null;
        backgroundImage?: { url: string } | null;
      };

      try {
        const existingCategory = await db.query.categoryTable.findFirst({
          where: eq(categoryTable.saleorCategoryId, category.id),
        });

        const categoryData = {
          teamId,
          saleorCategoryId: category.id,
          name: category.name,
          slug: category.slug,
          description: category.description || '',
          imageUrl: category.backgroundImage?.url,
        };

        if (existingCategory) {
          await db.update(categoryTable)
            .set(categoryData)
            .where(eq(categoryTable.id, existingCategory.id));
        } else {
          await db.insert(categoryTable).values(categoryData);
        }

        synced++;
      } catch (error) {
        const errorMsg = `Failed to sync category ${category.id}: ${error instanceof Error ? error.message : 'Unknown error'}`;
        console.error(errorMsg);
        errors.push(errorMsg);
      }
    }

    return { synced, errors };
  } catch (error) {
    console.error(`Failed to sync categories for team ${teamId}:`, error);
    throw error;
  }
}

/**
 * Syncs collections from Saleor to local database
 */
export async function syncCollectionsFromSaleor(teamId: string) {
  const client = await getSaleorClientForTeam(teamId);
  const db = getDB();

  try {
    const { data } = await client.query({
      query: COLLECTION_LIST,
      variables: {
        first: 100,
      },
    });

    if (!data?.collections?.edges) {
      console.log(`No collections found for team ${teamId}`);
      return { synced: 0, errors: [] };
    }

    const errors: string[] = [];
    let synced = 0;

    for (const edge of data.collections.edges) {
      const collection = edge.node;

      try {
        const existingCollection = await db.query.collectionTable.findFirst({
          where: eq(collectionTable.saleorCollectionId, collection.id),
        });

        const collectionData = {
          teamId,
          saleorCollectionId: collection.id,
          name: collection.name,
          slug: collection.slug,
          description: collection.description || '',
          imageUrl: collection.backgroundImage?.url,
          isPublished: collection.isPublished ? 1 : 0,
        };

        if (existingCollection) {
          await db.update(collectionTable)
            .set(collectionData)
            .where(eq(collectionTable.id, existingCollection.id));
        } else {
          await db.insert(collectionTable).values(collectionData);
        }

        synced++;
      } catch (error) {
        const errorMsg = `Failed to sync collection ${collection.id}: ${error instanceof Error ? error.message : 'Unknown error'}`;
        console.error(errorMsg);
        errors.push(errorMsg);
      }
    }

    return { synced, errors };
  } catch (error) {
    console.error(`Failed to sync collections for team ${teamId}:`, error);
    throw error;
  }
}

/**
 * Full sync of all data from Saleor
 */
export async function fullSyncFromSaleor(teamId: string) {
  console.log(`Starting full sync for team ${teamId}`);

  const results = {
    products: { synced: 0, errors: [] as string[] },
    orders: { synced: 0, errors: [] as string[] },
    customers: { synced: 0, errors: [] as string[] },
    categories: { synced: 0, errors: [] as string[] },
    collections: { synced: 0, errors: [] as string[] },
  };

  try {
    // Sync in order of dependencies
    results.categories = await syncCategoriesFromSaleor(teamId);
    results.collections = await syncCollectionsFromSaleor(teamId);
    results.products = await syncProductsFromSaleor(teamId);
    results.customers = await syncCustomersFromSaleor(teamId);
    results.orders = await syncOrdersFromSaleor(teamId);

    console.log(`Full sync completed for team ${teamId}:`, results);
    return results;
  } catch (error) {
    console.error(`Full sync failed for team ${teamId}:`, error);
    throw error;
  }
}
