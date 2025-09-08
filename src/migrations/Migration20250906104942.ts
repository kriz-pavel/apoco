import { Migration } from '@mikro-orm/migrations';

export class Migration20250905144629 extends Migration {
  override async up(): Promise<void> {
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

    this.addSql(
      `alter table "pokemon" add column "classification_id" int, add column "weight_max" numeric(5,2) not null default 0, add column "weight_min" numeric(5,2) not null default 0, add column "height_max" numeric(5,2) not null default 0, add column "height_min" numeric(5,2) not null default 0, add column "flee_rate" numeric(3,2) not null default 0, add column "max_cp" int not null default 0, add column "max_hp" int not null default 0, add column "is_legendary" boolean not null default false, add column "is_mythical" boolean not null default false, add column "common_capture_area" varchar(255) null, add column "created_at" timestamptz not null default now(), add column "updated_at" timestamptz not null default now();`,
    );
    this.addSql(
      `alter table "pokemon" add constraint "pokemon_classification_id_foreign" foreign key ("classification_id") references "classification" ("id") on update cascade;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "pokemon_weaknesses" cascade;`);

    this.addSql(`drop table if exists "pokemon_types" cascade;`);

    this.addSql(`drop table if exists "pokemon_resistant" cascade;`);

    this.addSql(
      `alter table "pokemon" drop constraint "pokemon_classification_id_foreign";`,
    );

    this.addSql(
      `alter table "pokemon" drop column "classification_id", drop column "weight_max", drop column "weight_min", drop column "height_max", drop column "height_min", drop column "flee_rate", drop column "max_cp", drop column "max_hp", drop column "is_legendary", drop column "is_mythical", drop column "common_capture_area", drop column "created_at", drop column "updated_at";`,
    );

    this.addSql(
      `alter table "pokemon" drop constraint "pokemon_classification_id_foreign";`,
    );
  }
}
