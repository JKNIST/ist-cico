import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { RecipientTypeSelection } from "./recipients/RecipientTypeSelection";
import { ExternalRecipientsSection } from "./recipients/ExternalRecipientsSection";
import { InternalRecipientsSection } from "./recipients/InternalRecipientsSection";

interface RecipientsSectionProps {
  onInternalOnlyChange?: (internalOnly: boolean) => void;
}

export function RecipientsSection({ onInternalOnlyChange }: RecipientsSectionProps) {
  const { t } = useTranslation();
  const [showExternalRecipients, setShowExternalRecipients] = useState(true);
  const [showInternalRecipients, setShowInternalRecipients] = useState(false);

  // Notifiera parent om endast interna mottagare är valda
  useEffect(() => {
    const isInternalOnly = !showExternalRecipients && showInternalRecipients;
    onInternalOnlyChange?.(isInternalOnly);
  }, [showExternalRecipients, showInternalRecipients, onInternalOnlyChange]);

  return (
    <div className="space-y-4 p-4 border rounded-md">
      <h3 className="font-medium text-sm">{t("blog.form.recipients")}</h3>

      <RecipientTypeSelection
        showExternal={showExternalRecipients}
        showInternal={showInternalRecipients}
        onShowExternalChange={setShowExternalRecipients}
        onShowInternalChange={setShowInternalRecipients}
      />

      {showExternalRecipients && <ExternalRecipientsSection />}
      {showInternalRecipients && <InternalRecipientsSection />}
    </div>
  );
}
