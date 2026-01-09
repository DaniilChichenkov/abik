import {
  Form,
  redirect,
  type ActionFunction,
  type ActionFunctionArgs,
  type LoaderFunction,
  type LoaderFunctionArgs,
  useNavigation,
} from "react-router";
import type { Route } from "../+types/root";
import bcrypt from "bcryptjs";

//Database
import { connectToDB } from "~/utils/db";
import UserModel from "~/models/userModel";

//Session
import { getSession, commitSession } from "~/utils/session";

export const action: ActionFunction = async ({
  request,
}: ActionFunctionArgs) => {
  //Get Login and Password from request formdata
  const formData = await request.formData();
  const login = formData.get("login");
  const password = formData.get("password");

  //Object with errors
  const errors: Record<string, boolean> = {};

  //Check for credentials
  if (!login || typeof login !== "string") {
    errors.noLoginProvided = true;
  }
  if (!password || typeof password !== "string") {
    errors.noPasswordProvided = true;
  }

  //Check for errors before proceeding
  if (Object.keys(errors).length > 0) {
    return {
      ok: false,
      errors,
    };
  }

  //Try to find user in db
  try {
    await connectToDB();
    const user = await UserModel.findOne({ username: login });

    if (!user) {
      return {
        ok: false,
        errors: {
          noUserFound: true,
        },
      };
    }

    //Compare password hashes
    const isPassCorrect = await bcrypt.compare(
      password as string,
      user.passwordHash
    );

    //If password is wrong
    if (!isPassCorrect) {
      return {
        ok: false,
        errors: {
          wrongCredentials: true,
        },
      };
    }

    //Set http cookies and redirect user
    const cookieHeader = request.headers.get("Cookie");
    const session = await getSession(cookieHeader);
    session.set("isAdmin", true);

    return redirect("/admin?lang=ee", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      errors: {
        errorDuringUserRequest: true,
      },
    };
  }
};

export const loader: LoaderFunction = async ({
  request,
}: LoaderFunctionArgs) => {
  //Check if user is already logged in
  const cookieHeader = request.headers.get("Cookie");
  const session = await getSession(cookieHeader);

  //If user is authorized
  if (session.get("isAdmin")) {
    return redirect("/admin");
  }

  return null;
};

type Props = {
  actionData?: {
    ok: boolean;
    errors: Record<string, boolean>;
  };
};
const Login = ({ actionData }: Props) => {
  //Navigation state
  const navigationState = useNavigation();
  const isSubmitting = navigationState.state === "submitting";

  return (
    <section className="w-screen h-screen flex justify-center items-center px-10">
      <div className="card w-full md:w-96 bg-base-100 card-lg shadow-sm shadow-base-300">
        <div className="card-body">
          <div className="w-full flex justify-center items-center">
            <h2 className="card-title text-2xl">Log in</h2>
          </div>

          {/* Login */}
          <Form method="POST" action=".">
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Your name</legend>
              <input
                type="text"
                disabled={isSubmitting}
                className={`input ${actionData?.errors.noLoginProvided && "input-error"}`}
                placeholder="Type name here"
                name="login"
              />
              {actionData?.errors.noLoginProvided ? (
                <p className="label text-red-500">You provided no Login</p>
              ) : null}
            </fieldset>

            {/* Password */}
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Your password</legend>
              <input
                type="password"
                disabled={isSubmitting}
                className={`input ${actionData?.errors.noPasswordProvided && "input-error"}`}
                placeholder="Type password here"
                name="password"
              />
              {actionData?.errors.noPasswordProvided ? (
                <p className="label text-red-500">You provided no Password</p>
              ) : null}
            </fieldset>

            {/* Error messages */}
            {actionData && !actionData?.ok ? (
              <p className="text-error">
                {/* If something wrong on the server */}
                {actionData?.errors.errorDuringUserRequest && "Something wrong"}

                {/* Wrong credentials */}
                {(actionData?.errors.wrongCredentials ||
                  actionData?.errors.noUserFound) &&
                  "Wrong credentials"}
              </p>
            ) : null}

            {/* Login button / spinner */}
            <div className="justify-center card-actions mt-10">
              {isSubmitting ? (
                <span className="loading loading-dots loading-xl"></span>
              ) : (
                <button disabled={isSubmitting} className="btn btn-primary">
                  Continue
                </button>
              )}
            </div>
          </Form>
        </div>
      </div>
    </section>
  );
};

export default Login;
