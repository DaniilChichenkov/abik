import { useSearchParams } from "react-router";
import useClientModalStore from "~/stores/clientModalStore";

const translations = {
  close: {
    ru: "Закрыть",
    ee: "Sulge",
  },
};

const Modal = () => {
  const open = useClientModalStore((state) => state.open);
  const closeModal = useClientModalStore((state) => state.closeModal);
  const innerContent = useClientModalStore((state) => state.innerContent);

  const [searchParams] = useSearchParams();
  const lang = searchParams.get("lang") as "ee" | "ru";

  return (
    <dialog id="my_modal_1" className="modal" open={open}>
      <div className="modal-box overflow-scroll max-h-[95dvh]">
        {(innerContent && innerContent) || null}
        <div className="modal-action">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn" onClick={closeModal}>
            {translations.close[lang]}
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default Modal;
