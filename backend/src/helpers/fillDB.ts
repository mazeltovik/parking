import { PrismaClient } from '../../generated/prisma/client';
import { v4 as uuidv4 } from 'uuid';
const prisma = new PrismaClient();

async function* asyncGenerator() {
  let i = 1;
  while (i < 25) {
    yield i++;
  }
}

async function fillDB() {
  const names = ['A', 'B', 'C', 'D', 'E'];
  let index = 0;
  for await (const num of asyncGenerator()) {
    index = num % 5 == 0 ? (index += 1) : index;
    const id = uuidv4();
    const name = `${names[index]}-${num}`;
    const location = `Улица ${num}`;
    const isCreated = await prisma.parkingSpot.create({
      data: { id, name, location },
    });
    if (isCreated) {
      console.log(`Parking spot: ${name} created`);
    }
  }
}

fillDB();
