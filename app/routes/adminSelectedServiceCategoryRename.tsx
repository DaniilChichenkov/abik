import {
  Form,
  redirect,
  useLocation,
  useNavigate,
  type ActionFunction,
  type ActionFunctionArgs,
  type LoaderFunction,
  type LoaderFunctionArgs,
} from "react-router";
import { useState } from "react";

import { X } from "lucide-react";

type Props = {
  loaderData: {
    _id: string;
    title: {
      ee: string;
      ru: string;
    };
  };
  actionData: {
    ok: boolean;
    errors: Record<string, boolean>;
  };
};
const AdminSelectedCategoryRename = ({ loaderData, actionData }: Props) => {
  const [categoryNameEE, setCategoryNameEE] = useState(loaderData.title.ee);
  const [categoryNameRU, setCategoryNameRU] = useState(loaderData.title.ru);

  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="card bg-base-100 shadow-md w-full md:w-[20rem] mt-5 relative">
      <div className="card-body w-full">
        <Form method="POST" action={`.${location.search}`}>
          {/* New name est */}
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Change title (est)</legend>
            <input
              name="newCategoryNameEE"
              type="text"
              className={`input ${actionData?.errors && actionData.errors.duplicatedFieldEE && "input-error"}`}
              placeholder="Type here"
              value={categoryNameEE}
              onChange={(e) => setCategoryNameEE(e.target.value)}
              required
            />
            {actionData?.errors && actionData.errors.duplicatedFieldEE ? (
              <p className="label text-red-500">
                Category name is already taken
              </p>
            ) : null}
          </fieldset>

          {/* New name rus */}
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Change title (rus)</legend>
            <input
              name="newCategoryNameRU"
              type="text"
              className={`input ${actionData?.errors && actionData.errors.duplicatedFieldRU && "input-error"}`}
              placeholder="Type here"
              value={categoryNameRU}
              onChange={(e) => setCategoryNameRU(e.target.value)}
              required
            />
            {actionData?.errors && actionData.errors.duplicatedFieldRU ? (
              <p className="label text-red-500">
                Category name is already taken
              </p>
            ) : null}
          </fieldset>

          {/* Hidden input with id of category */}
          <input type="hidden" name="categoryId" value={loaderData._id} />

          <div className="justify-end card-actions mt-5">
            <button className="btn btn-primary">Confirm</button>
          </div>
        </Form>
      </div>

      {/* Close form button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-0 right-0 btn btn-error text-white btn-sm"
      >
        <X />
      </button>
    </div>
  );
};

export const loader: LoaderFunction = async ({
  params,
}: LoaderFunctionArgs) => {
  //Import DB modules
  const { connectToDB } = await import("~/utils/db");
  const ServiceModel = (await import("~/models/serviceModel")).default;
  const mongoose = await import("mongoose");

  //Get param
  const { selectedServiceCategory } = params;

  if (!selectedServiceCategory) {
    throw new Response("noCategoryProvided", { status: 400 });
  }

  try {
    await connectToDB();

    const serviceCategory = await ServiceModel.findOne(
      {
        _id: new mongoose.Types.ObjectId(selectedServiceCategory),
      },
      { __v: 0, content: 0 }
    ).lean();

    if (!serviceCategory) {
      throw new Response("noCategoryFound", { status: 404 });
    }

    return {
      ...serviceCategory,
      _id: serviceCategory?._id.toString(),
    };
  } catch (error) {
    throw new Response("serverSideError", { status: 500 });
  }
};

export const action: ActionFunction = async ({
  request,
}: ActionFunctionArgs) => {
  //Import DB modules
  const { connectToDB } = await import("~/utils/db");
  const ServiceModel = (await import("~/models/serviceModel")).default;
  const mongoose = await import("mongoose");

  //Get form data
  const formData = await request.formData();
  const newCategoryNameEE = formData.get("newCategoryNameEE");
  const newCategoryNameRU = formData.get("newCategoryNameRU");
  const categoryId = formData.get("categoryId");

  //Validate form fields
  const formValidationErrors: Record<string, boolean> = {};
  if (!newCategoryNameEE || typeof newCategoryNameEE !== "string") {
    formValidationErrors.noCategoryNameEE = true;
  }
  if (!newCategoryNameRU || typeof newCategoryNameRU !== "string") {
    formValidationErrors.noCategoryNameRU = true;
  }
  if (!categoryId || typeof categoryId !== "string") {
    formValidationErrors.noCategoryId = true;
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

    await ServiceModel.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(categoryId as string),
      },
      {
        title: {
          ee: newCategoryNameEE,
          ru: newCategoryNameRU,
        },
      }
    );

    const url = new URL(request.url);
    return redirect(`/admin/services/${categoryId}${url.search}`);
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

export default AdminSelectedCategoryRename;
