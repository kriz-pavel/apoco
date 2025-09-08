import { Migration } from '@mikro-orm/migrations';

export class Migration20250905083055 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "attack" ("id" serial primary key, "type_id" int not null, "name" varchar(255) not null, "damage" int not null, "category" text check ("category" in ('fast', 'special')) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null);`);
    this.addSql(`alter table "attack" add constraint "attack_name_unique" unique ("name");`);

    this.addSql(`alter table "attack" add constraint "attack_type_id_foreign" foreign key ("type_id") references "pokemon_type" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "attack" cascade;`);
  }

}
