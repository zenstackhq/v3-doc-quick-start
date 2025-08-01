import { ZenStackClient } from '@zenstackhq/runtime';
import { SqlJsDialect } from 'kysely-sql-js';
import initSqlJs from 'sql.js';
import { schema } from './zenstack/schema';
import { inspect } from 'node:util';

async function main() {
  // initialize sql.js engine
  const SQL = await initSqlJs();

  // create database client with sql.js dialect
  const db = new ZenStackClient(schema, {
    dialect: new SqlJsDialect({ sqlJs: new SQL.Database() }),
  });

  // push schema to the database (`$pushSchema` is for testing only)
  await db.$pushSchema();

  // create a user with some postsØ
  const user = await db.user.create({
    data: {
      email: 'u1@test.com',
      posts: {
        create: [
          {
            title: 'Post1',
            content: 'My first post',
            published: false,
          },
          {
            title: 'Post2',
            content: 'Just another post',
            published: true,
          },
        ],
      },
    },
    include: { posts: true },
  });

  console.log(inspect(user, { colors: true }));
}

main();
