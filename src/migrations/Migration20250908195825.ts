import { Migration } from '@mikro-orm/migrations';

export class Migration20250908195825 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "evolution" drop constraint "evolution_from_pokemon_id_unique";`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "evolution" add constraint "evolution_from_pokemon_id_unique" unique ("from_pokemon_id");`);
  }

}
