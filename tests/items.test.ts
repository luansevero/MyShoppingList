import supertest from "supertest";
import { prisma } from "../src/database";
import { createItem, InsertItem } from "./factories/itemFactory";
import app from "../src/app";

beforeEach(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE "items"`;
});

const agent = supertest(app);

describe('Testa POST /items ', () => {
  it('Deve retornar 201, se cadastrado um item no formato correto', async () => {
    const itemBody = await createItem();
    const result = await agent.post("/items").send(itemBody);
    expect(result.status).toEqual(201);
  });
  it('Deve retornar 409, ao tentar cadastrar um item que exista', async () => {
    const itemBody = await InsertItem();
    delete itemBody["id"]
    const result = await agent.post("/items").send(itemBody);
    expect(result.status).toEqual(409);
  })
});

describe('Testa GET /items ', () => {
  it('Deve retornar status 200 e o body no formato de Array',async () => {
    const result = await agent.get("/items");

    expect(result.status).toBe(200);
    expect(result.body).toBeInstanceOf(Array);
  });
});

describe('Testa GET /items/:id ', () => {
  it('Deve retornar status 200 e um objeto igual a o item cadastrado', async () => {
    const itemBody = await InsertItem();
    const result = await agent.get(`/items/${itemBody["id"]}`)
    expect(result.status).toBe(200);
    expect(result.body).toEqual(expect.objectContaining(itemBody));
  });
  it('Deve retornar status 404 caso não exista um item com esse id',async () => {
    const result = await agent.get("/items/0")
    expect(result.status).toBe(404);
  });
});


afterAll(async () => {
  prisma.$disconnect
})