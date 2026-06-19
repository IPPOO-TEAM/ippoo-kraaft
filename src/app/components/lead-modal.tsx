import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { useLeads, type LeadType } from "../hooks/use-leads";
import { useUser } from "../hooks/use-user";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  type: LeadType;
  title: string;
  description?: string;
  refId?: string;
  refLabel?: string;
  fields?: { phone?: boolean; message?: boolean };
  successToast?: string;
}

export function LeadModal({ open, onOpenChange, type, title, description, refId, refLabel, fields = { phone: true, message: true }, successToast }: Props) {
  const { addLead } = useLeads();
  const { user } = useUser();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (open && user) {
      setName(prev => prev || user.fullName || "");
      setEmail(prev => prev || user.email || "");
      setPhone(prev => prev || user.phone || "");
    }
  }, [open, user]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) { toast.error("Nom et email requis"); return; }
    addLead({ type, ref: refId, refLabel, name: name.trim(), email: email.trim(), phone: phone.trim() || undefined, message: message.trim() || undefined });
    toast.success(successToast || "Demande enregistrée — nous revenons vers vous sous 48h.");
    onOpenChange(false);
    setMessage("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <form onSubmit={submit} className="space-y-3">
          <div>
            <Label htmlFor="lead-name">Nom complet</Label>
            <Input id="lead-name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="lead-email">Email</Label>
            <Input id="lead-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          {fields.phone && (
            <div>
              <Label htmlFor="lead-phone">Téléphone (optionnel)</Label>
              <Input id="lead-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
          )}
          {fields.message && (
            <div>
              <Label htmlFor="lead-message">Message (optionnel)</Label>
              <Textarea id="lead-message" rows={3} value={message} onChange={(e) => setMessage(e.target.value)} />
            </div>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
            <Button type="submit" className="bg-[var(--ipk-green-dark)] text-white">Envoyer</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
