import {
  redirect,
  useSearchParams,
  type ActionFunction,
  type ActionFunctionArgs,
  type LoaderFunction,
  type LoaderFunctionArgs,
} from "react-router";
import { Header, RequestsList } from "~/components/admin/requests";
import { getSession } from "~/utils/session";

const translations = {
  completedRequests: {
    ru: "Выполненные запросы",
    ee: "Lõpetatud päringud",
  },
};

type Props = {
  loaderData: {
    ok: boolean;
    completedRequests: {
      _id: string;
      email: string;
      phoneNumber: string | null;
      serviceCategory: {
        title: {
          ee: string;
          ru: string;
        };
      };
      service: {
        price: number;
        title: {
          ee: string;
          ru: string;
        };
      };
    }[];
  };
};
const CompletedRequests = ({ loaderData }: Props) => {
  const [searchParams] = useSearchParams();
  const lang = searchParams.get("lang") as "ee" | "ru";

  return (
    <section className="w-full">
      <Header content={translations.completedRequests[lang]} />
      <RequestsList content={loaderData.completedRequests} type="completed" />
    </section>
  );
};

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

  const { connectToDB } = await import("../utils/db");
  const ServiceRequestModel = (await import("../models/serviceRequestModel"))
    .default;

  try {
    await connectToDB();
    const requests = await ServiceRequestModel.find({
      completed: true,
    }).lean();
    const requestsWithStringIds = requests.length
      ? requests.map((item) => ({
          ...item,
          _id: item._id.toString(),
        }))
      : [];

    return {
      ok: true,
      completedRequests: requestsWithStringIds,
    };
  } catch (error) {
    throw new Response("An error occured", { status: 500 });
  }
};

export const action: ActionFunction = async ({
  request,
}: ActionFunctionArgs) => {
  //Check for authentication
  const cookieHeader = request.headers.get("Cookie");
  const session = await getSession(cookieHeader);

  //If user is unauthorized
  if (!session.get("isAdmin")) {
    return redirect("/login");
  }

  const formData = await request.formData();
  const itemId = formData.get("itemId");

  if (!itemId || typeof itemId !== "string") {
    return {
      ok: false,
      errors: {
        noItemIdProvided: true,
      },
    };
  }

  const mongoose = await import("mongoose");
  const { connectToDB } = await import("../utils/db");
  const ServiceRequestModel = (await import("../models/serviceRequestModel"))
    .default;

  try {
    await connectToDB();
    await ServiceRequestModel.deleteOne({
      _id: new mongoose.Types.ObjectId(itemId),
    });
    return {
      ok: true,
    };
  } catch (error) {
    return {
      ok: false,
      errors: {
        serverSideError: true,
      },
    };
  }
};

export default CompletedRequests;
