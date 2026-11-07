import { useEffect, useId, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { FiX } from "react-icons/fi";
import * as S from "./Modal.styles";

export type ModalProps = {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  size?: "default" | "large" | "wide";
  tone?: "default" | "warm";
};

export default function Modal({
  open,
  title,
  children,
  onClose,
  size = "default",
  tone = "default",
}: ModalProps) {
  const titleId = useId();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return;

    const previousActiveElement = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCloseRef.current();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousActiveElement?.focus();
    };
  }, [open]);

  return createPortal(
    <S.Backdrop
      $open={open}
      aria-hidden={!open}
      onMouseDown={open ? onClose : undefined}
    >
      <S.Dialog
        $size={size}
        $tone={tone}
        $open={open}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <S.Header>
          <S.Title id={titleId} $size={size}>{title}</S.Title>
          <S.CloseButton $tone={tone} ref={closeButtonRef} type="button" onClick={onClose} aria-label="모달 닫기">
            <FiX aria-hidden="true" />
          </S.CloseButton>
        </S.Header>
        <S.Content>{children}</S.Content>
      </S.Dialog>
    </S.Backdrop>,
    document.body,
  );
}
