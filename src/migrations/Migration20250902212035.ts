import { Migration } from '@mikro-orm/migrations';

export class Migration20250902212035 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`alter table "pokemon_type" add column "slug" varchar(255)`);
    this.addSql(`
      update "pokemon_type" p
      set "slug" = lower(regexp_replace(p."name", '\\s+', '-', 'g'));
    `);
    this.addSql('alter table "pokemon_type" alter column "slug" set not null;');
    this.addSql(
      `create index "pokemon_type_slug_index" on "pokemon_type" ("slug");`,
    );
    this.addSql(
      `alter table "pokemon_type" add constraint "pokemon_type_slug_unique" unique ("slug");`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(`drop index "pokemon_type_slug_index";`);
    this.addSql(
      `alter table "pokemon_type" drop constraint "pokemon_type_slug_unique";`,
    );
    this.addSql(`alter table "pokemon_type" drop column "slug";`);
  }
}
