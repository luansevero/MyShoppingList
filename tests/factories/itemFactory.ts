import { faker } from "@faker-js/faker"
import { prisma } from "../../src/database";

export function createItem(){
    const item = {
        title: faker.animal.dog(),
        url : faker.internet.url(),
        description: faker.lorem.words(),
        amount: faker.datatype.number(),
    };
    return item
}

export async function InsertItem(){
    const item = createItem();
    const InsertedItem = await prisma.items.create({data:item});
    return InsertedItem;
}

