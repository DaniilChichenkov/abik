import useAdminBetterModalStore from "~/stores/adminBetterModalStore";

const BetterModal = () => {
  const open = useAdminBetterModalStore((state) => state.open);
  const closeModal = useAdminBetterModalStore((state) => state.closeModal);
  const innerContent = useAdminBetterModalStore((state) => state.innerContent);

  return (
    <dialog id="my_modal_1" className="modal" open={open}>
      <div className="modal-box overflow-scroll max-h-[95dvh]">
        {(innerContent && innerContent) || null}
      </div>
    </dialog>
  );
};

export default BetterModal;
