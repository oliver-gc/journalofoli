import { relations } from 'drizzle-orm';
import { boolean, jsonb, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

// src/db/schema.ts
export { account, accountRelations, session, sessionRelations, user, userRelations, verification } from '@/db/auth-schema';


export const topic = pgTable("topic", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    color: varchar("color").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => /* @__PURE__ */ new Date()).notNull(),
    isActive: boolean("is_active").default(true).notNull()
})

export const post = pgTable("post", {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    content: jsonb("content").notNull(),
    topicId: uuid("topic_id").references(() => topic.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => /* @__PURE__ */ new Date()).notNull(),
    isActive: boolean("is_active").default(true).notNull()
})

export const topicRelations = relations(topic, ({ many }) => ({
    posts: many(post)
}))

export const postRelations = relations(post, ({ one }) => ({
    topic: one(topic, {
        fields: [post.topicId],
        references: [topic.id]
    })
}))