import {
  Form,
  useNavigate,
  type ActionFunction,
  redirect,
  useNavigation,
  useSearchParams,
  NavLink,
} from "react-router";
import { useEffect, useState, useRef } from "react";

import { X } from "lucide-react";

const translations = {
  uploadedSuccessfully: {
    ru: "Успешно загружено:",
    ee: "Edukalt üles laaditud:",
  },
  conflict: {
    ru: "Конфликт",
    ee: "Konflikt",
  },
  inOrderToUploadConflicted: {
    ru: "Чтобы загрузить конфликтующие файлы, переименуйте их и попробуйте снова",
    ee: "Konfliktsete failide üleslaadimiseks nimetage need ümber ja proovige uuesti",
  },
  errorDuringUpload: {
    ru: "Ошибка при загрузке",
    ee: "Viga üleslaadimisel",
  },
  uploadFiles: {
    ru: "Загрузите файл(ы)",
    ee: "Laadi oma fail(id) üles",
  },
  selectedFile: {
    ru: "Выбранные файлы:",
    ee: "Valitud failid:",
  },
  confirm: {
    ru: "Подтвердить",
    ee: "Kinnita",
  },
};

import useAdminModalStore from "~/stores/adminModalStore";
import { getSession } from "~/utils/session";

type Props = {
  actionData: {
    ok: boolean;
    uploadedSuccessfully: string[];
    conflicted: string[];
    errors?: Record<string, boolean>;
  };
  params: {
    selectedGalleryCategory: string;
  };
};
const AdminSelectedGalleryCategoryNewImages = ({
  actionData,
  params,
}: Props) => {
  //Modal window
  const openModal = useAdminModalStore((state) => state.openModal);
  const setInnerContent = useAdminModalStore((state) => state.setInnerContent);

  //Files (Preview)
  const [files, setFiles] = useState<File[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const lastResultRef = useRef<string | null>(null);

  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const lang = searchParams.get("lang") as "ee" | "ru";

  //Track action data
  useEffect(() => {
    //If request was successfull
    if (actionData && actionData.ok) {
      //Protection from re-rendering
      const signature = JSON.stringify({
        u: actionData.uploadedSuccessfully,
        c: actionData.conflicted,
      });

      if (lastResultRef.current === signature) return;
      lastResultRef.current = signature;

      //Clear state
      setFiles([]);

      //Clear input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      //Open modal
      openModal("info");
      setInnerContent(
        <>
          <h3 className="font-bold text-lg">Results:</h3>
          {/* Uploaded files */}
          {actionData.uploadedSuccessfully.length > 0 && (
            <ul className="list bg-base-100 rounded-box shadow-md mt-5">
              <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">
                {translations.uploadedSuccessfully[lang]}
              </li>

              {actionData.uploadedSuccessfully.map((item) => (
                <li className="list-row" key={item}>
                  {item}
                </li>
              ))}
            </ul>
          )}

          {/* Conflicted files */}
          {actionData.conflicted.length > 0 && (
            <>
              <ul className="list bg-base-100 rounded-box shadow-md mt-5">
                <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">
                  {translations.conflict[lang]}:
                </li>

                {actionData.conflicted.map((item) => (
                  <li className="list-row" key={item}>
                    {item}
                  </li>
                ))}
              </ul>

              <p className="text-sm mt-3">
                {translations.inOrderToUploadConflicted[lang]}
              </p>
            </>
          )}
        </>,
      );

      navigate(-1);
    } else if (actionData && !actionData.ok) {
      //Protection from re-rendering
      const signature = JSON.stringify({
        ok: actionData.ok,
        errors: actionData.errors,
      });
      if (lastResultRef.current === signature) return;
      lastResultRef.current = signature;

      //Show modal
      openModal("info");
      setInnerContent(
        <>
          <h2>{translations.errorDuringUpload[lang]}</h2>
          {actionData?.errors &&
            Object.keys(actionData.errors).map((item) => (
              <p className="text-error" key={item}>
                {item}
              </p>
            ))}
        </>,
      );
    }
  }, [actionData]);

  return (
    <div className="card bg-base-100 shadow-md w-full md:w-[20rem] mt-5 relative">
      <div className="card-body w-full">
        {" "}
        <Form method="POST" action="." encType="multipart/form-data">
          {/* Input  */}
          <label
            htmlFor="File"
            className="block rounded border border-gray-300 p-4 text-gray-900 shadow-sm sm:p-6 w-full md:w-auto mt-5 cursor-pointer"
          >
            <div className="flex items-center justify-center gap-4">
              <span className="font-medium">
                {translations.uploadFiles[lang]}{" "}
              </span>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7.5 7.5h-.75A2.25 2.25 0 0 0 4.5 9.75v7.5a2.25 2.25 0 0 0 2.25 2.25h7.5a2.25 2.25 0 0 0 2.25-2.25v-7.5a2.25 2.25 0 0 0-2.25-2.25h-.75m0-3-3-3m0 0-3 3m3-3v11.25m6-2.25h.75a2.25 2.25 0 0 1 2.25 2.25v7.5a2.25 2.25 0 0 1-2.25 2.25h-7.5a2.25 2.25 0 0 1-2.25-2.25v-.75"
                ></path>
              </svg>
            </div>

            <input
              accept="image/*"
              multiple
              type="file"
              id="File"
              className="sr-only"
              name="images"
              ref={fileInputRef}
              required
              onChange={(e) => {
                const selectedFiles = e.target.files;
                if (!selectedFiles) return;
                setFiles(Array.from(selectedFiles));
              }}
            />
          </label>

          {/* Files preview */}
          {(files.length && (
            <ul className="list bg-base-100 rounded-box shadow-md mt-5">
              <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">
                {translations.uploadFiles[lang]}
              </li>

              {files.map((item) => {
                return (
                  <li className="list-row" key={item.name}>
                    {item.name}
                  </li>
                );
              })}
            </ul>
          )) ||
            null}

          {/* Confirm button */}
          <div className="justify-end card-actions mt-5">
            {isSubmitting ? (
              <span className="loading loading-lg loading-spinner"></span>
            ) : (
              <button className="btn btn-primary">
                {translations.confirm[lang]}
              </button>
            )}
          </div>
        </Form>
      </div>

      {/* Form close button */}
      <NavLink
        to={`/admin/gallery/${params.selectedGalleryCategory}?${searchParams.toString()}`}
        className="absolute top-0 right-0 btn btn-error text-white btn-sm"
      >
        <X />
      </NavLink>
    </div>
  );
};

export const action: ActionFunction = async ({ params, request }) => {
  //Check for authentication
  const cookieHeader = request.headers.get("Cookie");
  const session = await getSession(cookieHeader);

  //If user is unauthorized
  if (!session.get("isAdmin")) {
    return redirect("/login");
  }

  const { selectedGalleryCategory } = params;

  //Check if no gallery provided - redirect to /admin/gallery
  if (!selectedGalleryCategory || typeof selectedGalleryCategory !== "string") {
    return redirect("/admin/gallery");
  }

  const validationErrors: Record<string, boolean> = {};

  //Get and validate files (Ensure that they are images)
  const formData = await request.formData();
  const files = formData
    .getAll("images")
    .filter((v): v is File => v instanceof File);

  if (files.length === 0) {
    return {
      ok: false,
      errors: { noFilesSelected: true },
    };
  }

  files.forEach((file) => {
    if (!file.type.startsWith("image/")) {
      validationErrors.errorWithFiles = true;
    }
  });

  if (Object.keys(validationErrors).length > 0) {
    return {
      ok: false,
      errors: validationErrors,
    };
  }

  //Import DB modules
  const mongoose = await import("mongoose");
  const { connectToDB } = await import("~/utils/db");
  const GalleryModel = (await import("~/models/galleryModel")).default;
  const fs = await import("fs/promises");
  const path = await import("path");

  //Check if gallery exists in db
  try {
    await connectToDB();
    const gallery = await GalleryModel.findOne({
      _id: new mongoose.Types.ObjectId(selectedGalleryCategory),
    });
    if (!gallery) {
      throw new Error("noGalleryFound");
    }
  } catch (error) {
    return {
      ok: false,
      errors: {
        noGalleryExists: true,
      },
    };
  }

  //Build path where images are going to be uploaded
  const folderPath = path.join(
    process.cwd(),
    "public",
    "gallery",
    selectedGalleryCategory,
  );

  //Check if such directory exists
  try {
    const s = await fs.stat(folderPath);
    if (!s.isDirectory()) {
      throw new Error("Not a directory");
    }

    //Upload files
    const uploadedSuccessfully = [];
    const conflicted = [];
    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const safeFileName = path.basename(file.name);
      try {
        await fs.writeFile(path.join(folderPath, safeFileName), buffer, {
          flag: "wx",
        });
        uploadedSuccessfully.push(safeFileName);
      } catch (err: any) {
        //Implement notification for user that file exists
        if (err.code === "EEXIST") {
          conflicted.push(safeFileName);
        }
      }
    }

    await new Promise((r) => {
      setTimeout(() => {
        r("");
      }, 300);
    });

    return {
      ok: true,
      uploadedSuccessfully,
      conflicted,
    };
  } catch (error) {
    return {
      ok: false,
      errors: {
        noGalleryDirectory: true,
      },
    };
  }
};

export default AdminSelectedGalleryCategoryNewImages;
