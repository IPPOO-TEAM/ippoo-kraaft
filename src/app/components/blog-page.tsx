import React, { useState, useMemo, useEffect, useRef } from "react";
import { Link, useParams } from "react-router";
import {
  ArrowLeft, ArrowRight, Calendar, Clock, User, Tag, ChevronRight,
  Share2, BookOpen, Heart, MessageCircle, Search, Newspaper, Trash2
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { blogArticles } from "../data/mock-data";
import { LazyImage } from "./lazy-image";
import { useSeo } from "../hooks/use-seo";
import { NotFoundDetail } from "./not-found-detail";
import { toast } from "sonner";
import { useLeads } from "../hooks/use-leads";

const ALL_CATEGORIES = ["Tous", ...Array.from(new Set(blogArticles.map(a => a.category)))];

// ============= COMMENTS HOOK (localStorage) =============
type BlogComment = { id: string; slug: string; author: string; text: string; createdAt: string };
const COMMENTS_KEY = "ipk:blog:comments:v1";
function loadComments(): BlogComment[] {
  try { return JSON.parse(localStorage.getItem(COMMENTS_KEY) || "[]"); } catch { return []; }
}
function saveComments(list: BlogComment[]) {
  try { localStorage.setItem(COMMENTS_KEY, JSON.stringify(list)); } catch {}
}
function useBlogComments(slug: string | undefined) {
  const [all, setAll] = useState<BlogComment[]>(() => loadComments());
  useEffect(() => { saveComments(all); }, [all]);
  const comments = useMemo(() => all.filter(c => c.slug === slug).sort((a, b) => b.createdAt.localeCompare(a.createdAt)), [all, slug]);
  const add = (author: string, text: string) => {
    if (!slug) return;
    const c: BlogComment = { id: `c_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`, slug, author: author.trim() || "Anonyme", text: text.trim(), createdAt: new Date().toISOString() };
    setAll(prev => [c, ...prev]);
  };
  const remove = (id: string) => setAll(prev => prev.filter(c => c.id !== id));
  return { comments, add, remove };
}

// ============= BLOG LIST PAGE =============
export function BlogPage() {
  useSeo({ title: "Blog & Actualités - Récits d'artisanat africain", description: "Articles, actualités, reportages et savoir-faire ancestraux : récits sur l'artisanat africain par IPPOO KRAAFT." });
  const [activeCategory, setActiveCategory] = useState("Tous");
  const [activeAuthor, setActiveAuthor] = useState<string | null>(null);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const { addLead, hasLead } = useLeads();
  const subscribed = hasLead("newsletter", newsletterEmail.trim().toLowerCase());
  const subscribe = () => {
    const email = newsletterEmail.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { toast.error("Email invalide"); return; }
    if (subscribed) { toast.info("Déjà abonné avec cet email"); return; }
    addLead({ type: "newsletter", ref: email, email });
    toast.success("Inscription confirmée !");
    setNewsletterEmail("");
  };

  // Auteurs (avec compteur) - pour le filtre "par auteur"
  const authors = useMemo(() => {
    const map = new Map<string, number>();
    blogArticles.forEach(a => map.set(a.author, (map.get(a.author) || 0) + 1));
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, []);
  // Tags populaires (top 12)
  const popularTags = useMemo(() => {
    const map = new Map<string, number>();
    blogArticles.forEach(a => a.tags?.forEach(t => map.set(t, (map.get(t) || 0) + 1)));
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, 12);
  }, []);
  // Dernières actus (par date desc, top 5)
  const latestNews = useMemo(
    () => [...blogArticles].sort((a, b) => (b.date || "").localeCompare(a.date || "")).slice(0, 5),
    []
  );

  const filtered = useMemo(() => {
    let list = blogArticles;
    if (activeCategory !== "Tous") list = list.filter(a => a.category === activeCategory);
    if (activeAuthor) list = list.filter(a => a.author === activeAuthor);
    if (activeTag) list = list.filter(a => a.tags?.includes(activeTag));
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.tags?.some(t => t.toLowerCase().includes(q))
      );
    }
    return list;
  }, [activeCategory, activeAuthor, activeTag, searchQuery]);

  const hasFilters = activeCategory !== "Tous" || !!activeAuthor || !!activeTag || !!searchQuery.trim();
  const resetFilters = () => { setActiveCategory("Tous"); setActiveAuthor(null); setActiveTag(null); setSearchQuery(""); };
  const featured = blogArticles[0];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 pb-20 lg:pb-6">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <span className="inline-flex items-center gap-2 text-[var(--ipk-blue)]" style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            <Newspaper className="w-4 h-4" /> Blog &amp; Actualités
          </span>
          <h1 className="mt-1" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(24px, 5vw, 36px)", fontWeight: 600, color: "var(--ipk-ink)" }}>
            Art &amp; Cultures
          </h1>
          <p className="text-[var(--ipk-text)] mt-1" style={{ fontSize: "15px" }}>
            Symboliques, portraits, reportages terroir et coulisses de l'artisanat africain
          </p>
        </div>
        <div className="text-[var(--ipk-text)]" style={{ fontSize: "13px" }}>
          {blogArticles.length} article{blogArticles.length > 1 ? "s" : ""} publiés
        </div>
      </div>

      {/* Dernières actualités (chronologique) */}
      <section className="mb-8 bg-gradient-to-r from-[var(--ipk-blue)]/10 to-[var(--ipk-green)]/5 border border-[var(--ipk-border)] rounded-2xl p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="inline-flex items-center gap-2 text-[var(--ipk-ink)]" style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", fontWeight: 700 }}>
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> Dernières actualités
          </h2>
          <Link to="/blog" onClick={(e) => { e.preventDefault(); resetFilters(); }} className="text-[var(--ipk-blue)] hover:underline" style={{ fontSize: "13px", fontWeight: 600 }}>
            Voir tout
          </Link>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide" style={{ WebkitOverflowScrolling: "touch" }}>
          {latestNews.map((n) => (
            <Link key={n.id} to={`/blog/${n.slug}`} className="shrink-0 w-[260px] bg-white rounded-xl border border-[var(--ipk-border)] overflow-hidden hover:shadow-md transition-shadow">
              <div className="aspect-[16/9] overflow-hidden">
                <LazyImage src={n.image} alt={n.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-3">
                <div className="flex items-center gap-2 text-[var(--ipk-text)]" style={{ fontSize: "11px" }}>
                  <Calendar className="w-3 h-3" /> {n.date}
                  <span>·</span>
                  <span className="text-[var(--ipk-blue)]">{n.category}</span>
                </div>
                <p className="line-clamp-2 mt-1" style={{ fontSize: "13.5px", fontWeight: 600, color: "var(--ipk-ink)", lineHeight: 1.4 }}>{n.title}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Search bar */}
      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--ipk-text)]" />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Rechercher un article, un thème, un artisan..."
          className="w-full pl-10 pr-4 py-2.5 bg-[var(--ipk-surface)] border border-[var(--ipk-border)] rounded-xl"
          style={{ fontSize: "14px" }}
        />
      </div>

      {/* Category filters */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-3 scrollbar-hide" style={{ WebkitOverflowScrolling: "touch" }}>
        {ALL_CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors shrink-0 ${
              activeCategory === cat
                ? "bg-[var(--ipk-green-dark)] text-white"
                : "bg-[var(--ipk-surface)] text-[var(--ipk-text)] border border-[var(--ipk-border)] hover:border-[#0B6B3A]/40"
            }`}
            style={{ fontSize: "13px", fontWeight: 500 }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Auteurs + tags populaires */}
      <div className="grid lg:grid-cols-2 gap-3 mb-5">
        <div className="bg-white border border-[var(--ipk-border)] rounded-xl p-3">
          <div className="flex items-center gap-1.5 mb-2 text-[var(--ipk-text)]" style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            <User className="w-3.5 h-3.5" /> Par auteur
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button onClick={() => setActiveAuthor(null)} className={`px-2.5 py-1 rounded-lg transition-colors ${activeAuthor === null ? "bg-[var(--ipk-blue)] text-white" : "bg-[var(--ipk-surface)] text-[var(--ipk-text)] hover:bg-[var(--ipk-blue)]/10"}`} style={{ fontSize: "12px", fontWeight: 500 }}>Tous</button>
            {authors.map(([name, count]) => (
              <button key={name} onClick={() => setActiveAuthor(activeAuthor === name ? null : name)} className={`px-2.5 py-1 rounded-lg transition-colors ${activeAuthor === name ? "bg-[var(--ipk-blue)] text-white" : "bg-[var(--ipk-surface)] text-[var(--ipk-text)] hover:bg-[var(--ipk-blue)]/10"}`} style={{ fontSize: "12px", fontWeight: 500 }}>
                {name} <span className="opacity-60">·{count}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="bg-white border border-[var(--ipk-border)] rounded-xl p-3">
          <div className="flex items-center gap-1.5 mb-2 text-[var(--ipk-text)]" style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            <Tag className="w-3.5 h-3.5" /> Tags populaires
          </div>
          <div className="flex flex-wrap gap-1.5">
            {popularTags.map(([tag, count]) => (
              <button key={tag} onClick={() => setActiveTag(activeTag === tag ? null : tag)} className={`px-2.5 py-1 rounded-lg transition-colors ${activeTag === tag ? "bg-[var(--ipk-green-dark)] text-white" : "bg-[var(--ipk-surface)] text-[var(--ipk-text)] hover:bg-[var(--ipk-green)]/10"}`} style={{ fontSize: "12px", fontWeight: 500 }}>
                #{tag} <span className="opacity-60">·{count}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bandeau filtres actifs */}
      {hasFilters && (
        <div className="mb-4 flex items-center gap-2 flex-wrap text-[var(--ipk-text)]" style={{ fontSize: "13px" }}>
          <span>Filtres actifs :</span>
          {activeCategory !== "Tous" && <span className="px-2 py-0.5 bg-[var(--ipk-surface)] rounded">{activeCategory}</span>}
          {activeAuthor && <span className="px-2 py-0.5 bg-[var(--ipk-surface)] rounded">Auteur : {activeAuthor}</span>}
          {activeTag && <span className="px-2 py-0.5 bg-[var(--ipk-surface)] rounded">#{activeTag}</span>}
          {searchQuery && <span className="px-2 py-0.5 bg-[var(--ipk-surface)] rounded">« {searchQuery} »</span>}
          <button onClick={resetFilters} className="text-[var(--ipk-blue)] hover:underline ml-1" style={{ fontWeight: 600 }}>Réinitialiser</button>
        </div>
      )}

      {/* Featured article (only show when no filter is active) */}
      {!hasFilters && featured && (
        <Link to={`/blog/${featured.slug}`} className="block rounded-2xl overflow-hidden border border-[var(--ipk-border)] mb-8 group hover:shadow-lg transition-shadow">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="aspect-[4/3] md:aspect-auto overflow-hidden">
              <LazyImage src={featured.image} alt={featured.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
            <div className="p-6 flex flex-col justify-center">
              <Badge className="bg-[#0057FF]/10 text-[var(--ipk-blue)] border-0 w-fit mb-3">{featured.category}</Badge>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(20px, 3vw, 26px)", fontWeight: 600, color: "var(--ipk-ink)", lineHeight: 1.3 }}>
                {featured.title}
              </h2>
              <p className="text-[var(--ipk-text)] mt-2 line-clamp-3" style={{ fontSize: "14px", lineHeight: 1.7 }}>{featured.excerpt}</p>
              {featured.tags && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {featured.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="px-2 py-0.5 bg-[var(--ipk-surface)] rounded text-[var(--ipk-text)]" style={{ fontSize: "11px" }}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex items-center gap-3 mt-4" style={{ fontSize: "12px", color: "var(--ipk-text)" }}>
                <span className="flex items-center gap-1"><User className="w-3 h-3" /> {featured.author}</span>
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {featured.date}</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {featured.readTime}</span>
              </div>
              <div className="mt-4">
                <span className="text-[var(--ipk-blue)] flex items-center gap-1" style={{ fontSize: "14px", fontWeight: 500 }}>
                  Lire l'article <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </div>
        </Link>
      )}

      {/* Results count */}
      {hasFilters && (
        <p className="mb-4 text-[var(--ipk-text)]" style={{ fontSize: "13px" }}>
          {filtered.length} article{filtered.length > 1 ? "s" : ""} trouvé{filtered.length > 1 ? "s" : ""}
        </p>
      )}

      {/* Articles grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {(!hasFilters ? filtered.slice(1) : filtered).map((article) => (
            <Link
              key={article.id}
              to={`/blog/${article.slug}`}
              className="rounded-2xl overflow-hidden border border-[var(--ipk-border)] group hover:shadow-lg transition-all bg-white"
            >
              <div className="aspect-[16/10] overflow-hidden relative">
                <LazyImage src={article.image} alt={article.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <Badge className="absolute top-3 left-3 bg-white/90 text-[var(--ipk-blue)] border-0 backdrop-blur-sm" style={{ fontSize: "11px" }}>
                  {article.category}
                </Badge>
              </div>
              <div className="p-4">
                <h3 className="line-clamp-2" style={{ fontSize: "16px", fontWeight: 600, color: "var(--ipk-ink)", lineHeight: 1.4 }}>{article.title}</h3>
                <p className="text-[var(--ipk-text)] mt-1.5 line-clamp-2" style={{ fontSize: "13px", lineHeight: 1.6 }}>{article.excerpt}</p>
                {article.tags && (
                  <div className="flex flex-wrap gap-1 mt-2.5">
                    {article.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="px-2 py-0.5 bg-[var(--ipk-surface)] rounded text-[var(--ipk-text)]" style={{ fontSize: "10px" }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--ipk-border)]">
                  <div className="flex items-center gap-2" style={{ fontSize: "12px", color: "var(--ipk-text)" }}>
                    <span>{article.author}</span>
                    <span>·</span>
                    <span>{article.date}</span>
                  </div>
                  <span className="flex items-center gap-1 text-[var(--ipk-text)]" style={{ fontSize: "11px" }}>
                    <Clock className="w-3 h-3" /> {article.readTime}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <BookOpen className="w-12 h-12 text-[var(--ipk-border)] mx-auto mb-3" />
          <p style={{ fontSize: "16px", fontWeight: 600, color: "var(--ipk-ink)" }}>Aucun article trouvé</p>
          <p className="text-[var(--ipk-text)] mt-1" style={{ fontSize: "14px" }}>Essayez une autre recherche ou catégorie</p>
          <Button onClick={resetFilters} className="mt-4 bg-[var(--ipk-green-dark)] text-white rounded-xl">
            Voir tous les articles
          </Button>
        </div>
      )}

      {/* Newsletter CTA */}
      <div className="mt-12 p-6 md:p-8 bg-[var(--ipk-surface)] rounded-2xl text-center">
        <BookOpen className="w-8 h-8 text-[var(--ipk-green-dark)] mx-auto mb-3" />
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", fontWeight: 600, color: "var(--ipk-ink)" }}>
          Restez informé
        </h3>
        <p className="text-[var(--ipk-text)] mt-1 mb-4 max-w-md mx-auto" style={{ fontSize: "14px" }}>
          Recevez nos articles, portraits d'artisans et coulisses de l'artisanat africain directement dans votre boîte mail.
        </p>
        <form onSubmit={(e) => { e.preventDefault(); subscribe(); }} className="flex gap-2 max-w-md mx-auto">
          <input
            type="email"
            value={newsletterEmail}
            onChange={(e) => setNewsletterEmail(e.target.value)}
            placeholder="votre@email.com"
            className="flex-1 px-4 py-2.5 bg-white border border-[var(--ipk-border)] rounded-xl"
            style={{ fontSize: "14px" }}
          />
          <Button type="submit" className="bg-[var(--ipk-green-dark)] text-white rounded-xl px-5 shrink-0">
            S'abonner
          </Button>
        </form>
      </div>
    </div>
  );
}

// ============= BLOG DETAIL PAGE =============
export function BlogDetailPage() {
  const { slug } = useParams();
  const { addLead, leads, removeLead } = useLeads();
  const liked = leads.find(l => l.type === "blog_like" && l.ref === slug);
  const toggleLike = () => {
    if (liked) { removeLead(liked.id); toast.info("Retiré de vos favoris"); }
    else { addLead({ type: "blog_like", ref: slug, refLabel: slug }); toast.success("Article ajouté à vos favoris !"); }
  };
  const { comments, add: addComment, remove: removeComment } = useBlogComments(slug);
  const commentSectionRef = useRef<HTMLDivElement>(null);
  const [commentAuthor, setCommentAuthor] = useState("");
  const [commentText, setCommentText] = useState("");
  const focusCommentForm = () => {
    commentSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => {
      const ta = commentSectionRef.current?.querySelector<HTMLTextAreaElement>("textarea");
      ta?.focus();
    }, 300);
  };
  const submitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) { toast.error("Écrivez votre commentaire avant de publier"); return; }
    addComment(commentAuthor, commentText);
    setCommentText("");
    toast.success("Commentaire publié");
  };
  const article = blogArticles.find(a => a.slug === slug);

  useSeo({
    title: article ? article.title : "Article introuvable",
    description: article?.excerpt,
    ogImage: article?.image,
    noIndex: !article,
  });

  if (!article) {
    return <NotFoundDetail title="Article introuvable" message="Cet article n'existe pas ou a été déplacé." backTo="/blog" backLabel="Retour aux articles" />;
  }

  const currentIndex = blogArticles.findIndex(a => a.slug === slug);
  const prevArticle = currentIndex > 0 ? blogArticles[currentIndex - 1] : null;
  const nextArticle = currentIndex < blogArticles.length - 1 ? blogArticles[currentIndex + 1] : null;
  const relatedArticles = blogArticles.filter(a => a.id !== article.id && a.category === article.category).slice(0, 3);
  if (relatedArticles.length < 3) {
    const moreRelated = blogArticles.filter(a => a.id !== article.id && a.category !== article.category).slice(0, 3 - relatedArticles.length);
    relatedArticles.push(...moreRelated);
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: article.title, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href).catch(() => {});
      toast.success("Lien copié dans le presse-papier !");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-20 lg:pb-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 mb-6 flex-wrap" style={{ fontSize: "13px", color: "var(--ipk-text)" }}>
        <Link to="/accueil" className="hover:text-[var(--ipk-blue)] transition-colors">Accueil</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/blog" className="hover:text-[var(--ipk-blue)] transition-colors">Art & Cultures</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-[var(--ipk-ink)] truncate max-w-[200px]">{article.title}</span>
      </nav>

      {/* Back */}
      <Link to="/blog" className="inline-flex items-center gap-1.5 text-[var(--ipk-blue)] mb-5 hover:underline" style={{ fontSize: "14px" }}>
        <ArrowLeft className="w-4 h-4" /> Tous les articles
      </Link>

      {/* Category + Meta */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <Badge className="bg-[#0057FF]/10 text-[var(--ipk-blue)] border-0">{article.category}</Badge>
        <div className="flex items-center gap-3" style={{ fontSize: "13px", color: "var(--ipk-text)" }}>
          <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {article.date}</span>
          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {article.readTime}</span>
        </div>
      </div>

      {/* Title */}
      <h1 className="mb-4" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(24px, 5vw, 38px)", fontWeight: 600, color: "var(--ipk-ink)", lineHeight: 1.25 }}>
        {article.title}
      </h1>

      {/* Excerpt */}
      <p className="mb-6" style={{ fontSize: "17px", color: "var(--ipk-text)", lineHeight: 1.7 }}>
        {article.excerpt}
      </p>

      {/* Author bar */}
      <div className="flex items-center justify-between p-4 bg-[var(--ipk-surface)] rounded-xl mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[var(--ipk-green-dark)] rounded-full flex items-center justify-center shrink-0">
            <span className="text-white" style={{ fontSize: "14px", fontWeight: 700 }}>
              {article.author.split(" ").map(w => w[0]).join("").slice(0, 2)}
            </span>
          </div>
          <div>
            <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--ipk-ink)" }}>{article.author}</p>
            <p style={{ fontSize: "12px", color: "var(--ipk-text)" }}>Contributeur IPPOO KRAAFT</p>
          </div>
        </div>
        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[var(--ipk-border)] rounded-lg hover:bg-[var(--ipk-surface)] transition-colors"
        >
          <Share2 className="w-3.5 h-3.5 text-[var(--ipk-text)]" />
          <span style={{ fontSize: "12px", color: "var(--ipk-text)" }}>Partager</span>
        </button>
      </div>

      {/* Hero image */}
      <div className="rounded-2xl overflow-hidden aspect-[21/9] mb-8">
        <LazyImage src={article.image} alt={article.title} className="w-full h-full object-cover" />
      </div>

      {/* Article body */}
      {article.content && article.content.length > 0 ? (
        <div className="space-y-5 mb-8">
          {article.content.map((paragraph, i) => (
            <React.Fragment key={i}>
              <p style={{ fontSize: "15px", color: "var(--ipk-text)", lineHeight: 1.9 }}>{paragraph}</p>
              {/* Insert related images between paragraphs */}
              {article.relatedImages && i === 1 && article.relatedImages[0] && (
                <div className="my-6 rounded-xl overflow-hidden aspect-[16/7]">
                  <LazyImage src={article.relatedImages[0]} alt={`Illustration - ${article.title}`} className="w-full h-full object-cover" />
                </div>
              )}
              {article.relatedImages && i === 3 && article.relatedImages.length >= 2 && (
                <div className="my-6 grid grid-cols-2 gap-3">
                  <div className="rounded-xl overflow-hidden aspect-[4/3]">
                    <LazyImage src={article.relatedImages[1]} alt="Illustration" className="w-full h-full object-cover" />
                  </div>
                  {article.relatedImages[2] && (
                    <div className="rounded-xl overflow-hidden aspect-[4/3]">
                      <LazyImage src={article.relatedImages[2]} alt="Illustration" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      ) : (
        <p className="mb-8" style={{ fontSize: "15px", color: "var(--ipk-text)", lineHeight: 1.9 }}>
          Contenu complet bientôt disponible. Revenez nous consulter prochainement.
        </p>
      )}

      {/* Tags */}
      {article.tags && article.tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-8 pb-8 border-b border-[var(--ipk-border)]">
          <Tag className="w-4 h-4 text-[var(--ipk-text)]" />
          {article.tags.map(tag => (
            <span key={tag} className="px-3 py-1 bg-[var(--ipk-surface)] rounded-full border border-[var(--ipk-border)] text-[var(--ipk-text)]" style={{ fontSize: "12px" }}>
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Engagement bar */}
      <div className="flex items-center justify-between p-4 bg-[var(--ipk-surface)] rounded-xl mb-8">
        <div className="flex items-center gap-4">
          <button onClick={toggleLike} className={`flex items-center gap-1.5 transition-colors ${liked ? "text-red-500" : "text-[var(--ipk-text)] hover:text-red-500"}`}>
            <Heart className={`w-4 h-4 ${liked ? "fill-current" : ""}`} />
            <span style={{ fontSize: "13px" }}>{liked ? "Aimé" : "J'aime"}</span>
          </button>
          <button onClick={focusCommentForm} className="flex items-center gap-1.5 text-[var(--ipk-text)] hover:text-[var(--ipk-blue)] transition-colors">
            <MessageCircle className="w-4 h-4" />
            <span style={{ fontSize: "13px" }}>Commenter{comments.length > 0 ? ` · ${comments.length}` : ""}</span>
          </button>
        </div>
        <button onClick={handleShare} className="flex items-center gap-1.5 text-[var(--ipk-text)] hover:text-[var(--ipk-blue)] transition-colors">
          <Share2 className="w-4 h-4" />
          <span style={{ fontSize: "13px" }}>Partager</span>
        </button>
      </div>

      {/* Prev / Next navigation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
        {prevArticle ? (
          <Link to={`/blog/${prevArticle.slug}`} className="flex items-center gap-3 p-4 bg-white rounded-xl border border-[var(--ipk-border)] hover:border-[var(--ipk-green-dark)] transition-colors group">
            <ArrowLeft className="w-5 h-5 text-[var(--ipk-text)] group-hover:text-[var(--ipk-green-dark)] shrink-0 transition-colors" />
            <div className="min-w-0">
              <p style={{ fontSize: "11px", color: "var(--ipk-text)" }}>Article précédent</p>
              <p className="truncate" style={{ fontSize: "13px", fontWeight: 600, color: "var(--ipk-ink)" }}>{prevArticle.title}</p>
            </div>
          </Link>
        ) : <div />}
        {nextArticle ? (
          <Link to={`/blog/${nextArticle.slug}`} className="flex items-center gap-3 p-4 bg-white rounded-xl border border-[var(--ipk-border)] hover:border-[var(--ipk-green-dark)] transition-colors group text-right sm:justify-end">
            <div className="min-w-0">
              <p style={{ fontSize: "11px", color: "var(--ipk-text)" }}>Article suivant</p>
              <p className="truncate" style={{ fontSize: "13px", fontWeight: 600, color: "var(--ipk-ink)" }}>{nextArticle.title}</p>
            </div>
            <ArrowRight className="w-5 h-5 text-[var(--ipk-text)] group-hover:text-[var(--ipk-green-dark)] shrink-0 transition-colors" />
          </Link>
        ) : <div />}
      </div>

      {/* Comments section */}
      <div ref={commentSectionRef} className="mb-10 scroll-mt-24">
        <h2 className="mb-4 flex items-center gap-2" style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", fontWeight: 600, color: "var(--ipk-ink)" }}>
          <MessageCircle className="w-5 h-5 text-[var(--ipk-blue)]" />
          Commentaires {comments.length > 0 && <span className="text-[var(--ipk-text)]" style={{ fontSize: "16px", fontWeight: 400 }}>· {comments.length}</span>}
        </h2>
        <form onSubmit={submitComment} className="bg-[var(--ipk-surface)] rounded-2xl p-4 mb-5 space-y-3">
          <input
            value={commentAuthor}
            onChange={(e) => setCommentAuthor(e.target.value)}
            placeholder="Votre nom (facultatif)"
            className="w-full px-3 py-2 bg-white border border-[var(--ipk-border)] rounded-lg"
            style={{ fontSize: "14px" }}
          />
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Partagez votre avis, une anecdote, une question…"
            rows={3}
            className="w-full px-3 py-2 bg-white border border-[var(--ipk-border)] rounded-lg resize-y"
            style={{ fontSize: "14px" }}
          />
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <p className="text-[var(--ipk-text)]" style={{ fontSize: "12px" }}>
              Les commentaires sont stockés localement sur cet appareil.
            </p>
            <Button type="submit" className="bg-[var(--ipk-blue)] hover:bg-[var(--ipk-blue-dark)] text-white rounded-xl">
              Publier
            </Button>
          </div>
        </form>
        {comments.length === 0 ? (
          <p className="text-[var(--ipk-text)] italic" style={{ fontSize: "14px" }}>
            Aucun commentaire pour le moment - soyez le premier à réagir.
          </p>
        ) : (
          <ul className="space-y-3">
            {comments.map((c) => (
              <li key={c.id} className="bg-white border border-[var(--ipk-border)] rounded-xl p-4">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[var(--ipk-blue)]/10 text-[var(--ipk-blue)] flex items-center justify-center" style={{ fontSize: "12px", fontWeight: 700 }}>
                      {c.author.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--ipk-ink)" }}>{c.author}</p>
                      <p className="text-[var(--ipk-text)]" style={{ fontSize: "11px" }}>{new Date(c.createdAt).toLocaleString("fr-FR")}</p>
                    </div>
                  </div>
                  <button onClick={() => removeComment(c.id)} className="text-[var(--ipk-text)] hover:text-red-500 transition-colors" aria-label="Supprimer ce commentaire">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-[var(--ipk-text)] whitespace-pre-line" style={{ fontSize: "14px", lineHeight: 1.6 }}>{c.text}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Related articles */}
      {relatedArticles.length > 0 && (
        <div>
          <h2 className="mb-4" style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", fontWeight: 600, color: "var(--ipk-ink)" }}>
            Articles similaires
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedArticles.map(a => (
              <Link key={a.id} to={`/blog/${a.slug}`} className="rounded-xl overflow-hidden border border-[var(--ipk-border)] group hover:shadow-md transition-shadow bg-white">
                <div className="aspect-[16/10] overflow-hidden">
                  <LazyImage src={a.image} alt={a.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="p-3">
                  <Badge className="bg-[#0057FF]/10 text-[var(--ipk-blue)] border-0 mb-1.5" style={{ fontSize: "10px" }}>{a.category}</Badge>
                  <h4 className="line-clamp-2" style={{ fontSize: "14px", fontWeight: 600, color: "var(--ipk-ink)", lineHeight: 1.3 }}>{a.title}</h4>
                  <div className="flex items-center gap-2 mt-2" style={{ fontSize: "11px", color: "var(--ipk-text)" }}>
                    <span>{a.date}</span>
                    <span>·</span>
                    <span>{a.readTime}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
