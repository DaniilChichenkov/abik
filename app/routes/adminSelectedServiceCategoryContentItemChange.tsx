import {
  Form,
  useNavigate,
  type ActionFunction,
  type ActionFunctionArgs,
  type LoaderFunction,
  type LoaderFunctionArgs,
  redirect,
  useLocation,
  useSearchParams,
  NavLink,
} from "react-router";
import { X } from "lucide-react";
import { useState } from "react";

const translations = {
  newServiceTitle: {
    ru: "Новое название услуги",
    ee: "Uus teenuse nimetus",
  },
  typeHere: {
    ru: "Введите здесь",
    ee: "Sisestage siia",
  },
  newServicePrice: {
    ru: "Новая цена услуги",
    ee: "Uus teenuse hind",
  },
  confirm: {
    ru: "Подтвердить",
    ee: "Kinnita",
  },
  selectTariff: {
    ru: "Выберите тариф",
    ee: "Valige tariif",
  },
  perHour: {
    ru: "За час",
    ee: "Tunni kohta",
  },
  perService: {
    ru: "За всю услугу",
    ee: "Kogu teenuse eest",
  },
  volumeBased: {
    ru: "От объема",
    ee: "Sõltub mahust",
  },
  priceType: {
    ru: "Тип расчёта",
    ee: "Arvestuse tüüp",
  },
  errorSelectTariff: {
    ru: "Необходимо выбрать тариф",
    ee: "Tuleb valida tariif",
  },
};

type Props = {
  loaderData: {
    price: number | "volumeBased";
    ee: string;
    ru: string;
    _id: string;
    parentId: string;
    priceType: "perHour" | "perService";
  };
  actionData: {
    ok: boolean;
    errors: Record<string, boolean>;
  };
};
const AdminSelectedServiceCategoryContentItemChange = ({
  loaderData,
  actionData,
}: Props) => {
  const navigate = useNavigate();

  const [serviceTitleEE, setServiceTitleEE] = useState<string>(loaderData.ee);
  const [serviceTitleRU, setServiceTitleRU] = useState<string>(loaderData.ru);
  const [servicePrice, setServicePrice] = useState<string>(
    String(loaderData.price)
  );

  const location = useLocation();

  //Get language
  const [searchParams] = useSearchParams();
  const lang = searchParams.get("lang") as "ee" | "ru";

  //Track selected tariff and if "volumeBased" selected - hide price input
  const [isVolumeBasedTariffSelected, setIsVolumeBasedTariffSelected] =
    useState<null | boolean>(null);

  return (
    <article className="mt-10">
      <div className="card bg-base-100 shadow-md w-full md:w-[20rem] mt-5 relative">
        <div className="card-body w-full">
          <Form method="POST" action={`.${location.search}`}>
            {/* New name est */}
            <fieldset className="fieldset">
              <legend className="fieldset-legend">
                {translations.newServiceTitle[lang]} (EST)
              </legend>
              <input
                name="newServiceTitleEE"
                type="text"
                className={`input ${actionData?.errors && actionData.errors.duplicatedFieldEE && "input-error"}`}
                placeholder={translations.typeHere[lang]}
                value={serviceTitleEE}
                onChange={(e) => setServiceTitleEE(e.target.value)}
                required
              />
              {/* {actionData?.errors && actionData.errors.duplicatedFieldEE ? (
                <p className="label text-red-500">
                  Category name is already taken
                </p>
              ) : null} */}
            </fieldset>

            {/* New name rus */}
            <fieldset className="fieldset">
              <legend className="fieldset-legend">
                {translations.newServiceTitle[lang]} (RUS)
              </legend>
              <input
                name="newServiceTitleRU"
                type="text"
                className={`input ${actionData?.errors && actionData.errors.duplicatedFieldRU && "input-error"}`}
                placeholder={translations.typeHere[lang]}
                value={serviceTitleRU}
                onChange={(e) => setServiceTitleRU(e.target.value)}
                required
              />
              {/* {actionData?.errors && actionData.errors.duplicatedFieldRU ? (
                <p className="label text-red-500">
                  Category name is already taken
                </p>
              ) : null} */}
            </fieldset>

            {/* New service price */}
            <fieldset className="fieldset">
              <legend
                className={`${(isVolumeBasedTariffSelected === null && loaderData.price === "volumeBased") || isVolumeBasedTariffSelected ? "hidden" : ""} fieldset-legend`}
              >
                {translations.newServicePrice[lang]}
              </legend>
              <input
                name="newServicePrice"
                type={
                  (isVolumeBasedTariffSelected === null &&
                    loaderData.price === "volumeBased") ||
                  isVolumeBasedTariffSelected
                    ? "hidden"
                    : "text"
                }
                className={`input ${actionData?.errors && actionData.errors.duplicatedFieldRU && "input-error"}`}
                placeholder={translations.typeHere[lang]}
                value={servicePrice}
                onChange={(e) => {
                  if (!isVolumeBasedTariffSelected) {
                    setServicePrice(e.target.value);
                  }
                }}
                required
              />
            </fieldset>

            {/* Service price type */}
            <fieldset className="fieldset">
              <legend className="fieldset-legend">
                {translations.priceType[lang]}
              </legend>
              <select
                id="tariffSelect"
                name="priceType"
                defaultValue={loaderData.priceType}
                className="select"
                required
                onChange={(e) => {
                  if (e.target.value === "volumeBased") {
                    setIsVolumeBasedTariffSelected(true);
                    setServicePrice("volumeBased");
                  } else {
                    setIsVolumeBasedTariffSelected(false);
                    setServicePrice("");
                  }
                }}
              >
                <option disabled={true}>
                  {translations.selectTariff[lang]}
                </option>
                <option value="perHour">{translations.perHour[lang]}</option>
                <option value="perService">
                  {translations.perService[lang]}
                </option>
                <option value="volumeBased">
                  {translations.volumeBased[lang]}
                </option>
              </select>
              {actionData?.errors && actionData.errors.newServicePriceType ? (
                <p className="label text-red-500">
                  {translations.errorSelectTariff[lang]}
                </p>
              ) : null}
            </fieldset>

            {/* Hidden input with id of category (To which category service will be added) */}
            <input
              type="hidden"
              name="serviceCategoryToAppendId"
              value={loaderData.parentId}
            />

            {/* Hidden input with id of item which user trying to change */}
            <input
              type="hidden"
              name="contentItemToChangeId"
              value={loaderData._id}
            />

            <div className="justify-end card-actions mt-5">
              <button className="btn btn-primary">
                {translations.confirm[lang]}
              </button>
            </div>
          </Form>
        </div>

        {/* Close form button */}
        <NavLink
          to={`/admin/services/${loaderData.parentId}?${searchParams.toString()}`}
          className="absolute top-0 right-0 btn btn-error text-white btn-sm"
        >
          <X />
        </NavLink>
      </div>
    </article>
  );
};

export const loader: LoaderFunction = async ({
  params,
}: LoaderFunctionArgs) => {
  //Import DB modules
  const { connectToDB } = await import("~/utils/db");
  const ServiceModel = (await import("~/models/serviceModel")).default;
  const mongoose = await import("mongoose");

  const { selectedServiceCategory, selectedServiceCategoryItem } = params;

  //Validate params
  const paramsValidationErrors: Record<string, boolean> = {};
  if (!selectedServiceCategory || typeof selectedServiceCategory !== "string") {
    paramsValidationErrors.noParentItemProvided = true;
  }
  if (
    !selectedServiceCategoryItem ||
    typeof selectedServiceCategoryItem !== "string"
  ) {
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
    const serviceItem = await ServiceModel.findOne({
      _id: new mongoose.Types.ObjectId(selectedServiceCategory),
    }).lean();

    if (!serviceItem) {
      throw new Response("noServiceItemFound", { status: 404 });
    }

    const serviceItemData = serviceItem.content.filter(
      (item) => item._id.toString() === selectedServiceCategoryItem
    );

    if (!serviceItemData.length) {
      throw new Response("noServiceItemFound", { status: 404 });
    }

    return {
      ok: true,
      parentId: selectedServiceCategory,
      ...serviceItemData[0],
      _id: serviceItemData[0]._id.toString(),
    };
  } catch (error) {
    return {
      ok: false,
      error,
    };
  }
};

export const action: ActionFunction = async ({
  request,
}: ActionFunctionArgs) => {
  //Import DB modules
  const { connectToDB } = await import("~/utils/db");
  const ServiceModel = (await import("~/models/serviceModel")).default;
  const mongoose = await import("mongoose");

  //Get data which user submitted
  const formData = await request.formData();
  const newServiceTitleEE = formData.get("newServiceTitleEE");
  const newServiceTitleRU = formData.get("newServiceTitleRU");
  const newServicePrice = formData.get("newServicePrice");
  const categoryToAppendItemIn = formData.get("serviceCategoryToAppendId");
  const contentItemToChange = formData.get("contentItemToChangeId");
  const servicePriceType = formData.get("priceType");

  //Validate form fields
  const formValidationErrors: Record<string, boolean> = {};
  if (!newServiceTitleEE || typeof newServiceTitleEE !== "string") {
    formValidationErrors.newServiceTitleEE = true;
  }
  if (!newServiceTitleRU || typeof newServiceTitleRU !== "string") {
    formValidationErrors.newServiceTitleRU = true;
  }
  if (!newServicePrice || typeof +newServicePrice !== "number") {
    formValidationErrors.noNewServicePrice = true;
  }
  if (!categoryToAppendItemIn || typeof categoryToAppendItemIn !== "string") {
    formValidationErrors.categoryToAppendItemIn = true;
  }
  if (!contentItemToChange || typeof contentItemToChange !== "string") {
    formValidationErrors.contentItemToChange = true;
  }
  if (!servicePriceType || typeof servicePriceType !== "string") {
    formValidationErrors.newServicePriceType = true;
  }

  //If any validation errors exists - send ok:false
  if (Object.keys(formValidationErrors).length > 0) {
    return {
      ok: false,
      errors: { ...formValidationErrors },
    };
  }

  try {
    await connectToDB();

    //Change item
    await ServiceModel.updateOne(
      {
        _id: categoryToAppendItemIn,
        "content._id": contentItemToChange,
      },
      {
        $set: {
          "content.$.ee": newServiceTitleEE,
          "content.$.ru": newServiceTitleRU,
          "content.$.price": newServicePrice,
          "content.$.priceType": servicePriceType,
        },
      }
    );

    const url = new URL(request.url);
    return redirect(`/admin/services/${categoryToAppendItemIn}${url.search}`);
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      errors: {
        serverSideError: true,
      },
    };
  }
};

export default AdminSelectedServiceCategoryContentItemChange;
