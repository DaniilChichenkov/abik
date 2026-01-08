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

//Modal store
import useAdminModalStore from "~/stores/adminModalStore";

const translations = {
  price: {
    ru: "Цена:",
    ee: "Hind:",
  },
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
  service: {
    ru: "Услуга",
    ee: "Teenus",
  },
  perHour: {
    ru: "За час",
    ee: "Tunni kohta",
  },
  perService: {
    ru: "За всю услугу",
    ee: "Kogu teenuse eest",
  },
  priceType: {
    ru: "Тип расчёта",
    ee: "Arvestuse tüüp",
  },
};

type ContentItemProps = {
  id: string;
  price: number;
  titleRU: string;
  titleEE: string;
  parentId: string;
  priceType: "perHour" | "perService";
};
const AdminSelectedServiceCategoryContentItem = ({
  id,
  parentId,
  price,
  titleEE,
  titleRU,
  priceType,
}: ContentItemProps) => {
  const openModal = useAdminModalStore((state) => state.openModal);
  const setActionRoute = useAdminModalStore((state) => state.setActionRoute);
  const setItemId = useAdminModalStore((state) => state.setItemId);

  const location = useLocation();

  const [searchParams] = useSearchParams();
  const lang = searchParams.get("lang") as "ee" | "ru";

  return (
    <div className="card w-full bg-base-100 card-md shadow-sm">
      <div className="card-body">
        <h2 className="card-title">{lang === "ee" ? titleEE : titleRU}</h2>
        <p className="text-lg">
          {translations.price[lang]} {price}
        </p>
        <p className="text-lg">
          {translations.priceType[lang]} : {translations[priceType][lang]}
        </p>

        <div className="justify-end card-actions">
          <NavLink
            to={{
              pathname: `/admin/services/${parentId}/${id}/change`,
              search: location.search,
            }}
            className="btn btn-primary"
          >
            <PencilLine />
          </NavLink>

          <button
            onClick={() => {
              //Open "delete" modal
              openModal("delete");

              //Set id of item on which action will be performed
              setItemId(id);
              setActionRoute(
                `/admin/services/${parentId}/${id}/delete${location.search}`
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
};

type Props = {
  loaderData: {
    _id: string;
    title: {
      ee: string;
      ru: string;
    };
    content: {
      price: number;
      ee: string;
      ru: string;
      _id: string;
      priceType: "perHour" | "perService";
    }[];
  };
};
const AdminSelectedServiceCategory = ({ loaderData }: Props) => {
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
                    pathname: `/admin/services/${loaderData._id}/rename`,
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
                      `/admin/services/${loaderData._id}/delete${search}`
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
        {pathname !== `/admin/services/${loaderData._id}/new` && (
          <NavLink
            to={{
              pathname: `/admin/services/${loaderData._id}/new`,
              search,
            }}
            className="btn btn-neutral btn-wide mt-5"
          >
            {" "}
            <Plus />
            {translations.service[lang]}{" "}
          </NavLink>
        )}
      </header>

      {/* Content of category */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 md:gap-x-10 gap-y-10 mt-10">
        {loaderData.content.map((item) => (
          <AdminSelectedServiceCategoryContentItem
            parentId={loaderData._id}
            id={item._id}
            titleEE={item.ee}
            titleRU={item.ru}
            price={item.price}
            key={item._id}
            priceType={item.priceType}
          />
        ))}
      </div>
    </article>
  );
};

export const ErrorBoundary = () => {
  const error = useRouteError();

  return <p>something went wrong</p>;
};

export const loader: LoaderFunction = async ({
  request,
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
      { __v: 0 }
    ).lean();

    if (!serviceCategory) {
      const url = new URL(request.url);
      return redirect(`/admin/services${url.search}`);
    }

    //Change _id of each category`s content item to string
    const content = serviceCategory.content.map((item) => ({
      ...item,
      _id: item._id.toString(),
    }));

    return {
      ...serviceCategory,
      _id: serviceCategory?._id.toString(),
      content,
    };
  } catch (error) {
    throw new Response("serverSideError", { status: 500 });
  }
};

export default AdminSelectedServiceCategory;
