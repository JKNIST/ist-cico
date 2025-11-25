import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface ModalFooterProps {
  onCancel: () => void;
  onSend: () => void;
  isDisabled?: boolean;
}

export const ModalFooter = ({ onCancel, onSend, isDisabled = false }: ModalFooterProps) => {
  const { t } = useTranslation();
  
  return (
    <div className="flex justify-end gap-2 pt-4">
      <Button variant="outline" onClick={onCancel}>
        {t("chat.modal.cancel")}
      </Button>
      <Button onClick={onSend} disabled={isDisabled}>
        {t("chat.modal.send")}
      </Button>
    </div>
  );
};
