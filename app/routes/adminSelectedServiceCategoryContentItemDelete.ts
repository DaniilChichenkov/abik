import { redirect, type ActionFunction } from "react-router";

import path from "path";
import fs from "fs/promises";
import { getSession } from "~/utils/session";

export const action: ActionFunction = async ({ request, params }) => {
  //Check for authentication
  const cookieHeader = request.headers.get("Cookie");
  const session = await getSession(cookieHeader);

  //If user is unauthorized
  if (!session.get("isAdmin")) {
    return redirect("/login");
  }

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

    //Remove record from db
    const changedRecord = await ServiceModel.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(selectedServiceCategory as string),
      },
      {
        $pull: {
          content: { _id: new mongoose.Types.ObjectId(itemId) },
        },
      },
      {
        new: false,
        runValidators: true,
      },
    );

    //Find item by id (Which was removed)
    if (changedRecord) {
      const removedItem = changedRecord.content.find(
        (item) => item._id.toString() === itemId,
      );

      if (
        removedItem &&
        removedItem.pathToIcon &&
        removedItem.pathToIcon.length > 0
      ) {
        //Get path to file
        const pathToFile = path.join(
          process.cwd(),
          "public",
          "services",
          removedItem.pathToIcon,
        );

        //Remove file
        await fs.unlink(pathToFile);
      }
    }

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
