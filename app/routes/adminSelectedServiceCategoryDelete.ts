import {
  redirect,
  type ActionFunction,
  type ActionFunctionArgs,
} from "react-router";

export const action: ActionFunction = async ({
  request,
}: ActionFunctionArgs) => {
  //Import DB modules
  const { connectToDB } = await import("~/utils/db");
  const ServiceModel = (await import("~/models/serviceModel")).default;
  const mongoose = await import("mongoose");

  //Get form data
  const formData = await request.formData();
  const itemId = formData.get("itemId");

  //Validate form fields
  const formValidationErrors: Record<string, boolean> = {};
  if (!itemId || typeof itemId !== "string") {
    formValidationErrors.noItemProvided = true;
  }

  //If any validation errors exists - send ok:false (Will be remade into redirect)
  if (Object.keys(formValidationErrors).length > 0) {
    return {
      ok: false,
      errors: { ...formValidationErrors },
    };
  }

  try {
    await connectToDB();
    await ServiceModel.deleteOne({
      _id: new mongoose.Types.ObjectId(itemId as string),
    });
    return {
      ok: true,
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      error,
    };
  }
};
