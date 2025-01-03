import { mockData } from '.';
import prisma from '@/database';
import { hash } from '@/lib/encrypt';

const { products, users } = mockData;

const seed = async () => {
  try {
    await prisma.product.deleteMany();
    await prisma.account.deleteMany();
    await prisma.session.deleteMany();
    await prisma.verificationToken.deleteMany();
    await prisma.user.deleteMany();

    await prisma.product.createMany({
      data: products,
    });

    const usersWithHashedPassword = [];

    for (let i = 0; i < users.length; i++) {
      usersWithHashedPassword.push({
        ...users[i],
        password: await hash(users[i].password),
      });
    }

    await prisma.user.createMany({ data: usersWithHashedPassword });

    console.log('Mock products and users added to database successfully.');
  } catch (error) {
    console.error(error);
  }
};

seed();
