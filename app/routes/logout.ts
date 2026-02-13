import type { LoaderFunction, LoaderFunctionArgs } from "react-router";
import { redirect } from "react-router";

//Session
import { getSession, destroySession } from "~/utils/session";

export const loader: LoaderFunction = async ({
  request,
}: LoaderFunctionArgs) => {
  //Check for authentication
  const cookieHeader = request.headers.get("Cookie");
  const session = await getSession(cookieHeader);

  //If user is unauthorized
  if (!session.get("isAdmin")) {
    return redirect("/login");
  }

  // Destroy the session
  return redirect("/login", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
};
