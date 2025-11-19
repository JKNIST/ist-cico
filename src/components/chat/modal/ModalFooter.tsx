import { Button } from "@/components/ui/button";

interface ModalFooterProps {
  onCancel: () => void;
  onSend: () => void;
  isDisabled?: boolean;
}

export const ModalFooter = ({ onCancel, onSend, isDisabled = false }: ModalFooterProps) => {
  return (
    <div className="flex justify-end gap-2 pt-4">
      <Button variant="outline" onClick={onCancel}>
        Avbryt
      </Button>
      <Button onClick={onSend} disabled={isDisabled}>
        Skicka
      </Button>
    </div>
  );
};
