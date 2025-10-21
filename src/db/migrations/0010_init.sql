PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_category` (
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`updateCounter` integer DEFAULT 0,
	`id` text PRIMARY KEY NOT NULL,
	`teamId` text NOT NULL,
	`saleorCategoryId` text(255) NOT NULL,
	`name` text(255) NOT NULL,
	`slug` text(255) NOT NULL,
	`description` text(1000),
	`parentId` text,
	`sortOrder` integer DEFAULT 0 NOT NULL,
	`imageUrl` text(600),
	FOREIGN KEY (`teamId`) REFERENCES `team`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_category`("createdAt", "updatedAt", "updateCounter", "id", "teamId", "saleorCategoryId", "name", "slug", "description", "parentId", "sortOrder", "imageUrl") SELECT "createdAt", "updatedAt", "updateCounter", "id", "teamId", "saleorCategoryId", "name", "slug", "description", "parentId", "sortOrder", "imageUrl" FROM `category`;--> statement-breakpoint
DROP TABLE `category`;--> statement-breakpoint
ALTER TABLE `__new_category` RENAME TO `category`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `category_team_id_idx` ON `category` (`teamId`);--> statement-breakpoint
CREATE INDEX `category_saleor_id_idx` ON `category` (`saleorCategoryId`);--> statement-breakpoint
CREATE INDEX `category_slug_idx` ON `category` (`slug`);--> statement-breakpoint
CREATE INDEX `category_parent_idx` ON `category` (`parentId`);--> statement-breakpoint
CREATE TABLE `__new_order` (
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`updateCounter` integer DEFAULT 0,
	`id` text PRIMARY KEY NOT NULL,
	`teamId` text NOT NULL,
	`saleorOrderId` text(255) NOT NULL,
	`orderNumber` text(50) NOT NULL,
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
	FOREIGN KEY (`teamId`) REFERENCES `team`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`customerId`) REFERENCES `customer`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_order`("createdAt", "updatedAt", "updateCounter", "id", "teamId", "saleorOrderId", "orderNumber", "customerId", "customerEmail", "customerName", "status", "totalAmount", "currency", "shippingAddress", "billingAddress", "lineItems", "fulfillmentStatus", "paymentStatus") SELECT "createdAt", "updatedAt", "updateCounter", "id", "teamId", "saleorOrderId", "orderNumber", "customerId", "customerEmail", "customerName", "status", "totalAmount", "currency", "shippingAddress", "billingAddress", "lineItems", "fulfillmentStatus", "paymentStatus" FROM `order`;--> statement-breakpoint
DROP TABLE `order`;--> statement-breakpoint
ALTER TABLE `__new_order` RENAME TO `order`;--> statement-breakpoint
CREATE INDEX `order_team_id_idx` ON `order` (`teamId`);--> statement-breakpoint
CREATE INDEX `order_saleor_id_idx` ON `order` (`saleorOrderId`);--> statement-breakpoint
CREATE INDEX `order_number_idx` ON `order` (`orderNumber`);--> statement-breakpoint
CREATE INDEX `order_customer_email_idx` ON `order` (`customerEmail`);--> statement-breakpoint
CREATE INDEX `order_status_idx` ON `order` (`status`);--> statement-breakpoint
CREATE TABLE `__new_product` (
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`updateCounter` integer DEFAULT 0,
	`id` text PRIMARY KEY NOT NULL,
	`teamId` text NOT NULL,
	`saleorProductId` text(255) NOT NULL,
	`sku` text(100),
	`name` text(255) NOT NULL,
	`description` text(5000),
	`price` integer NOT NULL,
	`compareAtPrice` integer,
	`inventory` integer DEFAULT 0 NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`images` text,
	`categoryId` text,
	`variants` text,
	`metadata` text,
	FOREIGN KEY (`teamId`) REFERENCES `team`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`categoryId`) REFERENCES `category`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_product`("createdAt", "updatedAt", "updateCounter", "id", "teamId", "saleorProductId", "sku", "name", "description", "price", "compareAtPrice", "inventory", "status", "images", "categoryId", "variants", "metadata") SELECT "createdAt", "updatedAt", "updateCounter", "id", "teamId", "saleorProductId", "sku", "name", "description", "price", "compareAtPrice", "inventory", "status", "images", "categoryId", "variants", "metadata" FROM `product`;--> statement-breakpoint
DROP TABLE `product`;--> statement-breakpoint
ALTER TABLE `__new_product` RENAME TO `product`;--> statement-breakpoint
CREATE INDEX `product_team_id_idx` ON `product` (`teamId`);--> statement-breakpoint
CREATE INDEX `product_saleor_id_idx` ON `product` (`saleorProductId`);--> statement-breakpoint
CREATE INDEX `product_sku_idx` ON `product` (`sku`);--> statement-breakpoint
CREATE INDEX `product_status_idx` ON `product` (`status`);--> statement-breakpoint
CREATE INDEX `product_category_idx` ON `product` (`categoryId`);--> statement-breakpoint
CREATE TABLE `__new_team` (
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`updateCounter` integer DEFAULT 0,
	`id` text PRIMARY KEY NOT NULL,
	`name` text(255) NOT NULL,
	`slug` text(255) NOT NULL,
	`description` text(1000),
	`avatarUrl` text(600),
	`settings` text(10000),
	`billingEmail` text(255),
	`planId` text(100),
	`planExpiresAt` integer,
	`creditBalance` integer DEFAULT 0 NOT NULL,
	`saleorApiUrl` text(500),
	`saleorApiToken` text(500),
	`storeDomain` text(255),
	`storeStatus` text DEFAULT 'inactive' NOT NULL,
	`storeTheme` text
);
--> statement-breakpoint
INSERT INTO `__new_team`("createdAt", "updatedAt", "updateCounter", "id", "name", "slug", "description", "avatarUrl", "settings", "billingEmail", "planId", "planExpiresAt", "creditBalance", "saleorApiUrl", "saleorApiToken", "storeDomain", "storeStatus", "storeTheme") SELECT "createdAt", "updatedAt", "updateCounter", "id", "name", "slug", "description", "avatarUrl", "settings", "billingEmail", "planId", "planExpiresAt", "creditBalance", "saleorApiUrl", "saleorApiToken", "storeDomain", "storeStatus", "storeTheme" FROM `team`;--> statement-breakpoint
DROP TABLE `team`;--> statement-breakpoint
ALTER TABLE `__new_team` RENAME TO `team`;--> statement-breakpoint
CREATE UNIQUE INDEX `team_slug_unique` ON `team` (`slug`);--> statement-breakpoint
CREATE INDEX `team_slug_idx` ON `team` (`slug`);--> statement-breakpoint
CREATE INDEX `team_store_domain_idx` ON `team` (`storeDomain`);