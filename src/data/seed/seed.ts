import { envs } from '../../config';
import { CategoryModel } from '../mongo/models/category.model';
import { ProductModel } from '../mongo/models/product.model';
import { UserModel } from '../mongo/models/user.model';
import { MongoDatabase } from '../mongo/mongo-database';
import { seedData } from './data';

(async () => {
  MongoDatabase.connect({
    dbName: envs.MONGO_DB_NAME,
    mongoUrl: envs.MONGO_URL,
  });

  await main();
  await MongoDatabase.disconnect();
})();

const randomBetween = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

async function main() {
  await Promise.all([
    UserModel.deleteMany({}),
    CategoryModel.deleteMany({}),
    ProductModel.deleteMany({}),
  ]);

  // 1. Users
  const users = await UserModel.insertMany(seedData.users);

  // 2. Categories
  const categories = await CategoryModel.insertMany(
    seedData.categories.map((category) => ({
      ...category,
      user: users[randomBetween(0, users.length - 1)]._id,
    }))
  );

  // 3. Products
  const products = await ProductModel.insertMany(
    seedData.products.map((product) => ({
      ...product,
      category: categories[randomBetween(0, categories.length - 1)]._id,
      user : users[randomBetween(0, users.length - 1)]._id,
    }))
  );

  console.log('Seed data inserted successfully');
}
