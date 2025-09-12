import { Migration } from '@mikro-orm/migrations';

export class Migration20250911200400 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "favorite_pokemon" ("id" serial primary key, "pokemon_id" int not null, "user_id" int not null);`);
    this.addSql(`create index "favorite_pokemon_pokemon_id_index" on "favorite_pokemon" ("pokemon_id");`);
    this.addSql(`create index "favorite_pokemon_user_id_index" on "favorite_pokemon" ("user_id");`);
    this.addSql(`alter table "favorite_pokemon" add constraint "favorite_pokemon_user_id_pokemon_id_unique" unique ("user_id", "pokemon_id");`);

    this.addSql(`alter table "favorite_pokemon" add constraint "favorite_pokemon_pokemon_id_foreign" foreign key ("pokemon_id") references "pokemon" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "favorite_pokemon" add constraint "favorite_pokemon_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;`);

    this.addSql(`drop table if exists "pokemon_user_pivot" cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`create table "pokemon_user_pivot" ("user_id" int not null, "pokemon_id" int not null, constraint "pokemon_user_pivot_pkey" primary key ("user_id", "pokemon_id"));`);

    this.addSql(`alter table "pokemon_user_pivot" add constraint "pokemon_user_pivot_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "pokemon_user_pivot" add constraint "pokemon_user_pivot_pokemon_id_foreign" foreign key ("pokemon_id") references "pokemon" ("id") on update cascade on delete cascade;`);

    this.addSql(`drop table if exists "favorite_pokemon" cascade;`);
  }

}
