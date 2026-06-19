import { z } from "zod";

const phoneRegex = /^[+]?[\d\s().-]{8,20}$/;

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Nom trop court").max(80, "Nom trop long"),
  email: z.string().email("Adresse email invalide"),
  subject: z.string().trim().min(3, "Sujet trop court").max(120, "Sujet trop long"),
  message: z.string().trim().min(10, "Message trop court (10 caractères minimum)").max(2000, "Message trop long"),
});
export type ContactFormValues = z.infer<typeof contactSchema>;

export const joinArtisanSchema = z.object({
  fullName: z.string().trim().min(2, "Nom complet requis").max(100),
  email: z.string().email("Adresse email invalide"),
  phone: z.string().trim().regex(phoneRegex, "Numéro de téléphone invalide"),
  country: z.string().trim().min(2, "Pays requis"),
  craft: z.string().trim().min(2, "Spécialité requise"),
  niches: z.array(z.string()).min(1, "Sélectionnez au moins une niche").max(8, "Maximum 8 niches"),
  experience: z.string().trim().min(1, "Expérience requise"),
  motivation: z.string().trim().min(20, "Motivation trop courte (20 caractères minimum)").max(1500),
});
export type JoinArtisanFormValues = z.infer<typeof joinArtisanSchema>;

export const newsletterSchema = z.object({
  email: z.string().email("Adresse email invalide"),
});
export type NewsletterFormValues = z.infer<typeof newsletterSchema>;

export const profileSchema = z.object({
  name: z.string().trim().min(2, "Nom trop court").max(80, "Nom trop long"),
  email: z.string().email("Adresse email invalide"),
  phone: z.string().trim().regex(phoneRegex, "Numéro de téléphone invalide"),
  address: z.string().trim().min(5, "Adresse trop courte").max(200, "Adresse trop longue"),
});
export type ProfileFormValues = z.infer<typeof profileSchema>;
