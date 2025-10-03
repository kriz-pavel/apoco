import { Migration } from '@mikro-orm/migrations';

export class Migration20251002185521 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "pokemon" drop constraint "pokemon_classification_id_foreign";`);

    this.addSql(`alter table "evolution" drop constraint "evolution_candy_id_foreign";`);

    this.addSql(`alter table "pokemon_weaknesses" drop constraint "pokemon_weaknesses_type_id_foreign";`);

    this.addSql(`alter table "pokemon_types_pivot" drop constraint "pokemon_types_pivot_type_id_foreign";`);

    this.addSql(`alter table "pokemon_resistant" drop constraint "pokemon_resistant_type_id_foreign";`);

    this.addSql(`alter table "attack" drop constraint "attack_type_id_foreign";`);

    this.addSql(`alter table "attack_pokemon" drop constraint "attack_pokemon_attack_id_foreign";`);

    this.addSql(`alter table "candy" add column "created_at" timestamptz not null default now(), add column "updated_at" timestamptz not null default now();`);
    this.addSql(`alter table "candy" alter column "id" type smallint using ("id"::smallint);`);

    this.addSql(`alter table "classification" add column "created_at" timestamptz not null default now(), add column "updated_at" timestamptz not null default now();`);
    this.addSql(`alter table "classification" alter column "id" type smallint using ("id"::smallint);`);

    this.addSql(`drop index "pokemon_pokedex_id_index";`);
    this.addSql(`drop index "pokemon_name_index";`);

    this.addSql(`alter table "pokemon" alter column "classification_id" type smallint using ("classification_id"::smallint);`);
    this.addSql(`alter table "pokemon" add constraint "pokemon_classification_id_foreign" foreign key ("classification_id") references "classification" ("id") on update cascade;`);

    this.addSql(`drop index "evolution_to_pokemon_id_index";`);

    this.addSql(`alter table "evolution" add column "created_at" timestamptz not null default now();`);
    this.addSql(`alter table "evolution" alter column "candy_id" type smallint using ("candy_id"::smallint);`);
    this.addSql(`alter table "evolution" add constraint "evolution_candy_id_foreign" foreign key ("candy_id") references "candy" ("id") on update cascade;`);

    this.addSql(`drop index "pokemon_type_slug_index";`);

    this.addSql(`alter table "pokemon_type" alter column "id" type smallint using ("id"::smallint);`);

    this.addSql(`alter table "pokemon_weaknesses" alter column "type_id" type smallint using ("type_id"::smallint);`);
    this.addSql(`alter table "pokemon_weaknesses" add constraint "pokemon_weaknesses_type_id_foreign" foreign key ("type_id") references "pokemon_type" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "pokemon_types_pivot" alter column "type_id" type smallint using ("type_id"::smallint);`);
    this.addSql(`alter table "pokemon_types_pivot" add constraint "pokemon_types_pivot_type_id_foreign" foreign key ("type_id") references "pokemon_type" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "pokemon_resistant" alter column "type_id" type smallint using ("type_id"::smallint);`);
    this.addSql(`alter table "pokemon_resistant" add constraint "pokemon_resistant_type_id_foreign" foreign key ("type_id") references "pokemon_type" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "attack" alter column "id" type smallint using ("id"::smallint);`);
    this.addSql(`alter table "attack" alter column "type_id" type smallint using ("type_id"::smallint);`);
    this.addSql(`alter table "attack" add constraint "attack_type_id_foreign" foreign key ("type_id") references "pokemon_type" ("id") on update cascade;`);

    this.addSql(`alter table "attack_pokemon" alter column "attack_id" type smallint using ("attack_id"::smallint);`);
    this.addSql(`alter table "attack_pokemon" add constraint "attack_pokemon_attack_id_foreign" foreign key ("attack_id") references "attack" ("id") on update cascade on delete cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "pokemon" drop constraint "pokemon_classification_id_foreign";`);

    this.addSql(`alter table "evolution" drop constraint "evolution_candy_id_foreign";`);

    this.addSql(`alter table "pokemon_weaknesses" drop constraint "pokemon_weaknesses_type_id_foreign";`);

    this.addSql(`alter table "pokemon_types_pivot" drop constraint "pokemon_types_pivot_type_id_foreign";`);

    this.addSql(`alter table "pokemon_resistant" drop constraint "pokemon_resistant_type_id_foreign";`);

    this.addSql(`alter table "attack" drop constraint "attack_type_id_foreign";`);

    this.addSql(`alter table "attack_pokemon" drop constraint "attack_pokemon_attack_id_foreign";`);

    this.addSql(`alter table "candy" drop column "created_at", drop column "updated_at";`);

    this.addSql(`alter table "candy" alter column "id" type int using ("id"::int);`);

    this.addSql(`alter table "classification" drop column "created_at", drop column "updated_at";`);

    this.addSql(`alter table "classification" alter column "id" type int using ("id"::int);`);

    this.addSql(`alter table "pokemon" alter column "classification_id" type int using ("classification_id"::int);`);
    this.addSql(`alter table "pokemon" add constraint "pokemon_classification_id_foreign" foreign key ("classification_id") references "classification" ("id") on update cascade;`);
    this.addSql(`create index "pokemon_pokedex_id_index" on "pokemon" ("pokedex_id");`);
    this.addSql(`create index "pokemon_name_index" on "pokemon" ("name");`);

    this.addSql(`alter table "evolution" drop column "created_at";`);

    this.addSql(`alter table "evolution" alter column "candy_id" type int using ("candy_id"::int);`);
    this.addSql(`alter table "evolution" add constraint "evolution_candy_id_foreign" foreign key ("candy_id") references "candy" ("id") on update cascade;`);
    this.addSql(`create index "evolution_to_pokemon_id_index" on "evolution" ("to_pokemon_id");`);

    this.addSql(`alter table "pokemon_type" alter column "id" type int using ("id"::int);`);
    this.addSql(`create index "pokemon_type_slug_index" on "pokemon_type" ("slug");`);

    this.addSql(`alter table "pokemon_weaknesses" alter column "type_id" type int using ("type_id"::int);`);
    this.addSql(`alter table "pokemon_weaknesses" add constraint "pokemon_weaknesses_type_id_foreign" foreign key ("type_id") references "pokemon_type" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "pokemon_types_pivot" alter column "type_id" type int using ("type_id"::int);`);
    this.addSql(`alter table "pokemon_types_pivot" add constraint "pokemon_types_pivot_type_id_foreign" foreign key ("type_id") references "pokemon_type" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "pokemon_resistant" alter column "type_id" type int using ("type_id"::int);`);
    this.addSql(`alter table "pokemon_resistant" add constraint "pokemon_resistant_type_id_foreign" foreign key ("type_id") references "pokemon_type" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "attack" alter column "id" type int using ("id"::int);`);
    this.addSql(`alter table "attack" alter column "type_id" type int using ("type_id"::int);`);
    this.addSql(`alter table "attack" add constraint "attack_type_id_foreign" foreign key ("type_id") references "pokemon_type" ("id") on update cascade;`);

    this.addSql(`alter table "attack_pokemon" alter column "attack_id" type int using ("attack_id"::int);`);
    this.addSql(`alter table "attack_pokemon" add constraint "attack_pokemon_attack_id_foreign" foreign key ("attack_id") references "attack" ("id") on update cascade on delete cascade;`);
  }

}
