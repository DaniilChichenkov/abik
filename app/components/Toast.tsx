import { useRef, useEffect } from "react";

import useToastStore from "~/stores/toastModalStore";

const Toast = () => {
  const isToastOpen = useToastStore((state) => state.open);
  const hideToast = useToastStore((state) => state.closeToast);
  const toastVariant = useToastStore((state) => state.variant);
  const toastInnerContent = useToastStore((state) => state.innerContent);

  //Toast hide timeout
  const toastHideTimeout = useRef<any>(null);
  useEffect(() => {
    if (isToastOpen) {
      if (toastHideTimeout) {
        clearInterval(toastHideTimeout.current);
      }
      toastHideTimeout.current = setTimeout(() => {
        hideToast();
      }, 5000);
    }
  }, [isToastOpen]);

  return (
    (toastVariant && toastInnerContent && (
      <>
        <div
          className={`toast toast-top toast-center transition-all duration-200 ${!isToastOpen && "-top-full"}`}
        >
          <div className={`alert alert-${toastVariant}`}>
            <span className="text-lg">{toastInnerContent}</span>
          </div>
        </div>
      </>
    )) ||
    null
  );
};

export default Toast;
