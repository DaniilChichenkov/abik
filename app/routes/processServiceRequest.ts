import type { ActionFunction, ActionFunctionArgs } from "react-router";

export const action: ActionFunction = async ({
  request,
}: ActionFunctionArgs) => {
  //Get and validate form data
  const formData = await request.formData();
  const email = formData.get("serviceRequestEmail");
  const selectedServiceCategoryId = formData.get("selectedServiceCategoryId");
  const selectedServiceId = formData.get("selectedServiceId");
  const phoneNumber = formData.get("serviceRequestTel");
  const agreement = formData.get("serviceRequestAgreedToProceed");
  const honeypot = formData.get("website");
  const ts = formData.get("ts");

  if (!agreement || agreement !== "on") {
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
    !email ||
    !ts ||
    !selectedServiceCategoryId ||
    !selectedServiceId ||
    typeof email !== "string" ||
    typeof ts !== "string" ||
    typeof selectedServiceCategoryId !== "string" ||
    typeof selectedServiceId !== "string"
  ) {
    return {
      ok: false,
      errors: {
        noCredentialsProvided: true,
        resultId: Date.now().toString(),
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

  //Validate email
  if (!email.includes("@") || email.length > 200) {
    return {
      ok: false,
      errors: { invalidEmail: true },
      resultId: Date.now().toString(),
    };
  }

  //Create record in db
  try {
    const mongoose = await import("mongoose");
    const { connectToDB } = await import("../utils/db");
    const ServiceModel = (await import("../models/serviceModel")).default;
    const ServiceRequestModel = (await import("../models/serviceRequestModel"))
      .default;

    await connectToDB();

    //Find data about selected service category and service itself
    const serviceCategoryFromDB = await ServiceModel.findOne(
      { "content._id": new mongoose.Types.ObjectId(selectedServiceId) },
      {
        title: 1,
        content: {
          $elemMatch: { _id: new mongoose.Types.ObjectId(selectedServiceId) },
        },
      }
    );

    if (!serviceCategoryFromDB || !serviceCategoryFromDB.content.length) {
      throw new Error("noCategoryFound");
    }

    await ServiceRequestModel.create({
      email,
      phoneNumber:
        phoneNumber && typeof phoneNumber === "string" ? phoneNumber : null,
      serviceCategory: {
        title: {
          ee: serviceCategoryFromDB.title!.ee,
          ru: serviceCategoryFromDB.title!.ru,
        },
      },
      service: {
        title: {
          ee: serviceCategoryFromDB.content[0].ee,
          ru: serviceCategoryFromDB.content[0].ru,
        },
        price:
          serviceCategoryFromDB.content[0].price === "volumeBased"
            ? "volumeBased"
            : +serviceCategoryFromDB.content[0].price,
        priceType: serviceCategoryFromDB.content[0].priceType,
      },
    });

    return {
      ok: true,
      resultId: Date.now().toString(),
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      errors: { serverSideError: true },
      resultId: Date.now().toString(),
    };
  }
};
