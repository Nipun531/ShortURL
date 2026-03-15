import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

// const INITIAL_LINKS = [
//   { id: 1, short: "short.link/l3wsh", original: "https://cdn.digialm.com//per/g01/pub/585/touchstone/AssessmentQPHTMLMode1//GATE2565/GATE2565S4D9442/17706397639492729/CS26S4131903...", date: "2026-03-12" },
//   { id: 2, short: "short.link/abc123", original: "https://www.example.com/very/long/url/that/needs/shortening/for/sharing", date: "2026-03-11" },
//   { id: 3, short: "short.link/x9kt2", original: "https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms/edit",date: "2026-03-10" },
//   { id: 4, short: "short.link/p2mzq", original: "https://github.com/vercel/next.js/blob/canary/packages/next/src/server/app-render/app-render.tsx",date: "2026-03-09" },
//   { id: 5, short: "short.link/wr7ys", original: "https://www.figma.com/file/xyz123/My-Design-System?node-id=0%3A1&t=abc", date: "2026-03-08" },
// ];




function today() {
  return new Date().toISOString().slice(0, 10);
}

const token = localStorage.getItem("token");

let decoded = null;

if (token) {
  try {
    decoded = jwtDecode(token);
  } catch (err) {
    console.log("Invalid token");
    localStorage.removeItem("token");
    window.location.href = "/";
  }
} else {
  localStorage.removeItem("token");
  window.location.href = "/";
}



export default function Home() {
  const [activeNav, setActiveNav] = useState("dashboard");
  const [url, setUrl] = useState("");
  const [links, setLinks] = useState([]);
  const [newLink, setNewLink] = useState(null);
  const [copied, setCopied] = useState(null);
  const [error, setError] = useState("");
  

  const Url='http://localhost:3000'

  async function getLinks(){

    const res=await fetch(`${Url}/urls`,{
      method:'GET',
      headers:{
        Authorization:`Bearer ${token}`
      }
    })
    const data=await res.json();
    if (!res.ok) {
      console.error(data);
      return;
    }
    setLinks(data.urls);

  }

  useEffect(()=>{
    getLinks()
    
  },[])
  
  async function handleGenerate() {
    if (!url.trim()) { setError("Please enter a URL."); return; }
    console.log(url.trim())
    try { new URL(url.trim()); } catch { setError("Please enter a valid URL (include https://)."); return; }
    setError("");
    
    const res=await fetch(`${Url}/create-url`,{
      method: 'POST',
      headers:{
        "Content-Type": "application/json"
      },
      body:JSON.stringify({
        url: url.trim(),
        user_id:decoded.id,
      })
    })

    const data=await res.json();
      if (!res.ok) {
        alert(data.msg);
        return;
      }

    // const generated = {
    //   id: data.id,
    //   short: `${Url}/${data.short_url}`,
    //   original: url.trim(),
    //   date: data.created_at,
    // };
    const generated=data;
    setNewLink(generated);
    setLinks(prev => [generated, ...prev].slice(0, 5));
    setUrl("");
  }

  function handleCopy(text, id) {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }

  function handleDelete(id) {
    setLinks(prev => prev.filter(l => l.id !== id));
    if (newLink?.id === id) setNewLink(null);
  }

  function handleDismissNew() {
    setNewLink(null);
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "radial-gradient(ellipse at 60% 0%, #1e1040 0%, #0f0f1a 50%, #080810 100%)" }}>

      {/* Top Navbar */}
      <header className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)", backdropFilter: "blur(12px)" }}>
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #6d28d9, #a855f7)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-white font-bold text-lg tracking-tight">ShortLink</span>
        </div>

        {/* Nav Links */}
        <nav className="flex items-center gap-1">
          {[{ key: "dashboard", label: "Dashboard" }, { key: "manage", label: "Manage Links" }].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveNav(key)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
              style={activeNav === key
                ? { background: "rgba(139,92,246,0.18)", color: "#a78bfa" }
                : { color: "#6b7280" }}
              onMouseOver={e => { if (activeNav !== key) e.currentTarget.style.color = "#9ca3af"; }}
              onMouseOut={e => { if (activeNav !== key) e.currentTarget.style.color = "#6b7280"; }}>
              {label}
            </button>
          ))}
        </nav>

        {/* User + Logout */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white" style={{ background: "linear-gradient(135deg, #6d28d9, #a855f7)" }}>JD</div>
            <span className="text-sm text-gray-300 font-medium">John Doe</span>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm text-gray-400 hover:text-white transition-colors" style={{ border: "1px solid rgba(255,255,255,0.08)" }}
            onMouseOver={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)"}
            onMouseOut={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Logout
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-10">

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight">URL Shortener</h1>
          <p className="text-gray-500 mt-1 text-sm">Create short, memorable links in seconds</p>
        </div>

        {/* URL Input Card */}
        <div className="rounded-2xl p-6 mb-6" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <label className="block text-sm font-medium text-gray-300 mb-3">Paste your long URL here</label>
          <input
            type="text"
            value={url}
            onChange={e => { setUrl(e.target.value); setError(""); }}
            onKeyDown={e => e.key === "Enter" && handleGenerate()}
            placeholder="https://example.com/your-very-long-url"
            className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition-all mb-4"
            style={{ background: "rgba(255,255,255,0.05)", border: error ? "1px solid rgba(239,68,68,0.5)" : "1px solid rgba(255,255,255,0.1)" }}
            onFocus={e => { e.target.style.borderColor = "#7c3aed"; }}
            onBlur={e => { e.target.style.borderColor = error ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.1)"; }}
          />
          {error && <p className="text-xs text-red-400 mb-3 -mt-2">{error}</p>}
          <button
            onClick={handleGenerate}
            className="px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-95"
            style={{ background: "linear-gradient(90deg, #6d28d9, #a855f7)", boxShadow: "0 4px 20px rgba(124,58,237,0.35)" }}>
            Generate Short Link
          </button>
        </div>

        {/* Newly Generated Link — shown distinctively */}
        {newLink && (
          <div className="rounded-2xl p-5 mb-6 relative overflow-hidden" style={{ background: "linear-gradient(135deg, rgba(109,40,217,0.25), rgba(168,85,247,0.12))", border: "1px solid rgba(167,139,250,0.35)", boxShadow: "0 0 30px rgba(124,58,237,0.15)" }}>
            {/* Glow blob */}
            <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full opacity-20 pointer-events-none" style={{ background: "radial-gradient(circle, #a855f7, transparent)" }} />

            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: "rgba(167,139,250,0.2)", color: "#c4b5fd" }}>✨ New Link</span>
                </div>
                <a href="#" className="text-base font-bold block mb-1" style={{ color: "#a78bfa" }}>{`${Url}/${newLink.short_url}`}</a>
                <p className="text-xs text-gray-500 truncate">{newLink.real_url}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleCopy(`${Url}/${newLink.short_url}`, "new")}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all"
                  style={{ background: copied === "new" ? "rgba(167,139,250,0.25)" : "rgba(255,255,255,0.08)", color: copied === "new" ? "#c4b5fd" : "#9ca3af", border: "1px solid rgba(255,255,255,0.1)" }}>
                  {copied === "new" ? (
                    <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg> Copied!</>
                  ) : (
                    <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy</>
                  )}
                </button>
                <button onClick={handleDismissNew} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-600 hover:text-gray-400 transition-colors" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total Links", value: links.length, color: "#6d28d9" },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-2xl p-5 text-center" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <p className="text-2xl font-bold mb-1" style={{ color }}>{value}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          ))}
        </div>

        {/* Links List */}
        <div>
          <div className="mb-4">
            <h2 className="text-lg font-bold text-white">Your Shortened Links</h2>
            <p className="text-xs text-gray-500 mt-0.5">Showing your last 5 generated links</p>
          </div>

          <div className="flex flex-col gap-3">
            {links.map((link) => (
              <div key={link.id} className="rounded-xl px-5 py-4 flex items-center gap-4 group transition-all" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
                onMouseOver={e => e.currentTarget.style.borderColor = "rgba(167,139,250,0.2)"}
                onMouseOut={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(109,40,217,0.18)" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <a href="#" className="text-sm font-semibold hover:underline" style={{ color: "#a78bfa" }}>{`${Url}/${link.short_url}`}</a>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                  </div>
                  <p className="text-xs text-gray-600 truncate">{link.real_url}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="flex items-center gap-1 text-xs text-gray-600">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                      {link.created_at}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleCopy(`${Url}/${link.short_url}`, link.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                    style={{ background: copied === link.id ? "rgba(167,139,250,0.15)" : "rgba(255,255,255,0.06)", color: copied === link.id ? "#c4b5fd" : "#9ca3af", border: "1px solid rgba(255,255,255,0.08)" }}>
                    {copied === link.id ? (
                      <><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg> Copied</>
                    ) : (
                      <><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy</>
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(link.id)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-700 hover:text-red-400 transition-colors"
                    style={{ background: "rgba(255,255,255,0.04)" }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                  </button>
                </div>
              </div>
            ))}

            {links.length === 0 && (
              <div className="rounded-xl py-12 text-center" style={{ background: "rgba(255,255,255,0.03)", border: "1px dashed rgba(255,255,255,0.08)" }}>
                <p className="text-gray-600 text-sm">No links yet. Generate your first one above!</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}