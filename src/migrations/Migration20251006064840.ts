import { Migration } from '@mikro-orm/migrations';

export class Migration20251006064840 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table "pokemon" drop column "is_legendary", drop column "is_mythical";`,
    );

    this.addSql(
      `alter table "pokemon" add column "rarity" text check ("rarity" in ('basic', 'mythic', 'legendary')) not null;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "pokemon" drop column "rarity";`);

    this.addSql(
      `alter table "pokemon" add column "is_legendary" boolean not null, add column "is_mythical" boolean not null;`,
    );
  }
}
