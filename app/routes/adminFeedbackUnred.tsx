import {
  redirect,
  useSearchParams,
  type ActionFunction,
  type ActionFunctionArgs,
  type LoaderFunction,
  type LoaderFunctionArgs,
} from "react-router";

import { Header, FeedbackList } from "~/components/admin/feedback";
import { getSession } from "~/utils/session";

const translations = {
  headerContent: {
    ru: "Непрочитанные сообщения обратной связи",
    ee: "Lugemata tagasiside sõnumid",
  },
};

type Props = {
  loaderData: {
    ok: boolean;
    feedback: {
      //   name: string;
      email: string;
      message: string;
      _id: string;
    }[];
  };
};
const AdminFeedbackUnred = ({ loaderData }: Props) => {
  const [searchParams] = useSearchParams();
  const lang = searchParams.get("lang") as "ee" | "ru";

  return (
    <section className="w-full">
      <Header content={translations.headerContent[lang]} />
      <FeedbackList content={loaderData.feedback} type="unred" />
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

  const FeedbackModel = (await import("../models/feedbackModel")).default;
  const { connectToDB } = await import("../utils/db");

  try {
    await connectToDB();
    const unredFeedback = await FeedbackModel.find({ red: false }).lean();

    //If unred feedback is empty
    if (!unredFeedback.length) {
      return {
        ok: true,
        feedback: [],
      };
    }

    const feedbackWithStringIds = unredFeedback.map((item) => ({
      ...item,
      _id: item._id.toString(),
    }));

    return {
      ok: true,
      feedback: feedbackWithStringIds,
    };
  } catch (error) {
    throw new Response("serverSideError", { status: 500 });
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

  //Get form data
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

  //Import db modules
  const mongoose = await import("mongoose");
  const { connectToDB } = await import("../utils/db");
  const FeedbackModel = (await import("../models/feedbackModel")).default;

  try {
    await connectToDB();

    await FeedbackModel.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(itemId) },
      { red: true },
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

export default AdminFeedbackUnred;
