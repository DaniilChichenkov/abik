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
  pendingRequests: {
    ru: "Текущие запросы",
    ee: "Praegused päringud",
  },
};

type Props = {
  loaderData: {
    ok: boolean;
    pendingRequests: {
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
        price: number | "volumeBased";
        title: {
          ee: string;
          ru: string;
        };
        priceType: "perHour" | "perService";
      };
    }[];
  };
};
const Admin = ({ loaderData }: Props) => {
  const [searchParams] = useSearchParams();
  const lang = searchParams.get("lang") as "ee" | "ru";

  return (
    <section className="w-full">
      <Header content={translations.pendingRequests[lang]} />
      <RequestsList content={loaderData.pendingRequests} type="pending" />
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
      completed: false,
    }).lean();
    const requestsWithStringIds = requests.length
      ? requests.map((item) => ({
          ...item,
          _id: item._id.toString(),
        }))
      : [];

    return {
      ok: true,
      pendingRequests: requestsWithStringIds,
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
    await ServiceRequestModel.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(itemId) },
      { completed: true },
    );
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

export default Admin;
