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
import { X, MoveLeft, FileUp } from "lucide-react";
import { useEffect, useState } from "react";
import { fileTypeFromBuffer } from "file-type";
import { v4 as uuidv4 } from "uuid";
import fs from "fs/promises";
import path from "path";
import { getSession } from "~/utils/session";

const ALLOWED_MIMES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);

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
  colorOfButton: {
    ee: "Nupu värv",
    ru: "Цвет кнопки",
  },
  click: {
    ee: "Klõpsa siia",
    ru: "Нажмите здесь",
  },
  uploadFile: {
    ee: "Laadi fail üles",
    ru: "Загрузить файл",
  },
  browseFiles: {
    ee: "Vali fail",
    ru: "Выбрать файл",
  },
  iconPreview: {
    ee: "Ikooni eelvaade",
    ru: "Предпросмотр иконки",
  },
  serviceIcon: {
    ee: "Teenuse ikoon",
    ru: "Иконка услуги",
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

  //Handle color selection
  const [hexColor, setHexColor] = useState<string>("");

  //Handle file selection (Icon for service)
  const [iconFile, setIconFile] = useState<File | null>();
  const [iconFilePreviewUrl, setIconFilePreviewUrl] = useState<string>("");

  useEffect(() => {
    //If file was selected
    if (iconFile) {
      const filePreviewUrl = URL.createObjectURL(iconFile);
      setIconFilePreviewUrl(filePreviewUrl);
    } else {
      URL.revokeObjectURL(iconFilePreviewUrl);
      setIconFilePreviewUrl("");
    }

    //Clear url
    return () => {
      URL.revokeObjectURL(iconFilePreviewUrl);
    };
  }, [iconFile]);

  return (
    <article className="w-full grid grid-cols-1 gap-y-8">
      <Form
        method="POST"
        action={`.${location.search}`}
        encType="multipart/form-data"
        className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-x-10"
      >
        <div className="card bg-base-100 shadow-md w-full md:w-[20rem] mt-5 relative">
          <div className="card-body w-full">
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
                type={isVolumeBasedTariffSelected ? "hidden" : "number"}
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
                      setAdditionalInfoInputLanguageDropdownOpen(
                        (prev) => !prev,
                      );
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
                className={`textarea w-full h-24 ${additionalInfoInputLanguage === "ru" && "hidden"}`}
                placeholder={translations.typeHere[lang]}
              ></textarea>

              <textarea
                name="serviceAdditionalInfoRU"
                className={`textarea w-full h-24 ${additionalInfoInputLanguage === "ee" && "hidden"}`}
                placeholder={translations.typeHere[lang]}
              ></textarea>
            </fieldset>

            {/* Hidden input with id of category (To which category service will be added) */}
            <input
              type="hidden"
              name="serviceCategoryToAppendId"
              value={params.selectedServiceCategory}
            />
          </div>

          {/* Close form button */}
          <NavLink
            to={`/admin/services/${params.selectedServiceCategory}?${searchParams.toString()}`}
            className="absolute top-0 right-0 btn btn-error text-white btn-sm"
          >
            <X />
          </NavLink>
        </div>

        {/* Additional service data (Image and button color) */}
        <div className="card bg-base-100 shadow-md w-full md:w-[20rem] mt-5 relative">
          <div className="card-body w-full">
            {/* Color picker */}
            <fieldset className="fieldset">
              <legend className="fieldset-legend">
                {translations.colorOfButton[lang]}
              </legend>

              {/* Hex value */}
              <div className="flex justify-start items-center">
                <p>HEX:</p>
                <p>{hexColor}</p>
              </div>

              <div className="w-full grid grid-cols-3">
                <input
                  type="color"
                  name="colorOfButton"
                  className="w-full cursor-pointer"
                  onChange={(e) => {
                    setHexColor(e.target.value);
                  }}
                />
                <div className="col-span-2 pl-2 flex items-center justify-start gap-x-2">
                  <MoveLeft />
                  <p>{translations.click[lang]}</p>
                </div>
              </div>
              {/* <p className="label">Optional</p> */}
            </fieldset>

            {/* Icon selector */}
            <fieldset className="fieldset">
              <legend className="fieldset-legend">
                {translations.serviceIcon[lang]}
              </legend>
              <label
                htmlFor="File"
                className="flex flex-col items-center rounded border border-gray-300 p-4 text-gray-900 shadow-sm sm:p-6"
              >
                <FileUp />

                <span className="mt-4 font-medium">
                  {" "}
                  {translations.uploadFile[lang]}{" "}
                </span>

                <span className="mt-2 inline-block rounded border border-gray-200 bg-gray-50 px-3 py-1.5 text-center text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-100">
                  {translations.browseFiles[lang]}
                </span>

                <input
                  type="file"
                  id="File"
                  className="sr-only"
                  name="serviceIcon"
                  accept="image/*"
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files && files.length > 0) {
                      const iconFile = files[0];
                      setIconFile(iconFile);
                    } else {
                      setIconFile(null);
                    }
                  }}
                />
              </label>
            </fieldset>

            {/* Icon preview */}
            {iconFilePreviewUrl.length ? (
              <fieldset className="fieldset">
                <legend className="fieldset-legend">
                  {translations.iconPreview[lang]}:
                </legend>
                <div className="w-full flex justify-center items-center mt-3">
                  <img
                    src={iconFilePreviewUrl}
                    alt="Icon preview url"
                    className="size-32 aspect-square"
                  />
                </div>
              </fieldset>
            ) : null}
          </div>

          {/* Confirm button */}
          <div className="card-actions w-full justify-center mb-5">
            <button className="btn btn-primary">
              {translations.confirm[lang]}
            </button>
          </div>
        </div>
      </Form>
    </article>
  );
};

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

  //Get data which user submitted
  const formData = await request.formData();
  const newServiceTitleEE = formData.get("newServiceTitleEE");
  const newServiceTitleRU = formData.get("newServiceTitleRU");
  const newServicePrice = formData.get("newServicePrice");
  const newServicePriceType = formData.get("priceType");
  const categoryToAppendItemIn = formData.get("serviceCategoryToAppendId");
  const newServiceAdditionalInfoRU = formData.get("serviceAdditionalInfoRU");
  const newServiceAdditionalInfoEE = formData.get("serviceAdditionalInfoEE");
  const newServiceButtonColor = formData.get("colorOfButton");
  const newServiceIconFile = formData.get("serviceIcon");

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
  if (newServiceButtonColor) {
    if (typeof newServiceButtonColor !== "string") {
      formValidationErrors.invalidColorFormat = true;
    }
  }
  if (newServiceIconFile && (newServiceIconFile as File).name.length) {
    if (!(newServiceIconFile instanceof File)) {
      formValidationErrors.invalidFileFormat = true;
    } else {
      const fileBuffer = Buffer.from(await newServiceIconFile.arrayBuffer());
      const fileType = await fileTypeFromBuffer(fileBuffer);
      const mimeFromFile = fileType?.mime ?? "unknown";

      if (!fileType || !ALLOWED_MIMES.has(mimeFromFile)) {
        formValidationErrors.suspiciousFileMime = true;
      }
    }
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

    //Generate uuid for content item
    const uuidForService = uuidv4();

    //Push new service into category
    const updatedServiceCategory = await ServiceModel.findByIdAndUpdate(
      categoryToAppendItemIn,
      {
        $push: {
          content: {
            price:
              newServicePriceType !== "volumeBased"
                ? +newServicePrice!
                : "volumeBased",
            ee: newServiceTitleEE,
            ru: newServiceTitleRU,
            priceType: newServicePriceType,
            additionalInfo: {
              ru: newServiceAdditionalInfoRU || "",
              ee: newServiceAdditionalInfoEE || "",
            },
            colorOfButton: newServiceButtonColor || "",
            id: uuidForService,
          },
        },
      },
      {
        new: true,
        runValidators: true,
      },
    );

    //Handle file (If provided)
    if (newServiceIconFile && (newServiceIconFile as File).name.length) {
      //Find service item in category by id
      const serviceItemFromCategoryById = updatedServiceCategory?.content.find(
        (item) => item.id === uuidForService,
      );

      //If service item was found -> Proceed to upload file on disc
      if (serviceItemFromCategoryById && updatedServiceCategory) {
        //Path to directory
        const pathToDir = path.join(
          process.cwd(),
          "public",
          "services",
          updatedServiceCategory._id.toString(),
        );

        //Create dir for uploading (If not already)
        await fs.mkdir(pathToDir, { recursive: true });

        //Path to file
        const fileToUpload = newServiceIconFile as File;
        const fileToUploadExt =
          path.extname(fileToUpload.name).toLowerCase() || ".bin";
        const fileToUploadName = `${uuidForService}${fileToUploadExt}`;
        const fileToUploadPath = path.join(pathToDir, fileToUploadName);

        const fileBuff = Buffer.from(await fileToUpload.arrayBuffer());
        await fs.writeFile(fileToUploadPath, fileBuff);

        //Update record in db
        await ServiceModel.findOneAndUpdate(
          { _id: categoryToAppendItemIn, "content.id": uuidForService },
          {
            $set: {
              "content.$.pathToIcon": path.join(
                updatedServiceCategory._id.toString(),
                fileToUploadName,
              ),
            },
          },
          { new: true, runValidators: true },
        );
      }
    }

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
