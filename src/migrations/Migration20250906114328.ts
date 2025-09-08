import { Migration } from '@mikro-orm/migrations';

export class Migration20250906114328 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table "pokemon" drop constraint "pokemon_classification_id_foreign";`,
    );

    this.addSql(
      `alter table "pokemon" alter column "classification_id" type int using ("classification_id"::int);`,
    );
    this.addSql(
      `alter table "pokemon" alter column "classification_id" drop not null;`,
    );
    this.addSql(
      `alter table "pokemon" alter column "weight_max" type numeric(6,2) using ("weight_max"::numeric(6,2));`,
    );
    this.addSql(
      `alter table "pokemon" alter column "weight_min" type numeric(6,2) using ("weight_min"::numeric(6,2));`,
    );
    this.addSql(
      `alter table "pokemon" alter column "height_max" type numeric(4,2) using ("height_max"::numeric(4,2));`,
    );
    this.addSql(
      `alter table "pokemon" alter column "height_min" type numeric(4,2) using ("height_min"::numeric(4,2));`,
    );
    this.addSql(
      `alter table "pokemon" add constraint "pokemon_classification_id_foreign" foreign key ("classification_id") references "classification" ("id") on update cascade on delete set null;`,
    );
  }

  override async down(): Promise<void> {
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
      `alter table "pokemon" alter column "weight_max" type numeric(5,2) using ("weight_max"::numeric(5,2));`,
    );
    this.addSql(
      `alter table "pokemon" alter column "weight_min" type numeric(5,2) using ("weight_min"::numeric(5,2));`,
    );
    this.addSql(
      `alter table "pokemon" alter column "height_max" type numeric(5,2) using ("height_max"::numeric(5,2));`,
    );
    this.addSql(
      `alter table "pokemon" alter column "height_min" type numeric(5,2) using ("height_min"::numeric(5,2));`,
    );
    this.addSql(
      `alter table "pokemon" add constraint "pokemon_classification_id_foreign" foreign key ("classification_id") references "classification" ("id") on update cascade;`,
    );
  }
}
