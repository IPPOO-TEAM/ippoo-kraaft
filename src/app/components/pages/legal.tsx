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


// ============= LEGAL PAGE =============
export function LegalPage() {
  useSeo({ title: "Mentions légales", description: "Informations légales, conditions générales et politique de confidentialité IPPOO KRAAFT." });
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 pb-20 lg:pb-8">
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(24px, 5vw, 32px)", fontWeight: 600, color: "var(--ipk-ink)" }}>
        Informations Légales
      </h1>

      <Tabs defaultValue="cgv" className="mt-6">
        <TabsList className="w-full overflow-x-auto flex-nowrap">
          <TabsTrigger value="cgv">CGV</TabsTrigger>
          <TabsTrigger value="confidentialite">Confidentialité</TabsTrigger>
          <TabsTrigger value="cookies">Cookies</TabsTrigger>
          <TabsTrigger value="mentions">Mentions</TabsTrigger>
        </TabsList>
        <TabsContent value="cgv" className="mt-4">
          <div className="prose" style={{ fontSize: "14px", color: "var(--ipk-text)", lineHeight: 1.8 }}>
            <h3 style={{ color: "var(--ipk-ink)" }}>Conditions Générales de Vente</h3>
            <p>Les présentes conditions générales de vente s'appliquent à toutes les commandes passées sur le site ipookraaft.com. En passant commande, vous acceptez ces conditions sans réserve.</p>
            <h4 style={{ color: "var(--ipk-ink)" }}>Article 1 - Objet</h4>
            <p>Les présentes CGV régissent les ventes d'oeuvres artisanales, accessoires et services proposés par IPPOO KRAAFT ART AND HANDMADE.</p>
            <h4 style={{ color: "var(--ipk-ink)" }}>Article 2 - Prix</h4>
            <p>Les prix sont indiqués en Fcfa TTC. IPPOO KRAAFT se réserve le droit de modifier ses prix à tout moment.</p>
            <h4 style={{ color: "var(--ipk-ink)" }}>Article 3 - Commandes</h4>
            <p>Toute commande implique l'acceptation des prix et descriptions des produits. La validation de la commande vaut acceptation de ces CGV.</p>
            <h4 style={{ color: "var(--ipk-ink)" }}>Article 4 - Livraison</h4>
            <p>Les délais de livraison sont indicatifs. IPPOO KRAAFT s'engage à livrer dans les meilleurs délais.</p>
            <h4 style={{ color: "var(--ipk-ink)" }}>Article 5 - Retours et remboursements</h4>
            <p>Vous disposez d'un délai de 14 jours pour retourner un article. Les pièces sur mesure ne sont pas retournables.</p>
          </div>
        </TabsContent>
        <TabsContent value="confidentialite" className="mt-4">
          <div style={{ fontSize: "14px", color: "var(--ipk-text)", lineHeight: 1.8 }}>
            <h3 style={{ color: "var(--ipk-ink)" }}>Politique de Confidentialité</h3>
            <p>IPPOO KRAAFT s'engage à protéger vos données personnelles conformément au RGPD et aux lois applicables.</p>
            <p className="mt-3">Nous collectons uniquement les données nécessaires au traitement de vos commandes et à l'amélioration de nos services : nom, email, adresse de livraison, historique de commandes.</p>
            <p className="mt-3">Vos données ne sont jamais vendues à des tiers. Vous pouvez demander l'accès, la modification ou la suppression de vos données à tout moment.</p>
          </div>
        </TabsContent>
        <TabsContent value="cookies" className="mt-4">
          <div style={{ fontSize: "14px", color: "var(--ipk-text)", lineHeight: 1.8 }}>
            <h3 style={{ color: "var(--ipk-ink)" }}>Politique de Cookies</h3>
            <p>Ce site utilise des cookies pour améliorer votre expérience de navigation. En continuant à naviguer, vous acceptez l'utilisation de cookies.</p>
            <p className="mt-3">Types de cookies utilisés : cookies essentiels (fonctionnement du site), cookies analytiques (statistiques anonymes), cookies marketing (personnalisation).</p>
          </div>
        </TabsContent>
        <TabsContent value="mentions" className="mt-4">
          <div style={{ fontSize: "14px", color: "var(--ipk-text)", lineHeight: 1.8 }}>
            <h3 style={{ color: "var(--ipk-ink)" }}>Mentions Légales</h3>
            <p><strong>Éditeur :</strong> IPPOO KRAAFT ART AND HANDMADE</p>
            <p><strong>Siège :</strong> Lomé, Togo</p>
            <p><strong>Email :</strong> contact@ipookraaft.com</p>
            <p><strong>Téléphone :</strong> +228 90 12 34 56</p>
            <p className="mt-3"><strong>Propriété intellectuelle :</strong> Toutes les images, textes, créations et catalogues publiés sur ce site sont protégés par le droit d'auteur. Toute reproduction sans autorisation est interdite.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
