import { relations } from "drizzle-orm";
import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const userTable = pgTable("users", {
	id: uuid().primaryKey().defaultRandom(),
	name: text().notNull(),
});

export const categoryTable = pgTable("categories", {
	id: uuid().primaryKey().defaultRandom(),
	name: text().notNull(),
	slug: text().notNull().unique(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const categoryRelations = relations(categoryTable, ({ many }) => {
	return {
		products: many(productTable),
	}
});

export const productTable = pgTable("products", {
	id: uuid().primaryKey().defaultRandom(),
	categoryId: uuid("category_id").notNull().references(() => categoryTable.id),
	name: text().notNull(),
	slug: text().notNull().unique(),
	description: text().notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const productVariantTable = pgTable("product_variants", {
	id: uuid().primaryKey().defaultRandom(),
	productId: uuid("product_id").notNull().references(() => productTable.id),
	name: text().notNull(),
	slug: text().notNull().unique(),
	priceInCents: integer("price_in_cents").notNull(),
	color: text().notNull(),
	imageUrl: text("image_url").notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const productRelations = relations(productTable, ({ one, many }) => {
	return {
		category: one(categoryTable, {
			fields: [productTable.categoryId],
			references: [categoryTable.id],
		}),
		variants: many(productVariantTable),
	}
});

export const productVariantsRelations = relations(productVariantTable, ({ one }) => {
	return {
		category: one(productTable, {
			fields: [productVariantTable.productId],
			references: [productTable.id],
		}),
	}
});