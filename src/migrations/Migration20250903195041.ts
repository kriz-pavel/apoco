import { Migration } from '@mikro-orm/migrations';

export class Migration20250903195041 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "candy" ("id" serial primary key, "name" varchar(255) not null);`);
    this.addSql(`alter table "candy" add constraint "candy_name_unique" unique ("name");`);

    this.addSql(`alter table "pokemon_type" alter column "slug" drop default;`);
    this.addSql(`alter table "pokemon_type" alter column "slug" type varchar(255) using ("slug"::varchar(255));`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "candy" cascade;`);

    this.addSql(`alter table "pokemon_type" alter column "slug" type varchar(255) using ("slug"::varchar(255));`);
    this.addSql(`alter table "pokemon_type" alter column "slug" set default '';`);
  }

}
