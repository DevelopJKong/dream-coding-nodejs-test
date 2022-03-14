import axios from "axios";
import { startServer, stopServer } from "../../app.js";
import { sequelize } from "../../db/database.js";
import faker from "faker";

// 테스트 전! 서버 시작 및 데이터 베이스 초기화! 설정!
// 테스트 후! 데이터베이스 깨끗하게 청소해 놓기!

describe("Auth APIS", () => {
  let server;
  let request;

  beforeAll(async () => {
    server = await startServer();
    request = axios.create({
      baseURL: "http://localhost:5050",
      validateStatus: null,
    });
  });

  afterAll(async () => {
    await sequelize.drop();
    await stopServer(server);
  });

  describe("POST to /auth/signup", () => {
    it('returns 201 and authrozation token when user details are valid', async () => {
        const fakeUser = faker.helpers.userCard();
        const user = {
          name: fakeUser.name,
          username: fakeUser.username,
          email: fakeUser.email,
          password: faker.internet.password(10, true),
        };
  
        const res = await request.post('/auth/signup', user);
  
        expect(res.status).toBe(201);
        expect(res.data.token.length).toBeGreaterThan(0);
      });
  });
});
