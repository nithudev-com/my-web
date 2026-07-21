const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  try {
    const settings = await prisma.storeSettings.findFirst()
    console.log('Successfully connected to the database!')
    console.log('Store Settings:', settings)
  } catch (error) {
    console.error('Error connecting to the database:')
    console.error(error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
