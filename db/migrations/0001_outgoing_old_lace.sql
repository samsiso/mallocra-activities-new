DO $$ BEGIN
 CREATE TYPE "public"."user_status" AS ENUM('active', 'inactive', 'suspended', 'pending');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."user_type" AS ENUM('customer', 'salesperson', 'operator', 'admin');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."activity_category" AS ENUM('water_sports', 'land_adventures', 'cultural', 'nightlife', 'family_fun');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."activity_status" AS ENUM('active', 'inactive', 'draft', 'suspended');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."availability_status" AS ENUM('available', 'limited', 'full', 'cancelled');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."price_type" AS ENUM('adult', 'child', 'senior', 'group', 'family');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."weather_status" AS ENUM('good', 'marginal', 'cancelled');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."booking_status" AS ENUM('pending', 'confirmed', 'cancelled', 'completed', 'no_show');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."commission_status" AS ENUM('pending', 'calculated', 'paid', 'withheld');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."payment_method" AS ENUM('card', 'paypal', 'apple_pay', 'google_pay', 'sepa', 'cash');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."payment_status" AS ENUM('pending', 'authorized', 'paid', 'refunded', 'failed');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "operators" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"business_name" text NOT NULL,
	"license_number" text,
	"insurance_number" text,
	"commission_rate" numeric DEFAULT '0.15',
	"business_address" text,
	"business_phone" text,
	"business_email" text,
	"status" "user_status" DEFAULT 'pending' NOT NULL,
	"verified_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "salespeople" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"commission_rate" numeric DEFAULT '0.15',
	"territory" text,
	"monthly_target" numeric,
	"total_sales" numeric DEFAULT '0',
	"status" "user_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_user_id" text NOT NULL,
	"user_type" "user_type" DEFAULT 'customer' NOT NULL,
	"first_name" text,
	"last_name" text,
	"email" text NOT NULL,
	"phone" text,
	"preferred_language" text DEFAULT 'en',
	"status" "user_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_profiles_clerk_user_id_unique" UNIQUE("clerk_user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "activities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"operator_id" uuid NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"short_description" text,
	"category" "activity_category" NOT NULL,
	"location" text NOT NULL,
	"meeting_point" text,
	"duration_minutes" integer NOT NULL,
	"max_participants" integer NOT NULL,
	"min_participants" integer DEFAULT 1,
	"min_age" integer,
	"max_age" integer,
	"included_items" text[],
	"excluded_items" text[],
	"what_to_bring" text[],
	"cancellation_policy" text,
	"safety_requirements" text,
	"weather_dependent" boolean DEFAULT false,
	"instant_confirmation" boolean DEFAULT true,
	"status" "activity_status" DEFAULT 'draft' NOT NULL,
	"featured" boolean DEFAULT false,
	"avg_rating" numeric DEFAULT '0',
	"total_reviews" integer DEFAULT 0,
	"total_bookings" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "activities_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "activity_add_ons" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"activity_id" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"price" numeric NOT NULL,
	"currency" text DEFAULT 'EUR',
	"is_required" boolean DEFAULT false,
	"is_available" boolean DEFAULT true,
	"max_quantity" integer DEFAULT 1,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "activity_availability" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"activity_id" uuid NOT NULL,
	"date" date NOT NULL,
	"time_slot" time,
	"max_capacity" integer NOT NULL,
	"available_spots" integer NOT NULL,
	"price_override" numeric,
	"status" "availability_status" DEFAULT 'available' NOT NULL,
	"weather_status" "weather_status" DEFAULT 'good',
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "activity_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"activity_id" uuid NOT NULL,
	"image_url" text NOT NULL,
	"alt_text" text,
	"caption" text,
	"is_primary" boolean DEFAULT false,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "activity_pricing" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"activity_id" uuid NOT NULL,
	"price_type" "price_type" NOT NULL,
	"base_price" numeric NOT NULL,
	"seasonal_multiplier" numeric DEFAULT '1.0',
	"currency" text DEFAULT 'EUR',
	"valid_from" date,
	"valid_until" date,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "booking_add_ons" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"booking_id" uuid NOT NULL,
	"add_on_id" uuid NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"unit_price" numeric NOT NULL,
	"total_price" numeric NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "bookings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"booking_reference" text NOT NULL,
	"activity_id" uuid NOT NULL,
	"customer_id" uuid NOT NULL,
	"salesperson_id" uuid,
	"booking_date" date NOT NULL,
	"booking_time" time,
	"adults" integer DEFAULT 1 NOT NULL,
	"children" integer DEFAULT 0 NOT NULL,
	"seniors" integer DEFAULT 0 NOT NULL,
	"total_participants" integer NOT NULL,
	"subtotal" numeric NOT NULL,
	"tax_amount" numeric DEFAULT '0',
	"service_fee" numeric DEFAULT '0',
	"total_amount" numeric NOT NULL,
	"currency" text DEFAULT 'EUR',
	"paid_amount" numeric DEFAULT '0',
	"lead_customer_name" text NOT NULL,
	"lead_customer_email" text NOT NULL,
	"lead_customer_phone" text,
	"emergency_contact" text,
	"special_requirements" text,
	"participant_names" text[],
	"status" "booking_status" DEFAULT 'pending' NOT NULL,
	"is_deposit_only" boolean DEFAULT false,
	"deposit_amount" numeric,
	"remaining_balance" numeric DEFAULT '0',
	"cancellation_reason" text,
	"confirmation_sent_at" timestamp,
	"reminder_sent_at" timestamp,
	"check_in_time" timestamp,
	"completed_at" timestamp,
	"cancelled_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "bookings_booking_reference_unique" UNIQUE("booking_reference")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "commissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"booking_id" uuid NOT NULL,
	"salesperson_id" uuid,
	"booking_amount" numeric NOT NULL,
	"platform_commission_rate" numeric NOT NULL,
	"platform_commission_amount" numeric NOT NULL,
	"salesperson_commission_rate" numeric,
	"salesperson_commission_amount" numeric DEFAULT '0',
	"operator_amount" numeric NOT NULL,
	"status" "commission_status" DEFAULT 'pending' NOT NULL,
	"calculated_at" timestamp,
	"paid_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"booking_id" uuid NOT NULL,
	"stripe_payment_intent_id" text,
	"payment_method" "payment_method" NOT NULL,
	"amount" numeric NOT NULL,
	"currency" text DEFAULT 'EUR',
	"status" "payment_status" DEFAULT 'pending' NOT NULL,
	"transaction_id" text,
	"failure_reason" text,
	"refund_amount" numeric DEFAULT '0',
	"refund_reason" text,
	"paid_at" timestamp,
	"refunded_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "payments_stripe_payment_intent_id_unique" UNIQUE("stripe_payment_intent_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"booking_id" uuid NOT NULL,
	"customer_id" uuid NOT NULL,
	"activity_id" uuid NOT NULL,
	"rating" integer NOT NULL,
	"title" text,
	"comment" text,
	"pros" text,
	"cons" text,
	"would_recommend" boolean DEFAULT true,
	"is_verified" boolean DEFAULT true,
	"is_published" boolean DEFAULT true,
	"helpful_votes" integer DEFAULT 0,
	"operator_response" text,
	"operator_response_date" timestamp,
	"photo_urls" text[],
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "operators" ADD CONSTRAINT "operators_user_id_users_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users_profiles"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "salespeople" ADD CONSTRAINT "salespeople_user_id_users_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users_profiles"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "activities" ADD CONSTRAINT "activities_operator_id_operators_id_fk" FOREIGN KEY ("operator_id") REFERENCES "public"."operators"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "activity_add_ons" ADD CONSTRAINT "activity_add_ons_activity_id_activities_id_fk" FOREIGN KEY ("activity_id") REFERENCES "public"."activities"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "activity_availability" ADD CONSTRAINT "activity_availability_activity_id_activities_id_fk" FOREIGN KEY ("activity_id") REFERENCES "public"."activities"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "activity_images" ADD CONSTRAINT "activity_images_activity_id_activities_id_fk" FOREIGN KEY ("activity_id") REFERENCES "public"."activities"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "activity_pricing" ADD CONSTRAINT "activity_pricing_activity_id_activities_id_fk" FOREIGN KEY ("activity_id") REFERENCES "public"."activities"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "booking_add_ons" ADD CONSTRAINT "booking_add_ons_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "booking_add_ons" ADD CONSTRAINT "booking_add_ons_add_on_id_activity_add_ons_id_fk" FOREIGN KEY ("add_on_id") REFERENCES "public"."activity_add_ons"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bookings" ADD CONSTRAINT "bookings_activity_id_activities_id_fk" FOREIGN KEY ("activity_id") REFERENCES "public"."activities"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bookings" ADD CONSTRAINT "bookings_customer_id_users_profiles_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."users_profiles"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bookings" ADD CONSTRAINT "bookings_salesperson_id_salespeople_id_fk" FOREIGN KEY ("salesperson_id") REFERENCES "public"."salespeople"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "commissions" ADD CONSTRAINT "commissions_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "commissions" ADD CONSTRAINT "commissions_salesperson_id_salespeople_id_fk" FOREIGN KEY ("salesperson_id") REFERENCES "public"."salespeople"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "payments" ADD CONSTRAINT "payments_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reviews" ADD CONSTRAINT "reviews_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reviews" ADD CONSTRAINT "reviews_customer_id_users_profiles_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."users_profiles"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reviews" ADD CONSTRAINT "reviews_activity_id_activities_id_fk" FOREIGN KEY ("activity_id") REFERENCES "public"."activities"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
