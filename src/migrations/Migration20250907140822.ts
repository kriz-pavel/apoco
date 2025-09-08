import { Migration } from '@mikro-orm/migrations';

export class Migration20250907140822 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "pokemon" alter column "weight_max" type int using ("weight_max"::int);`);
    this.addSql(`alter table "pokemon" alter column "weight_min" type int using ("weight_min"::int);`);
    this.addSql(`alter table "pokemon" alter column "height_max" type int using ("height_max"::int);`);
    this.addSql(`alter table "pokemon" alter column "height_min" type int using ("height_min"::int);`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "pokemon" alter column "weight_max" type numeric(10,0) using ("weight_max"::numeric(10,0));`);
    this.addSql(`alter table "pokemon" alter column "weight_min" type numeric(10,0) using ("weight_min"::numeric(10,0));`);
    this.addSql(`alter table "pokemon" alter column "height_max" type numeric(10,0) using ("height_max"::numeric(10,0));`);
    this.addSql(`alter table "pokemon" alter column "height_min" type numeric(10,0) using ("height_min"::numeric(10,0));`);
  }

}
