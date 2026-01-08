import {
  Form,
  NavLink,
  useLocation,
  useNavigation,
  useSearchParams,
} from "react-router";

import { Plus, X } from "lucide-react";

const translations = {
  categories: {
    ru: "Категории",
    ee: "Kategooriad",
  },
  typeHere: {
    ru: "Введите здесь",
    ee: "Sisestage siia",
  },
  newCategory: {
    ru: "Новое название категории",
    ee: "Uue kategooria nimi",
  },
  confirm: {
    ru: "Подтвердить",
    ee: "Kinnita",
  },
  errorCategoryNameTaken: {
    ru: "Название категории уже занято",
    ee: "Kategooria nimi on juba kasutusel",
  },
  category: {
    ru: "Категория",
    ee: "Kategooria",
  },
};

export const NewCategoryForm = ({
  isVisible,
  toggleNewCategoryForm,
  errors,
}: {
  isVisible: boolean;
  toggleNewCategoryForm: () => void;
  errors: Record<string, boolean> | null;
}) => {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const location = useLocation();

  const [searchParams] = useSearchParams();
  const lang = searchParams.get("lang") as "ee" | "ru";

  return (
    <div className={`${!isVisible && "hidden"} w-full md:w-96 relative`}>
      {/* Card with form */}
      <div className="card w-full bg-base-100 card-md shadow-md">
        <div className="card-body">
          <Form method="POST" action={`.${location.search}`}>
            {/* New name est */}
            <fieldset className="fieldset">
              <legend className="fieldset-legend">
                {translations.newCategory[lang]} (EST):
              </legend>
              <input
                name="newCategoryNameEE"
                type="text"
                className={`input ${errors && errors.duplicatedFieldEE && "input-error"}`}
                placeholder={translations.typeHere[lang]}
                required
              />
              {errors && errors.duplicatedFieldEE ? (
                <p className="label text-red-500">
                  {translations.errorCategoryNameTaken[lang]}
                </p>
              ) : null}
            </fieldset>

            {/* New name rus */}
            <fieldset className="fieldset">
              <legend className="fieldset-legend">
                {translations.newCategory[lang]} (RUS):
              </legend>
              <input
                name="newCategoryNameRU"
                type="text"
                className={`input ${errors && errors.duplicatedFieldRU && "input-error"}`}
                placeholder={translations.typeHere[lang]}
                required
              />
              {errors && errors.duplicatedFieldRU ? (
                <p className="label text-red-500">
                  {translations.errorCategoryNameTaken[lang]}
                </p>
              ) : null}
            </fieldset>

            <div className="justify-end card-actions mt-5">
              {isSubmitting ? (
                <span className="loading loading-dots loading-xl"></span>
              ) : (
                <button disabled={isSubmitting} className="btn btn-primary">
                  {translations.confirm[lang]}
                </button>
              )}
            </div>
          </Form>
        </div>
      </div>

      {/* Close form button */}
      <button
        onClick={toggleNewCategoryForm}
        className="absolute top-0 right-0 btn btn-error text-white btn-sm"
      >
        <X />
      </button>
    </div>
  );
};

export const NewCategoryButton = ({ onClick }: { onClick: () => void }) => {
  const [searchParams] = useSearchParams();
  const lang = searchParams.get("lang") as "ee" | "ru";

  return (
    <button onClick={onClick} className="btn btn-neutral">
      <Plus />
      {translations.category[lang]}
    </button>
  );
};

export const CategoryListItem = ({
  title,
  category,
  categoryId,
}: {
  title: string;
  category: string;
  categoryId: string;
}) => {
  const location = useLocation();

  return (
    <NavLink
      to={{
        pathname: `/admin/gallery/${categoryId}`,
        search: location.search,
      }}
      className={({ isActive }) =>
        `btn min-h-12 h-full flex justify-center items-center ${isActive && "btn-primary"}`
      }
    >
      {title}
    </NavLink>
  );
};

export const CategorySelectionList = ({
  toggleNewCategoryForm,
  categories,
  isCategoryCreationFormOpen,
}: {
  toggleNewCategoryForm: () => void;
  categories: {
    _id: string;
    title: {
      ee: string;
      ru: string;
    };
    content: [];
  }[];
  isCategoryCreationFormOpen: boolean;
}) => {
  const [searchParams] = useSearchParams();
  const lang = searchParams.get("lang") as "ee" | "ru";

  return (
    <div className="w-full grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-5 gap-y-5 mt-5">
      {categories.map((item) => (
        <CategoryListItem
          key={item._id}
          categoryId={item._id}
          category={item.title[lang]}
          title={item.title[lang]}
        />
      ))}

      {/* Add new Category button */}
      {!isCategoryCreationFormOpen && (
        <NewCategoryButton onClick={toggleNewCategoryForm} />
      )}
    </div>
  );
};

export const Header = () => {
  const [searchParams] = useSearchParams();
  const lang = searchParams.get("lang") as "ee" | "ru";

  return (
    <header>
      <h2 className="text-2xl font-bold">{translations.categories[lang]}:</h2>
    </header>
  );
};
