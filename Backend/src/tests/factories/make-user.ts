import { db } from "../../database/cliente.ts";
import { faker} from "@faker-js/faker";
import { users} from "../../database/schema";
import { hash } from "argon2";
import { randomUUID } from "crypto";

export async function makeUser() {

    const passwordBeforeHash = randomUUID()

    const result = await db.insert(users).values({
       name: faker.person.fullName(),
       email: faker.internet.email(),
       passwordHash: await hash(passwordBeforeHash),
    }).returning()

    return {
        user: result[0],
        passwordBeforeHash,
    }
}   