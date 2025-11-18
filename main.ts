import { ZenStackClient } from '@zenstackhq/orm';
import { SqlJsDialect } from '@zenstackhq/orm/dialects/sql.js';
import initSqlJs from 'sql.js';
import { schema } from './zenstack/schema';

async function main() {
  // initialize sql.js engine
  const SQL = await initSqlJs();

  // create database client with sql.js dialect
  const db = new ZenStackClient(schema, {
    dialect: new SqlJsDialect({ sqlJs: new SQL.Database() }),
  });

  // push schema to the database (`$pushSchema` is for testing only)
  await db.$pushSchema();

  // create a user with some posts
  await db.user.create({
    data: {
      id: 1, 
      email: 'u1@test.com',
      posts: {
        create: [{ title: 'Post1' }, { title: 'Post2' }]
      }
    }
  });

  // high-level query API
  const userWithPosts = await db.user.findFirst({
    where: { id: 1 },
    include: { posts: true }
  });
  console.log(userWithPosts);

  // low-level SQL query builder API
  const userPostJoin = await db
    .$qb
    .selectFrom('User')
    .innerJoin('Post', 'Post.authorId', 'User.id')
    .select(['User.id', 'User.email', 'Post.title'])
    .where('User.id', '=', 1)
    .execute();
  console.log(userPostJoin);
}

main();
