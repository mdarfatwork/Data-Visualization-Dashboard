import { PrismaClient } from '@prisma/client';

// Create a PrismaClient instance
const prisma = new PrismaClient();

// Function to connect to the database
const connectDB = async () => {
  try {
    await prisma.$connect();
    // console.log('Connected to the database');
  } catch (error) {
    console.error('Error connecting to the database', error);
    throw new Error('Unable to connect to the database');
  }
};

// Export the PrismaClient instance and the connectDB function
export { prisma, connectDB };