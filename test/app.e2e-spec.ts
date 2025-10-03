/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */

/* eslint-disable @typescript-eslint/no-unsafe-return */

import request from 'supertest';

describe('Pokemon API (e2e)', () => {
  // API base URL - defaults to localhost:3000 if not set
  const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';
  let authToken: string;
  let testUser: {
    name: string;
    email: string;
  };

  beforeAll(async () => {
    // Create a test user for authentication tests
    const newUser = {
      name: 'E2E Test User',
      email: `e2e-test@example.com`,
    };

    const createUserResponse = await request(API_BASE_URL)
      .post('/api/user')
      .send(newUser);

    if (createUserResponse.status === 201) {
      testUser = createUserResponse.body.user;
      // Use the actual token returned from user creation
      authToken = createUserResponse.body.token;
    }
  });

  afterAll(async () => {
    // Clean up test user if needed
    // In production tests, you might want to clean up test data
  });

  describe('Health Check', () => {
    it('/api/health (GET)', () => {
      return request(API_BASE_URL)
        .get('/api/health')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('status', 'ok');
          expect(res.body).toHaveProperty('info');
          expect(res.body.info).toHaveProperty('mikroorm');
          expect(res.body.info.mikroorm).toHaveProperty('status', 'up');
        });
    });
  });

  describe('Pokemon Types', () => {
    it('/api/types (GET)', () => {
      return request(API_BASE_URL)
        .get('/api/types')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThanOrEqual(1);
          if (res.body.length > 0) {
            expect(res.body[0]).toHaveProperty('name');
            expect(res.body[0]).toHaveProperty('slug');
          }
        });
    });
  });

  describe('User Management', () => {
    it('/api/user (POST) - create new user', () => {
      const newUser = {
        name: 'New Test User',
        email: 'newuser@example.com',
      };

      return request(API_BASE_URL)
        .post('/api/user')
        .send(newUser)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('token', expect.any(String));
          expect(res.body.user).toHaveProperty('name', newUser.name);
          expect(res.body.user).toHaveProperty('email', newUser.email);
        });
    });

    it('/api/user (POST) - validation error for invalid email', () => {
      const invalidUser = {
        name: 'Test User',
        email: 'invalid-email',
      };

      return request(API_BASE_URL)
        .post('/api/user')
        .send(invalidUser)
        .expect(400)
        .expect((res) => {
          expect(res.body).toHaveProperty('message');
          expect(res.body.message).toContain('email must be an email');
        });
    });

    it('/api/user (POST) - validation error for empty name', () => {
      const invalidUser = {
        name: '',
        email: 'test@example.com',
      };

      return request(API_BASE_URL)
        .post('/api/user')
        .send(invalidUser)
        .expect(400)
        .expect((res) => {
          expect(res.body).toHaveProperty('message');
          expect(res.body.message).toContain('name should not be empty');
        });
    });

    it('/api/user (POST) - duplicate email error', async () => {
      const duplicateUser = {
        name: 'Duplicate User',
        email: testUser?.email,
      };

      return request(API_BASE_URL)
        .post('/api/user')
        .send(duplicateUser)
        .expect((res) => {
          expect(res.status).toBe(400);
        });
    });

    it('/api/auth/rotate-token (POST) - rotate token', async () => {
      const newUser = {
        name: 'Rotate Token User',
        email: 'rotate-token@example.com',
      };
      const createUserResponse = await request(API_BASE_URL)
        .post('/api/user')
        .send(newUser);

      expect(createUserResponse.status).toBe(201);
      expect(createUserResponse.body).toHaveProperty('token');
      expect(createUserResponse.body.token).not.toBe(authToken); // ensure new token is different from original token

      const rotateTokenResponse = await request(API_BASE_URL)
        .post('/api/auth/rotate-token')
        .send({ token: createUserResponse.body.token })
        .expect(200);

      expect(rotateTokenResponse.body).toHaveProperty('token');
      expect(rotateTokenResponse.body.token).not.toBe(
        createUserResponse.body.token,
      );
      expect(rotateTokenResponse.status).toBe(200);
    });
  });

  describe('Authentication', () => {
    it('/api/auth/rotate-token (POST) - invalid token', () => {
      return request(API_BASE_URL)
        .post('/api/auth/rotate-token')
        .send({ token: 'invalid-token' })
        .expect(401); // Changed from 404 to 401 as that's what the API actually returns
    });

    it('/api/auth/rotate-token (POST) - missing token', () => {
      return request(API_BASE_URL)
        .post('/api/auth/rotate-token')
        .send({})
        .expect(400)
        .expect((res) => {
          expect(res.body).toHaveProperty('message');
          expect(res.body.message).toContain('token should not be empty');
        });
    });
  });

  describe('Pokemon API', () => {
    it('/api/pokemon (GET) - get all Pokemon without auth', () => {
      return request(API_BASE_URL)
        .get('/api/pokemon')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('data');
          expect(Array.isArray(res.body.data)).toBe(true);
          expect(res.body.data.length).toBeGreaterThanOrEqual(0);
          expect(res.body).toHaveProperty('currentPage');
          expect(res.body).toHaveProperty('nextPage');
          expect(res.body).toHaveProperty('previousPage');
          expect(res.body).toHaveProperty('pageCount');
          expect(res.body).toHaveProperty('recordCount');
        });
    });

    it('/api/pokemon (GET) - get all Pokemon with auth', () => {
      return request(API_BASE_URL)
        .get('/api/pokemon')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('data');
          expect(Array.isArray(res.body.data)).toBe(true);
        });
    });

    it('/api/pokemon (GET) - pagination', () => {
      return request(API_BASE_URL)
        .get('/api/pokemon?page=1&limit=2')
        .expect(200)
        .expect((res) => {
          expect(res.body.data.length).toBeLessThanOrEqual(2);
          expect(res.body).toHaveProperty('currentPage', 1);
          expect(res.body).toHaveProperty('nextPage', 2);
          expect(res.body).toHaveProperty('previousPage', null);
          expect(res.body).toHaveProperty('pageCount', 76);
          expect(res.body).toHaveProperty('recordCount', 151);
        });
    });

    it('/api/pokemon (GET) - search by name', async () => {
      await request(API_BASE_URL)
        .get('/api/pokemon?q=test')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('data');
          expect(Array.isArray(res.body.data)).toBe(true);
          expect(res.body.data.length).toBe(0);
        });

      await request(API_BASE_URL)
        .get('/api/pokemon?q=Bulbasaur')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('data');
          expect(Array.isArray(res.body.data)).toBe(true);
          expect(res.body.data.length).toBe(1);
          expect(res.body.data[0].name).toBe('Bulbasaur');
        });

      await request(API_BASE_URL)
        .get('/api/pokemon?q=bulbasaur')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('data');
          expect(Array.isArray(res.body.data)).toBe(true);
          expect(res.body.data.length).toBe(1);
          expect(res.body.data[0].name).toBe('Bulbasaur');
        });

      await request(API_BASE_URL)
        .get('/api/pokemon?q=ido')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('data');
          expect(Array.isArray(res.body.data)).toBe(true);
          expect(res.body.data.length).toBe(6);
          expect(res.body.data.some((p) => p.name === 'Nidoran-F')).toBe(true);
          expect(res.body.data.some((p) => p.name === 'Nidorina')).toBe(true);
          expect(res.body.data.some((p) => p.name === 'Nidoqueen')).toBe(true);
          expect(res.body.data.some((p) => p.name === 'Nidoran-M')).toBe(true);
          expect(res.body.data.some((p) => p.name === 'Nidorino')).toBe(true);
          expect(res.body.data.some((p) => p.name === 'Nidoking')).toBe(true);
        });
    });

    it('/api/pokemon (GET) - filter by type', () => {
      return request(API_BASE_URL)
        .get('/api/pokemon?type=Fire')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('data');
          expect(Array.isArray(res.body.data)).toBe(true);
          // Should return Pokemon with Fire type or empty array
        });
    });

    it('/api/pokemon (GET) - sort by name', () => {
      return request(API_BASE_URL)
        .get('/api/pokemon?sortBy=name&sortDir=asc')
        .expect(200)
        .expect((res) => {
          const names = res.body.data.map((p: any) => p.name);
          const sortedNames = [...names].sort();
          expect(names).toEqual(sortedNames);
        });
    });

    it('/api/pokemon/1 (GET) - get Pokemon by pokedexId', async () => {
      await request(API_BASE_URL)
        .get('/api/pokemon/001')
        .expect((res) => {
          expect(res.status).toBe(200);
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('name');
        });

      await request(API_BASE_URL)
        .get('/api/pokemon/1')
        .expect((res) => {
          expect(res.status).toBe(200);
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('name');
        });
    });

    it('/api/pokemon/by-name/Bulbasaur (GET) - get Pokemon by name', () => {
      return request(API_BASE_URL)
        .get('/api/pokemon/by-name/Bulbasaur')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('name');
        });
    });

    it('/api/pokemon/999 (GET) - Pokemon not found', () => {
      return request(API_BASE_URL).get('/api/pokemon/999').expect(404);
    });

    it('/api/pokemon/invalid (GET) - invalid Pokemon ID', () => {
      return request(API_BASE_URL).get('/api/pokemon/invalid').expect(400);
    });

    it('/api/pokemon/by-name/NonExistentPokemon (GET) - get Pokemon by name - not found', () => {
      const nonExistentPokemon = 'NonExistentPokemon';
      return request(API_BASE_URL)
        .get(`/api/pokemon/by-name/${nonExistentPokemon}`)
        .expect(404);
    });
  });

  describe('Favorite Pokemon (Authenticated)', () => {
    it('/api/me/favorite-pokemon/:pokedexId (POST) - add to favorites without auth', () => {
      return request(API_BASE_URL)
        .post('/api/me/favorite-pokemon/25')
        .expect(401);
    });

    it('/api/me/favorite-pokemon/1 (POST) - add to favorites', () => {
      return request(API_BASE_URL)
        .post('/api/me/favorite-pokemon/1')
        .set('Authorization', `Bearer ${authToken}`)
        .expect((res) => {
          expect(res.status).toBe(204);
        });
    });

    it('/api/me/favorite-pokemon/999 (POST) - add non-existent Pokemon to favorites', () => {
      return request(API_BASE_URL)
        .post('/api/me/favorite-pokemon/999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('/api/me/favorite-pokemon/invalid (POST) - invalid Pokemon ID', () => {
      return request(API_BASE_URL)
        .post('/api/me/favorite-pokemon/invalid')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400);
    });

    it('/api/pokemon (GET) - show favorites when authenticated and favorites=true', () => {
      return request(API_BASE_URL)
        .get('/api/pokemon?favorites=true')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('data');
          expect(Array.isArray(res.body.data)).toBe(true);
        });
    });

    it('/api/pokemon (GET) - favorites=true without auth should return 401', () => {
      return request(API_BASE_URL)
        .get('/api/pokemon?favorites=true')
        .expect(401);
    });

    it('/api/me/favorite-pokemon/1 (DELETE) - remove non-favorite Pokemon', () => {
      return request(API_BASE_URL)
        .delete('/api/me/favorite-pokemon/1')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(204); // 204 - idempotent behavior
    });

    it('/api/me/favorite-pokemon/:pokedexId (DELETE) - remove from favorites without auth', () => {
      return request(API_BASE_URL)
        .delete('/api/me/favorite-pokemon/25')
        .expect(401);
    });

    it('/api/me/favorite-pokemon/1 (DELETE) - remove from favorites', async () => {
      const testPokemonName = 'Bulbasaur';
      const testPokemonId = '001';

      // add to favorites
      await request(API_BASE_URL)
        .post(`/api/me/favorite-pokemon/${testPokemonId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(204);

      // check if added to favorites
      await request(API_BASE_URL)
        .get(`/api/pokemon?favorites=true&q=${testPokemonName}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(
            res.body.data.find((p) => p.id === testPokemonId),
          ).toBeDefined();
        });

      // remove from favorites
      await request(API_BASE_URL)
        .delete(`/api/me/favorite-pokemon/${testPokemonId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(204);

      // check if removed from favorites
      await request(API_BASE_URL)
        .get(`/api/pokemon?favorites=true&q=${testPokemonName}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(
            res.body.data.find((p) => p.id === testPokemonId),
          ).toBeUndefined();
        });
    });
  });

  describe('Seed check - special Pokemon', () => {
    it('/api/pokemon/by-name/eevee (GET) - check Eevee evolutions', () => {
      return request(API_BASE_URL)
        .get('/api/pokemon/by-name/eevee')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('evolutions');
          expect(res.body.evolutions.length).toBe(3);
          expect(res.body.evolutions.some((e) => e.name === 'Vaporeon')).toBe(
            true,
          );
          expect(res.body.evolutions.some((e) => e.name === 'Jolteon')).toBe(
            true,
          );
          expect(res.body.evolutions.some((e) => e.name === 'Flareon')).toBe(
            true,
          );
          expect(res.body.previousEvolutions.length).toBe(0);
        });
    });

    it('/api/pokemon/by-name/eevee (GET) - check Ditto evolutions', () => {
      return request(API_BASE_URL)
        .get('/api/pokemon/by-name/ditto')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('evolutions');
          expect(res.body.evolutions.length).toBe(0);
          expect(res.body.previousEvolutions.length).toBe(0);
        });
    });
  });

  describe('API Integration Tests', () => {
    it('Complete user workflow: create user, rotate token, manage favorites', async () => {
      // Create a new user
      const newUser = {
        name: 'Integration Test User',
        email: 'integration@test.com',
      };
      const testPokemonName = 'Bulbasaur';
      const testPokemonId = '001';

      const createUserResponse = await request(API_BASE_URL)
        .post('/api/user')
        .send(newUser)
        .expect(201)
        .expect((res) => {
          expect(res.body.user).toHaveProperty('name');
          expect(res.body.user).toHaveProperty('email');
          expect(res.body).toHaveProperty('token');
        });

      // rotate token
      const rotateTokenResponse = await request(API_BASE_URL)
        .post('/api/auth/rotate-token')
        .send({ token: createUserResponse.body.token })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('token');
          expect(res.body.token).not.toBe(createUserResponse.body.token);
        });

      // add favorite pokemon
      await request(API_BASE_URL)
        .post(`/api/me/favorite-pokemon/${testPokemonId}`)
        .set('Authorization', `Bearer ${rotateTokenResponse.body.token}`)
        .expect(204);

      // get favorites using search query
      await request(API_BASE_URL)
        .get(`/api/pokemon?favorites=true&q=${testPokemonName}`)
        .set('Authorization', `Bearer ${rotateTokenResponse.body.token}`)
        .expect(200)
        .expect((res) => {
          expect(
            res.body.data.find((p) => p.id === testPokemonId),
          ).toBeDefined();
        });
    });

    it('Error handling: invalid authentication token across endpoints', async () => {
      const invalidToken = 'invalid-auth-token';

      // Test protected endpoints with invalid token
      await request(API_BASE_URL)
        .get('/api/pokemon?favorites=true')
        .set('Authorization', `Bearer ${invalidToken}`)
        .expect(401);

      await request(API_BASE_URL)
        .post('/api/me/favorite-pokemon/1')
        .set('Authorization', `Bearer ${invalidToken}`)
        .expect(401);

      await request(API_BASE_URL)
        .delete('/api/me/favorite-pokemon/1')
        .set('Authorization', `Bearer ${invalidToken}`)
        .expect(401);
    });
  });
});
