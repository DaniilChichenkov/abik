import type {
  LoaderFunction,
  LoaderFunctionArgs,
  MetaFunction,
} from "react-router";
import { redirect, useLocation } from "react-router";
import type { Route } from "./+types/home";

import { Header, Services, Gallery, FeedBack } from "~/components";
import { useEffect } from "react";

const SITE = "https://abik.ee";

export const meta: MetaFunction = ({ location }) => {
  const sp = new URLSearchParams(location.search);
  const rawLang = sp.get("lang") ?? "ee";
  const lang: "ee" | "ru" = rawLang === "ru" ? "ru" : "ee";

  const canonical = `${SITE}${location.pathname}?lang=${lang}`;

  const title =
    lang === "ru"
      ? "Бытовые услуги и ремонт | Abik"
      : "Koduteenused ja hooldustööd | Abik";

  const description =
    lang === "ru"
      ? "Уборка снега, покос травы, сантехник, электрик, ремонт мебели и окон, уборка и вывоз мусора. Узнайте цену и оставьте заявку."
      : "Lume koristus, muru niitmine, torutööd, elekter, mööbliremont, akende remont, koristus ja jäätmete äravedu. Küsi hinda ja jäta päring.";

  return [
    { title },
    { name: "description", content: description },

    // canonical
    { rel: "canonical", href: canonical },

    // hreflang (HTML lang code is et, query param remains ee)
    {
      rel: "alternate",
      hrefLang: "et",
      href: `${SITE}${location.pathname}?lang=ee`,
    },
    {
      rel: "alternate",
      hrefLang: "ru",
      href: `${SITE}${location.pathname}?lang=ru`,
    },
    {
      rel: "alternate",
      hrefLang: "x-default",
      href: `${SITE}${location.pathname}?lang=ee`,
    },

    // Open Graph
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: canonical },
    { property: "og:type", content: "website" },
  ];
};

type Props = {
  loaderData: {
    ok: boolean;
    selectedServiceCategoryContentForClient: {
      price: number;
      ee: string;
      ru: string;
      _id: string;
      priceType: "perHour" | "perService";
    }[];
    otherServiceCategoriesContentForClient: {
      _id: string;
      title: {
        ee: string;
        ru: string;
      };
    }[];
    selectedGalleryContentForClient: string[];
    otherGalleriesTitlesForClient: {
      _id: string;
      title: {
        ee: string;
        ru: string;
      };
    }[];
    contactInfoForClient: {
      tel: string;
      email: string;
      address: string;
    };
  };
};
const Home = ({ loaderData }: Props) => {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;

    requestAnimationFrame(() => {
      const el = document.querySelector(hash);
      el?.scrollIntoView({ block: "center" });
    });
  }, [hash]);

  return (
    <main>
      <Header />
      <Services
        selectedServiceContent={
          loaderData.selectedServiceCategoryContentForClient
        }
        otherServicesCategories={
          loaderData.otherServiceCategoriesContentForClient
        }
        contactInfo={loaderData.contactInfoForClient}
      />
      <Gallery
        selectedGalleryContent={loaderData.selectedGalleryContentForClient}
        galleryCategories={loaderData.otherGalleriesTitlesForClient}
      />
      <FeedBack {...loaderData.contactInfoForClient} />
    </main>
  );
};
export default Home;

export const loader: LoaderFunction = async ({
  request,
}: LoaderFunctionArgs) => {
  //Import db modules
  const mongoose = await import("mongoose");
  const ServiceModel = (await import("~/models/serviceModel")).default;
  const GalleryModel = (await import("~/models/galleryModel")).default;
  const ContactInfoModel = (await import("~/models/contactInfoModel")).default;
  const { connectToDB } = await import("~/utils/db");

  //Import fs modules
  const fs = await import("fs/promises");
  const path = await import("path");

  //Connect to db
  await connectToDB();

  //Get search params from url
  const url = new URL(request.url);

  //Flag which will determine if redirect to fresh url is needed
  let shouldRefreshUrl = false;

  //Get language from url and if not provided - set default one to EE
  let lang = url.searchParams.get("lang");
  if (!lang) {
    shouldRefreshUrl = true;
    lang = "ee";
  }

  //Check service from url
  let serviceCategory = url.searchParams.get("service");
  try {
    //If no service was provided at all
    if (!serviceCategory) {
      //Try to find any service category in db
      const services = await ServiceModel.find({}, { _id: 1 }).lean();

      //If no services exists
      if (!services.length) {
        serviceCategory = "none";

        //Since url was changed (From null to 'none') -> Refresh is needed
        shouldRefreshUrl = true;

        //If service was found
      } else {
        //Get any first item and set it as default
        const serviceItemId = services[0]._id.toString();

        //Set id in url
        serviceCategory = serviceItemId;

        //Since url was changed (From null to 'id') -> Refresh is needed
        shouldRefreshUrl = true;
      }
    } else if (serviceCategory === "none") {
      //If from previous request of page service was not found - try to find it now
      const services = await ServiceModel.find({}, { _id: 1 }).lean();

      //Only check if any services was found (Since changing 'none' to 'none' makes no sense)
      if (services.length) {
        //Get any first item and set it as default
        const serviceItemId = services[0]._id.toString();

        //Set id in url
        serviceCategory = serviceItemId;

        //Since url was changed (From 'none' to 'id') -> Refresh is needed
        shouldRefreshUrl = true;
      }

      //Check url with provided id
    } else {
      //Try to find service by id from url
      const serviceByProvidedId = await ServiceModel.findOne({
        _id: new mongoose.Types.ObjectId(String(serviceCategory)),
      });

      //If service was not found (Since checking if existing service does exists makes no sense)
      if (!serviceByProvidedId) {
        //Try to find any other service (Basically a fallback)
        const services = await ServiceModel.find({}, { _id: 1 }).lean();

        //If no fallback services were found (Set url to 'none' and since url was changed from 'id' to 'none' -> refresh is needed)
        if (!services.length) {
          serviceCategory = "none";

          shouldRefreshUrl = true;
        } else {
          //If fallback service was found
          const fallbackService = services[0]._id.toString();
          serviceCategory = fallbackService;

          //Since url was changed from one id to another -> refresh is needed
          shouldRefreshUrl = true;
        }
      }
    }
  } catch (error) {
    serviceCategory = "none";
  }

  //Check gallery from url
  let galleryCategory = url.searchParams.get("gallery");
  try {
    //If no gallery was provided at all
    if (!galleryCategory) {
      //Try to find any gallery category in db
      const galleries = await GalleryModel.find({}, { _id: 1 }).lean();

      //If no gallery exists
      if (!galleries.length) {
        galleryCategory = "none";

        //Since url was changed (From null to 'none') -> Refresh is needed
        shouldRefreshUrl = true;

        //If gallery was found
      } else {
        //Get any first item and set it as default
        const galleryItemId = galleries[0]._id.toString();

        //Set id in url
        galleryCategory = galleryItemId;

        //Since url was changed (From null to 'id') -> Refresh is needed
        shouldRefreshUrl = true;
      }
    } else if (galleryCategory === "none") {
      //If from previous request of page gallery was not found - try to find it now
      const galleries = await GalleryModel.find({}, { _id: 1 }).lean();

      //Only check if any galleries was found (Since changing 'none' to 'none' makes no sense)
      if (galleries.length) {
        //Get any first item and set it as default
        const galleryItemId = galleries[0]._id.toString();

        //Set id in url
        galleryCategory = galleryItemId;

        //Since url was changed (From 'none' to 'id') -> Refresh is needed
        shouldRefreshUrl = true;
      }

      //Check url with provided id
    } else {
      //Try to find gallery by id from url
      const galleryByProvidedId = await GalleryModel.findOne({
        _id: new mongoose.Types.ObjectId(String(galleryCategory)),
      });

      //If gallery was not found (Since checking if existing gallery does exists makes no sense)
      if (!galleryByProvidedId) {
        //Try to find any other galleries (Basically a fallback)
        const galleries = await GalleryModel.find({}, { _id: 1 }).lean();

        //If no fallback gallery were found (Set url to 'none' and since url was changed from 'id' to 'none' -> refresh is needed)
        if (!galleries.length) {
          galleryCategory = "none";

          shouldRefreshUrl = true;
        } else {
          //If fallback gallery was found
          const fallbackGallery = galleries[0]._id.toString();
          galleryCategory = fallbackGallery;

          //Since url was changed from one id to another -> refresh is needed
          shouldRefreshUrl = true;
        }
      }
    }
  } catch (error) {
    galleryCategory = "none";
  }

  //If refresh is needed
  if (shouldRefreshUrl) {
    url.searchParams.set("lang", lang);
    url.searchParams.set("service", serviceCategory);
    url.searchParams.set("gallery", galleryCategory);
    return redirect(url.toString());
  }

  //If no refresh is needed - proceed to get content
  //Get categories content
  let selectedServiceCategoryContentForClient: {
    price: number;
    ee: string;
    ru: string;
    _id: string;
  }[] = [];
  let otherServiceCategoriesContentForClient: {
    _id: string;
    title: {
      ee: string;
      ru: string;
    };
  }[] = [];

  try {
    if (serviceCategory && serviceCategory !== "none") {
      //Find selected service category content
      const selectedServiceCategoryContent = await ServiceModel.findOne(
        { _id: String(serviceCategory) },
        { content: 1 }
      ).lean();
      if (selectedServiceCategoryContent) {
        const selectedServiceCategoryContentWithStringIds =
          selectedServiceCategoryContent.content.map((item) => ({
            ...item,
            _id: item._id.toString(),
          }));
        selectedServiceCategoryContentForClient =
          selectedServiceCategoryContentWithStringIds;
      }

      //Find other categories
      const serviceCategories = await ServiceModel.find(
        {},
        { title: 1, _id: 1 }
      ).lean();
      if (serviceCategories.length) {
        const serviceCategoriesWithStringIds = serviceCategories.map(
          (item) => ({
            ...item,
            _id: item._id.toString(),
          })
        );
        otherServiceCategoriesContentForClient =
          serviceCategoriesWithStringIds as any;
      }
    }
  } catch (error) {
    selectedServiceCategoryContentForClient = [];
    otherServiceCategoriesContentForClient = [];
  }

  //Get gallery content
  let selectedGalleryContentForClient: string[] = [];
  let otherGalleriesTitlesForClient: {
    _id: string;
    title: {
      ee: string;
      ru: string;
    };
  }[] = [];

  try {
    if (galleryCategory && galleryCategory !== "none") {
      //Get selected gallery
      const selectedGallery = await GalleryModel.findOne(
        { _id: String(galleryCategory) },
        { _id: 1 }
      ).lean();

      if (selectedGallery) {
        const selectedGalleryStringId = selectedGallery._id.toString();

        //Build path to gallery directory
        const pathToGallery = path.join(
          process.cwd(),
          "public",
          "gallery",
          selectedGalleryStringId
        );

        //Read directory
        const entries = await fs.readdir(pathToGallery);
        const filePaths = entries.map((item) =>
          path.join("gallery", selectedGalleryStringId, item)
        );
        selectedGalleryContentForClient = filePaths;
      }

      //Get other galleries titles and ids
      const otherGalleries = await GalleryModel.find({}).lean();
      if (otherGalleries.length) {
        const otherGalleriesWithStringIds = otherGalleries.map((item) => ({
          ...item,
          _id: item._id.toString(),
        }));
        otherGalleriesTitlesForClient = otherGalleriesWithStringIds as any;
      }
    }
  } catch (error) {
    selectedGalleryContentForClient = [];
    otherGalleriesTitlesForClient = [];
  }

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
    ok: true,
    serviceCategory,
    galleryCategory,
    selectedGalleryContentForClient,
    otherGalleriesTitlesForClient,
    selectedServiceCategoryContentForClient,
    otherServiceCategoriesContentForClient,
    contactInfoForClient,
  };
};
