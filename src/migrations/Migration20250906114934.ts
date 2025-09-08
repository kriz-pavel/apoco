import { Migration } from '@mikro-orm/migrations';

export class Migration20250906114934 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "pokemon" alter column "weight_max" type numeric(10,0) using ("weight_max"::numeric(10,0));`);
    this.addSql(`alter table "pokemon" alter column "weight_min" type numeric(10,0) using ("weight_min"::numeric(10,0));`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "pokemon" alter column "weight_max" type numeric(6,2) using ("weight_max"::numeric(6,2));`);
    this.addSql(`alter table "pokemon" alter column "weight_min" type numeric(6,2) using ("weight_min"::numeric(6,2));`);
  }

}
