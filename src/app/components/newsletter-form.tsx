import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { newsletterSchema, type NewsletterFormValues } from "../lib/validations";

export function NewsletterForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewsletterFormValues>({ resolver: zodResolver(newsletterSchema) });

  const onSubmit = async (_values: NewsletterFormValues) => {
    await new Promise(r => setTimeout(r, 700));
    toast.success("Merci ! Vous êtes abonné·e à notre newsletter.");
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1 min-w-0">
          <label htmlFor="newsletter-email" className="sr-only">Adresse email</label>
          <input
            id="newsletter-email"
            type="email"
            autoComplete="email"
            placeholder="Votre email"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "newsletter-email-err" : undefined}
            className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/50"
            style={{ fontSize: "14px" }}
            {...register("email")}
          />
          {errors.email && (
            <p id="newsletter-email-err" role="alert" className="mt-1 text-red-300" style={{ fontSize: "12px" }}>
              {errors.email.message}
            </p>
          )}
        </div>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-[var(--ipk-green-dark)] hover:bg-[var(--ipk-green-darker)] rounded-xl px-5 shrink-0 disabled:opacity-60"
        >
          {isSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" aria-hidden="true" /> Envoi…</> : "S'abonner"}
        </Button>
      </div>
    </form>
  );
}
