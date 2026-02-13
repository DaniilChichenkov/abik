import {
  Form,
  redirect,
  useLocation,
  useNavigation,
  useSearchParams,
  type ActionFunction,
  type ActionFunctionArgs,
  type LoaderFunction,
  type LoaderFunctionArgs,
} from "react-router";
import { Header } from "~/components/admin/contact";
import { getSession } from "~/utils/session";

const translations = {
  contactInfo: {
    ru: "Контактная информация",
    ee: "Kontaktandmed",
  },
  phoneNumber: {
    ru: "Номер телефона",
    ee: "Telefoninumber",
  },
  typeHere: {
    ru: "Введите здесь",
    ee: "Sisestage siia",
  },
  noTelProvided: {
    ru: "Номер телефона не указан",
    ee: "Telefoninumbrit ei ole esitatud",
  },
  email: {
    ru: "Э-почта",
    ee: "E-post",
  },
  noEmailProvided: {
    ru: "Электронная почта не указана",
    ee: "E-posti aadressi ei ole esitatud",
  },
  adress: {
    ru: "Адрес",
    ee: "Aadress",
  },
  noAddressProvided: {
    ru: "Адрес не указан",
    ee: "Aadressi ei ole esitatud",
  },
  confirm: {
    ru: "Подтвердить",
    ee: "Kinnita",
  },
};

type Props = {
  loaderData: {
    ok: boolean;
    contactInfo: {
      id: string;
      address: string;
      tel: string;
      email: string;
    };
  };
  actionData: {
    ok: boolean;
    errors: Record<string, boolean>;
  };
  responseId: string;
};
const AdminContact = ({ loaderData, actionData }: Props) => {
  const {
    contactInfo: { tel, address, email },
  } = loaderData;
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const location = useLocation();

  const [searchParams] = useSearchParams();
  const lang = searchParams.get("lang") as "ee" | "ru";

  return (
    <section className="w-full">
      <Header content={translations.contactInfo[lang]} />

      <div className="card w-full max-w-xl bg-base-100 card-md shadow-sm mt-10">
        <div className="card-body">
          <Form
            method="POST"
            action={`.${location.search}`}
            className="space-y-3 mt-5"
          >
            {/* Phone number input */}
            <fieldset className="fieldset w-full">
              <legend className="fieldset-legend">
                {translations.phoneNumber[lang]}
              </legend>
              <input
                type="tel"
                className="input w-full"
                placeholder={translations.typeHere[lang]}
                defaultValue={tel ? tel : ""}
                required
                name="contactInfoTel"
              />
              {actionData &&
              !actionData.ok &&
              actionData.errors.noTelProvided ? (
                <p className="label text-error">
                  {translations.noTelProvided[lang]}
                </p>
              ) : null}
            </fieldset>

            {/* Email input */}
            <fieldset className="fieldset w-full">
              <legend className="fieldset-legend ">
                {translations.email[lang]}
              </legend>
              <input
                type="email"
                className="input w-full"
                placeholder={translations.typeHere[lang]}
                defaultValue={email ? email : ""}
                required
                name="contactInfoEmail"
              />
              {actionData &&
              !actionData.ok &&
              actionData.errors.noEmailProvided ? (
                <p className="label text-error">
                  {translations.noEmailProvided[lang]}
                </p>
              ) : null}
            </fieldset>

            {/* Address input */}
            <fieldset className="fieldset w-full">
              <legend className="fieldset-legend">
                {translations.adress[lang]}
              </legend>
              <input
                type="text"
                className="input w-full"
                placeholder={translations.typeHere[lang]}
                defaultValue={address ? address : ""}
                required
                name="contactInfoAddress"
              />
              {actionData &&
              !actionData.ok &&
              actionData.errors.noAddressProvided ? (
                <p className="label text-error">
                  {translations.noAddressProvided[lang]}
                </p>
              ) : null}
            </fieldset>

            <div className="justify-center card-actions mt-5">
              {isSubmitting ? (
                <span className="loading loading-dots loading-lg"></span>
              ) : (
                <button className="btn btn-primary">
                  {translations.confirm[lang]}
                </button>
              )}
            </div>
          </Form>
        </div>
      </div>
    </section>
  );
};

export const loader: LoaderFunction = async ({
  request,
}: LoaderFunctionArgs) => {
  //Check for authentication
  const cookieHeader = request.headers.get("Cookie");
  const session = await getSession(cookieHeader);

  //If user is unauthorized
  if (!session.get("isAdmin")) {
    return redirect("/login");
  }

  const { connectToDB } = await import("../utils/db");
  const ContactInfoModel = (await import("../models/contactInfoModel")).default;

  try {
    await connectToDB();
    const contactInfo = await ContactInfoModel.findOne({
      id: "contactInfo",
    }).lean();
    if (!contactInfo) {
      throw new Error("noContactInfoFound");
    }
    return {
      ok: true,
      contactInfo,
    };
  } catch (error) {
    throw new Response("serverSideError");
  }
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

  const formData = await request.formData();
  const email = formData.get("contactInfoEmail");
  const tel = formData.get("contactInfoTel");
  const address = formData.get("contactInfoAddress");

  if (!email || typeof email !== "string") {
    return {
      ok: false,
      errors: {
        noEmailProvided: true,
        responseId: Date.now().toString(),
      },
    };
  }

  if (!tel || typeof tel !== "string") {
    return {
      ok: false,
      errors: {
        noTelProvided: true,
        responseId: Date.now().toString(),
      },
    };
  }

  if (!address || typeof address !== "string") {
    return {
      ok: false,
      errors: {
        noAddressProvided: true,
        responseId: Date.now().toString(),
      },
    };
  }

  const { connectToDB } = await import("../utils/db");
  const ContactInfoModel = (await import("../models/contactInfoModel")).default;

  try {
    await connectToDB();
    await ContactInfoModel.findOneAndUpdate(
      { id: "contactInfo" },
      {
        tel,
        email,
        address,
      },
    );
    return {
      ok: true,
      responseId: Date.now().toString(),
    };
  } catch (error) {
    return {
      ok: false,
      errors: {
        serverSideError: true,
        responseId: Date.now().toString(),
      },
    };
  }
};

export default AdminContact;
