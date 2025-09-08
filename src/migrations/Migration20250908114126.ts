import { Migration } from '@mikro-orm/migrations';

export class Migration20250908114126 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table "attack_pokemon" ("attack_id" int not null, "pokemon_id" int not null, constraint "attack_pokemon_pkey" primary key ("attack_id", "pokemon_id"));`,
    );

    this.addSql(
      `alter table "attack_pokemon" add constraint "attack_pokemon_attack_id_foreign" foreign key ("attack_id") references "attack" ("id") on update cascade on delete cascade;`,
    );
    this.addSql(
      `alter table "attack_pokemon" add constraint "attack_pokemon_pokemon_id_foreign" foreign key ("pokemon_id") references "pokemon" ("id") on update cascade on delete cascade;`,
    );

    this.addSql(
      `alter table "pokemon" drop constraint "pokemon_classification_id_foreign";`,
    );

    this.addSql(
      `alter table "pokemon" alter column "classification_id" type int using ("classification_id"::int);`,
    );
    this.addSql(
      `alter table "pokemon" alter column "classification_id" set not null;`,
    );
    this.addSql(
      `alter table "pokemon" alter column "height_max" type smallint using ("height_max"::smallint);`,
    );
    this.addSql(
      `alter table "pokemon" alter column "height_min" type smallint using ("height_min"::smallint);`,
    );
    this.addSql(
      `alter table "pokemon" alter column "max_cp" type smallint using ("max_cp"::smallint);`,
    );
    this.addSql(
      `alter table "pokemon" alter column "max_hp" type smallint using ("max_hp"::smallint);`,
    );
    this.addSql(
      `alter table "pokemon" add constraint "pokemon_classification_id_foreign" foreign key ("classification_id") references "classification" ("id") on update cascade;`,
    );
    this.addSql(`create index "pokemon_name_index" on "pokemon" ("name");`);
    this.addSql(
      `alter table "pokemon" add constraint pokemon_pokedex_id_check check(pokedex_id > 0);`,
    );
    this.addSql(
      `alter table "pokemon" add constraint pokemon_weight_max_check check(weight_max >= weight_min and weight_min > 0);`,
    );
    this.addSql(
      `alter table "pokemon" add constraint pokemon_weight_min_check check(weight_max >= weight_min and weight_min > 0);`,
    );
    this.addSql(
      `alter table "pokemon" add constraint pokemon_height_max_check check(height_max >= height_min and height_min > 0);`,
    );
    this.addSql(
      `alter table "pokemon" add constraint pokemon_height_min_check check(height_max >= height_min and height_min > 0);`,
    );
    this.addSql(
      `alter table "pokemon" add constraint pokemon_max_cp_check check(max_cp > 0);`,
    );
    this.addSql(
      `alter table "pokemon" add constraint pokemon_max_hp_check check(max_hp > 0);`,
    );

    this.addSql(
      `alter table "attack" alter column "damage" type smallint using ("damage"::smallint);`,
    );
    this.addSql(
      `alter table "attack" add constraint attack_damage_check check(damage >= 0);`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "attack_pokemon" cascade;`);

    this.addSql(
      `alter table "pokemon" drop constraint "pokemon_classification_id_foreign";`,
    );

    this.addSql(`drop index "pokemon_name_index";`);
    this.addSql(
      `alter table "pokemon" drop constraint pokemon_pokedex_id_check;`,
    );
    this.addSql(
      `alter table "pokemon" drop constraint pokemon_weight_max_check;`,
    );
    this.addSql(
      `alter table "pokemon" drop constraint pokemon_weight_min_check;`,
    );
    this.addSql(
      `alter table "pokemon" drop constraint pokemon_height_max_check;`,
    );
    this.addSql(
      `alter table "pokemon" drop constraint pokemon_height_min_check;`,
    );
    this.addSql(`alter table "pokemon" drop constraint pokemon_max_cp_check;`);
    this.addSql(`alter table "pokemon" drop constraint pokemon_max_hp_check;`);

    this.addSql(
      `alter table "pokemon" alter column "classification_id" type int using ("classification_id"::int);`,
    );
    this.addSql(
      `alter table "pokemon" alter column "classification_id" drop not null;`,
    );
    this.addSql(
      `alter table "pokemon" alter column "height_max" type int using ("height_max"::int);`,
    );
    this.addSql(
      `alter table "pokemon" alter column "height_min" type int using ("height_min"::int);`,
    );
    this.addSql(
      `alter table "pokemon" alter column "max_cp" type int using ("max_cp"::int);`,
    );
    this.addSql(
      `alter table "pokemon" alter column "max_hp" type int using ("max_hp"::int);`,
    );
    this.addSql(
      `alter table "pokemon" add constraint "pokemon_classification_id_foreign" foreign key ("classification_id") references "classification" ("id") on update cascade on delete set null;`,
    );

    this.addSql(`alter table "attack" drop constraint attack_damage_check;`);

    this.addSql(
      `alter table "attack" alter column "damage" type int using ("damage"::int);`,
    );
  }
}
