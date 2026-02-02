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
import { X, MoveLeft, FileUp, Pen, Trash } from "lucide-react";
import { fileTypeFromBuffer } from "file-type";
import { useEffect, useState } from "react";
import fs from "fs/promises";
import path from "path";

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
  currentIconPreview: {
    ee: "Praeguse ikooni eelvaade",
    ru: "Предпросмотр текущей иконки",
  },
  iconPreview: {
    ee: "Ikooni eelvaade",
    ru: "Предпросмотр иконки",
  },
  serviceIcon: {
    ee: "Teenuse ikoon",
    ru: "Иконка услуги",
  },
  iconWillBeRemovedOnSubmit: {
    ee: "Vormi kinnitamisel eemaldatakse ikoon",
    ru: "При подтверждении формы иконка будет удалена",
  },
  iconWillBeChangedOnSubmit: {
    ee: "Vormi kinnitamisel muudetakse ikooni",
    ru: "При подтверждении формы иконка будет изменена",
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
    additionalInfo: {
      ee: string;
      ru: string;
    };
    colorOfButton?: string;
    pathToIcon?: string;
    id?: string;
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
  const [serviceTitleEE, setServiceTitleEE] = useState<string>(loaderData.ee);
  const [serviceTitleRU, setServiceTitleRU] = useState<string>(loaderData.ru);
  const [servicePrice, setServicePrice] = useState<string>(
    String(loaderData.price),
  );

  const location = useLocation();

  //Get language
  const [searchParams] = useSearchParams();
  const lang = searchParams.get("lang") as "ee" | "ru";

  //Track selected tariff and if "volumeBased" selected - hide price input
  const [isVolumeBasedTariffSelected, setIsVolumeBasedTariffSelected] =
    useState<null | boolean>(null);

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
  const [hexColor, setHexColor] = useState<string>("#000000");

  //Handle file selection (Icon for service)
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [iconFilePreviewUrl, setIconFilePreviewUrl] = useState<string>("");
  const [iconFileIntention, setIconFileIntention] = useState<string>("");

  //Set initial additional data (Color of button and icon) if they were provided
  useEffect(() => {
    //If color of button is not default
    if (loaderData.colorOfButton && loaderData.colorOfButton !== "#000000") {
      setHexColor(loaderData.colorOfButton);
    }

    //Display icon preview (If provided)
    if (loaderData.pathToIcon) {
      setIconFilePreviewUrl(`/services/${loaderData.pathToIcon}`);
    }

    //Revoke url (To prevent memory leak)
    return () => {
      URL.revokeObjectURL(iconFilePreviewUrl);
    };
  }, []);

  return (
    <article className="mt-10">
      <Form
        encType="multipart/form-data"
        method="POST"
        action={`.${location.search}`}
        className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-x-10"
      >
        <div className="card bg-base-100 shadow-md w-full md:w-[20rem] mt-5 relative">
          <div className="card-body w-full">
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
                    : "number"
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
                className={`textarea h-24 ${additionalInfoInputLanguage === "ru" && "hidden"}`}
                placeholder={translations.typeHere[lang]}
                defaultValue={loaderData.additionalInfo.ee}
              ></textarea>

              <textarea
                name="serviceAdditionalInfoRU"
                className={`textarea h-24 ${additionalInfoInputLanguage === "ee" && "hidden"}`}
                placeholder={translations.typeHere[lang]}
                defaultValue={loaderData.additionalInfo.ru}
              ></textarea>
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
          </div>

          {/* Close form button */}
          <NavLink
            to={`/admin/services/${loaderData.parentId}?${searchParams.toString()}`}
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
                  value={hexColor}
                />
                <div className="col-span-2 pl-2 flex items-center justify-start gap-x-2">
                  <MoveLeft />
                  <p>{translations.click[lang]}</p>
                </div>
              </div>
              {/* <p className="label">Optional</p> */}
            </fieldset>

            {/* Hidden input which will track intention of user about icon file */}
            <input
              type="hidden"
              name="serviceIconIntention"
              value={iconFileIntention}
            />

            {/* Hidden input with service item unique id */}
            <input type="hidden" name="serviceUniqueId" value={loaderData.id} />

            {/* Perform operation on previous icon */}
            {loaderData.pathToIcon && loaderData.pathToIcon.length > 0 ? (
              <>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">
                    {translations.currentIconPreview[lang]}:
                  </legend>
                  <div className="w-full flex justify-center items-center mt-3">
                    <img
                      src={
                        iconFile
                          ? iconFilePreviewUrl
                          : `/services/${loaderData.pathToIcon}`
                      }
                      alt="Icon preview url"
                      className="size-32 aspect-square"
                    />
                  </div>

                  {/* Notify user about consecuenses */}
                  {iconFileIntention === "delete" ? (
                    <>
                      <p className="text-center text-error">
                        {translations.iconWillBeRemovedOnSubmit[lang]}
                      </p>
                    </>
                  ) : iconFileIntention === "change" ? (
                    <>
                      <p className="text-center">
                        {translations.iconWillBeChangedOnSubmit[lang]}
                      </p>
                    </>
                  ) : null}
                </fieldset>

                {/* Option buttons */}
                <div className="w-full flex justify-center items-center gap-x-5">
                  <label
                    // onClick={(e) => {
                    //   if (iconFileIntention !== "change") {
                    //     setIconFileIntention("change");
                    //   } else {
                    //     e.preventDefault();
                    //     setIconFileIntention("");
                    //     setIconFile(null);
                    //     URL.revokeObjectURL(iconFilePreviewUrl);
                    //   }
                    // }}
                    htmlFor="serviceIcon"
                    className={`btn ${iconFileIntention === "change" && "btn-primary"}`}
                  >
                    <Pen />
                  </label>
                  {/* Actual file input */}
                  <input
                    type="file"
                    id="serviceIcon"
                    className="sr-only"
                    name="serviceIcon"
                    accept="image/*"
                    onChange={(e) => {
                      const files = e.target.files;

                      //If any file was selected
                      if (files && files.length > 0) {
                        const iconFile = files[0];
                        setIconFile(iconFile);
                        setIconFileIntention("change");

                        //Set new preview url
                        const newPreviewUrl = URL.createObjectURL(iconFile);
                        setIconFilePreviewUrl(newPreviewUrl);
                      } else {
                        setIconFile(null);
                        setIconFileIntention("");
                        URL.revokeObjectURL(iconFilePreviewUrl);
                      }
                    }}
                  />
                  <button
                    onClick={() => {
                      //If previous intention was not delete
                      if (iconFileIntention !== "delete") {
                        setIconFileIntention("delete");
                        setIconFile(null);
                        URL.revokeObjectURL(iconFilePreviewUrl);
                      } else {
                        //If current intention is delete -> Switch it off (Toggle)
                        setIconFileIntention("");
                      }
                    }}
                    type="button"
                    className={`btn ${iconFileIntention === "delete" && "btn-error"}`}
                  >
                    <Trash />
                  </button>
                </div>
              </>
            ) : null}

            {/* Icon selector */}
            {!loaderData.pathToIcon || loaderData.pathToIcon.length === 0 ? (
              <>
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

                    {/* Actual file input */}
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
                          setIconFileIntention("change");

                          //Set new preview url
                          const newPreviewUrl = URL.createObjectURL(iconFile);
                          setIconFilePreviewUrl(newPreviewUrl);
                        } else {
                          setIconFile(null);
                          setIconFileIntention("");

                          //Remove preview url
                          URL.revokeObjectURL(iconFilePreviewUrl);
                          setIconFilePreviewUrl("");
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
              </>
            ) : null}
          </div>
        </div>
      </Form>
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
      (item) => item._id.toString() === selectedServiceCategoryItem,
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
  const newServiceAdditionalInfoRU = formData.get("serviceAdditionalInfoRU");
  const newServiceAdditionalInfoEE = formData.get("serviceAdditionalInfoEE");
  const newServiceButtonColor = formData.get("colorOfButton");
  const newServiceIconFile = formData.get("serviceIcon");
  const newServiceIconFileIntention = formData.get("serviceIconIntention");
  const newServiceUniqueId = formData.get("serviceUniqueId");

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
  if (!contentItemToChange || typeof contentItemToChange !== "string") {
    formValidationErrors.contentItemToChange = true;
  }
  if (!servicePriceType || typeof servicePriceType !== "string") {
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
  if (!newServiceUniqueId) {
    formValidationErrors.noIdProvided = true;
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
  if (
    newServiceIconFileIntention &&
    typeof newServiceIconFileIntention !== "string"
  ) {
    formValidationErrors.strangeIntention = true;
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
    const updatedServiceCategory = await ServiceModel.findOneAndUpdate(
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
          "content.$.additionalInfo.ee": newServiceAdditionalInfoEE,
          "content.$.additionalInfo.ru": newServiceAdditionalInfoRU,
          "content.$.colorOfButton": newServiceButtonColor,
        },
      },
      {
        new: true,
        runValidators: true,
      },
    );

    //If update went fine
    if (updatedServiceCategory) {
      //Handle file update
      if (newServiceIconFileIntention === "change") {
        //Find content item which was just changed in category
        const contentItemJustChanged = updatedServiceCategory.content.find(
          (item) => item.id === newServiceUniqueId,
        );

        //If content item was found
        if (contentItemJustChanged) {
          //Delete previous file (If it exists)
          const fileName = path.join(
            process.cwd(),
            "public",
            "services",
            contentItemJustChanged.pathToIcon!,
          );
          try {
            await fs.access(fileName);
            await fs.unlink(fileName);
          } catch (error) {}

          //Create new file
          const fileToUpload = newServiceIconFile as File;
          const fileToUploadExt =
            path.extname(fileToUpload.name).toLowerCase() || ".bin";
          const fileToUploadName = `${contentItemJustChanged.id}${fileToUploadExt}`;
          const fileToUploadPath = path.join(
            process.cwd(),
            "public",
            "services",
            updatedServiceCategory._id.toString(),
            fileToUploadName,
          );

          const fileBuff = Buffer.from(await fileToUpload.arrayBuffer());
          await fs.writeFile(fileToUploadPath, fileBuff);

          //Update db
          await ServiceModel.findOneAndUpdate(
            {
              _id: updatedServiceCategory._id,
              "content.id": contentItemJustChanged.id,
            },
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
      } else if (newServiceIconFileIntention === "delete") {
        //Handle file delete
        //Find content item which was just changed in category
        const contentItemJustChanged = updatedServiceCategory.content.find(
          (item) => item.id === newServiceUniqueId,
        );

        //If content item was found
        if (contentItemJustChanged) {
          //Delete previous file
          const fileName = path.join(
            process.cwd(),
            "public",
            "services",
            contentItemJustChanged.pathToIcon!,
          );
          await fs.unlink(fileName);

          //Update db
          await ServiceModel.findOneAndUpdate(
            {
              _id: updatedServiceCategory._id,
              "content.id": contentItemJustChanged.id,
            },
            {
              $set: {
                "content.$.pathToIcon": "",
              },
            },
            { new: true, runValidators: true },
          );
        }
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

export default AdminSelectedServiceCategoryContentItemChange;
