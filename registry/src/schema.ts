// import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';
import type { InferInsertModel, InferSelectModel, InferSelectViewModel } from 'drizzle-orm'
import { customType, sqliteTable, text } from 'drizzle-orm/sqlite-core'


export type TrackedReposInsert = InferInsertModel<typeof modules>
export type TrackedReposSelect = InferSelectModel<typeof modules>

export enum Provider {
  GitHub = "github"
}

export enum ModuleOrigin {
  // Official = "official", /** not supported via api */
  Community = "community"
}

const provider = customType<{ data: Provider; }>(
  {
    dataType() {
      return 'text';
    },
  },
);

const origin = customType<{ data: ModuleOrigin; }>(
  {
    dataType() {
      return 'text';
    },
  },
);

export const modules = sqliteTable('modules', {
  name: text('name').notNull(),
  description: text('description'),
  tags: text('tags'),
  moduleId: text('module_id').unique().notNull(),
  semver: text('version').notNull(),
  iteration: text('version').notNull(),
  repoName: text('repo_name').notNull(),
  owner: text('owner').notNull(),
  provider: provider("provider").notNull(),
  origin: origin("module_origin").notNull()
});