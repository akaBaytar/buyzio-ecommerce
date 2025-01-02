import { PrismaClient } from '@prisma/client';

import { mockData } from '.';

const { products } = mockData;

const seed = async () => {
  const prisma = new PrismaClient();

  try {
    await prisma.product.deleteMany();

    await prisma.product.createMany({
      data: products,
    });

    console.log('Mock data added to database successfully.');
  } catch (error) {
    console.error(error);
  }
};

seed();
