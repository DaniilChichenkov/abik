import type { ActionFunction, ActionFunctionArgs } from "react-router";

export const action: ActionFunction = async ({
  request,
}: ActionFunctionArgs) => {
  //Get form data
  const formData = await request.formData();
  // const name = formData.get("name");
  const email = formData.get("email");
  const message = formData.get("message");
  const agreedToProceed = formData.get("agreedToProceed");
  const honeypot = formData.get("website");
  const ts = formData.get("ts");

  if (!agreedToProceed || agreedToProceed !== "on") {
    return {
      ok: false,
      errors: {
        proceedAgreementWasNotProvided: true,
      },
    };
  }

  //If honeypot is filled -> request was submitted by bot (Pretend success but not proceed)
  if (typeof honeypot === "string" && honeypot.trim().length > 0) {
    return { ok: true };
  }

  //Validate form fields
  if (
    // !name ||
    !email ||
    !message ||
    !ts ||
    // typeof name !== "string" ||
    typeof email !== "string" ||
    typeof message !== "string" ||
    typeof ts !== "string"
  ) {
    return {
      ok: false,
      errors: {
        noCredentialsProvided: true,
      },
    };
  }

  //Validate timestamp
  const tsNum = Number(ts);
  if (!Number.isFinite(tsNum)) {
    return { ok: false, errors: { invalidTs: true } };
  }

  //Refuse instant post requests
  const now = Date.now();
  if (now - tsNum < 1500) {
    return {
      ok: true,
    };
  }

  //Refuse too old requests
  if (now - tsNum > 1000 * 60 * 60) {
    return {
      ok: false,
      errors: { formExpired: true },
      resultId: Date.now().toString(),
    };
  }

  //Refuse huge texts
  if (message.length > 200) {
    return {
      ok: false,
      errors: {
        hugeMessage: true,
      },
      resultId: Date.now().toString(),
    };
  }

  //Validate email
  if (!email.includes("@") || email.length > 200) {
    return {
      ok: false,
      errors: { invalidEmail: true },
      resultId: Date.now().toString(),
    };
  }

  //Import DB
  const { connectToDB } = await import("../utils/db");
  const FeedbackModel = (await import("../models/feedbackModel")).default;

  try {
    await connectToDB();
    await FeedbackModel.create({
      // name,
      email,
      message,
    });

    return {
      ok: true,
      resultId: Date.now().toString(),
    };
  } catch (error) {
    return {
      ok: false,
      errors: {
        errorDuringRequest: true,
      },
      resultId: Date.now().toString(),
    };
  }
};
