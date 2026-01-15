import {
  Outlet,
  redirect,
  type ActionFunction,
  type ActionFunctionArgs,
  type LoaderFunction,
} from "react-router";
import { useState } from "react";

import {
  Header,
  NewCategoryForm,
  CategorySelectionList,
} from "~/components/admin/gallery";

type Props = {
  actionData?: {
    ok: boolean;
    errors: Record<string, boolean>;
  };
  loaderData?: {
    _id: string;
    title: {
      ee: string;
      ru: string;
    };
    content: [];
  }[];
};
const AdminGallery = ({ actionData, loaderData }: Props) => {
  //Handle category form visibility
  const [newCategoryFormVisible, setNewCategoryFormVisible] = useState(false);
  const toggleNewCategoryForm = () => {
    setNewCategoryFormVisible((prev) => !prev);
  };

  return (
    <section className="w-full">
      <Header />
      <NewCategoryForm
        toggleNewCategoryForm={toggleNewCategoryForm}
        isVisible={newCategoryFormVisible}
        errors={actionData ? actionData.errors : null}
      />
      <CategorySelectionList
        categories={loaderData || []}
        toggleNewCategoryForm={toggleNewCategoryForm}
        isCategoryCreationFormOpen={newCategoryFormVisible}
      />

      {/* Selected category */}
      <Outlet />
    </section>
  );
};

export const loader: LoaderFunction = async () => {
  //Import DB modules
  const { connectToDB } = await import("~/utils/db");
  const GalleryModel = (await import("~/models/galleryModel")).default;

  try {
    //Fetch gallery categories from database
    await connectToDB();
    const galleryCategories = (
      await GalleryModel.find({}, { __v: 0 }).lean()
    ).map((item) => ({
      ...item,
      _id: item._id.toString(),
    }));

    return galleryCategories;
  } catch (error) {
    return {
      ok: false,
      errors: {
        serverSideError: true,
      },
    };
  }
};

export const action: ActionFunction = async ({
  request,
}: ActionFunctionArgs) => {
  //Import DB modules
  const { connectToDB } = await import("~/utils/db");
  const GalleryModel = (await import("~/models/galleryModel")).default;
  const fs = await import("fs/promises");
  const path = await import("path");

  //Get form data
  const formData = await request.formData();
  const newCategoryNameEE = formData.get("newCategoryNameEE");
  const newCategoryNameRU = formData.get("newCategoryNameRU");

  //Validate form fields
  const formValidationErrors: Record<string, boolean> = {};
  if (!newCategoryNameEE || typeof newCategoryNameEE !== "string") {
    formValidationErrors.noCategoryNameEE = true;
  }
  if (!newCategoryNameRU || typeof newCategoryNameRU !== "string") {
    formValidationErrors.noCategoryNameRU = true;
  }

  //If any validation errors exists - send ok:false
  if (Object.keys(formValidationErrors).length > 0) {
    return {
      ok: false,
      errors: { ...formValidationErrors },
    };
  }

  //Try to create new record in db
  try {
    await connectToDB();

    //Create record in db
    const createdGallery = await GalleryModel.create({
      title: {
        ee: newCategoryNameEE as string,
        ru: newCategoryNameRU as string,
      },
    });

    //Create folder to store images in gallery
    const storageFolderPath = path.join(
      process.cwd(),
      "public",
      "gallery",
      createdGallery._id.toString()
    );
    await fs.mkdir(storageFolderPath, { recursive: true });

    const url = new URL(request.url);
    return redirect(`/admin/gallery${url.search}`);
  } catch (error: any) {
    //Handle duplicate keys error
    if (error?.code === 11000) {
      const duplicatedFields = Object.keys(error.keyValue ?? {})[0];

      const errorsForClient: Record<string, boolean> = {};

      if (duplicatedFields === "title.ee") {
        errorsForClient.duplicatedFieldEE = true;
      } else if (duplicatedFields === "title.ru") {
        errorsForClient.duplicatedFieldRU = true;
      }

      return {
        ok: false,
        errors: {
          ...errorsForClient,
        },
      };
    }

    console.log(error);

    return {
      ok: false,
      errors: {
        serverSideError: true,
      },
    };
  }
};

export default AdminGallery;
