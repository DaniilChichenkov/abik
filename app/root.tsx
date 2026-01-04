import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  type LoaderFunctionArgs,
  useRouteLoaderData,
  redirect,
  useLoaderData,
  type MetaFunction,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";

const SUPPORTED_LANG = new Set(["ee", "ru"]);
const HTML_LANG_MAP: Record<string, string> = {
  ee: "et",
  ru: "ru",
};

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const data = useLoaderData();

  return (
    <html lang={data.safeLang}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);

  //Get language from url and if not provided - set default one to EE
  let lang = url.searchParams.get("lang");
  if (!lang) {
    url.searchParams.set("lang", "ee");
    throw redirect(url.toString(), 302);
  }

  const safeLang = SUPPORTED_LANG.has(lang) ? lang : "ee";
  const htmlLang = HTML_LANG_MAP[safeLang] ?? "et";

  return {
    safeLang: htmlLang,
  };
}
