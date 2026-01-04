import type { ActionFunction } from "react-router";

export const action: ActionFunction = async ({ request, params }) => {
  //Import DB modules
  const { connectToDB } = await import("~/utils/db");
  const ServiceModel = (await import("~/models/serviceModel")).default;
  const mongoose = await import("mongoose");

  const { selectedServiceCategory, itemId } = params;

  //Validate params
  const paramsValidationErrors: Record<string, boolean> = {};
  if (!selectedServiceCategory || typeof selectedServiceCategory !== "string") {
    paramsValidationErrors.noParentItemProvided = true;
  }
  if (!itemId || typeof itemId !== "string") {
    paramsValidationErrors.noItemProvided = true;
  }

  //If any validation errors exists - send ok:false (Will be remade into redirect)
  if (Object.keys(paramsValidationErrors).length > 0) {
    return {
      ok: false,
      errors: { ...paramsValidationErrors },
    };
  }

  try {
    await connectToDB();
    await ServiceModel.updateOne(
      {
        _id: new mongoose.Types.ObjectId(selectedServiceCategory as string),
      },
      {
        $pull: {
          content: { _id: new mongoose.Types.ObjectId(itemId) },
        },
      }
    );
    return {
      ok: true,
    };
  } catch (error) {
    return {
      ok: false,
      error,
    };
  }

  return null;
};
