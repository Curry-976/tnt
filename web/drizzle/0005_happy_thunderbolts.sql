ALTER TABLE "orders" ADD COLUMN "tracking_number" varchar(100);--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "tracking_carrier_slug" varchar(50);