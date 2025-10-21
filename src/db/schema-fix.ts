// Temporary fix for orderTable
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