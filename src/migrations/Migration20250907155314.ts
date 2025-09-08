import { Migration } from '@mikro-orm/migrations';

export class Migration20250907155314 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table "pokemon_type_pokemon" ("pokemon_type_id" int not null, "pokemon_id" int not null, constraint "pokemon_type_pokemon_pkey" primary key ("pokemon_type_id", "pokemon_id"));`,
    );

    this.addSql(
      `alter table "pokemon_type_pokemon" add constraint "pokemon_type_pokemon_pokemon_type_id_foreign" foreign key ("pokemon_type_id") references "pokemon_type" ("id") on update cascade on delete cascade;`,
    );
    this.addSql(
      `alter table "pokemon_type_pokemon" add constraint "pokemon_type_pokemon_pokemon_id_foreign" foreign key ("pokemon_id") references "pokemon" ("id") on update cascade on delete cascade;`,
    );

    this.addSql(`drop table if exists "pokemon_weaknesses" cascade;`);

    this.addSql(`drop table if exists "pokemon_types" cascade;`);

    this.addSql(`drop table if exists "pokemon_resistant" cascade;`);

    this.addSql(`alter table "pokemon" add column "pokedex_id" smallint;`);
    this.addSql(
      `create index "pokemon_pokedex_id_index" on "pokemon" ("pokedex_id");`,
    );
    this.addSql(
      `alter table "pokemon" add constraint "pokemon_pokedex_id_unique" unique ("pokedex_id");`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(
      `create table "pokemon_weaknesses" ("pokemon_id" int not null, "pokemon_type_id" int not null, constraint "pokemon_weaknesses_pkey" primary key ("pokemon_id", "pokemon_type_id"));`,
    );

    this.addSql(
      `create table "pokemon_types" ("pokemon_id" int not null, "pokemon_type_id" int not null, constraint "pokemon_types_pkey" primary key ("pokemon_id", "pokemon_type_id"));`,
    );

    this.addSql(
      `create table "pokemon_resistant" ("pokemon_id" int not null, "pokemon_type_id" int not null, constraint "pokemon_resistant_pkey" primary key ("pokemon_id", "pokemon_type_id"));`,
    );

    this.addSql(
      `alter table "pokemon_weaknesses" add constraint "pokemon_weaknesses_pokemon_id_foreign" foreign key ("pokemon_id") references "pokemon" ("id") on update cascade on delete cascade;`,
    );
    this.addSql(
      `alter table "pokemon_weaknesses" add constraint "pokemon_weaknesses_pokemon_type_id_foreign" foreign key ("pokemon_type_id") references "pokemon_type" ("id") on update cascade on delete cascade;`,
    );

    this.addSql(
      `alter table "pokemon_types" add constraint "pokemon_types_pokemon_id_foreign" foreign key ("pokemon_id") references "pokemon" ("id") on update cascade on delete cascade;`,
    );
    this.addSql(
      `alter table "pokemon_types" add constraint "pokemon_types_pokemon_type_id_foreign" foreign key ("pokemon_type_id") references "pokemon_type" ("id") on update cascade on delete cascade;`,
    );

    this.addSql(
      `alter table "pokemon_resistant" add constraint "pokemon_resistant_pokemon_id_foreign" foreign key ("pokemon_id") references "pokemon" ("id") on update cascade on delete cascade;`,
    );
    this.addSql(
      `alter table "pokemon_resistant" add constraint "pokemon_resistant_pokemon_type_id_foreign" foreign key ("pokemon_type_id") references "pokemon_type" ("id") on update cascade on delete cascade;`,
    );

    this.addSql(`drop table if exists "pokemon_type_pokemon" cascade;`);

    this.addSql(`drop index "pokemon_pokedex_id_index";`);
    this.addSql(
      `alter table "pokemon" drop constraint "pokemon_pokedex_id_unique";`,
    );
    this.addSql(`alter table "pokemon" drop column "pokedex_id";`);
  }
}
