import { Migration } from '@mikro-orm/migrations';

export class Migration20250903202636 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "classification" ("id" serial primary key, "name" varchar(255) not null);`);
    this.addSql(`alter table "classification" add constraint "classification_name_unique" unique ("name");`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "classification" cascade;`);
  }

}
