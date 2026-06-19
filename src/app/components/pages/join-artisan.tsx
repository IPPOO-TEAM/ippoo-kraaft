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


// ============= JOIN ARTISAN PAGE =============
export function JoinArtisanPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<JoinArtisanFormValues>({
    resolver: zodResolver(joinArtisanSchema),
    mode: "onBlur",
    defaultValues: { craft: "Sculpture" },
  });

  const onSubmit = async (data: JoinArtisanFormValues) => {
    await new Promise((r) => setTimeout(r, 600));
    toast.success("Candidature envoyée !", { description: "Nous vous contacterons sous 48h." });
    reset();
  };

  const fieldClass = (hasError: boolean) =>
    `w-full mt-1 px-4 py-2.5 bg-[var(--ipk-surface)] border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B6B3A]/30 ${hasError ? "border-red-500" : "border-[var(--ipk-border)]"}`;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 pb-20 lg:pb-8">
      <h1 className="text-center mb-2" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(26px, 5vw, 36px)", fontWeight: 600, color: "var(--ipk-ink)" }}>
        Devenir Artisan IPPOO KRAAFT
      </h1>
      <p className="text-center text-[var(--ipk-text)] mb-8" style={{ fontSize: "15px" }}>
        Rejoignez notre réseau d'artisans et bénéficiez de formations, visibilité et commandes régulières
      </p>

      {/* Steps */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {[
          { num: "1", title: "Inscription", desc: "Remplissez le formulaire" },
          { num: "2", title: "Entretien", desc: "Présentation de vos oeuvres" },
          { num: "3", title: "Validation", desc: "Test qualité et conformité" },
          { num: "4", title: "Intégration", desc: "Identifiant et espace artisan" },
        ].map((step, i) => (
          <div key={i} className="text-center p-4 bg-[var(--ipk-surface)] rounded-2xl">
            <div className="w-10 h-10 bg-[var(--ipk-green-dark)] text-white rounded-full flex items-center justify-center mx-auto mb-2" style={{ fontSize: "16px", fontWeight: 700 }}>
              {step.num}
            </div>
            <h4 style={{ fontSize: "14px", fontWeight: 600, color: "var(--ipk-ink)" }}>{step.title}</h4>
            <p style={{ fontSize: "11px", color: "var(--ipk-text)" }}>{step.desc}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl border border-[var(--ipk-border)] p-6 space-y-4" noValidate>
        <h2 style={{ fontSize: "18px", fontWeight: 600, color: "var(--ipk-ink)" }}>Formulaire de candidature</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="ja-fullName" style={{ fontSize: "13px" }}>Nom complet</label>
            <input id="ja-fullName" {...register("fullName")} aria-invalid={!!errors.fullName} className={fieldClass(!!errors.fullName)} style={{ fontSize: "14px" }} autoComplete="name" />
            {errors.fullName && <p className="mt-1 text-red-600" style={{ fontSize: "12px" }}>{errors.fullName.message}</p>}
          </div>
          <div>
            <label htmlFor="ja-country" style={{ fontSize: "13px" }}>Pays / Région</label>
            <input id="ja-country" {...register("country")} aria-invalid={!!errors.country} className={fieldClass(!!errors.country)} style={{ fontSize: "14px" }} autoComplete="country-name" />
            {errors.country && <p className="mt-1 text-red-600" style={{ fontSize: "12px" }}>{errors.country.message}</p>}
          </div>
          <div>
            <label htmlFor="ja-craft" style={{ fontSize: "13px" }}>Spécialité</label>
            <select id="ja-craft" {...register("craft")} aria-invalid={!!errors.craft} className={fieldClass(!!errors.craft)} style={{ fontSize: "14px" }}>
              <option>Sculpture</option><option>Textile</option><option>Poterie</option><option>Vannerie</option><option>Bijoux</option><option>Métal</option><option>Cuir</option><option>Autre</option>
            </select>
            {errors.craft && <p className="mt-1 text-red-600" style={{ fontSize: "12px" }}>{errors.craft.message}</p>}
          </div>
          <div>
            <label htmlFor="ja-experience" style={{ fontSize: "13px" }}>Années d'expérience</label>
            <input id="ja-experience" type="number" min="0" max="80" {...register("experience")} aria-invalid={!!errors.experience} className={fieldClass(!!errors.experience)} style={{ fontSize: "14px" }} />
            {errors.experience && <p className="mt-1 text-red-600" style={{ fontSize: "12px" }}>{errors.experience.message}</p>}
          </div>
          <div>
            <label htmlFor="ja-email" style={{ fontSize: "13px" }}>Email</label>
            <input id="ja-email" type="email" {...register("email")} aria-invalid={!!errors.email} className={fieldClass(!!errors.email)} style={{ fontSize: "14px" }} autoComplete="email" />
            {errors.email && <p className="mt-1 text-red-600" style={{ fontSize: "12px" }}>{errors.email.message}</p>}
          </div>
          <div>
            <label htmlFor="ja-phone" style={{ fontSize: "13px" }}>Téléphone / WhatsApp</label>
            <input id="ja-phone" type="tel" {...register("phone")} aria-invalid={!!errors.phone} className={fieldClass(!!errors.phone)} style={{ fontSize: "14px" }} autoComplete="tel" />
            {errors.phone && <p className="mt-1 text-red-600" style={{ fontSize: "12px" }}>{errors.phone.message}</p>}
          </div>
        </div>
        <div>
          <label htmlFor="ja-motivation" style={{ fontSize: "13px" }}>Présentez votre travail et vos oeuvres</label>
          <textarea id="ja-motivation" {...register("motivation")} aria-invalid={!!errors.motivation} className={`${fieldClass(!!errors.motivation)} h-28 resize-none`} style={{ fontSize: "14px" }} />
          {errors.motivation && <p className="mt-1 text-red-600" style={{ fontSize: "12px" }}>{errors.motivation.message}</p>}
        </div>
        <Button type="submit" disabled={isSubmitting} className="w-full bg-[var(--ipk-green-dark)] text-white rounded-xl h-12 disabled:opacity-60">
          {isSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" aria-hidden="true" /> Envoi en cours…</> : <>Envoyer ma candidature <ArrowRight className="w-4 h-4 ml-1" /></>}
        </Button>
      </form>
    </div>
  );
}
