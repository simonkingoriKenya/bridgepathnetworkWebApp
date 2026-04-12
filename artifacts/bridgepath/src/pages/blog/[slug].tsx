import { useRoute, Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Tag, ArrowRight } from "lucide-react";
import { blogPosts } from "./index";

const GREEN = "#8CC63F";
const DARK = "#1a2340";

function renderContent(content: string) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let key = 0;
  let inTable = false;
  let tableRows: string[][] = [];

  const flushTable = () => {
    if (tableRows.length < 2) return;
    const headers = tableRows[0];
    const rows = tableRows.slice(2);
    elements.push(
      <div key={`table-${key++}`} className="overflow-x-auto my-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr style={{ backgroundColor: DARK }}>
              {headers.map((h, i) => (
                <th key={i} className="text-white px-4 py-2.5 text-left font-semibold text-xs uppercase tracking-wide first:rounded-tl-lg last:rounded-tr-lg">{h.trim()}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri} className={ri % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                {row.map((cell, ci) => (
                  <td key={ci} className="px-4 py-2.5 text-gray-700 border-b border-gray-100">
                    {cell.trim().includes("✅") ? <span style={{ color: GREEN }} className="font-semibold">{cell.trim()}</span>
                      : cell.trim().includes("❌") ? <span className="text-red-400 font-semibold">{cell.trim()}</span>
                      : cell.trim()}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
    tableRows = [];
    inTable = false;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith("|")) {
      inTable = true;
      const cells = line.split("|").filter(Boolean);
      tableRows.push(cells);
      continue;
    } else if (inTable) {
      flushTable();
    }

    if (line.startsWith("## ")) {
      elements.push(<h2 key={key++} className="text-2xl font-bold mt-10 mb-4" style={{ color: DARK }}>{line.slice(3)}</h2>);
    } else if (line.startsWith("**") && line.endsWith("**") && line.length > 4) {
      const text = line.slice(2, -2);
      elements.push(<p key={key++} className="font-semibold text-gray-900 mt-4 mb-1">{text}</p>);
    } else if (line.startsWith("- ") || line.startsWith("* ")) {
      const text = line.slice(2);
      elements.push(
        <li key={key++} className="flex items-start gap-2 text-gray-700 text-base leading-relaxed my-1">
          <span className="h-1.5 w-1.5 rounded-full mt-2.5 shrink-0" style={{ backgroundColor: GREEN }} />
          <span dangerouslySetInnerHTML={{ __html: text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-green-600 hover:underline font-medium">$1</a>') }} />
        </li>
      );
    } else if (/^\d+\./.test(line)) {
      const text = line.replace(/^\d+\.\s*/, "");
      const num = parseInt(line);
      elements.push(
        <li key={key++} className="flex items-start gap-3 text-gray-700 text-base leading-relaxed my-2">
          <span className="h-6 w-6 rounded-full text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: GREEN }}>{num}</span>
          <span dangerouslySetInnerHTML={{ __html: text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-green-600 hover:underline font-medium">$1</a>') }} />
        </li>
      );
    } else if (line.trim() !== "") {
      const html = line
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-green-600 hover:underline font-medium">$1</a>');
      elements.push(<p key={key++} className="text-gray-700 text-base leading-relaxed my-3" dangerouslySetInnerHTML={{ __html: html }} />);
    }
  }
  if (inTable) flushTable();
  return elements;
}

export default function BlogPost() {
  const [match, params] = useRoute("/blog/:slug");
  const slug = params?.slug || "";
  const post = blogPosts.find((p) => p.slug === slug);
  const otherPosts = blogPosts.filter((p) => p.slug !== slug).slice(0, 2);

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center flex-col gap-4">
          <h2 className="text-2xl font-bold text-gray-800">Article not found</h2>
          <Link href="/blog">
            <button className="px-6 py-3 font-semibold text-white rounded-xl" style={{ backgroundColor: GREEN }}>
              View all articles
            </button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <div className="relative h-72 md:h-96 overflow-hidden">
        <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(26,35,64,0.92) 0%, rgba(26,35,64,0.4) 60%, transparent 100%)" }} />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto max-w-3xl">
            <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-white mb-4 transition-colors">
              <ArrowLeft className="h-4 w-4" /> Back to Insights
            </Link>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1.5" style={{ backgroundColor: GREEN + "25", color: GREEN }}>
                <Tag className="h-3 w-3" /> {post.tag}
              </span>
              <span className="text-xs text-gray-300 flex items-center gap-1">
                <Clock className="h-3 w-3" /> {post.readTime}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight">{post.title}</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-3xl px-4 md:px-8 py-12">
        <div className="flex items-center gap-4 pb-8 mb-8 border-b border-gray-100">
          <img src={post.author.avatar} alt={post.author.name} className="h-12 w-12 rounded-full object-cover shadow" />
          <div>
            <p className="font-semibold text-gray-900">{post.author.name}</p>
            <p className="text-sm text-gray-500">{post.author.role} · {post.date}</p>
          </div>
        </div>

        <motion.article
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="prose-custom"
        >
          {renderContent(post.content)}
        </motion.article>

        <div className="mt-12 pt-8 border-t border-gray-100">
          <div className="p-6 rounded-2xl" style={{ backgroundColor: GREEN + "10", border: `1px solid ${GREEN}30` }}>
            <h3 className="font-bold mb-2" style={{ color: DARK }}>Need HR or Recruitment Support in Africa?</h3>
            <p className="text-sm text-gray-600 mb-4">Bridgepath Network operates across 45+ African countries. Get in touch with our team.</p>
            <Link href="/#contact">
              <button className="px-5 py-2.5 text-sm font-semibold text-white rounded-xl hover:opacity-90 transition-opacity" style={{ backgroundColor: GREEN }}>
                Contact Our Team
              </button>
            </Link>
          </div>
        </div>
      </div>

      {otherPosts.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 md:px-8 max-w-3xl">
            <h2 className="text-xl font-bold mb-8" style={{ color: DARK }}>More Insights</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {otherPosts.map((p) => (
                <Link key={p.slug} href={`/blog/${p.slug}`}>
                  <div className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-all cursor-pointer">
                    <img src={p.image} alt={p.title} className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="p-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded" style={{ backgroundColor: GREEN + "20", color: GREEN }}>{p.tag}</span>
                      <h3 className="font-semibold text-gray-900 mt-2 mb-1 text-sm leading-snug group-hover:text-green-700 transition-colors line-clamp-2">{p.title}</h3>
                      <div className="flex items-center gap-1 text-xs font-semibold mt-2" style={{ color: GREEN }}>
                        Read more <ArrowRight className="h-3 w-3" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
