# 🧩 Pokémon Backend API

The **Pokémon Backend API** is a backend application built with **NestJS** and **TypeScript** that provides a RESTful interface for browsing and managing a Pokémon catalog.

It allows users to:

- 🙍‍♂️ Create a user account with a name and email to get a **bearer token**
- 📜 Retrieve a list of Pokémons with **pagination**, **name search**, and **filtering by type or favorites**
- 🔍 Get detailed information about a Pokémon by **ID** or **name**
- 🧬 Fetch available **Pokémon types**
- ⭐ Mark or unmark Pokémons as **favorites** (per authenticated user)

## ⚙️ Tech Stack

- **NestJS** – modular backend architecture
- **TypeScript** – strong typing and clean code
- **MikroORM + PostgreSQL** – data modeling and persistence
- **Docker** – multistage build setup + docker compose service for e2e tests
- **Swagger (OpenAPI)** – automatic API documentation
- **Jest** – testing framework
- **Zod** – Seed data validation

## 🧱🏗️ Project setup

```bash
$ yarn install
```

## 🚀 Compile and run the project

```bash
docker compose --profile app up
```

The database is persistent and seeded only during the first startup to avoid recreating the user profile every time. If the seed data or database schema has changed, you need to run the seed service manually to refresh the schema and reseed the data.

## 🧪 Run tests

```bash
# unit tests
$ yarn run test

# e2e tests
$ docker compose --profile e2e up
```

## 💡 Ideas: Before Going to Production

What can we implement next?

- **GitHub Actions for CI/CD**
  - Pipelines for PRs and `main`: **type-check**, **lint**, **build**, run **unit tests** and **e2e tests** (e2e in Docker Compose with ephemeral PostgreSQL).

- **Monitoring**
  - Add monitoring and alerting based on defined metrics.

- **Caching with Redis**
  - Add caching for hot endpoints (`GET /pokemons`, `GET /pokemons/:slug|pokedexId`, `GET /types`) with sensible TTLs.

- **Rate Limiting**
  - Redis-backed limits per IP and per auth token.

- **Cursor-based Pagination for Infinite Scroll**
  - Add optional cursor pagination alongside page/limit for `GET /pokemons`.

---

## 📝 Notes

- **Stable public identifiers**
  - The API **does not expose internal database IDs**. It uses **`pokedexId`** or **`slug`** instead.
  - Reasons: **security** (avoid leaking internal structure) and **cross-system compatibility**—stable, human-meaningful IDs are less coupled to storage details.

- **Idempotent favorites**
  - Endpoints to **add** or **remove** a favorite Pokémon are **idempotent**:
    - Re-adding an existing favorite still yields success without duplication.
    - Re-removing a non-favorite yields success with no side effects.

- **Contract-verified e2e tests**
  - E2E tests validate that responses **conform to the Swagger/OpenAPI schemas** (shape, required fields, types, enums).

- ** Husky pre-commit hooks**
  - Husky runs linting, formatting, and unit tests before every commit.

---

---

---

# 🛢 Database Schema

## Tables

### User

Stores user information for authentication and favorites.

| Column     | Type     | Constraints      | Description                       |
| ---------- | -------- | ---------------- | --------------------------------- |
| id         | integer  | PRIMARY KEY      | Auto-incrementing user identifier |
| email      | string   | UNIQUE, NOT NULL | User's email address              |
| name       | string   | NOT NULL         | User's display name               |
| created_at | datetime | DEFAULT now()    | Account creation timestamp        |
| updated_at | datetime | DEFAULT now()    | Last update timestamp             |

**Relationships:**

- One-to-many with `Token` (tokens for authentication)
- One-to-many with `FavoritePokemon` (user's favorite pokemon)

---

### Token

Stores authentication tokens for users.

| Column     | Type     | Constraints           | Description                        |
| ---------- | -------- | --------------------- | ---------------------------------- |
| id         | integer  | PRIMARY KEY           | Auto-incrementing token identifier |
| token_hash | string   | UNIQUE, NOT NULL      | Hashed authentication token        |
| user_id    | integer  | FOREIGN KEY → User.id | Reference to token owner           |
| expires_at | datetime | NOT NULL              | Token expiration timestamp         |
| is_revoked | boolean  | DEFAULT false         | Token revocation status            |
| created_at | datetime | DEFAULT now()         | Token creation timestamp           |
| updated_at | datetime | DEFAULT now()         | Last update timestamp              |

**Relationships:**

- Many-to-one with `User`

---

### Pokemon

The main entity storing all Pokemon data.

| Column              | Type         | Constraints                        | Description                           |
| ------------------- | ------------ | ---------------------------------- | ------------------------------------- |
| id                  | integer      | PRIMARY KEY                        | Auto-incrementing internal identifier |
| pokedex_id          | smallint     | UNIQUE, NOT NULL, CHECK > 0        | Official Pokedex number               |
| name                | string       | UNIQUE, NOT NULL                   | Pokemon name                          |
| classification_id   | integer      | FOREIGN KEY → Classification.id    | Reference to classification           |
| weight_max          | integer      | CHECK weight_max >= weight_min > 0 | Maximum weight in grams               |
| weight_min          | integer      | CHECK weight_max >= weight_min > 0 | Minimum weight in grams               |
| height_max          | smallint     | CHECK height_max >= height_min > 0 | Maximum height in centimeters         |
| height_min          | smallint     | CHECK height_max >= height_min > 0 | Minimum height in centimeters         |
| flee_rate           | decimal(3,2) | NOT NULL                           | Probability of fleeing (0.00-1.00)    |
| max_cp              | smallint     | CHECK > 0                          | Maximum Combat Power                  |
| max_hp              | smallint     | CHECK > 0                          | Maximum Health Points                 |
| rarity              | enum         | NOT NULL                           | 'basic', 'mythic', or 'legendary'     |
| common_capture_area | string       | NULLABLE                           | Common location for capture           |
| created_at          | datetime     | DEFAULT now()                      | Record creation timestamp             |
| updated_at          | datetime     | DEFAULT now()                      | Last update timestamp                 |

**Relationships:**

- Many-to-one with `Classification`
- Many-to-many with `PokemonType` (via `pokemon_types_pivot` table for types)
- Many-to-many with `PokemonType` (via `pokemon_resistant` table for resistances)
- Many-to-many with `PokemonType` (via `pokemon_weaknesses` table for weaknesses)
- Many-to-many with `Attack` (via junction table)
- One-to-many with `Evolution` (as `from_pokemon`)
- One-to-many with `Evolution` (as `to_pokemon`)
- One-to-many with `FavoritePokemon`

---

### Classification

Stores Pokemon classifications (e.g., "Seed Pokemon", "Flame Pokemon").

| Column     | Type     | Constraints      | Description               |
| ---------- | -------- | ---------------- | ------------------------- |
| id         | smallint | PRIMARY KEY      | Classification identifier |
| name       | string   | UNIQUE, NOT NULL | Classification name       |
| created_at | datetime | DEFAULT now()    | Record creation timestamp |
| updated_at | datetime | DEFAULT now()    | Last update timestamp     |

**Relationships:**

- One-to-many with `Pokemon`

---

### PokemonType

Stores Pokemon types (e.g., Fire, Water, Grass).

| Column | Type     | Constraints            | Description                  |
| ------ | -------- | ---------------------- | ---------------------------- |
| id     | smallint | PRIMARY KEY            | Type identifier              |
| slug   | string   | UNIQUE, AUTO-GENERATED | URL-friendly type identifier |
| name   | string   | UNIQUE, NOT NULL       | Type name                    |

**Relationships:**

- Many-to-many with `Pokemon` (types via `pokemon_types_pivot`)
- Many-to-many with `Pokemon` (resistances via `pokemon_resistant`)
- Many-to-many with `Pokemon` (weaknesses via `pokemon_weaknesses`)
- One-to-many with `Attack`

**Notes:**

- The `slug` field is automatically generated from the `name` using lifecycle hooks

---

### Attack

Stores Pokemon attack moves.

| Column     | Type     | Constraints                  | Description               |
| ---------- | -------- | ---------------------------- | ------------------------- |
| id         | smallint | PRIMARY KEY                  | Attack identifier         |
| name       | string   | UNIQUE, NOT NULL             | Attack name               |
| type_id    | smallint | FOREIGN KEY → PokemonType.id | Attack type reference     |
| damage     | smallint | CHECK >= 0                   | Damage value              |
| category   | enum     | NOT NULL                     | 'fast' or 'special'       |
| created_at | datetime | DEFAULT now()                | Record creation timestamp |
| updated_at | datetime | DEFAULT now()                | Last update timestamp     |

**Relationships:**

- Many-to-one with `PokemonType`
- Many-to-many with `Pokemon` (via junction table)

---

### Evolution

Stores Pokemon evolution chains and requirements.

| Column          | Type     | Constraints                      | Description                 |
| --------------- | -------- | -------------------------------- | --------------------------- |
| id              | integer  | PRIMARY KEY                      | Evolution record identifier |
| from_pokemon_id | integer  | FOREIGN KEY → Pokemon.id, INDEX  | Pokemon that evolves        |
| to_pokemon_id   | integer  | FOREIGN KEY → Pokemon.id, UNIQUE | Pokemon after evolution     |
| candy_id        | integer  | FOREIGN KEY → Candy.id           | Required candy type         |
| candy_amount    | smallint | NOT NULL                         | Amount of candy required    |
| created_at      | datetime | DEFAULT now()                    | Record creation timestamp   |

**Relationships:**

- Many-to-one with `Pokemon` (as from_pokemon)
- Many-to-one with `Pokemon` (as to_pokemon)
- Many-to-one with `Candy`

**Notes:**

- `to_pokemon_id` has a UNIQUE constraint, meaning a Pokemon can only be the result of one evolution path
- CASCADE delete rules ensure evolution records are cleaned up when Pokemon are deleted

---

### Candy

Stores candy types required for Pokemon evolution.

| Column     | Type     | Constraints      | Description               |
| ---------- | -------- | ---------------- | ------------------------- |
| id         | smallint | PRIMARY KEY      | Candy identifier          |
| name       | string   | UNIQUE, NOT NULL | Candy name                |
| created_at | datetime | DEFAULT now()    | Record creation timestamp |
| updated_at | datetime | DEFAULT now()    | Last update timestamp     |

**Relationships:**

- One-to-many with `Evolution`

---

### FavoritePokemon

Junction table for user's favorite Pokemon (many-to-many relationship).

| Column     | Type    | Constraints                     | Description                |
| ---------- | ------- | ------------------------------- | -------------------------- |
| id         | integer | PRIMARY KEY                     | Favorite record identifier |
| user_id    | integer | FOREIGN KEY → User.id, INDEX    | User reference             |
| pokemon_id | integer | FOREIGN KEY → Pokemon.id, INDEX | Pokemon reference          |

**Constraints:**

- UNIQUE constraint on (user_id, pokemon_id) - prevents duplicate favorites
- INDEX on user_id for fast user favorite lookups
- INDEX on pokemon_id for fast pokemon favorite counts
- CASCADE delete rules ensure favorites are cleaned up when user or pokemon is deleted

---

## Pivot Tables

The following pivot tables are automatically created by the ORM for many-to-many relationships:

### pokemon_types_pivot

Links Pokemon to their types (e.g., Pikachu is Electric type).

| Column     | Type     | Constraints                  |
| ---------- | -------- | ---------------------------- |
| pokemon_id | integer  | FOREIGN KEY → Pokemon.id     |
| type_id    | smallint | FOREIGN KEY → PokemonType.id |

---

### pokemon_resistant

Links Pokemon to types they are resistant to.

| Column     | Type     | Constraints                  |
| ---------- | -------- | ---------------------------- |
| pokemon_id | integer  | FOREIGN KEY → Pokemon.id     |
| type_id    | smallint | FOREIGN KEY → PokemonType.id |

---

### pokemon_weaknesses

Links Pokemon to types they are weak against.

| Column     | Type     | Constraints                  |
| ---------- | -------- | ---------------------------- |
| pokemon_id | integer  | FOREIGN KEY → Pokemon.id     |
| type_id    | smallint | FOREIGN KEY → PokemonType.id |

---

### attack_pokemon (implied)

Links Pokemon to their attacks.

| Column     | Type     | Constraints              |
| ---------- | -------- | ------------------------ |
| attack_id  | smallint | FOREIGN KEY → Attack.id  |
| pokemon_id | integer  | FOREIGN KEY → Pokemon.id |

---

## Enums

### Rarity

Used in the `Pokemon` table to indicate Pokemon rarity.

- `basic` - Common Pokemon
- `mythic` - Rare, special event Pokemon
- `legendary` - Legendary Pokemon

### AttackCategory

Used in the `Attack` table to categorize attack types.

- `fast` - Quick, low-damage attacks
- `special` - Charged, high-damage attacks

---

## Key Design Decisions

1. **Pokedex ID vs Internal ID**: The `Pokemon` table uses both an internal auto-incrementing `id` and a `pokedex_id` that matches the official Pokemon numbering system. This allows for stable public references while maintaining database efficiency.

2. **Measurement Units**: All measurements use consistent units:
   - Weight: grams (integer)
   - Height: centimeters (smallint)
   - Rates: decimal percentages (0.00-1.00)

3. **Timestamps**: Most tables include `created_at` and `updated_at` timestamps for audit trails and data tracking.
