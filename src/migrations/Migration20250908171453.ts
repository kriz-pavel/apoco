import { Migration } from '@mikro-orm/migrations';

export class Migration20250908171453 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "evolution" drop constraint "evolution_from_pokemon_id_foreign";`);
    this.addSql(`alter table "evolution" drop constraint "evolution_to_pokemon_id_foreign";`);

    this.addSql(`alter table "evolution" add constraint "evolution_from_pokemon_id_foreign" foreign key ("from_pokemon_id") references "pokemon" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "evolution" add constraint "evolution_to_pokemon_id_foreign" foreign key ("to_pokemon_id") references "pokemon" ("id") on update cascade on delete cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "evolution" drop constraint "evolution_from_pokemon_id_foreign";`);
    this.addSql(`alter table "evolution" drop constraint "evolution_to_pokemon_id_foreign";`);

    this.addSql(`alter table "evolution" add constraint "evolution_from_pokemon_id_foreign" foreign key ("from_pokemon_id") references "pokemon" ("id") on update cascade;`);
    this.addSql(`alter table "evolution" add constraint "evolution_to_pokemon_id_foreign" foreign key ("to_pokemon_id") references "pokemon" ("id") on update cascade;`);
  }

}
