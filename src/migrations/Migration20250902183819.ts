import { Migration } from '@mikro-orm/migrations';

export class Migration20250902183819 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "pokemon_type" ("id" serial primary key, "name" varchar(255) not null);`);
    this.addSql(`alter table "pokemon_type" add constraint "pokemon_type_name_unique" unique ("name");`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "pokemon_type" cascade;`);
  }

}
