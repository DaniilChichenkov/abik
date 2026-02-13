import {
  redirect,
  type ActionFunction,
  type ActionFunctionArgs,
} from "react-router";

import path from "path";
import fs from "fs/promises";
import { getSession } from "~/utils/session";

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
    const deletedCategory = await ServiceModel.findOneAndDelete(
      {
        _id: new mongoose.Types.ObjectId(itemId as string),
      },
      {
        new: true,
      },
    );

    //Remove folder with icons for this category
    if (deletedCategory) {
      const pathToFolder = path.join(
        process.cwd(),
        "public",
        "services",
        deletedCategory._id.toString(),
      );
      await fs.rm(pathToFolder, { recursive: true, force: true });
    }

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
