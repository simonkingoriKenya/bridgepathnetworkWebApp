import { useRoute, Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Tag, ArrowRight } from "lucide-react";
import { blogPosts } from "./index";

const CORAL = "#C8461A";
const CHARCOAL = "#1C1917";

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
            <tr style={{ backgroundColor: CHARCOAL }}>
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
                    {cell.trim().includes("✅") ? <span style={{ color: CORAL }} className="font-semibold">{cell.trim()}</span>
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
      elements.push(<h2 key={key++} className="text-2xl font-bold mt-10 mb-4" style={{ color: CHARCOAL }}>{line.slice(3)}</h2>);
    } else if (line.startsWith("**") && line.endsWith("**") && line.length > 4) {
      const text = line.slice(2, -2);
      elements.push(<p key={key++} className="font-semibold text-gray-900 mt-4 mb-1">{text}</p>);
    } else if (line.startsWith("- ") || line.startsWith("* ")) {
      const text = line.slice(2);
      elements.push(
        <li key={key++} className="flex items-start gap-2 text-gray-700 text-base leading-relaxed my-1">
          <span className="h-1.5 w-1.5 rounded-full mt-2.5 shrink-0" style={{ backgroundColor: CORAL }} />
          <span dangerouslySetInnerHTML={{ __html: text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\[(.*?)\]\((.*?)\)/g, `<a href="$2" style="color:${CORAL}" class="hover:underline font-medium">$1</a>`) }} />
        </li>
      );
    } else if (/^\d+\./.test(line)) {
      const text = line.replace(/^\d+\.\s*/, "");
      const num = parseInt(line);
      elements.push(
        <li key={key++} className="flex items-start gap-3 text-gray-700 text-base leading-relaxed my-2">
          <span className="h-6 w-6 rounded-full text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: CORAL }}>{num}</span>
          <span dangerouslySetInnerHTML={{ __html: text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\[(.*?)\]\((.*?)\)/g, `<a href="$2" style="color:${CORAL}" class="hover:underline font-medium">$1</a>`) }} />
        </li>
      );
    } else if (line.trim() !== "") {
      const html = line
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\[(.*?)\]\((.*?)\)/g, `<a href="$2" style="color:${CORAL}" class="hover:underline font-medium">$1</a>`);
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
            <button className="px-6 py-3 font-semibold text-white rounded-xl" style={{ backgroundColor: CORAL }}>
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

      <div className="relative h-[50vh] min-h-[340px] md:min-h-[460px] overflow-hidden">
        <img src={post.image} alt={post.title} className="w-full h-full object-cover object-top" />
        <div className="absolute bottom-0 left-0 right-0 px-4 py-8 md:p-10">
          <div className="container mx-auto max-w-3xl">
            <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-white font-semibold mb-4 transition-colors" style={{ textShadow: "0 1px 8px rgba(0,0,0,0.6)" }}>
              <ArrowLeft className="h-4 w-4" /> Back to Insights
            </Link>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1.5" style={{ backgroundColor: "rgba(255,255,255,0.85)", color: CORAL, backdropFilter: "blur(8px)" }}>
                <Tag className="h-3 w-3" /> {post.tag}
              </span>
              <span className="text-xs text-white flex items-center gap-1" style={{ textShadow: "0 1px 6px rgba(0,0,0,0.6)" }}>
                <Clock className="h-3 w-3" /> {post.readTime}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight" style={{ textShadow: "0 2px 16px rgba(0,0,0,0.6), 0 1px 4px rgba(0,0,0,0.45)" }}>{post.title}</h1>
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
          <div className="p-6 rounded-2xl" style={{ backgroundColor: `${CORAL}08`, border: `1px solid ${CORAL}25` }}>
            <h3 className="font-bold mb-2" style={{ color: CHARCOAL }}>Need HR or Recruitment Support in Africa?</h3>
            <p className="text-sm text-gray-600 mb-4">BridgePath Africa is launching platform access in Ghana and Kenya, with HR advisory support for teams expanding across Africa.</p>
            <Link href="/#contact">
              <button className="px-5 py-2.5 text-sm font-semibold text-white rounded-xl hover:opacity-90 transition-opacity" style={{ backgroundColor: CORAL }}>
                Contact Our Team
              </button>
            </Link>
          </div>
        </div>
      </div>

      {otherPosts.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 md:px-8 max-w-3xl">
            <h2 className="text-xl font-bold mb-8" style={{ color: CHARCOAL }}>More Insights</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {otherPosts.map((p) => (
                <Link key={p.slug} href={`/blog/${p.slug}`}>
                  <div className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-all cursor-pointer">
                    <img src={p.image} alt={p.title} className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="p-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded" style={{ backgroundColor: `${CORAL}15`, color: CORAL }}>{p.tag}</span>
                      <h3 className="font-semibold text-gray-900 mt-2 mb-1 text-sm leading-snug group-hover:text-orange-700 transition-colors line-clamp-2">{p.title}</h3>
                      <div className="flex items-center gap-1 text-xs font-semibold mt-2" style={{ color: CORAL }}>
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
