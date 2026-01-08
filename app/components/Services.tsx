import { useEffect, useRef } from "react";
import {
  Form,
  NavLink,
  useSearchParams,
  Link,
  useFetcher,
  useLocation,
} from "react-router";

import useClientModalStore from "~/stores/clientModalStore";

const translations = {
  ourServices: {
    ru: "Наши услуги",
    ee: "Meie teenused",
  },
  makeRequest: {
    ru: "Оставить заявку",
    ee: "Jäta taotlus",
  },
  price: {
    ru: "Цена",
    ee: "Hind",
  },
  requestModalHeader: {
    ru: "Здравствуйте! Для запроса услуги заполните форму ниже!",
    ee: "Tere! Teenuse taotlemiseks täitke allolev vorm!",
  },
  requestModalInfoCheck: {
    ru: "Уточнение информации:",
    ee: "Andmete täpsustamine:",
  },
  requestModalService: {
    ru: "Услуга",
    ee: "Teenus",
  },
  email: {
    ru: "Э-Почта",
    ee: "E-post",
  },
  emailInputPlaceholder: {
    ru: "Ваша э-почта",
    ee: "Teie e-post",
  },
  tel: {
    ru: "Номер телефона (Необязательно)",
    ee: "Telefoninumber (valikuline)",
  },
  telPlaceholder: {
    ru: "Укажите, если вам удобнее связаться по телефону",
    ee: "Märkige, kui teil on mugavam võtta ühendust telefoni teel",
  },
  privacyFirst: {
    ru: "Я согласен(на) на обработку моей электронной почты и, при указании, номера телефона для связи по запросу услуги в соответствии с",
    ee: "Olen nõus oma e-posti aadressi ja soovi korral ka telefoninumbri töötlemisega teenuse päringu raames vastavalt",
  },
  privacyPolicy: {
    ru: "Политикой конфиденциальности",
    ee: "Privaatsuspoliitikaga",
  },
  send: {
    ru: "Отправить",
    ee: "Saada",
  },
  closeModal: {
    ru: "Закрыть",
    ee: "Sulge",
  },
  thanksForRequest: {
    ru: "Благодарим за то, что оставили запрос, наши специалисты свяжутся с вами в ближайшее время!",
    ee: "Täname teid päringu jätmise eest, meie spetsialistid võtavad teiega peagi ühendust!",
  },
  inCaseOfQuestions: {
    ru: "В случае возникновения вопросов можете связаться с нами при помощи:",
    ee: "Küsimuste korral saate meiega ühendust võtta järgmiste kanalite kaudu:",
  },
  responseEmail: {
    ru: "Электронная почта:",
    ee: "E-post:",
  },
  responseTel: {
    ru: "Телефонный номер:",
    ee: "Telefoninumber:",
  },
  anErrorOccured: {
    ru: "К сожалению произошла ошибка, повторите попытку позже",
    ee: "Kahjuks tekkis viga, palun proovige hiljem uuesti",
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

const ServicesCategorySelectionButton = ({
  content,
  active,
  _id,
}: {
  content: string;
  active?: boolean;
  _id: string;
}) => {
  const [searchParams] = useSearchParams();

  const handleNavigation = () => {
    const params = new URLSearchParams(searchParams);
    params.set("service", _id);
    return `/?${params.toString()}`;
  };

  return (
    <NavLink
      to={handleNavigation()}
      preventScrollReset
      className={`btn 2xl:btn-lg ${active && "btn-primary"}`}
    >
      {content}
    </NavLink>
  );
};

const ServiceItem = ({
  title,
  price,
  _id,
  contactInfo,
  priceType,
}: {
  title: string;
  price: number;
  _id: string;
  contactInfo: {
    tel: string;
    email: string;
    address: string;
  };
  priceType: "perHour" | "perService";
}) => {
  const openModal = useClientModalStore((state) => state.openModal);
  const closeModal = useClientModalStore((state) => state.closeModal);
  const setInnerContent = useClientModalStore((state) => state.setInnerContent);
  const [searchParams] = useSearchParams();
  const lang = searchParams.get("lang") as "ee" | "ru";
  const selectedServiceCategory = searchParams.get("service");

  const responseId = useRef(null);

  const fetcher = useFetcher();

  const location = useLocation();

  const handleServiceRequest = (id: string) => {
    //Set form to request a service
    setInnerContent(
      <>
        {/* Header */}
        <div className="w-full">
          <h3 className="font-bold text-xl text-left">
            {translations.requestModalHeader[lang]}
          </h3>
          {/* Info about service  */}
          <div className="w-full text-left mt-5">
            <p className="text-normal mb-3">
              {translations.requestModalInfoCheck[lang]}
            </p>
            <p className="font-bold text-lg">
              {translations.requestModalService[lang]}{" "}
              <span className="font-normal">{title}</span>
            </p>
            <p className="font-bold text-lg">
              {translations.price[lang]}:{" "}
              <span className="font-normal">{price}&#8364;</span>
              <span className="underline font-normal ml-1">
                {translations[priceType][lang]}
              </span>
            </p>
          </div>
        </div>

        {/* Request */}
        <div className="w-full flex justify-center mt-10">
          <fetcher.Form
            method="POST"
            action="/service/request"
            className="w-full space-y-4"
          >
            {/* Email */}
            <div>
              <label
                className="block text-sm font-medium text-gray-900 2xl:text-lg"
                htmlFor="serviceRequestEmail"
              >
                {translations.email[lang]}
              </label>

              <input
                className="mt-1 w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:outline-none bg-white py-2 px-2 border 2xl:text-lg"
                id="serviceRequestEmail"
                type="email"
                placeholder={translations.emailInputPlaceholder[lang]}
                name="serviceRequestEmail"
                required
              />
            </div>

            {/* Phone number (Optional) */}
            <div>
              <label
                className="block text-sm font-medium text-gray-900 2xl:text-lg"
                htmlFor="serviceRequestTel"
              >
                {translations.tel[lang]}
              </label>

              <input
                className="mt-1 w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:outline-none bg-white py-2 px-2 border 2xl:text-lg"
                id="serviceRequestTel"
                type="tel"
                placeholder={translations.telPlaceholder[lang]}
                name="serviceRequestTel"
              />
            </div>

            <input
              type="text"
              name="website"
              autoComplete="off"
              className="hidden"
              tabIndex={-1}
            />
            <input type="hidden" name="ts" value={String(Date.now())} />

            {/* Agreement about use of email */}
            <div className="flex items-start gap-2 mt-5">
              <input
                type="checkbox"
                required
                className="checkbox"
                name="serviceRequestAgreedToProceed"
                id="serviceRequestAgreedToProceed"
              />
              <p>
                {translations.privacyFirst[lang]}{" "}
                <Link
                  to={{
                    pathname: "/privacy-policy",
                    search: location.search,
                  }}
                  onClick={closeModal}
                  className="link link-primary"
                >
                  {translations.privacyPolicy[lang]}
                </Link>
              </p>
            </div>

            {/* Data about service which user would like to request */}
            <input
              type="hidden"
              name="selectedServiceCategoryId"
              value={selectedServiceCategory || ""}
            />
            <input type="hidden" name="selectedServiceId" value={_id} />

            {/* Submit btn */}
            {fetcher.state === "idle" ? (
              <button
                className="block cursor-pointer w-full rounded-lg border border-indigo-600 bg-indigo-600 px-12 py-3 text-sm font-medium text-white transition-colors hover:bg-transparent hover:text-indigo-600 2xl:text-lg mt-5"
                type="submit"
              >
                {translations.send[lang]}
              </button>
            ) : (
              <span className="loading loading-spinner loading-lg"></span>
            )}
          </fetcher.Form>
        </div>
      </>
    );
    openModal();
  };

  //Handle response to request
  useEffect(() => {
    if (fetcher.data) {
      //Prevent from doing something if route will revalidate
      if (fetcher.data.resultId === responseId.current) return;
      responseId.current = fetcher.data.resultId;

      //Handle 'ok' response
      if (fetcher.data.ok) {
        //Change modal window content to notify user that his request was successfully proceeded
        setInnerContent(
          <>
            <div className="w-full">
              <h3 className="font-bold text-xl text-left">
                {translations.thanksForRequest[lang]}
              </h3>

              {/* Info about service  */}
              <div className="w-full text-left mt-5">
                <p className="text-normal mb-3">
                  {translations.requestModalInfoCheck[lang]}
                </p>
                <p className="font-bold text-lg">
                  {translations.requestModalService[lang]}{" "}
                  <span className="font-normal">{title}</span>
                </p>
                <p className="font-bold text-lg">
                  {translations.price[lang]}:{" "}
                  <span className="font-normal">{price}&#8364;</span>
                  <span className="underline font-normal ml-1">
                    {translations[priceType][lang]}
                  </span>
                </p>
              </div>

              {/* Info about support */}
              <div className="w-full text-left mt-5">
                <h3 className="font-bold text-xl text-left">
                  {translations.inCaseOfQuestions[lang]}
                </h3>
                <p className="font-bold text-lg mt-5">
                  {translations.responseEmail[lang]}{" "}
                  <span className="font-normal">{contactInfo.email}</span>
                </p>
                <p className="font-bold text-lg">
                  {translations.responseTel[lang]}{" "}
                  <span className="font-normal">{contactInfo.tel}</span>
                </p>
              </div>
            </div>
          </>
        );
      } else {
        setInnerContent(
          <>
            <div className="w-full">
              <h3 className="font-bold text-xl text-left">
                {translations.anErrorOccured[lang]}
              </h3>

              {/* Info about support */}
              <div className="w-full text-left mt-5">
                <h3 className="font-bold text-xl text-left">
                  {translations.inCaseOfQuestions[lang]}
                </h3>
                <p className="font-bold text-lg mt-5">
                  {translations.responseEmail[lang]}{" "}
                  <span className="font-normal">{contactInfo.email}</span>
                </p>
                <p className="font-bold text-lg">
                  {translations.responseTel[lang]}{" "}
                  <span className="font-normal">{contactInfo.tel}</span>
                </p>
              </div>
            </div>
          </>
        );
      }
    }
  }, [fetcher.data]);

  return (
    <div className="card card-border bg-base-100 w-full h-full overflow-scroll">
      <div className="card-body">
        <h2 className="card-title text-2xl font-bold 2xl:text-3xl">{title}</h2>
        <p className="text-lg">
          {translations.price[lang]}:{" "}
          <span className="font-normal">{price}&#8364;</span>
          <span className="underline font-normal ml-1">
            {translations[priceType][lang]}
          </span>
        </p>
        <div className="card-actions justify-end">
          <button
            onClick={() => handleServiceRequest(_id)}
            className="btn btn-primary 2xl:btn-lg"
          >
            {translations.makeRequest[lang]}
          </button>
        </div>
      </div>
    </div>
  );
};

type Props = {
  selectedServiceContent: {
    price: number;
    ee: string;
    ru: string;
    _id: string;
    priceType: "perHour" | "perService";
  }[];
  otherServicesCategories: {
    _id: string;
    title: {
      ee: string;
      ru: string;
    };
  }[];
  contactInfo: {
    tel: string;
    email: string;
    address: string;
  };
};
const Services = ({
  selectedServiceContent,
  otherServicesCategories,
  contactInfo,
}: Props) => {
  const [searchParams] = useSearchParams();
  const lang = searchParams.get("lang") as "ee" | "ru";

  return (
    <section id="services">
      <div className="mx-auto px-4 py-8 sm:px-6 lg:px-8 xl:px-20 xl:py-20 2xl:px-64 2xl:py-44">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:items-start md:gap-8 lg:gap-x-10">
          <div className="md:col-span-4 lg:col-span-1">
            <div className="max-w-prose md:max-w-none text-center lg:text-left">
              <h2 className="text-3xl font-semibold text-gray-900 sm:text-3xl xl:text-4xl 2xl:text-5xl">
                {translations.ourServices[lang]}
              </h2>

              {/* Services Selection */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-1 gap-x-4 gap-y-4 mt-5">
                {otherServicesCategories.map((item) => (
                  <ServicesCategorySelectionButton
                    content={item.title[lang]}
                    active={searchParams.get("service") === item._id}
                    _id={item._id}
                    key={item._id}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Services list */}
          <div className="md:col-span-4 lg:col-span-3 mt-10 lg:mt-0 flex flex-col md:grid md:grid-cols-2 xl:grid-cols-2 md:gap-x-10 2xl:gap-x-16 md:items-start items-center gap-y-8">
            {selectedServiceContent.map((item) => (
              <ServiceItem
                _id={item._id}
                title={item[lang]}
                price={item.price}
                key={item._id}
                contactInfo={contactInfo}
                priceType={item.priceType}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
