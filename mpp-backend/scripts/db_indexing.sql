CREATE INDEX CONCURRENTLY "sales_report_index"
ON "sales_report" ("sales_report_id");

CREATE INDEX CONCURRENTLY "product_index"
ON "product" ("product_id");

CREATE INDEX CONCURRENTLY "active_product_index"
ON "active_product" ("active_product_id");

CREATE INDEX CONCURRENTLY "product_verification_index"
ON "product_verification" ("product_verification_id");

CREATE INDEX CONCURRENTLY "partner_index"
ON "partner" ("partner_id");

CREATE INDEX CONCURRENTLY "country_index"
ON "country" ("country_id");

CREATE INDEX CONCURRENTLY "filing_plan_index"
ON "filing_plan" ("filing_plan_id");

CREATE INDEX CONCURRENTLY "product_quarter_index"
ON "product_quarter" ("product_quarter_id");

CREATE INDEX CONCURRENTLY "product_quarter_date_index"
ON "product_quarter_date" ("product_quarter_date_id");

CREATE INDEX CONCURRENTLY "product_notes_index"
ON "product_notes" ("product_notes_id");

CREATE INDEX CONCURRENTLY "template_message_index"
ON "template_message" ("template_message_id");