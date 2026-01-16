import {
  Form,
  useNavigate,
  redirect,
  type ActionFunction,
  type ActionFunctionArgs,
  useLocation,
  useSearchParams,
  NavLink,
} from "react-router";
import { X } from "lucide-react";
import { useState } from "react";

const translations = {
  newServiceTitle: {
    ru: "Новое название услуги",
    ee: "Uue teenuse nimetus",
  },
  typeHere: {
    ru: "Введите здесь",
    ee: "Sisestage siia",
  },
  serviceTitleTaken: {
    ru: "Название услуги уже занято",
    ee: "Teenuse nimi on juba kasutusel",
  },
  servicePrice: {
    ru: "Цена услуги",
    ee: "Teenuse hind",
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
  priceType: {
    ru: "Тип расчёта",
    ee: "Arvestuse tüüp",
  },
  errorSelectTariff: {
    ru: "Необходимо выбрать тариф",
    ee: "Tuleb valida tariif",
  },
  volumeBased: {
    ru: "От объема",
    ee: "Sõltub mahust",
  },
  additionalInfo: {
    ru: "Дополнительная информация",
    ee: "Lisainfo",
  },
};

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
  params: {
    selectedServiceCategory: string;
  };
};
const AdminSelectedServiceCategoryNewService = ({
  loaderData,
  actionData,
  params,
}: Props) => {
  const navigate = useNavigate();

  const [serviceTitleEE, setServiceTitleEE] = useState<string>("");
  const [serviceTitleRU, setServiceTitleRU] = useState<string>("");
  const [servicePrice, setServicePrice] = useState<string>("");

  const location = useLocation();

  const [searchParams] = useSearchParams();
  const lang = searchParams.get("lang") as "ee" | "ru";

  //Track selected tariff and if "volumeBased" selected - hide price input
  const [isVolumeBasedTariffSelected, setIsVolumeBasedTariffSelected] =
    useState(false);

  //Track additional info input language
  const [additionalInfoInputLanguage, setAdditionalInfoInputLanguage] =
    useState<"ru" | "ee">("ee");
  const [
    additionalInfoInputLanguageDropdownOpen,
    setAdditionalInfoInputLanguageDropdownOpen,
  ] = useState(false);

  const handleAdditionalInfoInputDropdownClick = (lang: "ru" | "ee") => {
    setAdditionalInfoInputLanguage(lang);
    setAdditionalInfoInputLanguageDropdownOpen(false);
  };

  return (
    <div className="card bg-base-100 shadow-md w-full md:w-[20rem] mt-5 relative">
      <div className="card-body w-full">
        <Form method="POST" action={`.${location.search}`}>
          {/* New name est */}
          <fieldset className="fieldset">
            <legend className="fieldset-legend">
              {translations.newServiceTitle[lang]} (est)
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
            {actionData?.errors && actionData.errors.duplicatedFieldEE ? (
              <p className="label text-red-500">
                {translations.serviceTitleTaken[lang]}
              </p>
            ) : null}
          </fieldset>

          {/* New name rus */}
          <fieldset className="fieldset">
            <legend className="fieldset-legend">
              {translations.newServiceTitle[lang]} (rus)
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
            {actionData?.errors && actionData.errors.duplicatedFieldRU ? (
              <p className="label text-red-500">
                {translations.serviceTitleTaken[lang]}
              </p>
            ) : null}
          </fieldset>

          {/* New service price */}
          <fieldset className="fieldset">
            <legend
              className={`${isVolumeBasedTariffSelected && "hidden"} fieldset-legend`}
            >
              {translations.servicePrice[lang]}
            </legend>
            <input
              name="newServicePrice"
              type={isVolumeBasedTariffSelected ? "hidden" : "string"}
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
            {actionData?.errors && actionData.errors.duplicatedFieldRU ? (
              <p className="label text-red-500">
                {translations.serviceTitleTaken[lang]}
              </p>
            ) : null}
          </fieldset>

          {/* Tariff selection */}
          <fieldset className="fieldset">
            <legend className="fieldset-legend">
              {translations.priceType[lang]}
            </legend>
            <select
              id="tariffSelect"
              name="priceType"
              defaultValue="Pick a browser"
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
              <option disabled={true}>{translations.selectTariff[lang]}</option>
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

          {/* Additional info */}
          <fieldset className="fieldset mt-5">
            <div className="w-full flex justify-between items-center">
              <legend className="fieldset-legend">
                {translations.additionalInfo[lang]}
              </legend>

              {/* Language selection dropdown */}
              <details
                className="dropdown dropdown-end"
                open={additionalInfoInputLanguageDropdownOpen}
              >
                <summary
                  onClick={(e) => {
                    e.preventDefault();
                    setAdditionalInfoInputLanguageDropdownOpen((prev) => !prev);
                  }}
                  className="btn m-1"
                >
                  {additionalInfoInputLanguage}
                </summary>
                <ul className="menu dropdown-content bg-base-100 rounded-box z-1 w-16 p-2 shadow-sm space-y-2">
                  <li>
                    <button
                      type="button"
                      className={`btn flex justify-center ${additionalInfoInputLanguage === "ee" && "btn-primary"}`}
                      onClick={() =>
                        handleAdditionalInfoInputDropdownClick("ee")
                      }
                    >
                      ee
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className={`btn flex justify-center ${additionalInfoInputLanguage === "ru" && "btn-primary"}`}
                      onClick={() =>
                        handleAdditionalInfoInputDropdownClick("ru")
                      }
                    >
                      ru
                    </button>
                  </li>
                </ul>
              </details>
            </div>
            <textarea
              name="serviceAdditionalInfoEE"
              className={`textarea h-24 ${additionalInfoInputLanguage === "ru" && "hidden"}`}
              placeholder={translations.typeHere[lang]}
            ></textarea>

            <textarea
              name="serviceAdditionalInfoRU"
              className={`textarea h-24 ${additionalInfoInputLanguage === "ee" && "hidden"}`}
              placeholder={translations.typeHere[lang]}
            ></textarea>
          </fieldset>

          {/* Hidden input with id of category (To which category service will be added) */}
          <input
            type="hidden"
            name="serviceCategoryToAppendId"
            value={params.selectedServiceCategory}
          />

          <div className="justify-end card-actions mt-5">
            <button className="btn btn-primary">
              {translations.confirm[lang]}
            </button>
          </div>
        </Form>
      </div>

      {/* Close form button */}
      {/* <button
        onClick={() => navigate(-1)}
        className="absolute top-0 right-0 btn btn-error text-white btn-sm"
      >
        <X />
      </button> */}
      <NavLink
        to={`/admin/services/${params.selectedServiceCategory}?${searchParams.toString()}`}
        className="absolute top-0 right-0 btn btn-error text-white btn-sm"
      >
        <X />
      </NavLink>
    </div>
  );
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
  const newServicePriceType = formData.get("priceType");
  const categoryToAppendItemIn = formData.get("serviceCategoryToAppendId");
  const newServiceAdditionalInfoRU = formData.get("serviceAdditionalInfoRU");
  const newServiceAdditionalInfoEE = formData.get("serviceAdditionalInfoEE");

  //Validate form fields
  const formValidationErrors: Record<string, boolean> = {};
  if (!newServiceTitleEE || typeof newServiceTitleEE !== "string") {
    formValidationErrors.newServiceTitleEE = true;
  }
  if (!newServiceTitleRU || typeof newServiceTitleRU !== "string") {
    formValidationErrors.newServiceTitleRU = true;
  }
  if (
    !newServicePrice ||
    (typeof +newServicePrice !== "number" && newServicePrice !== "volumeBased")
  ) {
    formValidationErrors.noNewServicePrice = true;
  }
  if (!categoryToAppendItemIn || typeof categoryToAppendItemIn !== "string") {
    formValidationErrors.categoryToAppendItemIn = true;
  }
  if (!newServicePriceType || typeof newServicePriceType !== "string") {
    formValidationErrors.newServicePriceType = true;
  }
  if (
    newServiceAdditionalInfoRU &&
    typeof newServiceAdditionalInfoRU !== "string"
  ) {
    formValidationErrors.invalidAdditionalInfo = true;
  }
  if (
    newServiceAdditionalInfoEE &&
    typeof newServiceAdditionalInfoEE !== "string"
  ) {
    formValidationErrors.invalidAdditionalInfo = true;
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

    //Push new service into category
    await ServiceModel.updateOne(
      {
        _id: new mongoose.Types.ObjectId(categoryToAppendItemIn as string),
      },
      {
        $push: {
          content: {
            price: newServicePrice,
            ee: newServiceTitleEE,
            ru: newServiceTitleRU,
            priceType: newServicePriceType,
            additionalInfo: {
              ru: newServiceAdditionalInfoRU || "",
              ee: newServiceAdditionalInfoEE || "",
            },
          },
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

export default AdminSelectedServiceCategoryNewService;
