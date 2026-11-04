import { useEffect, useId, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import * as S from "./BottomSheet.styles";

export type BottomSheetProps = {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
};

export default function BottomSheet({ open, title, children, onClose }: BottomSheetProps) {
  const titleId = useId();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const previousActiveElement = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousActiveElement?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <S.Backdrop onMouseDown={onClose}>
      <S.Sheet
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <S.Handle aria-hidden="true" />
        <S.Header>
          <S.Title id={titleId}>{title}</S.Title>
          <S.CloseButton ref={closeButtonRef} type="button" onClick={onClose} aria-label="바텀시트 닫기">
            ×
          </S.CloseButton>
        </S.Header>
        <S.Content>{children}</S.Content>
      </S.Sheet>
    </S.Backdrop>,
    document.body,
  );
}
