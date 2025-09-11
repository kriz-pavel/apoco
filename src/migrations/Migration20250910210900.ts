import { Migration } from '@mikro-orm/migrations';

export class Migration20250910210900 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "user" ("id" serial primary key, "email" varchar(255) not null, "name" varchar(255) not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now());`);
    this.addSql(`alter table "user" add constraint "user_email_unique" unique ("email");`);

    this.addSql(`create table "token" ("id" serial primary key, "token_hash" varchar(255) not null, "user_id" int not null, "expires_at" timestamptz not null, "is_revoked" boolean not null default false, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now());`);
    this.addSql(`alter table "token" add constraint "token_token_hash_unique" unique ("token_hash");`);

    this.addSql(`create table "pokemon_user_pivot" ("user_id" int not null, "pokemon_id" int not null, constraint "pokemon_user_pivot_pkey" primary key ("user_id", "pokemon_id"));`);

    this.addSql(`alter table "token" add constraint "token_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);

    this.addSql(`alter table "pokemon_user_pivot" add constraint "pokemon_user_pivot_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "pokemon_user_pivot" add constraint "pokemon_user_pivot_pokemon_id_foreign" foreign key ("pokemon_id") references "pokemon" ("id") on update cascade on delete cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "token" drop constraint "token_user_id_foreign";`);

    this.addSql(`alter table "pokemon_user_pivot" drop constraint "pokemon_user_pivot_user_id_foreign";`);

    this.addSql(`drop table if exists "user" cascade;`);

    this.addSql(`drop table if exists "token" cascade;`);

    this.addSql(`drop table if exists "pokemon_user_pivot" cascade;`);
  }

}
