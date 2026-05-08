/** @format */

import { useState, useMemo } from "react";

const INITIAL_PLAYERS = ["Valen", "Coro", "Toro", "Maro", "Juanchi", "Martin", "Lucas", "Facu", "Juli", "Lito", "Nico", "Fede T", "Mati"];

const INITIAL_MATCHES = [
    {
        id: 1,
        date: "2026-05-06",
        time: "20:00",
        location: "El Lobo",
        maxPlayers: 10,
        enrolled: ["Valen", "Nico", "Toro", "Mati", "Facu", "Gonza", "Maro", "Coro", "Lucas", "Fede T"],
        teamA: ["Valen", "Nico", "Toro", "Mati", "Facu"],
        teamB: ["Gonza", "Maro", "Coro", "Lucas", "Fede T"],
        result: "teamA",
        status: "finished",
    },
    {
        id: 2,
        date: "2026-05-03",
        time: "20:00",
        location: "La Meca",
        maxPlayers: 16,
        enrolled: ["Valen", "Toto", "Santi D", "Mati", "Amigo Mati", "Toro", "Facu", "Ivi", "Lucas", "Gonza", "Agus B", "Coro", "Juli", "Lito", "Carre", "Marian"],
        teamA: ["Valen", "Toto", "Santi D", "Mati", "Amigo Mati", "Toro", "Facu", "Ivi"],
        teamB: ["Lucas", "Gonza", "Agus B", "Coro", "Juli", "Lito", "Carre", "Marian"],
        result: "teamA",
        status: "finished",
    },
    {
        id: 3,
        date: "2026-04-29",
        time: "20:00",
        location: "El Lobo",
        maxPlayers: 10,
        enrolled: ["Valen", "Gonza", "Maro", "Coro", "Juli", "Juan", "Lucas", "Nico", "Toro", "Fede T"],
        teamA: ["Valen", "Gonza", "Maro", "Coro", "Juli"],
        teamB: ["Juan", "Lucas", "Nico", "Toro", "Fede T"],
        result: "teamA",
        status: "finished",
    },
    {
        id: 4,
        date: "2026-04-21",
        time: "20:00",
        location: "El Lobo",
        maxPlayers: 8,
        enrolled: ["Valen", "Juanchi", "Adrian", "Mati", "Maro", "Juli", "Lucas", "Coro"],
        teamA: ["Valen", "Juanchi", "Adrian", "Mati"],
        teamB: ["Juli", "Maro", "Coro", "Lucas"],
        result: "teamA",
        status: "finished",
    },
    {
        id: 5,
        date: "2026-04-19",
        time: "20:00",
        location: "La Meca",
        maxPlayers: 16,
        enrolled: ["Valen", "Toto", "Lucas", "Juan", "Toro", "Mati", "Marian", "Tom", "Gonza", "Agus B", "Maro", "Coro", "Facu", "Juanchi", "Carre", "Fede T"],
        teamA: ["Valen", "Toto", "Lucas", "Juan", "Toro", "Mati", "Marian", "Tom"],
        teamB: ["Gonza", "Agus B", "Maro", "Coro", "Facu", "Juanchi", "Carre", "Fede T"],
        result: "teamB",
        status: "finished",
    },
];

const formatDate = (d) => {
    const [y, m, day] = d.split("-");
    return `${day}/${m}/${y}`;
};

const Badge = ({ children, color = "lime" }) => {
    const colors = {
        lime: "bg-lime-400 text-black",
        red: "bg-red-500 text-white",
        gray: "bg-zinc-700 text-zinc-300",
        blue: "bg-sky-500 text-white",
        yellow: "bg-yellow-400 text-black",
    };
    return <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${colors[color]}`}>{children}</span>;
};

const Modal = ({ title, onClose, children }) => (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-zinc-900 border border-zinc-700 rounded-xl w-full max-w-lg shadow-2xl">
            <div className="flex justify-between items-center px-6 py-4 border-b border-zinc-800">
                <h3 className="text-white font-bold text-lg tracking-tight">{title}</h3>
                <button onClick={onClose} className="text-zinc-400 hover:text-white text-2xl leading-none">
                    &times;
                </button>
            </div>
            <div className="px-6 py-5">{children}</div>
        </div>
    </div>
);

const Input = ({ label, ...props }) => (
    <div className="flex flex-col gap-1">
        {label && <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{label}</label>}
        <input className="bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-lime-400 transition" {...props} />
    </div>
);

export default function App() {
    const [tab, setTab] = useState("matches");
    const [matches, setMatches] = useState(INITIAL_MATCHES);
    const [players] = useState(INITIAL_PLAYERS);
    const [currentUser, setCurrentUser] = useState("Valen");
    const [showNewMatch, setShowNewMatch] = useState(false);
    const [showResult, setShowResult] = useState(null);
    const [showEnroll, setShowEnroll] = useState(null);
    const [showTeams, setShowTeams] = useState(null);

    const [newMatch, setNewMatch] = useState({ date: "", time: "", location: "", maxPlayers: 10 });

    const stats = useMemo(() => {
        const map = {};
        players.forEach((p) => {
            map[p] = { played: 0, wins: 0, losses: 0, draws: 0 };
        });
        matches
            .filter((m) => m.status === "finished")
            .forEach((m) => {
                m.enrolled.forEach((p) => {
                    if (!map[p]) map[p] = { played: 0, wins: 0, losses: 0, draws: 0 };
                    map[p].played++;
                    const inA = m.teamA.includes(p);
                    const inB = m.teamB.includes(p);
                    if (m.result === "draw") {
                        map[p].draws++;
                    } else if ((m.result === "teamA" && inA) || (m.result === "teamB" && inB)) {
                        map[p].wins++;
                    } else if (m.result && (inA || inB)) {
                        map[p].losses++;
                    }
                });
            });
        return Object.entries(map)
            .map(([name, s]) => ({ name, ...s, winRate: s.played > 0 ? Math.round((s.wins / s.played) * 100) : 0 }))
            .sort((a, b) => b.wins - a.wins || b.winRate - a.winRate);
    }, [matches, players]);

    const handleCreateMatch = () => {
        if (!newMatch.date || !newMatch.time || !newMatch.location) return;
        const m = {
            id: Date.now(),
            ...newMatch,
            maxPlayers: parseInt(newMatch.maxPlayers) || 10,
            enrolled: [],
            teamA: [],
            teamB: [],
            result: null,
            status: "upcoming",
        };
        setMatches((prev) => [m, ...prev]);
        setNewMatch({ date: "", time: "", location: "", maxPlayers: 10 });
        setShowNewMatch(false);
    };

    const handleEnroll = (matchId) => {
        setMatches((prev) =>
            prev.map((m) => {
                if (m.id !== matchId) return m;
                if (m.enrolled.includes(currentUser)) return m;
                if (m.enrolled.length >= m.maxPlayers) return m;
                return { ...m, enrolled: [...m.enrolled, currentUser] };
            }),
        );
    };

    const handleUnenroll = (matchId) => {
        setMatches((prev) =>
            prev.map((m) => {
                if (m.id !== matchId) return m;
                return { ...m, enrolled: m.enrolled.filter((p) => p !== currentUser) };
            }),
        );
    };

    const handleSaveResult = (matchId, result, teamA, teamB) => {
        setMatches((prev) =>
            prev.map((m) => {
                if (m.id !== matchId) return m;
                return { ...m, result, teamA, teamB, status: "finished" };
            }),
        );
        setShowResult(null);
    };

    const upcomingMatches = matches.filter((m) => m.status === "upcoming");
    const finishedMatches = matches.filter((m) => m.status === "finished");

    return (
        <div className="min-h-screen bg-zinc-950 text-white font-sans" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Bebas+Neue&display=swap');
        .bebas { font-family: 'Bebas Neue', sans-serif; }
        .bar-fill { transition: width 0.8s cubic-bezier(0.16,1,0.3,1); }
        .card-hover { transition: border-color 0.2s, transform 0.2s; }
        .card-hover:hover { border-color: #a3e635; transform: translateY(-2px); }
      `}</style>

            {/* Header */}
            <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur sticky top-0 z-40">
                <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-lime-400 rounded-lg flex items-center justify-center">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5">
                                <circle cx="12" cy="12" r="10" />
                                <polygon points="12,6 14.5,10 19,10.5 15.5,14 16.5,18.5 12,16 7.5,18.5 8.5,14 5,10.5 9.5,10" fill="black" stroke="none" />
                            </svg>
                        </div>
                        <span className="bebas text-2xl tracking-wider text-white">FulboManager</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-xs text-zinc-500 hidden sm:block">Jugando como:</span>
                        <select className="bg-zinc-800 border border-zinc-700 text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-lime-400" value={currentUser} onChange={(e) => setCurrentUser(e.target.value)}>
                            {players.map((p) => (
                                <option key={p}>{p}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </header>

            {/* Tabs */}
            <div className="max-w-5xl mx-auto px-4 mt-6">
                <div className="flex gap-1 bg-zinc-900 border border-zinc-800 rounded-xl p-1 w-fit">
                    {[
                        ["matches", "Partidos"],
                        ["stats", "Estadisticas"],
                    ].map(([key, label]) => (
                        <button key={key} onClick={() => setTab(key)} className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${tab === key ? "bg-lime-400 text-black" : "text-zinc-400 hover:text-white"}`}>
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            <main className="max-w-5xl mx-auto px-4 py-6 space-y-8">
                {/* MATCHES TAB */}
                {tab === "matches" && (
                    <>
                        {/* Upcoming */}
                        <section>
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h2 className="bebas text-3xl tracking-wider text-white">Proximos Partidos</h2>
                                    <p className="text-zinc-500 text-sm">{upcomingMatches.length} partido(s) programado(s)</p>
                                </div>
                                <button onClick={() => setShowNewMatch(true)} className="bg-lime-400 hover:bg-lime-300 text-black font-bold text-sm px-4 py-2 rounded-lg transition flex items-center gap-2">
                                    <span>+</span> Nuevo partido
                                </button>
                            </div>

                            {upcomingMatches.length === 0 ? (
                                <div className="border border-dashed border-zinc-700 rounded-xl p-10 text-center text-zinc-500">No hay partidos programados. Crea uno nuevo.</div>
                            ) : (
                                <div className="grid gap-3 sm:grid-cols-2">
                                    {upcomingMatches.map((m) => {
                                        const isEnrolled = m.enrolled.includes(currentUser);
                                        const isFull = m.enrolled.length >= m.maxPlayers;
                                        const pct = Math.round((m.enrolled.length / m.maxPlayers) * 100);
                                        return (
                                            <div key={m.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 card-hover">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div>
                                                        <p className="font-bold text-white text-base">{m.location}</p>
                                                        <p className="text-zinc-400 text-sm">
                                                            {formatDate(m.date)} a las {m.time}
                                                        </p>
                                                    </div>
                                                    {isEnrolled ? <Badge color="lime">Apuntado</Badge> : isFull ? <Badge color="red">Lleno</Badge> : <Badge color="gray">Libre</Badge>}
                                                </div>

                                                {/* Progress bar */}
                                                <div className="mb-3">
                                                    <div className="flex justify-between text-xs text-zinc-500 mb-1">
                                                        <span>Jugadores inscritos</span>
                                                        <span className="text-white font-semibold">
                                                            {m.enrolled.length}/{m.maxPlayers}
                                                        </span>
                                                    </div>
                                                    <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                                        <div className="h-full bg-lime-400 bar-fill rounded-full" style={{ width: `${pct}%` }} />
                                                    </div>
                                                </div>

                                                {/* Enrolled avatars */}
                                                <div className="flex flex-wrap gap-1 mb-4">
                                                    {m.enrolled.map((p) => (
                                                        <span key={p} className={`text-xs px-2 py-0.5 rounded-full font-medium ${p === currentUser ? "bg-lime-400 text-black" : "bg-zinc-800 text-zinc-300"}`}>
                                                            {p}
                                                        </span>
                                                    ))}
                                                    {m.enrolled.length === 0 && <span className="text-xs text-zinc-600">Nadie apuntado aun</span>}
                                                </div>

                                                <div className="flex gap-2 flex-wrap">
                                                    {!isEnrolled && !isFull && (
                                                        <button onClick={() => handleEnroll(m.id)} className="bg-lime-400 hover:bg-lime-300 text-black text-xs font-bold px-3 py-1.5 rounded-lg transition">
                                                            Apuntarme
                                                        </button>
                                                    )}
                                                    {isEnrolled && (
                                                        <button onClick={() => handleUnenroll(m.id)} className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold px-3 py-1.5 rounded-lg transition">
                                                            Desapuntarme
                                                        </button>
                                                    )}
                                                    {m.enrolled.length >= 2 && (
                                                        <button onClick={() => setShowResult(m)} className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold px-3 py-1.5 rounded-lg transition">
                                                            Registrar resultado
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </section>

                        {/* Past matches */}
                        {finishedMatches.length > 0 && (
                            <section>
                                <h2 className="bebas text-3xl tracking-wider text-white mb-4">Partidos Jugados</h2>
                                <div className="space-y-3">
                                    {finishedMatches.map((m) => {
                                        const inA = m.teamA.includes(currentUser);
                                        const inB = m.teamB.includes(currentUser);
                                        const myResult = !inA && !inB ? null : m.result === "draw" ? "draw" : (m.result === "teamA" && inA) || (m.result === "teamB" && inB) ? "win" : "loss";
                                        return (
                                            <div key={m.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                                    <div>
                                                        <p className="font-bold text-white">{m.location}</p>
                                                        <p className="text-zinc-500 text-sm">
                                                            {formatDate(m.date)} - {m.time}
                                                        </p>
                                                    </div>
                                                    <div className="flex gap-2 items-center flex-wrap">
                                                        {myResult && <Badge color={myResult === "win" ? "lime" : myResult === "draw" ? "yellow" : "red"}>{myResult === "win" ? "Victoria" : myResult === "draw" ? "Empate" : "Derrota"}</Badge>}
                                                        <Badge color="gray">{m.enrolled.length} jugadores</Badge>
                                                    </div>
                                                </div>

                                                {/* Teams */}
                                                <div className="mt-4 grid grid-cols-2 gap-3">
                                                    <div className={`rounded-lg p-3 border ${m.result === "teamA" ? "border-lime-400 bg-lime-400/5" : "border-zinc-800 bg-zinc-800/50"}`}>
                                                        <p className="text-xs font-bold uppercase tracking-wider mb-2 ${m.result === 'teamA' ? 'text-lime-400' : 'text-zinc-500'}">Equipo A {m.result === "teamA" && <span className="text-lime-400">- Ganador</span>}</p>
                                                        <div className="flex flex-wrap gap-1">
                                                            {m.teamA.map((p) => (
                                                                <span key={p} className={`text-xs px-1.5 py-0.5 rounded ${p === currentUser ? "bg-lime-400 text-black font-bold" : "bg-zinc-800 text-zinc-300"}`}>
                                                                    {p}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className={`rounded-lg p-3 border ${m.result === "teamB" ? "border-lime-400 bg-lime-400/5" : "border-zinc-800 bg-zinc-800/50"}`}>
                                                        <p className="text-xs font-bold uppercase tracking-wider mb-2">Equipo B {m.result === "teamB" && <span className="text-lime-400">- Ganador</span>}</p>
                                                        <div className="flex flex-wrap gap-1">
                                                            {m.teamB.map((p) => (
                                                                <span key={p} className={`text-xs px-1.5 py-0.5 rounded ${p === currentUser ? "bg-lime-400 text-black font-bold" : "bg-zinc-800 text-zinc-300"}`}>
                                                                    {p}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                        )}
                    </>
                )}

                {/* STATS TAB */}
                {tab === "stats" && (
                    <section>
                        <div className="mb-6">
                            <h2 className="bebas text-4xl tracking-wider">Clasificacion General</h2>
                            <p className="text-zinc-500 text-sm">Basada en {finishedMatches.length} partido(s) jugado(s)</p>
                        </div>

                        {/* Top 3 podium */}
                        {stats.filter((s) => s.played > 0).length >= 3 && (
                            <div className="grid grid-cols-3 gap-3 mb-8">
                                {[1, 0, 2].map((idx, order) => {
                                    const s = stats.filter((x) => x.played > 0)[idx];
                                    if (!s) return null;
                                    const heights = ["h-24", "h-32", "h-20"];
                                    const medals = ["2", "1", "3"];
                                    const colors = ["text-zinc-400", "text-yellow-400", "text-orange-400"];
                                    return (
                                        <div key={s.name} className={`bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col items-center justify-end ${heights[order]}`}>
                                            <span className={`text-2xl font-black ${colors[order]} bebas`}>{medals[order]}</span>
                                            <span className={`text-sm font-bold ${s.name === currentUser ? "text-lime-400" : "text-white"}`}>{s.name}</span>
                                            <span className="text-xs text-zinc-500">{s.wins} victorias</span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Full table */}
                        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                            <div className="grid grid-cols-6 gap-2 px-5 py-3 border-b border-zinc-800 text-xs font-bold uppercase tracking-wider text-zinc-500">
                                <span className="col-span-2">Jugador</span>
                                <span className="text-center">PJ</span>
                                <span className="text-center">V</span>
                                <span className="text-center">D</span>
                                <span className="text-center">%</span>
                            </div>
                            {stats.map((s, i) => (
                                <div key={s.name} className={`grid grid-cols-6 gap-2 px-5 py-3.5 border-b border-zinc-800/50 last:border-0 transition hover:bg-zinc-800/30 ${s.name === currentUser ? "bg-lime-400/5" : ""}`}>
                                    <div className="col-span-2 flex items-center gap-3">
                                        <span className="text-xs text-zinc-600 font-mono w-4">{i + 1}</span>
                                        <div className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-300">{s.name[0]}</div>
                                        <span className={`font-semibold text-sm ${s.name === currentUser ? "text-lime-400" : "text-white"}`}>{s.name}</span>
                                    </div>
                                    <span className="text-center text-sm text-zinc-300 self-center">{s.played}</span>
                                    <span className="text-center text-sm font-bold text-lime-400 self-center">{s.wins}</span>
                                    <span className="text-center text-sm text-red-400 self-center">{s.losses}</span>
                                    <div className="flex items-center gap-2 self-center">
                                        <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-lime-400 rounded-full bar-fill" style={{ width: `${s.winRate}%` }} />
                                        </div>
                                        <span className="text-xs font-mono text-zinc-400 w-8">{s.winRate}%</span>
                                    </div>
                                </div>
                            ))}
                            {stats.every((s) => s.played === 0) && <div className="px-5 py-10 text-center text-zinc-600">No hay partidos finalizados aun</div>}
                        </div>

                        {/* Personal card */}
                        {(() => {
                            const me = stats.find((s) => s.name === currentUser);
                            if (!me) return null;
                            return (
                                <div className="mt-6 bg-zinc-900 border border-lime-400/30 rounded-xl p-5">
                                    <p className="text-xs font-bold uppercase tracking-wider text-lime-400 mb-3">Tu resumen</p>
                                    <div className="grid grid-cols-4 gap-4">
                                        {[
                                            ["Partidos", me.played],
                                            ["Victorias", me.wins],
                                            ["Derrotas", me.losses],
                                            ["% Victoria", `${me.winRate}%`],
                                        ].map(([label, val]) => (
                                            <div key={label} className="text-center">
                                                <div className="bebas text-3xl text-white">{val}</div>
                                                <div className="text-xs text-zinc-500">{label}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })()}
                    </section>
                )}
            </main>

            {/* Modal: New Match */}
            {showNewMatch && (
                <Modal title="Crear nuevo partido" onClose={() => setShowNewMatch(false)}>
                    <div className="space-y-4">
                        <Input label="Fecha" type="date" value={newMatch.date} onChange={(e) => setNewMatch((p) => ({ ...p, date: e.target.value }))} />
                        <Input label="Hora" type="time" value={newMatch.time} onChange={(e) => setNewMatch((p) => ({ ...p, time: e.target.value }))} />
                        <Input label="Lugar" type="text" placeholder="Ej: Campo Norte" value={newMatch.location} onChange={(e) => setNewMatch((p) => ({ ...p, location: e.target.value }))} />
                        <Input label="Max. jugadores" type="number" min={2} max={22} value={newMatch.maxPlayers} onChange={(e) => setNewMatch((p) => ({ ...p, maxPlayers: e.target.value }))} />
                        <button onClick={handleCreateMatch} className="w-full bg-lime-400 hover:bg-lime-300 text-black font-bold py-2.5 rounded-lg transition mt-2">
                            Crear partido
                        </button>
                    </div>
                </Modal>
            )}

            {/* Modal: Result */}
            {showResult && <ResultModal match={showResult} players={players} onSave={handleSaveResult} onClose={() => setShowResult(null)} />}
        </div>
    );
}

function ResultModal({ match, players, onSave, onClose }) {
    const enrolled = match.enrolled;
    const half = Math.ceil(enrolled.length / 2);
    const [teamA, setTeamA] = useState([...enrolled.slice(0, half)]);
    const [teamB, setTeamB] = useState([...enrolled.slice(half)]);
    const [winner, setWinner] = useState(null);

    const togglePlayer = (player, team) => {
        if (team === "A") {
            if (teamA.includes(player)) {
                setTeamA((t) => t.filter((p) => p !== player));
                setTeamB((t) => [...t, player]);
            } else {
                setTeamB((t) => t.filter((p) => p !== player));
                setTeamA((t) => [...t, player]);
            }
        }
    };

    return (
        <Modal title="Registrar resultado" onClose={onClose}>
            <div className="space-y-5">
                <p className="text-zinc-400 text-sm">Ajusta los equipos y selecciona el ganador.</p>

                <div className="grid grid-cols-2 gap-3">
                    {[
                        ["A", teamA, "Equipo A"],
                        ["B", teamB, "Equipo B"],
                    ].map(([key, team, label]) => (
                        <div key={key} className={`rounded-xl border p-3 ${winner === `team${key}` ? "border-lime-400 bg-lime-400/5" : "border-zinc-700 bg-zinc-800/50"}`}>
                            <p className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">{label}</p>
                            <div className="flex flex-wrap gap-1 min-h-8">
                                {team.map((p) => (
                                    <button key={p} onClick={() => togglePlayer(p, key === "A" ? "A" : "B")} className="text-xs bg-zinc-700 hover:bg-zinc-600 text-white px-2 py-0.5 rounded transition">
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <p className="text-xs text-zinc-500">Haz click en un jugador para cambiar de equipo.</p>

                <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Ganador</p>
                    <div className="flex gap-2">
                        {[
                            ["teamA", "Equipo A"],
                            ["teamB", "Equipo B"],
                            ["draw", "Empate"],
                        ].map(([key, label]) => (
                            <button key={key} onClick={() => setWinner(key)} className={`flex-1 py-2 rounded-lg text-sm font-bold border transition ${winner === key ? "bg-lime-400 border-lime-400 text-black" : "bg-zinc-800 border-zinc-700 text-zinc-300 hover:border-zinc-500"}`}>
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                <button disabled={!winner} onClick={() => onSave(match.id, winner, teamA, teamB)} className="w-full bg-lime-400 hover:bg-lime-300 disabled:bg-zinc-700 disabled:text-zinc-500 disabled:cursor-not-allowed text-black font-bold py-2.5 rounded-lg transition">
                    Guardar resultado
                </button>
            </div>
        </Modal>
    );
}
