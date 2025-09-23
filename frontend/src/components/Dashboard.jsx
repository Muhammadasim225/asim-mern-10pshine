// DashboardNotes.jsx
import React from "react";

/**
 * DashboardNotes.jsx
 * - Desktop-first responsive dashboard for Notes App
 * - Tailwind CSS used for all styling
 * - Replace dummy data and handlers with real API logic
 */

const PALETTE = {
  yellow: "bg-[#FBBF24]",
  orange: "bg-[#F97316]",
  green: "bg-[#D4E157]",
  purple: "bg-[#C5A3FF]",
  blue: "bg-[#38BDF8]",
};

const notesSample = [
  {
    id: 1,
    title: "Get the utility bills Deposited",
    body:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quick summary preview for the dashboard card.",
    date: "2021-06-08",
    tag: "Notes",
    color: "yellow",
  },
  {
    id: 2,
    title: "Plan UX improvements",
    body: "Short preview describing ideas and tasks to do for next sprint.",
    date: "2021-06-08",
    tag: "To Do",
    color: "orange",
  },
  {
    id: 3,
    title: "Research new components",
    body: "Notes about component research and design tokens.",
    date: "2021-06-08",
    tag: "Blog",
    color: "green",
  },
  {
    id: 4,
    title: "Prepare client demo",
    body: "Checklist for the demo and talking points.",
    date: "2021-06-08",
    tag: "Notes",
    color: "purple",
  },
  {
    id: 5,
    title: "Mindmap feature ideas",
    body: "Brainstorming and mapping product ideas.",
    date: "2021-06-08",
    tag: "Notes",
    color: "blue",
  },
  // add more items as necessary...
];

function formatDate(d) {
  const date = new Date(d);
  return date.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function Dashboard() {
  const [query, setQuery] = React.useState("");
  const [filter, setFilter] = React.useState("All");

  const filters = ["All", "Notes", "To Do", "Blog"];

  const filtered = notesSample.filter((n) => {
    const matchesFilter = filter === "All" ? true : n.tag === filter;
    const matchesQuery =
      query.trim() === ""
        ? true
        : (n.title + " " + n.body).toLowerCase().includes(query.toLowerCase());
    return matchesFilter && matchesQuery;
  });

  return (
    <main className="min-h-screen bg-gray-50 text-slate-900 font-sans antialiased">
      <div className="max-w-7xl mx-auto px-8 py-10">
        {/* Header */}
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-4xl font-extrabold tracking-tight text-orange-600">
              My Notes
            </h1>
            
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <label htmlFor="search" className="sr-only">
                Search notes
              </label>
              <input
                id="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search here"
                className="pl-10 pr-4 py-3 w-80 rounded-xl border border-transparent bg-white shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-300"
                aria-label="Search notes"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
                </svg>
              </div>
            </div>

            <button
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm bg-white border border-transparent shadow-sm hover:shadow-lg focus:outline-none"
              aria-label="Open voice search"
              title="Voice search (placeholder)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-slate-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 1v11m0 0a3 3 0 100-6 3 3 0 000 6z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-14 0" />
              </svg>
            </button>

            <div className="flex items-center gap-3">
              <div className="text-sm text-slate-700">Signed in</div>
              <img
                src="https://ui-avatars.com/api/?name=U+User&background=ffedd5&color=92400e"
                alt="user avatar"
                className="w-10 h-10 rounded-full ring-2 ring-white shadow-sm"
              />
            </div>
          </div>
        </header>

        {/* Filters */}
        <nav className="flex items-center gap-3 mb-6" aria-label="Note filters">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                filter === f
                  ? "bg-orange-500 text-white shadow-md"
                  : "bg-white text-slate-700 border border-transparent hover:shadow-sm"
              }`}
              aria-pressed={filter === f}
            >
              {f}
            </button>
          ))}
        </nav>

        {/* Notes grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((note) => (
            <article
              key={note.id}
              className={`relative rounded-2xl shadow-sm border border-transparent overflow-hidden transform transition hover:shadow-lg`}
              style={{
                // subtle gradient overlay for sticky-note feel
                background:
                  note.color && PALETTE[note.color]
                    ? undefined // use Tailwind bg class below
                    : undefined,
              }}
            >
              <div className={`${PALETTE[note.color] || "bg-white"} rounded-xl p-4 h-full`}>
                {/* Tag / small pill (date or weekday) */}
   

                <h3 className="text-lg font-semibold text-slate-900 mb-2">{note.title}</h3>
                <p className="text-sm text-slate-700 leading-relaxed mb-4 line-clamp-4">{note.body}</p>

                <div className="flex items-center justify-between text-xs text-slate-600 mt-4">
                  <time dateTime={note.date}>{formatDate(note.date)}</time>
                  <button
                    className="text-xs rounded-full px-2 py-1 bg-white/50"
                    aria-label="Open note"
                    onClick={() => alert(`Open note ${note.id}`)}
                  >
                    Open
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="mt-12 text-center text-slate-500">
            No notes found. Create your first note using the + button.
          </div>
        )}

        {/* Floating New Note Button */}
        <div className="fixed bottom-8 right-8">
          <button
            className="flex items-center gap-3 bg-black text-white px-5 py-3 rounded-full shadow-2xl hover:scale-105 transform transition focus:outline-none"
            aria-label="Create new note"
            onClick={() => alert("Create new note")}
            title="Create new note"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            <span className="hidden sm:inline-block font-medium">New Note</span>
          </button>
        </div>
      </div>
    </main>
  );
}
