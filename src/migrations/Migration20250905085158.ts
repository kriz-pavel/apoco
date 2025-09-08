import { Migration } from '@mikro-orm/migrations';

export class Migration20250905085158 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "attack" alter column "created_at" type timestamptz using ("created_at"::timestamptz);`);
    this.addSql(`alter table "attack" alter column "created_at" set default now();`);
    this.addSql(`alter table "attack" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);`);
    this.addSql(`alter table "attack" alter column "updated_at" set default now();`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "attack" alter column "created_at" drop default;`);
    this.addSql(`alter table "attack" alter column "created_at" type timestamptz using ("created_at"::timestamptz);`);
    this.addSql(`alter table "attack" alter column "updated_at" drop default;`);
    this.addSql(`alter table "attack" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);`);
  }

}
