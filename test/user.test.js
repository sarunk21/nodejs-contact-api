import supertest from "supertest";
import {web} from "../src/application/web.js";
import {prismaClient} from "../src/application/database.js";
import {logger} from "../src/application/logging.js";
import e from "express";

describe('POST /api/users', () => {

    afterEach(async () => {
        await prismaClient.user.deleteMany({
            where: {
                username: "kautsar"
            }
        });
    });

    it('should can register new user', async () => {
        const result = await supertest(web)
            .post('/api/users')
            .send({
                username: 'kautsar',
                password: 'rahasia',
                name: 'Muhammad Kautsar'
            });

        expect(result.status).toEqual(200);
        expect(result.body.data.username).toBe('kautsar');
        expect(result.body.data.name).toBe('Muhammad Kautsar');
        expect(result.body.password).toBeUndefined();
    });

    it('should reject if request is invalid', async () => {
        const result = await supertest(web)
            .post('/api/users')
            .send({
                username: '',
                password: '',
                name: ''
            });

        logger.info(result.body);

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });

    it('should reject if username already registered', async () => {
        let result = await supertest(web)
            .post('/api/users')
            .send({
                username: 'kautsar',
                password: 'rahasia',
                name: 'Muhammad Kautsar'
            });

        expect(result.status).toEqual(200);
        expect(result.body.data.username).toBe('kautsar');
        expect(result.body.data.name).toBe('Muhammad Kautsar');
        expect(result.body.password).toBeUndefined();

        result = await supertest(web)
            .post('/api/users')
            .send({
                username: 'kautsar',
                password: 'rahasia',
                name: 'Muhammad Kautsar'
            });

        logger.info(result.body);

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });
});