PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_order` (
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`updateCounter` integer DEFAULT 0,
	`id` text PRIMARY KEY NOT NULL,
	`teamId` text NOT NULL,
	`saleorOrderId` text(255),
	`orderNumber` text(50),
	`customerId` text,
	`customerEmail` text(255) NOT NULL,
	`customerName` text(255),
	`status` text DEFAULT 'pending' NOT NULL,
	`totalAmount` integer NOT NULL,
	`currency` text(3) DEFAULT 'USD' NOT NULL,
	`shippingAddress` text,
	`billingAddress` text,
	`lineItems` text,
	`fulfillmentStatus` text DEFAULT 'unfulfilled' NOT NULL,
	`paymentStatus` text DEFAULT 'pending' NOT NULL,
	`stripeSessionId` text(255),
	`stripePaymentIntentId` text(255),
	`stripeCustomerId` text(255),
	`notes` text(1000),
	`trackingNumber` text(100),
	`shippingMethod` text(100),
	`taxAmount` integer DEFAULT 0,
	`shippingAmount` integer DEFAULT 0,
	`discountAmount` integer DEFAULT 0,
	FOREIGN KEY (`teamId`) REFERENCES `team`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`customerId`) REFERENCES `customer`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_order`("createdAt", "updatedAt", "updateCounter", "id", "teamId", "saleorOrderId", "orderNumber", "customerId", "customerEmail", "customerName", "status", "totalAmount", "currency", "shippingAddress", "billingAddress", "lineItems", "fulfillmentStatus", "paymentStatus", "stripeSessionId", "stripePaymentIntentId", "stripeCustomerId", "notes", "trackingNumber", "shippingMethod", "taxAmount", "shippingAmount", "discountAmount") SELECT "createdAt", "updatedAt", "updateCounter", "id", "teamId", "saleorOrderId", "orderNumber", "customerId", "customerEmail", "customerName", "status", "totalAmount", "currency", "shippingAddress", "billingAddress", "lineItems", "fulfillmentStatus", "paymentStatus", "stripeSessionId", "stripePaymentIntentId", "stripeCustomerId", "notes", "trackingNumber", "shippingMethod", "taxAmount", "shippingAmount", "discountAmount" FROM `order`;--> statement-breakpoint
DROP TABLE `order`;--> statement-breakpoint
ALTER TABLE `__new_order` RENAME TO `order`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `order_team_id_idx` ON `order` (`teamId`);--> statement-breakpoint
CREATE INDEX `order_saleor_id_idx` ON `order` (`saleorOrderId`);--> statement-breakpoint
CREATE INDEX `order_number_idx` ON `order` (`orderNumber`);--> statement-breakpoint
CREATE INDEX `order_customer_email_idx` ON `order` (`customerEmail`);--> statement-breakpoint
CREATE INDEX `order_status_idx` ON `order` (`status`);--> statement-breakpoint
CREATE INDEX `order_stripe_session_idx` ON `order` (`stripeSessionId`);--> statement-breakpoint
CREATE INDEX `order_stripe_payment_intent_idx` ON `order` (`stripePaymentIntentId`);