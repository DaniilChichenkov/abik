import {
  redirect,
  type ActionFunction,
  type ActionFunctionArgs,
} from "react-router";
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
  const GalleryModel = (await import("~/models/galleryModel")).default;
  const mongoose = await import("mongoose");
  const fs = await import("fs/promises");
  const path = await import("path");

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
    //Delete category from db
    await connectToDB();
    await GalleryModel.deleteOne({
      _id: new mongoose.Types.ObjectId(itemId as string),
    });

    //Delete folder with gallery content
    const folderPath = path.join(
      process.cwd(),
      "public",
      "gallery",
      String(itemId),
    );
    await fs.rm(folderPath, { recursive: true, force: true });

    return {
      ok: true,
    };
  } catch (error) {
    return {
      ok: false,
      error,
    };
  }
};
