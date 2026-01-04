import { Form, useLocation, useSearchParams } from "react-router";

import { Trash } from "lucide-react";

const translations = {
  yes: {
    ru: "Да",
    ee: "Jah",
  },
  cancel: {
    ru: "Отмена",
    ee: "Tühista",
  },
  areYouSureWantToDelete: {
    ru: "Вы действительно хотите удалить?",
    ee: "Kas olete kindel, et soovite kustutada?",
  },
  isMarkAsRed: {
    ru: "Отметить как прочитанное?",
    ee: "Kas märkida loetuks?",
  },
  markAsRed: {
    ru: "Отметить как прочитанное",
    ee: "Märgi loetuks",
  },
  email: {
    ru: "Э-почта:",
    ee: "E-post:",
  },
};

import useAdminBetterModalStore from "~/stores/adminBetterModalStore";

const FeedbackListItem = ({
  email,
  //   name,
  message,
  _id,
  itemType,
}: {
  email: string;
  //   name: string;
  message: string;
  _id: string;
  itemType: "red" | "unred";
}) => {
  const setInnerContent = useAdminBetterModalStore(
    (state) => state.setInnerContent
  );
  const openModal = useAdminBetterModalStore((state) => state.openModal);
  const closeModal = useAdminBetterModalStore((state) => state.closeModal);

  const location = useLocation();
  const [searchParams] = useSearchParams();
  const lang = searchParams.get("lang") as "ee" | "ru";

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
            action={`/admin/feedback/red${location.search}`}
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
            {translations.isMarkAsRed[lang]}
          </h2>
        </div>
        <div className="modal-action flex justify-between items-center">
          <Form
            method="POST"
            action={`/admin/feedback/unred${location.search}`}
          >
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
          {translations.email[lang]}{" "}
          <span className="font-normal">{email}</span>
        </h2>
        <p>{message}</p>
        {itemType === "unred" ? (
          <>
            <div className="justify-end card-actions mt-3">
              {/* Form to mark item as red */}
              <button
                onClick={showStatusChangeWarningModal}
                className="btn btn-primary"
              >
                {translations.markAsRed[lang]}
              </button>
            </div>
          </>
        ) : (
          <div className="justify-end card-actions mt-3">
            {/* Form to delete red item */}
            <button
              onClick={showDeleteWarningModal}
              className="btn btn-error text-white"
            >
              <Trash />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const FeedbackList = ({
  content,
  type,
}: {
  content: {
    email: string;
    // name: string;
    message: string;
    _id: string;
  }[];
  type: "red" | "unred";
}) => {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-x-5 gap-y-10 mt-5">
      {(content &&
        content.length &&
        content.map((item) => (
          <FeedbackListItem
            key={item._id}
            _id={item._id}
            // name={item.name}
            email={item.email}
            message={item.message}
            itemType={type}
          />
        ))) ||
        null}
    </div>
  );
};

export default FeedbackList;
