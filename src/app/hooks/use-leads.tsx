import { useCallback, useEffect, useState } from "react";

const LEADS_KEY = "ipk:leads:v1";

export type LeadType =
  | "quote" | "order_groupement" | "partner" | "event_invite"
  | "newsletter" | "formation_signup" | "brochure" | "notify_groupbuy"
  | "showroom_visit" | "contact" | "blog_like";

export interface Lead {
  id: string;
  type: LeadType;
  ref?: string;          // ID/slug du contexte (produit, formation, blog, etc.)
  refLabel?: string;     // Libellé humain
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  payload?: Record<string, unknown>;
  createdAt: string;
  read?: boolean;        // vu par l'admin
  processed?: boolean;   // marqué comme traité
  processedAt?: string;
}

function load(): Lead[] { try { return JSON.parse(localStorage.getItem(LEADS_KEY) || "[]"); } catch { return []; } }
function save(list: Lead[]) { try { localStorage.setItem(LEADS_KEY, JSON.stringify(list)); } catch {} }

export function useLeads() {
  const [leads, setLeads] = useState<Lead[]>(() => load());

  useEffect(() => save(leads), [leads]);

  const addLead = useCallback((data: Omit<Lead, "id" | "createdAt">) => {
    const lead: Lead = {
      id: `lead-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      createdAt: new Date().toISOString(),
      ...data,
    };
    setLeads(prev => [lead, ...prev]);
    try { window.dispatchEvent(new CustomEvent("ipk:lead", { detail: lead })); } catch {}
    return lead;
  }, []);

  const removeLead = useCallback((id: string) => setLeads(prev => prev.filter(l => l.id !== id)), []);

  const hasLead = useCallback((type: LeadType, ref?: string) => leads.some(l => l.type === type && (ref ? l.ref === ref : true)), [leads]);

  const markRead = useCallback((id: string, read = true) => setLeads(prev => prev.map(l => l.id === id ? { ...l, read } : l)), []);
  const markAllRead = useCallback(() => setLeads(prev => prev.map(l => l.read ? l : { ...l, read: true })), []);
  const toggleProcessed = useCallback((id: string) => setLeads(prev => prev.map(l => l.id === id ? { ...l, processed: !l.processed, processedAt: !l.processed ? new Date().toISOString() : undefined, read: true } : l)), []);

  const unreadCount = leads.filter(l => !l.read).length;
  const pendingCount = leads.filter(l => !l.processed).length;

  return { leads, addLead, removeLead, hasLead, markRead, markAllRead, toggleProcessed, unreadCount, pendingCount };
}
