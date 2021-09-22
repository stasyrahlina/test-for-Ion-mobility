import { interpret } from "xstate";
import authenticationMachine from "../machine";

describe("Machine", () => {
  it("Test fetch Machine", (done) => {
    const mockFetchMachine = authenticationMachine.withContext({
      auth: {
        signIn: async () => {
          return { data: { access_token: "testToken" } };
        },
      },
    });

    const fetchService = interpret(mockFetchMachine).onTransition((state) => {
      if (state.matches("loggedIn")) {
        done();
      }
    });

    fetchService.start();

    fetchService.send("CHECK", {
      email: "test@mail.com",
      password: "testPassword",
    });
  });
});
