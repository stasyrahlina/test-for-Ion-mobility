import { assign, createMachine } from "xstate";
import { supabase } from "../utils/supabaseClient";

const authenticationMachine = createMachine(
  {
    id: "authentication",
    initial: "checkingIfLoggedIn",
    context: {
      auth: supabase.auth,
    },
    states: {
      checkingIfLoggedIn: {
        invoke: {
          src: "checkIfLoggedIn",
          onError: {
            target: "loggedOut",
          },
        },
        on: {
          REPORT_IS_LOGGED_IN: {
            target: "loggedIn",
          },
          REPORT_IS_LOGGED_OUT: "loggedOut",
        },
      },
      loggedIn: {
        on: {
          LOG_OUT: {
            target: "loggedOut",
          },
        },
      },
      loggedOut: {
        entry: ["clearUserDetailsFromContext"],
        on: {
          LOG_IN: {
            target: "loggedIn",
          },
        },
      },
    },
    on: {
      CHECK: {
        target: "checkingIfLoggedIn",
      },
    },
  },
  {
    services: {
      checkIfLoggedIn: (context, event) => async (send) => {
        const { email, password } = event;

        if (email && password) {
          try {
            const { data } = await context.auth.signIn({
              email,
              password,
            });

            send({
              type: "REPORT_IS_LOGGED_IN",
              userDetails: {
                email,
                token: data.access_token,
              },
            });
          } catch (error) {
            send({
              type: "REPORT_IS_LOGGED_OUT",
            });
          }
        }
      },
    },
    actions: {
      clearUserDetailsFromContext: assign({
        userDetails: undefined,
      }),
    },
  }
);

export default authenticationMachine;
