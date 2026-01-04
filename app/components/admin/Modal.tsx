import { useEffect } from "react";
import { useFetcher, useSearchParams } from "react-router";
import useAdminModalStore from "~/stores/adminModalStore";

const translations = {
  attention: {
    ru: "Внимание!",
    ee: "Tähelepanu!",
  },
  areYouSureWantToDelete: {
    ru: "Вы уверены, что хотите удалить это?",
    ee: "Kas olete kindel, et soovite selle kustutada?",
  },
  delete: {
    ru: "Удалить",
    ee: "Kustuta",
  },
  close: {
    ru: "Закрыть",
    ee: "Sulge",
  },
};

const ModalInfoVariant = ({ closeModal }: { closeModal: () => void }) => {
  const innerContent = useAdminModalStore((state) => state.innerContent);

  const [searchParams] = useSearchParams();
  const lang = searchParams.get("lang") as "ee" | "ru";

  return (
    <>
      {innerContent}
      <div className="modal-action flex justify-between items-center">
        {/* Close modal btn */}
        <button onClick={closeModal} className="btn">
          {translations.close[lang]}
        </button>
      </div>
    </>
  );
};

const ModalDeleteVariant = ({ closeModal }: { closeModal: () => void }) => {
  const actionRoute = useAdminModalStore((state) => state.actionRoute);
  const itemId = useAdminModalStore((state) => state.itemId);

  const [searchParams] = useSearchParams();
  const lang = searchParams.get("lang") as "ee" | "ru";

  //Track action response
  const fetcher = useFetcher<{ ok: boolean }>();
  useEffect(() => {
    if (fetcher.data?.ok) closeModal();
  }, [fetcher.data]);

  return (
    <>
      {actionRoute && itemId && (
        <>
          <h3 className="font-bold text-lg">{translations.attention[lang]}</h3>
          <p className="py-4">{translations.areYouSureWantToDelete[lang]}</p>
          <div className="modal-action flex justify-between items-center">
            {/* Form which will be sent if user confirms */}
            <fetcher.Form method="POST" action={actionRoute!}>
              <input type="hidden" name="itemId" value={itemId} />
              <button className="btn btn-error text-white">
                {translations.delete[lang]}
              </button>
            </fetcher.Form>

            {/* Close modal btn */}
            <button onClick={closeModal} className="btn">
              {translations.close[lang]}
            </button>
          </div>
        </>
      )}
    </>
  );
};

const Modal = () => {
  //State from store
  const modalOpened = useAdminModalStore((state) => state.open);
  const modalVariant = useAdminModalStore((state) => state.modalVariant);
  const closeModal = useAdminModalStore((state) => state.closeModal);

  return (
    <dialog open={modalOpened} className="modal">
      <div className="modal-box">
        {modalVariant === "delete" ? (
          <ModalDeleteVariant closeModal={closeModal} />
        ) : modalVariant === "info" ? (
          <ModalInfoVariant closeModal={closeModal} />
        ) : null}
      </div>
    </dialog>
  );
};

export default Modal;
