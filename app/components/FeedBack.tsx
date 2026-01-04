import { Link, useFetcher, useLocation, useSearchParams } from "react-router";
import { useEffect, useRef } from "react";

const translations = {
  feedback: {
    ru: "Обратная связь",
    ee: "Tagasiside",
  },
  feedbackText: {
    ru: "Расскажите, что вы думаете — нам действительно важно ваше мнение",
    ee: "Rääkige meile, mida te arvate — teie arvamus on meile tõesti oluline",
  },
  email: {
    ru: "Э-Почта",
    ee: "E-post",
  },
  emailInputPlaceholder: {
    ru: "Ваша э-почта",
    ee: "Teie e-post",
  },
  message: {
    ru: "Сообщение",
    ee: "Sõnum",
  },
  messagesPlaceholder: {
    ru: "Ваше сообщение",
    ee: "Teie sõnum",
  },
  privacyFirst: {
    ru: "Я согласен(на) с обработкой моей электронной почты в соответствии с",
    ee: "Olen nõus oma e-posti aadressi töötlemisega vastavalt",
  },
  privacyPolicy: {
    ru: "Политикой конфиденциальности",
    ee: "Privaatsuspoliitikaga",
  },
  send: {
    ru: "Отправить",
    ee: "Saada",
  },
  thanksForFeedback: {
    ru: "Спасибо за обратную связь!",
    ee: "Täname tagasiside eest!",
  },
  errorOccured: {
    ru: "Произошла ошибка, попробуйте позже!",
    ee: "Tekkis viga, palun proovige hiljem uuesti!",
  },
};

import useToastStore from "~/stores/toastModalStore";

const FeedBack = ({
  email,
  tel,
  address,
}: {
  email: string;
  tel: string;
  address: string;
}) => {
  const fetcher = useFetcher();
  const formRef = useRef<HTMLFormElement>(null);
  const [searchParams] = useSearchParams();
  const lang = searchParams.get("lang") as "ee" | "ru";

  const signature = useRef<string | null>(null);

  const location = useLocation();

  //Handle toast
  const openToast = useToastStore((state) => state.openToast);
  const setToastInnerContent = useToastStore(
    (state) => state.setToastInnerContent
  );
  const setToastVariant = useToastStore((state) => state.setToastVariant);

  useEffect(() => {
    if (fetcher.data) {
      const { resultId, ok } = fetcher.data;

      if (signature.current === resultId) return;

      signature.current = resultId;

      //Handle success
      if (ok) {
        //Clear form
        formRef.current?.reset();

        //Show toast
        setToastVariant("success");
        setToastInnerContent(
          <>
            <span className="text-lg">
              {translations.thanksForFeedback[lang]}
            </span>
          </>
        );
        openToast();
      } else {
        //Show toast
        setToastVariant("error");
        setToastInnerContent(
          <>
            <span className="text-lg">{translations.errorOccured[lang]}</span>
          </>
        );
        openToast();
      }
    }
  }, [fetcher.data, fetcher.state]);

  return (
    <div
      id="feedback"
      className="mx-auto px-4 py-8 sm:px-6 lg:px-8 xl:px-20 xl:py-20 2xl:px-64 2xl:py-44"
    >
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="md:py-4">
          <h2 className="text-3xl font-semibold text-gray-900 sm:text-3xl xl:text-4xl 2xl:text-5xl">
            {translations.feedback[lang]}
          </h2>

          <p className="mt-4 lg:text-lg xl:text-xl 2xl:text-2xl text-pretty text-gray-700">
            {translations.feedbackText[lang]}
          </p>

          <dl className="mt-6 space-y-3">
            <div>
              <dt className="sr-only">Phone number</dt>

              <dd className="grid grid-cols-[24px_1fr] items-center gap-2 text-gray-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"
                  ></path>
                </svg>

                <span className="font-medium">{tel ? tel : ""}</span>
              </dd>
            </div>

            <div>
              <dt className="sr-only">Email</dt>

              <dd className="grid grid-cols-[24px_1fr] items-center gap-2 text-gray-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                  ></path>
                </svg>

                <span className="font-medium">{email ? email : ""}</span>
              </dd>
            </div>

            <div>
              <dt className="sr-only">Location</dt>

              <dd className="grid grid-cols-[24px_1fr] items-center gap-2 text-gray-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                  ></path>
                </svg>

                <span className="font-medium">{address ? address : ""}</span>
              </dd>
            </div>
          </dl>
        </div>

        <fetcher.Form
          action="/feedback"
          method="POST"
          ref={formRef}
          className="space-y-4 rounded-lg border border-gray-300 bg-gray-100 p-6 2xl:p-10"
        >
          {/* <div>
            <label
              className="block text-sm font-medium text-gray-900 2xl:text-lg"
              htmlFor="name"
            >
              Ваше имя
            </label>

            <input
              className="mt-1 w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:outline-none bg-white py-2 px-2 border 2xl:text-lg"
              id="name"
              type="text"
              name="name"
              placeholder="Ваше имя"
              required
            />
          </div> */}
          <div>
            <label
              className="block text-sm font-medium text-gray-900 2xl:text-lg"
              htmlFor="email"
            >
              {translations.email[lang]}
            </label>

            <input
              className="mt-1 w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:outline-none bg-white py-2 px-2 border 2xl:text-lg"
              id="email"
              type="email"
              placeholder={translations.emailInputPlaceholder[lang]}
              name="email"
              required
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium text-gray-900 2xl:text-lg"
              htmlFor="message"
            >
              {translations.message[lang]}
            </label>

            <textarea
              className="mt-1 w-full resize-none rounded-lg border-gray-300 focus:border-indigo-500 focus:outline-none bg-white py-2 px-2 border 2xl:text-lg"
              id="message"
              rows={4}
              placeholder={translations.messagesPlaceholder[lang]}
              name="message"
              required
            ></textarea>
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
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              required
              className="checkbox"
              name="agreedToProceed"
              id="agreedToProceed"
            />
            <p>
              {translations.privacyFirst[lang]}{" "}
              <Link
                to={{
                  pathname: "/privacy-policy",
                  search: location.search,
                }}
                className="link link-primary"
              >
                {translations.privacyPolicy[lang]}
              </Link>
            </p>
          </div>

          {/* Submit btn */}
          <button
            className="block cursor-pointer w-full rounded-lg border border-indigo-600 bg-indigo-600 px-12 py-3 text-sm font-medium text-white transition-colors hover:bg-transparent hover:text-indigo-600 2xl:text-lg mt-5"
            type="submit"
          >
            {translations.send[lang]}
          </button>
        </fetcher.Form>
      </div>
    </div>
  );
};

export default FeedBack;
