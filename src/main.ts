import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
async function bootstrap() {

  const user = await prisma.user.create({
    data: {
      name: 'Alice',
      email: 'deeznuts@prisma.io',
    },
  })

  console.log(user)
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })


