import { Migration } from '@mikro-orm/migrations';

export class Migration20250908142735 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "evolution" ("id" serial primary key, "from_pokemon_id" int not null, "to_pokemon_id" int not null, "candy_id" int not null, "candy_amount" smallint not null);`);
    this.addSql(`create index "evolution_from_pokemon_id_index" on "evolution" ("from_pokemon_id");`);
    this.addSql(`alter table "evolution" add constraint "evolution_from_pokemon_id_unique" unique ("from_pokemon_id");`);
    this.addSql(`create index "evolution_to_pokemon_id_index" on "evolution" ("to_pokemon_id");`);
    this.addSql(`alter table "evolution" add constraint "evolution_to_pokemon_id_unique" unique ("to_pokemon_id");`);

    this.addSql(`alter table "evolution" add constraint "evolution_from_pokemon_id_foreign" foreign key ("from_pokemon_id") references "pokemon" ("id") on update cascade;`);
    this.addSql(`alter table "evolution" add constraint "evolution_to_pokemon_id_foreign" foreign key ("to_pokemon_id") references "pokemon" ("id") on update cascade;`);
    this.addSql(`alter table "evolution" add constraint "evolution_candy_id_foreign" foreign key ("candy_id") references "candy" ("id") on update cascade;`);

    this.addSql(`alter table "attack" drop constraint attack_damage_check;`);

    this.addSql(`alter table "attack" add constraint attack_damage_check check(damage >= 0);`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "evolution" cascade;`);

    this.addSql(`alter table "attack" drop constraint attack_damage_check;`);

    this.addSql(`alter table "attack" add constraint attack_damage_check check(damage => 0);`);
  }

}
