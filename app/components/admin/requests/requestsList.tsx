import { Form, useLocation, useSearchParams } from "react-router";

import { Trash } from "lucide-react";

import useAdminBetterModalStore from "~/stores/adminBetterModalStore";

const translations = {
  areYouSureWantToDelete: {
    ru: "Вы действительно хотите удалить?",
    ee: "Kas olete kindel, et soovite kustutada?",
  },
  yes: {
    ru: "Да",
    ee: "Jah",
  },
  cancel: {
    ru: "Отмена",
    ee: "Tühista",
  },
  isRequestDone: {
    ru: "Запрос был выполнен?",
    ee: "Kas päring on täidetud?",
  },
  email: {
    ru: "Э-почта:",
    ee: "E-post:",
  },
  tel: {
    ru: "Телефон:",
    ee: "Telefon:",
  },
  category: {
    ru: "Категория:",
    ee: "Kategooria:",
  },
  service: {
    ru: "Услуга:",
    ee: "Teenus:",
  },
  servicePrice: {
    ru: "Цена услуги:",
    ee: "Teenuse hind:",
  },
  markAsCompleted: {
    ru: "Отметить как выполнено",
    ee: "Märgi lõpetatuks",
  },
  perHour: {
    ru: "За час",
    ee: "Tunni kohta",
  },
  perService: {
    ru: "За всю услугу",
    ee: "Kogu teenuse eest",
  },
};

const RequestsListItem = ({
  email,
  _id,
  itemType,
  phoneNumber,
  serviceCategory,
  servicePrice,
  serviceTitle,
  servicePriceType,
}: {
  email: string;
  _id: string;
  itemType: "pending" | "completed";
  phoneNumber: string | null;
  serviceCategory: string;
  servicePrice: number;
  serviceTitle: string;
  servicePriceType: "perHour" | "perService";
}) => {
  const setInnerContent = useAdminBetterModalStore(
    (state) => state.setInnerContent
  );
  const openModal = useAdminBetterModalStore((state) => state.openModal);
  const closeModal = useAdminBetterModalStore((state) => state.closeModal);

  const [searchParams] = useSearchParams();
  const lang = searchParams.get("lang") as "ee" | "ru";

  const location = useLocation();

  const showDeleteWarningModal = () => {
    setInnerContent(
      <>
        <div className="w-full flex flex-col items-center">
          <h2 className="font-bold text-xl text-center">
            {translations.areYouSureWantToDelete[lang]}
          </h2>
        </div>
        <div className="modal-action flex justify-between items-center">
          <Form
            method="DELETE"
            action={`/admin/requests/completed${location.search}`}
          >
            <input type="hidden" name="itemId" id={_id} value={_id} />
            <button onClick={closeModal} className="btn btn-error text-white">
              {translations.yes[lang]}
            </button>
          </Form>
          <button className="btn" onClick={closeModal}>
            {translations.cancel[lang]}
          </button>
        </div>
      </>
    );
    openModal();
  };

  const showStatusChangeWarningModal = () => {
    setInnerContent(
      <>
        <div className="w-full flex flex-col items-center">
          <h2 className="font-bold text-xl text-center">
            {translations.isRequestDone[lang]}
          </h2>
        </div>
        <div className="modal-action flex justify-between items-center">
          <Form method="POST" action={`/admin${location.search}`}>
            <input type="hidden" name="itemId" id={_id} value={_id} />
            <button onClick={closeModal} className="btn btn-primary">
              {translations.yes[lang]}
            </button>
          </Form>
          <button className="btn" onClick={closeModal}>
            {translations.cancel[lang]}
          </button>
        </div>
      </>
    );
    openModal();
  };

  return (
    <div className="card w-full bg-base-100 card-md shadow-sm">
      <div className="card-body">
        {/* <h2 className="card-title text-xl">From: {name}</h2> */}
        <h2 className="card-title text-xl overflow-scroll">
          <span className="font-normal">{translations.email[lang]}</span>{" "}
          {email}
        </h2>
        {phoneNumber ? (
          <h2 className="card-title text-xl overflow-scroll">
            <span className="font-normal">{translations.tel[lang]}</span>{" "}
            {phoneNumber}
          </h2>
        ) : null}
        <p className="text-lg font-bold">
          <span className="font-normal">{translations.category[lang]}</span>{" "}
          {serviceCategory}
        </p>
        <p className="text-lg font-bold">
          <span className="font-normal">{translations.service[lang]}</span>{" "}
          {serviceTitle}
        </p>
        <p className="text-lg">
          {translations.servicePrice[lang]}{" "}
          <span className="font-normal">{servicePrice}&#8364;</span>
          <span className="underline font-normal ml-1">
            {translations[servicePriceType][lang]}
          </span>
        </p>

        {itemType === "pending" ? (
          <>
            <div className="justify-end card-actions mt-3">
              {/* Form to mark item as closed */}
              <button
                onClick={showStatusChangeWarningModal}
                className="btn btn-primary"
              >
                {translations.markAsCompleted[lang]}
              </button>
            </div>
          </>
        ) : (
          <div className="justify-end card-actions mt-3">
            {/* Form to delete completed item */}
            <button
              onClick={showDeleteWarningModal}
              className="btn btn-error text-white"
            >
              <Trash />
            </button>
            {/* <Form method="DELETE" action="/admin/requests/completed">
              <input type="hidden" name="itemId" id={_id} value={_id} />
              <button className="btn btn-error text-white">
                <Trash />
              </button>
            </Form> */}
          </div>
        )}
      </div>
    </div>
  );
};

const RequestsList = ({
  content,
  type,
}: {
  content: {
    _id: string;
    email: string;
    phoneNumber: string | null;
    serviceCategory: {
      title: {
        ee: string;
        ru: string;
      };
    };
    service: {
      priceType: "perHour" | "perService";
      price: number;
      title: {
        ee: string;
        ru: string;
      };
    };
  }[];
  type: "pending" | "completed";
}) => {
  const [searchParams] = useSearchParams();
  const lang = searchParams.get("lang") as "ee" | "ru";

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-x-5 gap-y-10 mt-5">
      {(content &&
        content.length &&
        content.map((item) => (
          <RequestsListItem
            key={item._id}
            _id={item._id}
            email={item.email}
            phoneNumber={item.phoneNumber || null}
            serviceCategory={item.serviceCategory.title[lang]}
            serviceTitle={item.service.title[lang]}
            servicePrice={item.service.price}
            itemType={type}
            servicePriceType={item.service.priceType}
          />
        ))) ||
        null}
    </div>
  );
};

export default RequestsList;
