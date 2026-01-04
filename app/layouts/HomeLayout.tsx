import { Outlet, type LoaderFunction } from "react-router";

import { NavBar, Footer, LightBox, Toast, Modal } from "~/components";

type Props = {
  loaderData: {
    contactInfoForClient: {
      email: string;
      tel: string;
      address: string;
    };
  };
};
const HomeLayout = ({ loaderData }: Props) => {
  const {
    contactInfoForClient: { email, tel },
  } = loaderData;

  return (
    <main className="min-h-dvh flex flex-col">
      <NavBar email={email} tel={tel} />
      <Outlet />
      <Footer />
      <LightBox />
      <Toast />
      <Modal />
    </main>
  );
};

export const loader: LoaderFunction = async () => {
  const { connectToDB } = await import("~/utils/db");
  const ContactInfoModel = (await import("~/models/contactInfoModel")).default;

  //Get contact info
  const contactInfoForClient: {
    tel: string | null;
    email: string | null;
    address: string | null;
  } = {
    tel: null,
    email: null,
    address: null,
  };

  try {
    await connectToDB();
    const contactInfoFromDB = await ContactInfoModel.findOne({
      id: "contactInfo",
    });
    if (!contactInfoFromDB) {
      throw new Error("noInfoFound");
    }
    contactInfoForClient.email = contactInfoFromDB.email;
    contactInfoForClient.address = contactInfoFromDB.address;
    contactInfoForClient.tel = contactInfoFromDB.tel;
  } catch (error) {
    contactInfoForClient.address = null;
    contactInfoForClient.tel = null;
    contactInfoForClient.email = null;
  }

  return {
    contactInfoForClient,
  };
};

export default HomeLayout;
