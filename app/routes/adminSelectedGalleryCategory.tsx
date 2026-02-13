import {
  NavLink,
  Outlet,
  type LoaderFunctionArgs,
  type LoaderFunction,
  useRouteError,
  redirect,
  useLocation,
  useSearchParams,
} from "react-router";
import { useRef } from "react";

import { Settings, Trash, PencilLine, Plus } from "lucide-react";

const translations = {
  selectedCategory: {
    ru: "Выбранная категория:",
    ee: "Valitud kategooria:",
  },
  rename: {
    ru: "Переименовать",
    ee: "Nimeta ümber",
  },
  delete: {
    ru: "Удалить",
    ee: "Kustuta",
  },
  images: {
    ru: "Изображения",
    ee: "Pildid",
  },
};

//Modal store
import useAdminModalStore from "~/stores/adminModalStore";
import { getSession } from "~/utils/session";

type Props = {
  loaderData: {
    _id: string;
    title: {
      ee: string;
      ru: string;
    };
    images: string[];
  };
};
const AdminSelectedGalleryCategory = ({ loaderData }: Props) => {
  const openModal = useAdminModalStore((state) => state.openModal);
  const setActionRoute = useAdminModalStore((state) => state.setActionRoute);
  const setItemId = useAdminModalStore((state) => state.setItemId);

  const settingsDropdownRef = useRef<HTMLDetailsElement | null>(null);
  const handleSettingsDropdownButtonClick = () => {
    if (settingsDropdownRef.current) {
      settingsDropdownRef.current.open = false;
    }
  };

  const { pathname, search } = useLocation();

  const [searchParams] = useSearchParams();
  const lang = searchParams.get("lang") as "ee" | "ru";

  return (
    <article className="mt-10">
      {/* Header */}
      <header className="flex flex-col items-start">
        {/* Category name and settings */}
        <div className="flex items-center gap-x-2 text-xl">
          <span className="font-semibold">
            {translations.selectedCategory[lang]}
          </span>{" "}
          {loaderData.title[lang]}
          {/* Settings of a selected category */}
          <details ref={settingsDropdownRef} className="dropdown dropdown-end">
            <summary className="btn m-1">
              <Settings />
            </summary>
            <ul className="menu menu-lg dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
              <li>
                <NavLink
                  to={{
                    pathname: `/admin/gallery/${loaderData._id}/rename`,
                    search,
                  }}
                  onClick={handleSettingsDropdownButtonClick}
                  className="flex justify-between items-center w-full"
                >
                  {translations.rename[lang]} <PencilLine />
                </NavLink>
              </li>
              <li>
                <button
                  onClick={() => {
                    handleSettingsDropdownButtonClick();
                    //Open "delete" modal
                    openModal("delete");

                    //Set id of item on which action will be performed
                    setItemId(loaderData._id);
                    setActionRoute(
                      `/admin/gallery/${loaderData._id}/delete${search}`,
                    );
                  }}
                  className="flex justify-between items-center w-full text-error"
                >
                  {translations.delete[lang]} <Trash />
                </button>
              </li>
            </ul>
          </details>
        </div>

        {/* Forms (Add new item to category / Change current category name) */}
        <Outlet />

        {/* Button to add new item to selected category */}
        {pathname !== `/admin/gallery/${loaderData._id}/new` && (
          <NavLink
            to={{
              pathname: `/admin/gallery/${loaderData._id}/new`,
              search,
            }}
            className="btn btn-neutral btn-wide mt-5"
          >
            {" "}
            <Plus />
            {translations.images[lang]}
          </NavLink>
        )}
      </header>

      {/* Content of category */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 md:gap-x-10 gap-y-10 mt-10">
        {loaderData?.images && loaderData.images.length
          ? loaderData.images.map((item) => {
              //Get name of just image (Not full path)
              const imageNameArr = item.split("/");
              const imageName = imageNameArr[imageNameArr.length - 1];

              return (
                <div
                  key={item}
                  className="card w-full bg-base-100 card-md shadow-sm"
                >
                  <div className="card-body">
                    <h2 className="card-title">{imageName}</h2>
                    <img
                      src={item}
                      alt="#"
                      className="w-full aspect-square mt-2"
                    />
                    <div className="justify-end card-actions">
                      <button
                        onClick={() => {
                          //Open "delete" modal
                          openModal("delete");

                          //Set id of item on which action will be performed
                          setItemId(loaderData._id);
                          setActionRoute(
                            `/admin/gallery/${loaderData._id}/${imageName}/delete${search}`,
                          );
                        }}
                        className="btn btn-error text-white"
                      >
                        <Trash />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          : null}
      </div>
    </article>
  );
};

export const ErrorBoundary = () => {
  const error = useRouteError();

  return <p>something went wrong</p>;
};

export const loader: LoaderFunction = async ({
  params,
  request,
}: LoaderFunctionArgs) => {
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

  //Get param
  const { selectedGalleryCategory } = params;

  if (!selectedGalleryCategory) {
    throw new Response("noCategoryProvided", { status: 400 });
  }

  try {
    await connectToDB();

    const galleryCategory = await GalleryModel.findOne(
      {
        _id: new mongoose.Types.ObjectId(selectedGalleryCategory),
      },
      { __v: 0 },
    ).lean();

    if (!galleryCategory) {
      const url = new URL(request.url);
      return redirect(`/admin/gallery${url.search}`);
    }

    //Get content of gallery`s folder (Image paths)
    const folderPath = path.join(
      process.cwd(),
      "public",
      "gallery",
      selectedGalleryCategory,
    );
    const entires = await fs.readdir(folderPath);

    //Build paths for entries
    const entriesWithPaths = entires.map((item) =>
      path.join("/gallery", selectedGalleryCategory, item),
    );

    return {
      ...galleryCategory,
      _id: galleryCategory?._id.toString(),
      images: entriesWithPaths,
    };
  } catch (error) {
    throw new Response("serverSideError", { status: 500 });
  }
};

export default AdminSelectedGalleryCategory;
