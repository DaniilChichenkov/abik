import {
  useSearchParams,
  type ActionFunction,
  type ActionFunctionArgs,
  type LoaderFunction,
} from "react-router";

import { Header, FeedbackList } from "~/components/admin/feedback";

const translations = {
  headerContent: {
    ru: "Прочитанные сообщения обратной связи",
    ee: "Loetud tagasiside sõnumid",
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
const AdminFeedbackRed = ({ loaderData }: Props) => {
  const [searchParams] = useSearchParams();
  const lang = searchParams.get("lang") as "ee" | "ru";

  return (
    <section className="w-full">
      <Header content={translations.headerContent[lang]} />
      <FeedbackList content={loaderData.feedback} type="red" />
    </section>
  );
};

export const loader: LoaderFunction = async () => {
  const { connectToDB } = await import("../utils/db");
  const FeedbackModel = (await import("../models/feedbackModel")).default;

  try {
    await connectToDB();
    const feedbackRed = await FeedbackModel.find({ red: true }).lean();
    if (!feedbackRed.length) {
      return {
        ok: true,
        feedback: [],
      };
    }
    const feedbackWithStrinFormatIds = feedbackRed.map((item) => ({
      ...item,
      _id: item._id.toString(),
    }));

    return {
      ok: true,
      feedback: feedbackWithStrinFormatIds,
    };
  } catch (error) {
    throw new Response("serverSideError", { status: 500 });
  }
};

export const action: ActionFunction = async ({
  request,
}: ActionFunctionArgs) => {
  //Delete item
  if (request.method === "DELETE") {
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

      await FeedbackModel.findOneAndDelete({
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
  }
  return null;
};

export default AdminFeedbackRed;
