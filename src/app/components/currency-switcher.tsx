import { Globe, Check } from "lucide-react";
import { useCurrency, type CurrencyCode } from "../hooks/use-currency";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";

export function CurrencySwitcher() {
  const { active, setActive, enabled, allCurrencies } = useCurrency();
  const def = allCurrencies[active];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="px-2 py-1.5 rounded-lg hover:bg-[var(--ipk-surface)] transition-colors flex items-center gap-1 text-[var(--ipk-text)]"
          aria-label={`Devise actuelle : ${def.label}`}
          style={{ fontSize: "12px", fontWeight: 600 }}
        >
          <Globe className="w-4 h-4" />
          <span className="hidden sm:inline">{def.code}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Devise d'affichage</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {enabled.map((code: CurrencyCode) => {
          const c = allCurrencies[code];
          return (
            <DropdownMenuItem key={code} onClick={() => setActive(code)} className={active === code ? "bg-[var(--ipk-surface)]" : ""}>
              <span className="flex items-center justify-between w-full">
                <span><span className="font-mono mr-2">{c.symbol}</span>{c.label}</span>
                {active === code && <Check className="w-3.5 h-3.5 text-[var(--ipk-green-dark)]" />}
              </span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
