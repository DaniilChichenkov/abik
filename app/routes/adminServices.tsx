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
} from "~/components/admin/services";

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
const AdminServices = ({ actionData, loaderData }: Props) => {
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
  const ServiceModel = (await import("~/models/serviceModel")).default;

  try {
    //Fetch service categories from database
    await connectToDB();
    const serviceCategories = (
      await ServiceModel.find({}, { __v: 0 }).lean()
    ).map((item) => ({
      ...item,
      _id: item._id.toString(),
    }));

    return serviceCategories;
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
  const ServiceModel = (await import("~/models/serviceModel")).default;

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

    await ServiceModel.create({
      title: {
        ee: newCategoryNameEE as string,
        ru: newCategoryNameRU as string,
      },
      content: [],
    });

    const url = new URL(request.url);
    return redirect(`/admin/services${url.search}`);
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
    return {
      ok: false,
      errors: {
        serverSideError: true,
      },
    };
  }
};

export default AdminServices;
