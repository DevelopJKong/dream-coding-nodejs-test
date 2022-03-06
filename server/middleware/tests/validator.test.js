import httpMocks from "node-mocks-http";
import faker from "faker";
import { validate } from "../validator";
import * as validator from "express-validator";

jest.mock("express-validator");

describe("Validator Middleware", () => {
  it("calls next if there are no validation error", () => {
    //given
    const request = httpMocks.createRequest();
    const response = httpMocks.createResponse();
    const next = jest.fn();
    validator.validationResult = jest.fn(() => ({ isEmpty: () => true }));

    //when
    validate(request, response, next);

    //then
    expect(next).toBeCalled();
  });
  it(`returns 400 if there are validation errors`, () => {
    //given
    const request = httpMocks.createRequest();
    const response = httpMocks.createResponse();
    const next = jest.fn();
    const errorMsg = faker.random.words(3);
    validator.validationResult = jest.fn(() => ({
      isEmpty: () => false,
      array: () => [{ msg: errorMsg }],
    }));

    //when
    validate(request, response, next);

    //then
    expect(next).not.toBeCalled();
    expect(response.statusCode).toBe(400);
    expect(response._getJSONData().message).toMatch(errorMsg);
  });
});
