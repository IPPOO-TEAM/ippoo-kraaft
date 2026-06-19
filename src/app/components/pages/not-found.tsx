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


// ============= NOT FOUND PAGE =============
export function NotFoundPage() {
  useSeo({ title: "Page introuvable", description: "La page demandée n'existe pas.", noIndex: true });
  return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "48px", fontWeight: 700, color: "var(--ipk-green-dark)" }}>404</h1>
      <h2 className="mt-2 text-[var(--ipk-ink)]" style={{ fontSize: "20px", fontWeight: 600 }}>Page non trouvée</h2>
      <p className="text-[var(--ipk-text)] mt-2 mb-6" style={{ fontSize: "15px" }}>La page que vous recherchez n'existe pas ou a été déplacée.</p>
      <Link to="/accueil">
        <Button className="bg-[var(--ipk-green-dark)] text-white rounded-xl h-11 px-6">
          Retour à l'accueil <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </Link>
    </div>
  );
}
