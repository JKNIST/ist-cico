import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useState } from "react"
import { ModalFooter } from "./modal/ModalFooter"
import { StaffMember, staffMembers } from "../staff/types"
import { RecipientSearch } from "./modal/RecipientSearch"

interface Recipient {
  id: string
  name: string
  subtitle?: string
  class: string
  type: "guardian" | "staff"
}

interface NewMessageModalProps {
  isOpen: boolean
  onClose: () => void
  onSend: (recipients: { students: Recipient[]; staff: string[] }) => void
  currentTab: 'external' | 'internal' | 'department'
}

const mockGuardians: Recipient[] = [
  { id: '1', name: '*** ***', subtitle: 'Vårdnadshavare', class: 'Sturegymnasiet - BA22-A', type: "guardian" },
  { id: '2', name: 'Agnes Engqvist', subtitle: 'Vårdnadshavare', class: 'Storängskolan - 4A', type: "guardian" },
  { id: '3', name: 'Agneta Nilsson', subtitle: 'Vårdnadshavare - Agga, Annica', class: 'Norreka 6-9 - 9/IDH', type: "guardian" },
  { id: '4', name: 'Anna Larsson', subtitle: 'Vårdnadshavare - Anders, Camilla, Marie', class: 'Landsrogymnasiet 1 - IMA22/EN', type: "guardian" },
  { id: '5', name: 'Anton Pettersson', subtitle: 'Vårdnadshavare', class: '+2 klasser/grupper', type: "guardian" },
];

export function NewMessageModal({ isOpen, onClose, onSend, currentTab }: NewMessageModalProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRecipients, setSelectedRecipients] = useState<(Recipient | StaffMember)[]>([])
  const [isRecipientsPopoverOpen, setIsRecipientsPopoverOpen] = useState(false)

  const handleRecipientSelect = (recipient: Recipient | StaffMember, checked: boolean) => {
    if (checked) {
      setSelectedRecipients(prev => [...prev, recipient])
    } else {
      setSelectedRecipients(prev => prev.filter(r => r.id !== recipient.id))
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRecipients(availableRecipients())
    } else {
      setSelectedRecipients([])
    }
  }

  const availableRecipients = () => {
    const recipients: (Recipient | StaffMember)[] = [];
    
    if (currentTab !== 'internal') {
      recipients.push(...mockGuardians);
    }
    recipients.push(...staffMembers);

    return recipients.filter(recipient => {
      const searchLower = searchQuery.toLowerCase();
      return (
        recipient.name.toLowerCase().includes(searchLower) ||
        ('subtitle' in recipient && recipient.subtitle?.toLowerCase().includes(searchLower)) ||
        ('class' in recipient && recipient.class.toLowerCase().includes(searchLower)) ||
        (!('type' in recipient) && recipient.role.toLowerCase().includes(searchLower))
      );
    });
  }

  const handleClose = () => {
    onClose()
    setSelectedRecipients([])
    setSearchQuery("")
    setIsRecipientsPopoverOpen(false)
  }

  const handleSend = () => {
    const students = selectedRecipients.filter((r): r is Recipient => 'type' in r && r.type === 'guardian');
    const staff = selectedRecipients.filter((r): r is StaffMember => !('type' in r)).map(s => s.id);
    
    onSend({
      students,
      staff
    })
    handleClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Nytt meddelande</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <RecipientSearch
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            isPopoverOpen={isRecipientsPopoverOpen}
            onPopoverOpenChange={setIsRecipientsPopoverOpen}
            recipients={availableRecipients()}
            selectedRecipients={selectedRecipients}
            onRecipientSelect={handleRecipientSelect}
            onSelectAll={handleSelectAll}
          />

          <ModalFooter 
            onCancel={handleClose}
            onSend={handleSend}
            isDisabled={selectedRecipients.length === 0}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
