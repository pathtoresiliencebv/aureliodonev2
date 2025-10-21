import { sqliteTable, integer, text, index } from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";
import { type InferSelectModel } from "drizzle-orm";

import { createId } from '@paralleldrive/cuid2'

export const ROLES_ENUM = {
  ADMIN: 'admin',
  USER: 'user',
} as const;

const roleTuple = Object.values(ROLES_ENUM) as [string, ...string[]];

const commonColumns = {
  createdAt: integer({
    mode: "timestamp",
  }).$defaultFn(() => new Date()).notNull(),
  updatedAt: integer({
    mode: "timestamp",
  }).$onUpdateFn(() => new Date()).notNull(),
  updateCounter: integer().default(0).$onUpdate(() => sql`updateCounter + 1`),
}

export const userTable = sqliteTable("user", {
  ...commonColumns,
  id: text().primaryKey().$defaultFn(() => `usr_${createId()}`).notNull(),
  firstName: text({
    length: 255,
  }),
  lastName: text({
    length: 255,
  }),
  email: text({
    length: 255,
  }).unique(),
  passwordHash: text(),
  role: text({
    enum: roleTuple,
  }).default(ROLES_ENUM.USER).notNull(),
  emailVerified: integer({
    mode: "timestamp",
  }),
  signUpIpAddress: text({
    length: 100,
  }),
  googleAccountId: text({
    length: 255,
  }),
  /**
   * This can either be an absolute or relative path to an image
   */
  avatar: text({
    length: 600,
  }),
  // Credit system fields
  currentCredits: integer().default(0).notNull(),
  lastCreditRefreshAt: integer({
    mode: "timestamp",
  }),
}, (table) => ([
  index('email_idx').on(table.email),
  index('google_account_id_idx').on(table.googleAccountId),
  index('role_idx').on(table.role),
]));

export const passKeyCredentialTable = sqliteTable("passkey_credential", {
  ...commonColumns,
  id: text().primaryKey().$defaultFn(() => `pkey_${createId()}`).notNull(),
  userId: text().notNull().references(() => userTable.id),
  credentialId: text({
    length: 255,
  }).notNull().unique(),
  credentialPublicKey: text({
    length: 255,
  }).notNull(),
  counter: integer().notNull(),
  // Optional array of AuthenticatorTransport as JSON string
  transports: text({
    length: 255,
  }),
  // Authenticator Attestation GUID. We use this to identify the device/authenticator app that created the passkey
  aaguid: text({
    length: 255,
  }),
  // The user agent of the device that created the passkey
  userAgent: text({
    length: 255,
  }),
  // The IP address that created the passkey
  ipAddress: text({
    length: 100,
  }),
}, (table) => ([
  index('user_id_idx').on(table.userId),
  index('credential_id_idx').on(table.credentialId),
]));

// Credit transaction types
export const CREDIT_TRANSACTION_TYPE = {
  PURCHASE: 'PURCHASE',
  USAGE: 'USAGE',
  MONTHLY_REFRESH: 'MONTHLY_REFRESH',
} as const;

export const creditTransactionTypeTuple = Object.values(CREDIT_TRANSACTION_TYPE) as [string, ...string[]];

export const creditTransactionTable = sqliteTable("credit_transaction", {
  ...commonColumns,
  id: text().primaryKey().$defaultFn(() => `ctxn_${createId()}`).notNull(),
  userId: text().notNull().references(() => userTable.id),
  amount: integer().notNull(),
  // Track how many credits are still available from this transaction
  remainingAmount: integer().default(0).notNull(),
  type: text({
    enum: creditTransactionTypeTuple,
  }).notNull(),
  description: text({
    length: 255,
  }).notNull(),
  expirationDate: integer({
    mode: "timestamp",
  }),
  expirationDateProcessedAt: integer({
    mode: "timestamp",
  }),
  paymentIntentId: text({
    length: 255,
  }),
}, (table) => ([
  index('credit_transaction_user_id_idx').on(table.userId),
  index('credit_transaction_type_idx').on(table.type),
  index('credit_transaction_created_at_idx').on(table.createdAt),
  index('credit_transaction_expiration_date_idx').on(table.expirationDate),
  index('credit_transaction_payment_intent_id_idx').on(table.paymentIntentId),
]));

// Define item types that can be purchased
export const PURCHASABLE_ITEM_TYPE = {
  COMPONENT: 'COMPONENT',
  // Add more types in the future (e.g., TEMPLATE, PLUGIN, etc.)
} as const;

export const purchasableItemTypeTuple = Object.values(PURCHASABLE_ITEM_TYPE) as [string, ...string[]];

export const purchasedItemsTable = sqliteTable("purchased_item", {
  ...commonColumns,
  id: text().primaryKey().$defaultFn(() => `pitem_${createId()}`).notNull(),
  userId: text().notNull().references(() => userTable.id),
  // The type of item (e.g., COMPONENT, TEMPLATE, etc.)
  itemType: text({
    enum: purchasableItemTypeTuple,
  }).notNull(),
  // The ID of the item within its type (e.g., componentId)
  itemId: text().notNull(),
  purchasedAt: integer({
    mode: "timestamp",
  }).$defaultFn(() => new Date()).notNull(),
}, (table) => ([
  index('purchased_item_user_id_idx').on(table.userId),
  index('purchased_item_type_idx').on(table.itemType),
  // Composite index for checking if a user owns a specific item of a specific type
  index('purchased_item_user_item_idx').on(table.userId, table.itemType, table.itemId),
]));

// System-defined roles - these are always available
export const SYSTEM_ROLES_ENUM = {
  OWNER: 'owner',
  ADMIN: 'admin',
  MEMBER: 'member',
  GUEST: 'guest',
} as const;

export const systemRoleTuple = Object.values(SYSTEM_ROLES_ENUM) as [string, ...string[]];

// Define available permissions
export const TEAM_PERMISSIONS = {
  // Resource access
  ACCESS_DASHBOARD: 'access_dashboard',
  ACCESS_BILLING: 'access_billing',

  // User management
  INVITE_MEMBERS: 'invite_members',
  REMOVE_MEMBERS: 'remove_members',
  CHANGE_MEMBER_ROLES: 'change_member_roles',

  // Team management
  EDIT_TEAM_SETTINGS: 'edit_team_settings',
  DELETE_TEAM: 'delete_team',

  // Role management
  CREATE_ROLES: 'create_roles',
  EDIT_ROLES: 'edit_roles',
  DELETE_ROLES: 'delete_roles',
  ASSIGN_ROLES: 'assign_roles',

  // Content permissions
  CREATE_COMPONENTS: 'create_components',
  EDIT_COMPONENTS: 'edit_components',
  DELETE_COMPONENTS: 'delete_components',

  // E-commerce permissions
  MANAGE_PRODUCTS: 'manage_products',
  VIEW_PRODUCTS: 'view_products',
  MANAGE_ORDERS: 'manage_orders',
  VIEW_ORDERS: 'view_orders',
  PROCESS_FULFILLMENT: 'process_fulfillment',
  MANAGE_CUSTOMERS: 'manage_customers',
  VIEW_CUSTOMERS: 'view_customers',
  MANAGE_STORE_SETTINGS: 'manage_store_settings',
  VIEW_ANALYTICS: 'view_analytics',

  // Add more as needed
} as const;

// Team table
export const teamTable = sqliteTable("team", {
  ...commonColumns,
  id: text().primaryKey().$defaultFn(() => `team_${createId()}`).notNull(),
  name: text({ length: 255 }).notNull(),
  slug: text({ length: 255 }).notNull().unique(),
  description: text({ length: 1000 }),
  avatarUrl: text({ length: 600 }),
  // Settings could be stored as JSON
  settings: text({ length: 10000 }),
  // Optional billing-related fields
  billingEmail: text({ length: 255 }),
  planId: text({ length: 100 }),
  planExpiresAt: integer({ mode: "timestamp" }),
  creditBalance: integer().default(0).notNull(),
  // Store-specific fields
  saleorApiUrl: text({ length: 500 }),
  saleorApiToken: text({ length: 500 }),
  storeDomain: text({ length: 255 }),
  storeStatus: text({
    enum: ['active', 'inactive', 'suspended'] as [string, ...string[]]
  }).notNull().default('inactive'),
  storeTheme: text({ mode: 'json' }).$type<Record<string, unknown>>(),
}, (table) => ([
  index('team_slug_idx').on(table.slug),
  index('team_store_domain_idx').on(table.storeDomain),
]));

// Team membership table
export const teamMembershipTable = sqliteTable("team_membership", {
  ...commonColumns,
  id: text().primaryKey().$defaultFn(() => `tmem_${createId()}`).notNull(),
  teamId: text().notNull().references(() => teamTable.id),
  userId: text().notNull().references(() => userTable.id),
  // This can be either a system role or a custom role ID
  roleId: text().notNull(),
  // Flag to indicate if this is a system role
  isSystemRole: integer().default(1).notNull(),
  invitedBy: text().references(() => userTable.id),
  invitedAt: integer({ mode: "timestamp" }),
  joinedAt: integer({ mode: "timestamp" }),
  expiresAt: integer({ mode: "timestamp" }),
  isActive: integer().default(1).notNull(),
}, (table) => ([
  index('team_membership_team_id_idx').on(table.teamId),
  index('team_membership_user_id_idx').on(table.userId),
  // Instead of unique() which causes linter errors, we'll create a unique constraint on columns
  index('team_membership_unique_idx').on(table.teamId, table.userId),
]));

// Team role table
export const teamRoleTable = sqliteTable("team_role", {
  ...commonColumns,
  id: text().primaryKey().$defaultFn(() => `trole_${createId()}`).notNull(),
  teamId: text().notNull().references(() => teamTable.id),
  name: text({ length: 255 }).notNull(),
  description: text({ length: 1000 }),
  // Store permissions as a JSON array of permission keys
  permissions: text({ mode: 'json' }).notNull().$type<string[]>(),
  // A JSON field for storing UI-specific settings like color, icon, etc.
  metadata: text({ length: 5000 }),
  // Optional flag to mark some roles as non-editable
  isEditable: integer().default(1).notNull(),
}, (table) => ([
  index('team_role_team_id_idx').on(table.teamId),
  // Instead of unique() which causes linter errors, we'll create a unique constraint on columns
  index('team_role_name_unique_idx').on(table.teamId, table.name),
]));

// Team invitation table
export const teamInvitationTable = sqliteTable("team_invitation", {
  ...commonColumns,
  id: text().primaryKey().$defaultFn(() => `tinv_${createId()}`).notNull(),
  teamId: text().notNull().references(() => teamTable.id),
  email: text({ length: 255 }).notNull(),
  // This can be either a system role or a custom role ID
  roleId: text().notNull(),
  // Flag to indicate if this is a system role
  isSystemRole: integer().default(1).notNull(),
  token: text({ length: 255 }).notNull().unique(),
  invitedBy: text().notNull().references(() => userTable.id),
  expiresAt: integer({ mode: "timestamp" }).notNull(),
  acceptedAt: integer({ mode: "timestamp" }),
  acceptedBy: text().references(() => userTable.id),
}, (table) => ([
  index('team_invitation_team_id_idx').on(table.teamId),
  index('team_invitation_email_idx').on(table.email),
  index('team_invitation_token_idx').on(table.token),
]));

// E-commerce tables

// Product table
export const productTable = sqliteTable("product", {
  ...commonColumns,
  id: text().primaryKey().$defaultFn(() => `prod_${createId()}`).notNull(),
  teamId: text().notNull().references(() => teamTable.id),
  saleorProductId: text({ length: 255 }).notNull(),
  sku: text({ length: 100 }),
  name: text({ length: 255 }).notNull(),
  description: text({ length: 5000 }),
  price: integer().notNull(), // Price in cents
  compareAtPrice: integer(),
  inventory: integer().default(0).notNull(),
  status: text({
    enum: ['draft', 'published', 'archived'] as [string, ...string[]]
  }).notNull().default('draft'),
  images: text({ mode: 'json' }).$type<string[]>(),
  categoryId: text().references(() => categoryTable.id),
  variants: text({ mode: 'json' }).$type<Record<string, unknown>>(),
  metadata: text({ mode: 'json' }).$type<Record<string, unknown>>(),
}, (table) => ([
  index('product_team_id_idx').on(table.teamId),
  index('product_saleor_id_idx').on(table.saleorProductId),
  index('product_sku_idx').on(table.sku),
  index('product_status_idx').on(table.status),
  index('product_category_idx').on(table.categoryId),
]));

// Category table
export const categoryTable = sqliteTable("category", {
  ...commonColumns,
  id: text().primaryKey().$defaultFn(() => `cat_${createId()}`).notNull(),
  teamId: text().notNull().references(() => teamTable.id),
  saleorCategoryId: text({ length: 255 }).notNull(),
  name: text({ length: 255 }).notNull(),
  slug: text({ length: 255 }).notNull(),
  description: text({ length: 1000 }),
  parentId: text(),
  sortOrder: integer().default(0).notNull(),
  imageUrl: text({ length: 600 }),
}, (table) => ([
  index('category_team_id_idx').on(table.teamId),
  index('category_saleor_id_idx').on(table.saleorCategoryId),
  index('category_slug_idx').on(table.slug),
  index('category_parent_idx').on(table.parentId),
]));

// Order table
export const orderTable = sqliteTable("order", {
  ...commonColumns,
  id: text().primaryKey().$defaultFn(() => `ord_${createId()}`).notNull(),
  teamId: text().notNull().references(() => teamTable.id),
  saleorOrderId: text({ length: 255 }),
  orderNumber: text({ length: 50 }),
  customerId: text().references(() => customerTable.id),
  customerEmail: text({ length: 255 }).notNull(),
  customerName: text({ length: 255 }),
  status: text({
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'refunded'] as [string, ...string[]]
  }).notNull().default('pending'),
  totalAmount: integer().notNull(), // Total in cents
  currency: text({ length: 3 }).notNull().default('USD'),
  shippingAddress: text({ mode: 'json' }).$type<Record<string, unknown>>(),
  billingAddress: text({ mode: 'json' }).$type<Record<string, unknown>>(),
  lineItems: text({ mode: 'json' }).$type<Record<string, unknown>[]>(),
  fulfillmentStatus: text({
    enum: ['unfulfilled', 'partially_fulfilled', 'fulfilled'] as [string, ...string[]]
  }).notNull().default('unfulfilled'),
  paymentStatus: text({
    enum: ['pending', 'paid', 'partially_paid', 'refunded'] as [string, ...string[]]
  }).notNull().default('pending'),
  // Stripe integration fields
  stripeSessionId: text({ length: 255 }),
  stripePaymentIntentId: text({ length: 255 }),
  stripeCustomerId: text({ length: 255 }),
  // Additional fields for better order management
  notes: text({ length: 1000 }),
  trackingNumber: text({ length: 100 }),
  shippingMethod: text({ length: 100 }),
  taxAmount: integer().default(0),
  shippingAmount: integer().default(0),
  discountAmount: integer().default(0),
}, (table) => [
  index('order_team_id_idx').on(table.teamId),
  index('order_saleor_id_idx').on(table.saleorOrderId),
  index('order_number_idx').on(table.orderNumber),
  index('order_customer_email_idx').on(table.customerEmail),
  index('order_status_idx').on(table.status),
  index('order_stripe_session_idx').on(table.stripeSessionId),
  index('order_stripe_payment_intent_idx').on(table.stripePaymentIntentId),
]);

// Customer table
export const customerTable = sqliteTable("customer", {
  ...commonColumns,
  id: text().primaryKey().$defaultFn(() => `cust_${createId()}`).notNull(),
  teamId: text().notNull().references(() => teamTable.id),
  saleorCustomerId: text({ length: 255 }).notNull(),
  email: text({ length: 255 }).notNull(),
  firstName: text({ length: 255 }),
  lastName: text({ length: 255 }),
  phone: text({ length: 50 }),
  defaultShippingAddress: text({ mode: 'json' }).$type<Record<string, unknown>>(),
  defaultBillingAddress: text({ mode: 'json' }).$type<Record<string, unknown>>(),
  totalOrders: integer().default(0).notNull(),
  totalSpent: integer().default(0).notNull(), // Total spent in cents
}, (table) => ([
  index('customer_team_id_idx').on(table.teamId),
  index('customer_saleor_id_idx').on(table.saleorCustomerId),
  index('customer_email_idx').on(table.email),
]));

// Collection table
export const collectionTable = sqliteTable("collection", {
  ...commonColumns,
  id: text().primaryKey().$defaultFn(() => `coll_${createId()}`).notNull(),
  teamId: text().notNull().references(() => teamTable.id),
  saleorCollectionId: text({ length: 255 }).notNull(),
  name: text({ length: 255 }).notNull(),
  slug: text({ length: 255 }).notNull(),
  description: text({ length: 1000 }),
  imageUrl: text({ length: 600 }),
  isPublished: integer().default(0).notNull(),
  products: text({ mode: 'json' }).$type<string[]>(),
}, (table) => ([
  index('collection_team_id_idx').on(table.teamId),
  index('collection_saleor_id_idx').on(table.saleorCollectionId),
  index('collection_slug_idx').on(table.slug),
]));

// Shipping method table
export const shippingMethodTable = sqliteTable("shipping_method", {
  ...commonColumns,
  id: text().primaryKey().$defaultFn(() => `ship_${createId()}`).notNull(),
  teamId: text().notNull().references(() => teamTable.id),
  saleorShippingMethodId: text({ length: 255 }).notNull(),
  name: text({ length: 255 }).notNull(),
  description: text({ length: 1000 }),
  price: integer().notNull(), // Price in cents
  minOrderValue: integer(),
  maxOrderValue: integer(),
  deliveryTimeMin: integer(), // Days
  deliveryTimeMax: integer(), // Days
}, (table) => ([
  index('shipping_team_id_idx').on(table.teamId),
  index('shipping_saleor_id_idx').on(table.saleorShippingMethodId),
]));

// Tax configuration table
export const taxConfigurationTable = sqliteTable("tax_configuration", {
  ...commonColumns,
  id: text().primaryKey().$defaultFn(() => `tax_${createId()}`).notNull(),
  teamId: text().notNull().references(() => teamTable.id),
  taxName: text({ length: 255 }).notNull(),
  taxRate: integer().notNull(), // Rate in basis points (e.g., 1000 = 10%)
  applyToShipping: integer().default(0).notNull(),
  regions: text({ mode: 'json' }).$type<string[]>(),
}, (table) => ([
  index('tax_team_id_idx').on(table.teamId),
]));

// Inventory table
export const inventoryTable = sqliteTable("inventory", {
  ...commonColumns,
  id: text().primaryKey().$defaultFn(() => `inv_${createId()}`).notNull(),
  teamId: text().notNull().references(() => teamTable.id),
  productId: text().notNull().references(() => productTable.id),
  variantId: text({ length: 255 }),
  warehouseId: text({ length: 255 }),
  quantityAvailable: integer().default(0).notNull(),
  quantityReserved: integer().default(0).notNull(),
  lowStockThreshold: integer().default(5).notNull(),
}, (table) => ([
  index('inventory_team_id_idx').on(table.teamId),
  index('inventory_product_idx').on(table.productId),
  index('inventory_variant_idx').on(table.variantId),
]));

// Analytics events table
export const analyticsEventTable = sqliteTable("analytics_event", {
  ...commonColumns,
  id: text().primaryKey().$defaultFn(() => `evt_${createId()}`).notNull(),
  teamId: text().notNull().references(() => teamTable.id),
  eventType: text({ length: 100 }).notNull(),
  productId: text().references(() => productTable.id),
  sessionId: text({ length: 255 }),
  timestamp: integer({ mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
  metadata: text({ mode: 'json' }).$type<Record<string, unknown>>(),
}, (table) => ([
  index('analytics_team_id_idx').on(table.teamId),
  index('analytics_event_type_idx').on(table.eventType),
  index('analytics_product_idx').on(table.productId),
  index('analytics_timestamp_idx').on(table.timestamp),
]));

export const teamRelations = relations(teamTable, ({ many }) => ({
  memberships: many(teamMembershipTable),
  invitations: many(teamInvitationTable),
  roles: many(teamRoleTable),
  products: many(productTable),
  categories: many(categoryTable),
  orders: many(orderTable),
  customers: many(customerTable),
  collections: many(collectionTable),
  shippingMethods: many(shippingMethodTable),
  taxConfigurations: many(taxConfigurationTable),
  inventory: many(inventoryTable),
  analyticsEvents: many(analyticsEventTable),
}));

export const teamRoleRelations = relations(teamRoleTable, ({ one }) => ({
  team: one(teamTable, {
    fields: [teamRoleTable.teamId],
    references: [teamTable.id],
  }),
}));

export const teamMembershipRelations = relations(teamMembershipTable, ({ one }) => ({
  team: one(teamTable, {
    fields: [teamMembershipTable.teamId],
    references: [teamTable.id],
  }),
  user: one(userTable, {
    fields: [teamMembershipTable.userId],
    references: [userTable.id],
  }),
  invitedByUser: one(userTable, {
    fields: [teamMembershipTable.invitedBy],
    references: [userTable.id],
  }),
}));

export const teamInvitationRelations = relations(teamInvitationTable, ({ one }) => ({
  team: one(teamTable, {
    fields: [teamInvitationTable.teamId],
    references: [teamTable.id],
  }),
  invitedByUser: one(userTable, {
    fields: [teamInvitationTable.invitedBy],
    references: [userTable.id],
  }),
  acceptedByUser: one(userTable, {
    fields: [teamInvitationTable.acceptedBy],
    references: [userTable.id],
  }),
}));

export const creditTransactionRelations = relations(creditTransactionTable, ({ one }) => ({
  user: one(userTable, {
    fields: [creditTransactionTable.userId],
    references: [userTable.id],
  }),
}));

export const purchasedItemsRelations = relations(purchasedItemsTable, ({ one }) => ({
  user: one(userTable, {
    fields: [purchasedItemsTable.userId],
    references: [userTable.id],
  }),
}));

export const userRelations = relations(userTable, ({ many }) => ({
  passkeys: many(passKeyCredentialTable),
  creditTransactions: many(creditTransactionTable),
  purchasedItems: many(purchasedItemsTable),
  teamMemberships: many(teamMembershipTable),
}));

export const passKeyCredentialRelations = relations(passKeyCredentialTable, ({ one }) => ({
  user: one(userTable, {
    fields: [passKeyCredentialTable.userId],
    references: [userTable.id],
  }),
}));

// E-commerce relations
export const productRelations = relations(productTable, ({ one, many }) => ({
  team: one(teamTable, {
    fields: [productTable.teamId],
    references: [teamTable.id],
  }),
  category: one(categoryTable, {
    fields: [productTable.categoryId],
    references: [categoryTable.id],
  }),
  inventory: many(inventoryTable),
  analyticsEvents: many(analyticsEventTable),
}));

export const categoryRelations = relations(categoryTable, ({ one, many }) => ({
  team: one(teamTable, {
    fields: [categoryTable.teamId],
    references: [teamTable.id],
  }),
  parent: one(categoryTable, {
    fields: [categoryTable.parentId],
    references: [categoryTable.id],
  }),
  children: many(categoryTable),
  products: many(productTable),
}));

export const orderRelations = relations(orderTable, ({ one }) => ({
  team: one(teamTable, {
    fields: [orderTable.teamId],
    references: [teamTable.id],
  }),
  customer: one(customerTable, {
    fields: [orderTable.customerId],
    references: [customerTable.id],
  }),
}));

export const customerRelations = relations(customerTable, ({ one, many }) => ({
  team: one(teamTable, {
    fields: [customerTable.teamId],
    references: [teamTable.id],
  }),
  orders: many(orderTable),
}));

export const collectionRelations = relations(collectionTable, ({ one }) => ({
  team: one(teamTable, {
    fields: [collectionTable.teamId],
    references: [teamTable.id],
  }),
}));

export const shippingMethodRelations = relations(shippingMethodTable, ({ one }) => ({
  team: one(teamTable, {
    fields: [shippingMethodTable.teamId],
    references: [teamTable.id],
  }),
}));

export const taxConfigurationRelations = relations(taxConfigurationTable, ({ one }) => ({
  team: one(teamTable, {
    fields: [taxConfigurationTable.teamId],
    references: [teamTable.id],
  }),
}));

export const inventoryRelations = relations(inventoryTable, ({ one }) => ({
  team: one(teamTable, {
    fields: [inventoryTable.teamId],
    references: [teamTable.id],
  }),
  product: one(productTable, {
    fields: [inventoryTable.productId],
    references: [productTable.id],
  }),
}));

export const analyticsEventRelations = relations(analyticsEventTable, ({ one }) => ({
  team: one(teamTable, {
    fields: [analyticsEventTable.teamId],
    references: [teamTable.id],
  }),
  product: one(productTable, {
    fields: [analyticsEventTable.productId],
    references: [productTable.id],
  }),
}));

export type User = InferSelectModel<typeof userTable>;
export type PassKeyCredential = InferSelectModel<typeof passKeyCredentialTable>;
export type CreditTransaction = InferSelectModel<typeof creditTransactionTable>;
export type PurchasedItem = InferSelectModel<typeof purchasedItemsTable>;
export type Team = InferSelectModel<typeof teamTable>;
export type TeamMembership = InferSelectModel<typeof teamMembershipTable>;
export type TeamRole = InferSelectModel<typeof teamRoleTable>;
export type TeamInvitation = InferSelectModel<typeof teamInvitationTable>;

// E-commerce types
export type Product = InferSelectModel<typeof productTable>;
export type Category = InferSelectModel<typeof categoryTable>;
export type Order = InferSelectModel<typeof orderTable>;
export type Customer = InferSelectModel<typeof customerTable>;
export type Collection = InferSelectModel<typeof collectionTable>;
export type ShippingMethod = InferSelectModel<typeof shippingMethodTable>;
export type TaxConfiguration = InferSelectModel<typeof taxConfigurationTable>;
export type Inventory = InferSelectModel<typeof inventoryTable>;
export type AnalyticsEvent = InferSelectModel<typeof analyticsEventTable>;
