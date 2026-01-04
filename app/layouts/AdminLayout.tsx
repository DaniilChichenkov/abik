import type { LoaderFunction, LoaderFunctionArgs } from "react-router";
import { Outlet, redirect } from "react-router";
import { useEffect } from "react";

//Session
import { getSession } from "~/utils/session";

//UI-components
import { Drawer, Modal, BetterModal } from "~/components/admin";

import useAdminFeedbackLengthStore from "~/stores/adminUnredFeedbackStore";
import useAdminPendingRequestsLength from "~/stores/adminPendingRequestsLengthStore";

export const meta = () => [{ name: "robots", content: "noindex,nofollow" }];

type Props = {
  loaderData: {
    ok: boolean;
    unredFeedbackMessages: number;
    pendingRequests: number;
  };
};
const AdminLayout = ({ loaderData }: Props) => {
  const setLength = useAdminFeedbackLengthStore((state) => state.setLength);
  const setPendingRequestsLength = useAdminPendingRequestsLength(
    (state) => state.setLength
  );

  useEffect(() => {
    if (loaderData && loaderData.ok) {
      setLength(
        loaderData.unredFeedbackMessages ? loaderData.unredFeedbackMessages : 0
      );
      setPendingRequestsLength(
        loaderData.pendingRequests ? loaderData.pendingRequests : 0
      );
    }
  }, [loaderData]);

  return (
    <>
      <Drawer>
        <Outlet />
      </Drawer>
      <Modal />
      <BetterModal />
    </>
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

  //Set default language (If not provided in url)
  const url = new URL(request.url);
  const lang = url.searchParams.get("lang");

  if (!lang) {
    url.searchParams.set("lang", "ru");
    return redirect(`${url.pathname}?${url.searchParams.toString()}`);
  }

  //Import db modules
  const FeedbackModel = (await import("../models/feedbackModel")).default;
  const ServiceRequestModel = (await import("../models/serviceRequestModel"))
    .default;
  const { connectToDB } = await import("../utils/db");

  //Get length of unred feedback messages
  try {
    await connectToDB();
    const unredFeedback = await FeedbackModel.countDocuments({ red: false });
    const pendingRequests = await ServiceRequestModel.countDocuments({
      completed: false,
    });

    return {
      ok: true,
      unredFeedbackMessages: unredFeedback,
      pendingRequests,
    };
  } catch (error) {
    throw new Response("serverSideError", { status: 500 });
  }
};

export default AdminLayout;
