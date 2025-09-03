import { Migration } from '@mikro-orm/migrations';

export class Migration20250831181308 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "pokemon" ("id" serial primary key, "name" varchar(255) not null);`);
    this.addSql(`alter table "pokemon" add constraint "pokemon_name_unique" unique ("name");`);
  }

}
