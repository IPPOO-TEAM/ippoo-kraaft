import { Link } from "react-router";
import { ArrowLeft, Search } from "lucide-react";
import { Button } from "./ui/button";

interface Props {
  title: string;
  message?: string;
  backTo: string;
  backLabel: string;
}

export function NotFoundDetail({ title, message, backTo, backLabel }: Props) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 text-center pb-20 lg:pb-6">
      <div className="w-20 h-20 rounded-full bg-[var(--ipk-surface)] flex items-center justify-center mx-auto mb-4">
        <Search className="w-9 h-9 text-[var(--ipk-text)]" aria-hidden="true" />
      </div>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(22px, 4vw, 28px)", fontWeight: 600, color: "var(--ipk-ink)" }}>
        {title}
      </h1>
      <p className="text-[var(--ipk-text)] mt-2 mb-6" style={{ fontSize: "14px" }}>
        {message ?? "Le contenu demandé n'existe pas ou a été retiré."}
      </p>
      <Link to={backTo}>
        <Button className="bg-[var(--ipk-green-dark)] text-white rounded-xl h-11 px-6">
          <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" /> {backLabel}
        </Button>
      </Link>
    </div>
  );
}
