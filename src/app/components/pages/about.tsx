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


// ============= ABOUT PAGE =============
export function AboutPage() {
  useSeo({ title: "À propos", description: "Notre mission : valoriser et préserver l'artisanat africain ancestral et ses savoir-faire." });
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 pb-20 lg:pb-8">
      <h1 className="text-center mb-2" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(26px, 5vw, 40px)", fontWeight: 600, color: "var(--ipk-ink)" }}>
        À propos d'IPPOO KRAAFT
      </h1>
      <p className="text-center text-[var(--ipk-text)] mb-6 sm:mb-8 max-w-xl mx-auto" style={{ fontSize: "15px" }}>
        Art & Handmade - Valoriser l'artisanat africain authentique
      </p>

      <div className="rounded-2xl overflow-hidden aspect-[16/9] sm:aspect-[21/9] mb-6 sm:mb-8">
        <LazyImage src={IMAGES.community} alt="Communauté IPPOO KRAAFT" className="w-full h-full object-cover" />
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="flex items-center gap-2 mb-3" style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", fontWeight: 600, color: "var(--ipk-ink)" }}>
            <Target className="w-5 h-5 text-[var(--ipk-green-dark)]" /> Notre Mission
          </h2>
          <p className="text-[var(--ipk-text)]" style={{ fontSize: "15px", lineHeight: 1.8 }}>
            IPPOO KRAAFT ART AND HANDMADE est un projet structurant dédié à la valorisation de l'artisanat africain dans toute sa diversité, en mettant l'accent sur la préservation des savoir-faire ancestraux, la professionnalisation des artisans et la création de débouchés commerciaux durables, afin que chaque oeuvre produite soit à la fois un témoignage culturel authentique et un produit compétitif sur les marchés locaux, régionaux et internationaux.
          </p>
        </section>

        <section>
          <h2 className="flex items-center gap-2 mb-3" style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", fontWeight: 600, color: "var(--ipk-ink)" }}>
            <Eye className="w-5 h-5 text-[var(--ipk-blue)]" /> Notre Vision
          </h2>
          <p className="text-[var(--ipk-text)]" style={{ fontSize: "15px", lineHeight: 1.8 }}>
            Transformer la richesse patrimoniale et créative de l'art africain en une économie culturelle organisée, traçable et respectueuse des origines, tout en garantissant une expérience de découverte et d'achat fiable, cohérente et qualitative pour le public.
          </p>
        </section>

        <section>
          <h2 className="flex items-center gap-2 mb-3" style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", fontWeight: 600, color: "var(--ipk-ink)" }}>
            <Heart className="w-5 h-5 text-[var(--ipk-green-dark)]" /> Nos Valeurs
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { title: "Authenticité", desc: "Chaque pièce est vérifiée et certifiée selon nos normes internes." },
              { title: "Éco-responsabilité", desc: "Matériaux naturels locaux et techniques ancestrales à faible impact." },
              { title: "Traçabilité", desc: "De l'atelier à votre porte, chaque étape est documentée." },
              { title: "Transmission", desc: "Formations et soutien pour préserver les savoir-faire." },
            ].map((v, i) => (
              <div key={i} className="p-4 bg-[var(--ipk-surface)] rounded-xl">
                <h4 style={{ fontSize: "15px", fontWeight: 600, color: "var(--ipk-ink)" }}>{v.title}</h4>
                <p style={{ fontSize: "13px", color: "var(--ipk-text)", lineHeight: 1.6, marginTop: "4px" }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="flex items-center gap-2 mb-3" style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", fontWeight: 600, color: "var(--ipk-ink)" }}>
            <Users className="w-5 h-5 text-[var(--ipk-blue)]" /> Organisation en Groupements
          </h2>
          <p className="text-[var(--ipk-text)]" style={{ fontSize: "15px", lineHeight: 1.8 }}>
            Le coeur du projet repose sur la mise en groupement des artisans, c'est-à-dire l'organisation des créateurs en communautés de travail coordonnées (par métiers, par zones géographiques ou par familles de techniques), afin de rompre l'isolement habituel des artisans, de mutualiser les ressources, de stabiliser les revenus et de renforcer le pouvoir de négociation.
          </p>
        </section>

        <section>
          <h2 className="flex items-center gap-2 mb-3" style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", fontWeight: 600, color: "var(--ipk-ink)" }}>
            <Shield className="w-5 h-5 text-[var(--ipk-green-dark)]" /> Nos Normes
          </h2>
          <div className="space-y-3">
            <div className="p-4 border border-[#0057FF]/20 bg-[#0057FF]/5 rounded-xl">
              <h4 style={{ fontSize: "14px", fontWeight: 600, color: "var(--ipk-ink)" }}>N001KHAM/51-26-02/OCTEGO-A</h4>
              <p style={{ fontSize: "13px", color: "var(--ipk-text)", marginTop: "4px" }}>Ordre de Conception, des Techniques d'Évaluation, Garanties d'Origine Ancestrale - encadre la conception, l'évaluation et la validation de chaque oeuvre.</p>
            </div>
            <div className="p-4 border border-[#0B6B3A]/20 bg-[#0B6B3A]/5 rounded-xl">
              <h4 style={{ fontSize: "14px", fontWeight: 600, color: "var(--ipk-ink)" }}>N001PAAG/51-26-02/OPT</h4>
              <p style={{ fontSize: "13px", color: "var(--ipk-text)", marginTop: "4px" }}>Produit du Terroir garanti d'Origine Ancestrale - certifie le lien entre l'oeuvre, le terroir et les ressources locales.</p>
            </div>
          </div>
        </section>

        <section className="text-center">
          <h2 className="mb-3" style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", fontWeight: 600, color: "var(--ipk-ink)" }}>
            Zones d'intervention
          </h2>
          <p className="text-[var(--ipk-text)] mb-4" style={{ fontSize: "15px" }}>
            Togo, Burkina Faso, Sénégal, Mali, Ghana, Côte d'Ivoire, Bénin, Niger, Cameroun et plus encore.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/groupements"><Button className="bg-[var(--ipk-green-dark)] text-white rounded-xl h-11 px-6">Voir nos groupements</Button></Link>
            <Link to="/contact"><Button variant="outline" className="border-2 border-[var(--ipk-blue)] text-[var(--ipk-blue)] rounded-xl h-11 px-6">Nous contacter</Button></Link>
          </div>
        </section>
      </div>
    </div>
  );
}
