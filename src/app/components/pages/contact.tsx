import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router";
import {
  Heart, MapPin, Shield, Award, Users, Target, Eye, Star,
  Phone, Mail, Clock, Calendar, MessageCircle, Send, ChevronRight,
  Trash2, Plus, Minus, CreditCard, ArrowRight, BarChart3, TrendingUp,
  Package, ShoppingCart, Globe, CheckCircle2, QrCode, Smartphone, Copy, Check, X, Loader2
} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { LeadModal } from "../lead-modal";
import {
  IMAGES, events, faqData, statsData,
  products, artisans, testimonials, formatPrice
} from "../../data/mock-data";
import { LazyImage } from "../lazy-image";
import { useModal } from "../../hooks/use-modal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, type ContactFormValues, joinArtisanSchema, type JoinArtisanFormValues, profileSchema, type ProfileFormValues } from "../../lib/validations";
import { useSeo } from "../../hooks/use-seo";
import { useStore } from "../../hooks/use-store";
import { useUser } from "../../hooks/use-user";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from "recharts";


// ============= CONTACT PAGE =============
function ContactLeadModal({ state, setState }: { state: { open: boolean; type: import("../../hooks/use-leads").LeadType; title: string; desc: string }; setState: (v: typeof state) => void }) {
  return <LeadModal open={state.open} onOpenChange={(v: boolean) => setState({ ...state, open: v })} type={state.type} title={state.title} description={state.desc} successToast="Demande envoyée — réponse sous 24h." />;
}

export function ContactPage() {
  const [contactType, setContactType] = useState("client");
  const [appt, setAppt] = useState<{ open: boolean; type: import("../../hooks/use-leads").LeadType; title: string; desc: string }>({ open: false, type: "showroom_visit", title: "", desc: "" });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({ resolver: zodResolver(contactSchema), mode: "onBlur" });

  const onSubmit = async (data: ContactFormValues) => {
    await new Promise((r) => setTimeout(r, 600));
    try {
      const KEY = "ipk:admin:messages:v1";
      const raw = localStorage.getItem(KEY);
      const list = raw ? JSON.parse(raw) : [];
      list.unshift({
        id: `msg-${Date.now()}`,
        type: contactType,
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
        date: new Date().toISOString(),
        read: false,
      });
      localStorage.setItem(KEY, JSON.stringify(list));
    } catch {}
    toast.success("Message envoyé !");
    reset();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-20 lg:pb-8">
      <h1 className="text-center mb-2" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(26px, 5vw, 36px)", fontWeight: 600, color: "var(--ipk-ink)" }}>
        Contactez-nous
      </h1>
      <p className="text-center text-[var(--ipk-text)] mb-8" style={{ fontSize: "15px" }}>
        Nous sommes à votre écoute pour toute question
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { icon: Phone, title: "Téléphone", info: "+228 90 12 34 56", sub: "Lun-Ven 8h-18h" },
          { icon: Mail, title: "Email", info: "contact@ipookraaft.com", sub: "Réponse sous 24h" },
          { icon: MessageCircle, title: "WhatsApp", info: "+228 90 12 34 56", sub: "Chat en direct" },
        ].map((item, i) => (
          <div key={i} className="text-center p-5 bg-[var(--ipk-surface)] rounded-2xl">
            <item.icon className="w-6 h-6 text-[var(--ipk-green-dark)] mx-auto mb-2" />
            <h4 style={{ fontSize: "14px", fontWeight: 600, color: "var(--ipk-ink)" }}>{item.title}</h4>
            <p style={{ fontSize: "14px", color: "var(--ipk-blue)", fontWeight: 500 }}>{item.info}</p>
            <p style={{ fontSize: "12px", color: "var(--ipk-text)" }}>{item.sub}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-[var(--ipk-border)] p-6">
        <h2 className="mb-4" style={{ fontSize: "18px", fontWeight: 600, color: "var(--ipk-ink)" }}>Envoyez-nous un message</h2>

        <div className="flex gap-2 mb-6">
          {[
            { value: "client", label: "Client" },
            { value: "artisan", label: "Artisan" },
            { value: "partenaire", label: "Partenaire" },
          ].map(t => (
            <button
              key={t.value}
              onClick={() => setContactType(t.value)}
              className={`px-4 py-2 rounded-full transition-colors ${contactType === t.value ? "bg-[var(--ipk-green-dark)] text-white" : "bg-[var(--ipk-surface)] text-[var(--ipk-text)] border border-[var(--ipk-border)]"}`}
              style={{ fontSize: "13px", fontWeight: 500 }}
            >
              {t.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="contact-name" style={{ fontSize: "13px", fontWeight: 500 }}>Nom complet</label>
              <input
                id="contact-name"
                {...register("name")}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "contact-name-error" : undefined}
                className={`w-full mt-1 px-4 py-2.5 bg-[var(--ipk-surface)] border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B6B3A]/30 ${errors.name ? "border-red-500" : "border-[var(--ipk-border)]"}`}
                style={{ fontSize: "14px" }}
                placeholder="Votre nom"
                autoComplete="name"
              />
              {errors.name && <p id="contact-name-error" className="mt-1 text-red-600" style={{ fontSize: "12px" }}>{errors.name.message}</p>}
            </div>
            <div>
              <label htmlFor="contact-email" style={{ fontSize: "13px", fontWeight: 500 }}>Email</label>
              <input
                id="contact-email"
                type="email"
                {...register("email")}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "contact-email-error" : undefined}
                className={`w-full mt-1 px-4 py-2.5 bg-[var(--ipk-surface)] border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B6B3A]/30 ${errors.email ? "border-red-500" : "border-[var(--ipk-border)]"}`}
                style={{ fontSize: "14px" }}
                placeholder="votre@email.com"
                autoComplete="email"
              />
              {errors.email && <p id="contact-email-error" className="mt-1 text-red-600" style={{ fontSize: "12px" }}>{errors.email.message}</p>}
            </div>
          </div>
          <div>
            <label htmlFor="contact-subject" style={{ fontSize: "13px", fontWeight: 500 }}>Sujet</label>
            <input
              id="contact-subject"
              {...register("subject")}
              aria-invalid={!!errors.subject}
              aria-describedby={errors.subject ? "contact-subject-error" : undefined}
              className={`w-full mt-1 px-4 py-2.5 bg-[var(--ipk-surface)] border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B6B3A]/30 ${errors.subject ? "border-red-500" : "border-[var(--ipk-border)]"}`}
              style={{ fontSize: "14px" }}
              placeholder="Objet de votre message"
            />
            {errors.subject && <p id="contact-subject-error" className="mt-1 text-red-600" style={{ fontSize: "12px" }}>{errors.subject.message}</p>}
          </div>
          <div>
            <label htmlFor="contact-message" style={{ fontSize: "13px", fontWeight: 500 }}>Message</label>
            <textarea
              id="contact-message"
              {...register("message")}
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? "contact-message-error" : undefined}
              className={`w-full mt-1 px-4 py-2.5 bg-[var(--ipk-surface)] border rounded-xl h-32 resize-none focus:outline-none focus:ring-2 focus:ring-[#0B6B3A]/30 ${errors.message ? "border-red-500" : "border-[var(--ipk-border)]"}`}
              style={{ fontSize: "14px" }}
              placeholder="Votre message..."
            />
            {errors.message && <p id="contact-message-error" className="mt-1 text-red-600" style={{ fontSize: "12px" }}>{errors.message.message}</p>}
          </div>
          <Button type="submit" disabled={isSubmitting} className="bg-[var(--ipk-green-dark)] text-white rounded-xl h-11 px-6 disabled:opacity-60">
            {isSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" aria-hidden="true" /> Envoi en cours…</> : <><Send className="w-4 h-4 mr-2" aria-hidden="true" /> Envoyer</>}
          </Button>
        </form>
      </div>

      <div className="mt-8 p-6 bg-[var(--ipk-surface)] rounded-2xl">
        <h3 className="mb-3" style={{ fontSize: "16px", fontWeight: 600, color: "var(--ipk-ink)" }}>Prendre rendez-vous</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {([
            { title: "Visite showroom", desc: "Découvrez nos oeuvres en personne", type: "showroom_visit" as const },
            { title: "Appel partenariat", desc: "Discutons de votre projet professionnel", type: "partner" as const },
            { title: "Inscription formation", desc: "Planifiez votre session", type: "formation_signup" as const },
          ]).map((item, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setAppt({ open: true, type: item.type, title: item.title, desc: item.desc })}
              className="p-4 bg-white border border-[var(--ipk-border)] rounded-xl text-left hover:border-[var(--ipk-green-dark)] transition-colors"
            >
              <h4 style={{ fontSize: "14px", fontWeight: 600, color: "var(--ipk-ink)" }}>{item.title}</h4>
              <p style={{ fontSize: "12px", color: "var(--ipk-text)" }}>{item.desc}</p>
            </button>
          ))}
        </div>
      </div>
      <ContactLeadModal state={appt} setState={setAppt} />
    </div>
  );
}

// ============= FAQ PAGE =============
export function FAQPage() {
  useSeo({ title: "FAQ — Questions fréquentes", description: "Réponses aux questions les plus posées sur la boutique, les normes, les certifications et les commandes IPPOO KRAAFT." });
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 pb-20 lg:pb-8">
      <h1 className="text-center mb-2" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(26px, 5vw, 36px)", fontWeight: 600, color: "var(--ipk-ink)" }}>
        Questions Fréquentes
      </h1>
      <p className="text-center text-[var(--ipk-text)] mb-8" style={{ fontSize: "15px" }}>
        Trouvez rapidement les réponses à vos questions
      </p>

      <div className="space-y-6">
        {faqData.map((section, i) => (
          <div key={i}>
            <h2 className="mb-3 flex items-center gap-2" style={{ fontSize: "18px", fontWeight: 600, color: "var(--ipk-green-dark)" }}>
              {section.category}
            </h2>
            <Accordion type="single" collapsible className="border rounded-2xl overflow-hidden">
              {section.questions.map((faq, j) => (
                <AccordionItem key={j} value={`${i}-${j}`}>
                  <AccordionTrigger className="px-4" style={{ fontSize: "14px" }}>{faq.q}</AccordionTrigger>
                  <AccordionContent className="px-4">
                    <p style={{ fontSize: "14px", color: "var(--ipk-text)", lineHeight: 1.7 }}>{faq.a}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ))}
      </div>

      <div className="mt-10 text-center p-6 bg-[var(--ipk-surface)] rounded-2xl">
        <p style={{ fontSize: "15px", color: "var(--ipk-text)" }}>Vous n'avez pas trouvé la réponse ?</p>
        <Link to="/contact">
          <Button className="mt-3 bg-[var(--ipk-green-dark)] text-white rounded-xl h-11 px-6">
            Contactez-nous <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
