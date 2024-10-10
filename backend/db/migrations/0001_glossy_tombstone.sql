ALTER TABLE "users" ADD COLUMN "level" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "day_quest_tasks" ADD CONSTRAINT "day_quest_tasks_category_id_day_quest_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."day_quest_categories"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
