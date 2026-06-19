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


// ============= EVENTS PAGE =============
export function EventsPage() {
  useSeo({ title: "Événements", description: "Salons, séminaires, démonstrations et expositions IPPOO KRAAFT à venir." });
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 pb-20 lg:pb-6">
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(24px, 5vw, 36px)", fontWeight: 600, color: "var(--ipk-ink)" }}>
        Événements
      </h1>
      <p className="text-[var(--ipk-text)] mt-1 mb-6" style={{ fontSize: "15px" }}>
        Salons, séminaires, démonstrations et expositions
      </p>

      <div className="space-y-4">
        {events.map((event) => (
          <div key={event.id} className="bg-white rounded-2xl overflow-hidden border border-[var(--ipk-border)] hover:shadow-lg transition-shadow">
            <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-0">
              <div className="aspect-[16/9] sm:aspect-auto overflow-hidden">
                <LazyImage src={event.image} alt={event.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-4 sm:p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-[#0057FF]/10 text-[var(--ipk-blue)] border-0" style={{ fontSize: "11px" }}>{event.type}</Badge>
                  {event.ticketPrice === 0 && <Badge className="bg-[#0B6B3A]/10 text-[var(--ipk-green-dark)] border-0" style={{ fontSize: "11px" }}>Gratuit</Badge>}
                </div>
                <h3 style={{ fontSize: "16px", fontWeight: 600, color: "var(--ipk-ink)" }}>{event.title}</h3>
                <p className="text-[var(--ipk-text)] mt-1 line-clamp-2" style={{ fontSize: "13px", lineHeight: 1.6 }}>{event.description}</p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3" style={{ fontSize: "12px", color: "var(--ipk-text)" }}>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" /> {event.date} → {event.endDate}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" /> {event.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" /> {event.spotsLeft} places
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-4">
                  <Button
                    onClick={() => toast.success("Inscription enregistrée", { description: `Votre place pour « ${event.title} » est réservée. Confirmation par email.` })}
                    className="bg-[var(--ipk-green-dark)] text-white rounded-xl h-9 px-5"
                    style={{ fontSize: "13px" }}
                  >
                    S'inscrire {event.ticketPrice > 0 && `(${formatPrice(event.ticketPrice)})`}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => toast.info(event.title, { description: event.description })}
                    className="border border-[var(--ipk-border)] rounded-xl h-9 px-5"
                    style={{ fontSize: "13px" }}
                  >
                    En savoir plus
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============= STATISTICS PAGE =============
export function StatsPage() {
  useSeo({ title: "Chiffres clés", description: "Notre impact en temps réel : ventes, artisans, pays couverts et croissance IPPOO KRAAFT." });
  const salesData = [
    { month: "Sep", ventes: 245 }, { month: "Oct", ventes: 312 }, { month: "Nov", ventes: 389 },
    { month: "Déc", ventes: 456 }, { month: "Jan", ventes: 398 }, { month: "Fév", ventes: 421 },
  ];
  const categoryData = [
    { name: "Sculpture", value: 30 }, { name: "Textile", value: 25 }, { name: "Poterie", value: 18 },
    { name: "Vannerie", value: 12 }, { name: "Bijoux", value: 10 }, { name: "Autre", value: 5 },
  ];
  const COLORS = ["var(--ipk-green-dark)", "var(--ipk-blue)", "var(--ipk-amber)", "#8B5CF6", "#EC4899", "var(--ipk-text)"];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 pb-20 lg:pb-6">
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(24px, 5vw, 36px)", fontWeight: 600, color: "var(--ipk-ink)" }}>
        Chiffres Clés
      </h1>
      <p className="text-[var(--ipk-text)] mt-1 mb-6" style={{ fontSize: "15px" }}>
        Notre impact et notre croissance en temps réel
      </p>

      {/* KPI cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3 mb-6 sm:mb-8">
        {[
          { label: "Visites", value: statsData.visits.toLocaleString(), icon: Eye, color: "var(--ipk-blue)" },
          { label: "Abonnés", value: statsData.subscribers.toLocaleString(), icon: Users, color: "var(--ipk-green-dark)" },
          { label: "Ventes", value: statsData.sales.toLocaleString(), icon: ShoppingCart, color: "var(--ipk-amber)" },
          { label: "Artisans", value: statsData.artisans, icon: Users, color: "#8B5CF6" },
          { label: "Pays", value: statsData.countries, icon: Globe, color: "#EC4899" },
        ].map((kpi, i) => (
          <div key={i} className="bg-white rounded-2xl border border-[var(--ipk-border)] p-3 sm:p-4">
            <kpi.icon className="w-4 h-4 sm:w-5 sm:h-5 mb-1.5 sm:mb-2" style={{ color: kpi.color }} />
            <div style={{ fontSize: "clamp(18px, 4vw, 28px)", fontWeight: 700, color: "var(--ipk-ink)" }}>{kpi.value}</div>
            <div style={{ fontSize: "11px", color: "var(--ipk-text)" }}>{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* More stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {[
          { label: "Groupements", value: statsData.groupements },
          { label: "Partenaires", value: statsData.partners },
          { label: "Pièces uniques", value: statsData.uniquePieces },
          { label: "Exclusivités", value: statsData.exclusives },
        ].map((s, i) => (
          <div key={i} className="text-center p-4 bg-[var(--ipk-surface)] rounded-2xl">
            <div style={{ fontSize: "24px", fontWeight: 700, color: "var(--ipk-green-dark)" }}>{s.value}</div>
            <div style={{ fontSize: "12px", color: "var(--ipk-text)" }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sales chart */}
        <div className="bg-white rounded-2xl border border-[var(--ipk-border)] p-5">
          <h3 className="mb-4" style={{ fontSize: "16px", fontWeight: 600, color: "var(--ipk-ink)" }}>Ventes mensuelles</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--ipk-border)" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip cursor={{ fill: "var(--ipk-surface)" }} contentStyle={{ borderRadius: 12, border: "1px solid var(--ipk-border)", fontSize: 12 }} labelStyle={{ color: "var(--ipk-ink)", fontWeight: 600 }} formatter={(v: number, n: string) => [v, n === "ventes" ? "Ventes" : n === "value" ? "Part" : n]} />
              <Bar dataKey="ventes" fill="var(--ipk-green-dark)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category breakdown */}
        <div className="bg-white rounded-2xl border border-[var(--ipk-border)] p-5">
          <h3 className="mb-4" style={{ fontSize: "16px", fontWeight: 600, color: "var(--ipk-ink)" }}>Répartition par catégorie</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" innerRadius={35} outerRadius={60} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} style={{ fontSize: "10px" }}>
                {categoryData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip cursor={{ fill: "var(--ipk-surface)" }} contentStyle={{ borderRadius: 12, border: "1px solid var(--ipk-border)", fontSize: 12 }} labelStyle={{ color: "var(--ipk-ink)", fontWeight: 600 }} formatter={(v: number, n: string) => [v, n === "ventes" ? "Ventes" : n === "value" ? "Part" : n]} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
