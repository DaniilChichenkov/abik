import {
  redirect,
  type ActionFunction,
  type ActionFunctionArgs,
} from "react-router";
import { getSession } from "~/utils/session";

export const action: ActionFunction = async ({
  request,
  params,
}: ActionFunctionArgs) => {
  //Check for authentication
  const cookieHeader = request.headers.get("Cookie");
  const session = await getSession(cookieHeader);

  //If user is unauthorized
  if (!session.get("isAdmin")) {
    return redirect("/login");
  }

  //Get params
  const { selectedGalleryCategory, image } = params;

  //Validate params
  const paramsValidationErrors: Record<string, boolean> = {};
  if (!selectedGalleryCategory || typeof selectedGalleryCategory !== "string") {
    paramsValidationErrors.noSelectedGalleryCategory = true;
  }
  if (!image || typeof image !== "string") {
    paramsValidationErrors.noImage = true;
  }
  if (Object.keys(paramsValidationErrors).length > 0) {
    return {
      ok: false,
      errors: { ...paramsValidationErrors },
    };
  }

  //Import DB modules
  const { connectToDB } = await import("~/utils/db");
  const GalleryModel = (await import("~/models/galleryModel")).default;
  const mongoose = await import("mongoose");

  //Check if gallery exists in db
  try {
    await connectToDB();
    const gallery = await GalleryModel.findOne({
      _id: new mongoose.Types.ObjectId(selectedGalleryCategory),
    });
    if (!gallery) {
      throw new Error("noGalleryFound");
    }
  } catch (error) {
    return {
      ok: false,
      errors: {
        noGalleryExists: true,
      },
    };
  }

  //Import fs modules
  const fs = await import("fs/promises");
  const path = await import("path");

  //Build path to gallery folder
  const folderPath = path.join(
    process.cwd(),
    "public",
    "gallery",
    String(selectedGalleryCategory),
  );

  //Ensure that gallery folder exists
  try {
    const s = await fs.stat(folderPath);
    if (!s.isDirectory()) {
      throw new Error("Not a directory");
    }
  } catch (error) {
    return {
      ok: false,
      errors: {
        noGalleryDirectory: true,
      },
    };
  }

  //Build path to file user wants to delete
  const filePath = path.join(folderPath, path.basename(String(image)));

  //Ensure that it is a file
  try {
    const stats = await fs.stat(filePath);

    if (!stats.isFile()) {
      return { ok: false, errors: { notAFile: true } };
    }
  } catch (error: any) {
    if (error?.code === "ENOENT") {
      return { ok: false, errors: { noFileExists: true } };
    }
    return { ok: false, errors: { errorDuringDelete: true } };
  }

  //Delete file
  try {
    await fs.unlink(filePath);
  } catch (err: any) {
    if (err?.code === "ENOENT") {
      return { ok: false, errors: { noFileExists: true } };
    }
    return { ok: false, errors: { errorDuringDelete: true } };
  }

  return {
    ok: true,
  };
};
