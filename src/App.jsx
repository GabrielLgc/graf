import { useMemo, useState } from "react";

const nodes = [
  { id: "A", x: 86, y: 72 },
  { id: "B", x: 238, y: 54 },
  { id: "C", x: 292, y: 182 },
  { id: "D", x: 150, y: 234 },
  { id: "E", x: 52, y: 178 }
];

const undirectedEdges = [
  ["A", "B"],
  ["A", "E"],
  ["B", "C"],
  ["C", "D"],
  ["D", "E"],
  ["B", "D"]
];

const directedEdges = [
  ["A", "B"],
  ["B", "C"],
  ["C", "D"],
  ["D", "B"],
  ["E", "A"],
  ["D", "E"]
];

const lessons = [
  {
    title: "Varfuri si muchii",
    body: "Un graf este format din varfuri, numite si noduri, si legaturi intre ele. In probleme, varfurile pot reprezenta orase, elevi, pagini web sau puncte dintr-o harta."
  },
  {
    title: "Graf neorientat",
    body: "O muchie neorientata leaga doua varfuri fara sens. Daca exista muchia dintre A si B, se poate parcurge atat de la A la B, cat si de la B la A."
  },
  {
    title: "Graf orientat",
    body: "Un arc orientat are sens. Arcul A -> B inseamna ca legatura merge de la A la B, dar nu implica automat si legatura B -> A."
  }
];

const comparisons = [
  ["Legatura", "muchie {A, B}", "arc (A, B)"],
  ["Parcurgere", "in ambele sensuri", "doar in sensul sagetii"],
  ["Grad", "numarul muchiilor incidente", "grad intern si grad extern"],
  ["Matrice", "simetrica fata de diagonala", "poate fi nesimetrica"]
];

const algorithms = [
  "BFS: gaseste rapid nivelele si distantele minime in grafuri fara costuri.",
  "DFS: exploreaza in adancime si ajuta la componente conexe sau cicluri.",
  "Dijkstra: calculeaza drumuri minime cand muchiile au costuri pozitive.",
  "Sortare topologica: ordoneaza activitati intr-un graf orientat aciclic."
];

function getNode(id) {
  return nodes.find((node) => node.id === id);
}

function Matrix({ mode }) {
  const edges = mode === "directed" ? directedEdges : undirectedEdges;
  const matrix = nodes.map((row) =>
    nodes.map((col) => {
      const forward = edges.some(([from, to]) => from === row.id && to === col.id);
      const reverse = mode === "undirected" && edges.some(([from, to]) => from === col.id && to === row.id);
      return forward || reverse ? 1 : 0;
    })
  );

  return (
    <div className="matrix" aria-label="Matrice de adiacenta">
      <span className="matrix-corner" />
      {nodes.map((node) => (
        <strong key={`top-${node.id}`}>{node.id}</strong>
      ))}
      {nodes.map((row, rowIndex) => (
        <span className="matrix-row" key={`row-label-${row.id}`}>
          <strong>{row.id}</strong>
          {matrix[rowIndex].map((value, colIndex) => (
            <span className={value ? "matrix-cell active" : "matrix-cell"} key={`${row.id}-${nodes[colIndex].id}`}>
              {value}
            </span>
          ))}
        </span>
      ))}
    </div>
  );
}

function GraphDiagram({ mode }) {
  const edges = mode === "directed" ? directedEdges : undirectedEdges;

  return (
    <svg viewBox="0 0 350 280" role="img" aria-label={`Exemplu de graf ${mode === "directed" ? "orientat" : "neorientat"}`}>
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#d54f2a" />
        </marker>
      </defs>
      <rect x="0" y="0" width="350" height="280" rx="18" fill="#f7fbfa" />
      <g>
        {edges.map(([from, to]) => {
          const start = getNode(from);
          const end = getNode(to);
          return (
            <line
              key={`${from}-${to}`}
              x1={start.x}
              y1={start.y}
              x2={end.x}
              y2={end.y}
              className={mode === "directed" ? "edge directed" : "edge"}
              markerEnd={mode === "directed" ? "url(#arrow)" : undefined}
            />
          );
        })}
      </g>
      <g>
        {nodes.map((node) => (
          <g key={node.id}>
            <circle cx={node.x} cy={node.y} r="24" className="node-circle" />
            <text x={node.x} y={node.y + 7} textAnchor="middle" className="node-text">
              {node.id}
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
}

function DegreePanel({ mode }) {
  const data = useMemo(() => {
    const edges = mode === "directed" ? directedEdges : undirectedEdges;
    return nodes.map((node) => {
      if (mode === "undirected") {
        const degree = edges.filter(([a, b]) => a === node.id || b === node.id).length;
        return { id: node.id, degree };
      }
      const out = edges.filter(([from]) => from === node.id).length;
      const incoming = edges.filter(([, to]) => to === node.id).length;
      return { id: node.id, incoming, out };
    });
  }, [mode]);

  return (
    <div className="degree-list">
      {data.map((item) => (
        <div className="degree-row" key={item.id}>
          <strong>{item.id}</strong>
          {mode === "undirected" ? (
            <span>grad {item.degree}</span>
          ) : (
            <span>
              intrare {item.incoming} / iesire {item.out}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const [mode, setMode] = useState("undirected");
  const isDirected = mode === "directed";

  return (
    <div className="app">
      <header className="site-header">
        <a href="#top" className="brand">
          <span className="brand-mark">G</span>
          <span>Grafuri pentru liceu</span>
        </a>
        <nav aria-label="Navigatie principala">
          <a href="#definitii">Definitii</a>
          <a href="#comparatie">Comparatie</a>
          <a href="#matrice">Matrice</a>
          <a href="#aplicatii">Aplicatii</a>
        </nav>
      </header>

      <main id="top">
        <section className="intro-section">
          <div className="intro-copy">
            <p className="eyebrow">Informatica • clasa a XI-a</p>
            <h1>Grafuri orientate si neorientate, explicate vizual</h1>
            <p>
              Invata rapid diferenta dintre muchii si arce, cum se citesc gradele varfurilor si cum arata matricea de
              adiacenta pentru fiecare tip de graf.
            </p>
            <div className="mode-switch" role="group" aria-label="Alege tipul grafului">
              <button className={!isDirected ? "selected" : ""} onClick={() => setMode("undirected")} type="button">
                Neorientat
              </button>
              <button className={isDirected ? "selected" : ""} onClick={() => setMode("directed")} type="button">
                Orientat
              </button>
            </div>
          </div>
          <div className="graph-panel" aria-live="polite">
            <GraphDiagram mode={mode} />
            <div className="graph-caption">
              <strong>{isDirected ? "Arcele au directie" : "Muchiile nu au directie"}</strong>
              <span>
                {isDirected
                  ? "Sagetile arata sensul permis al parcurgerii."
                  : "Fiecare legatura poate fi folosita in ambele sensuri."}
              </span>
            </div>
          </div>
        </section>

        <section className="content-band" id="definitii">
          <div className="section-heading">
            <p className="eyebrow">Baza teoriei</p>
            <h2>Ce trebuie sa retii</h2>
          </div>
          <div className="lesson-grid">
            {lessons.map((lesson, index) => (
              <article className="lesson-card" key={lesson.title}>
                <span>{index + 1}</span>
                <h3>{lesson.title}</h3>
                <p>{lesson.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="split-section" id="comparatie">
          <div>
            <p className="eyebrow">Comparatie directa</p>
            <h2>Orientat vs. neorientat</h2>
            <p>
              In grafurile neorientate conteaza doar existenta legaturii. In grafurile orientate conteaza si ordinea
              varfurilor, deci A -> B este diferit de B -> A.
            </p>
          </div>
          <div className="comparison-table" role="table" aria-label="Comparatie intre graf orientat si neorientat">
            <div role="row" className="table-head">
              <strong>Criteriu</strong>
              <strong>Neorientat</strong>
              <strong>Orientat</strong>
            </div>
            {comparisons.map(([criterion, undirected, directed]) => (
              <div role="row" key={criterion}>
                <span>{criterion}</span>
                <span>{undirected}</span>
                <span>{directed}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="content-band alternate" id="matrice">
          <div className="section-heading">
            <p className="eyebrow">Reprezentare</p>
            <h2>Matricea de adiacenta</h2>
            <p>
              Pentru graful selectat mai sus, 1 inseamna ca exista legatura de pe rand catre coloana. La grafurile
              neorientate matricea este simetrica.
            </p>
          </div>
          <div className="matrix-layout">
            <Matrix mode={mode} />
            <div className="info-panel">
              <h3>Gradele varfurilor</h3>
              <DegreePanel mode={mode} />
            </div>
          </div>
        </section>

        <section className="split-section reverse" id="aplicatii">
          <div className="algorithm-list">
            {algorithms.map((algorithm) => (
              <article key={algorithm}>
                <span />
                <p>{algorithm}</p>
              </article>
            ))}
          </div>
          <div>
            <p className="eyebrow">De ce sunt utile</p>
            <h2>Aplicatii si algoritmi</h2>
            <p>
              Grafurile apar in retele sociale, harti, rute de transport, dependente intre taskuri si structura
              internetului. Alegerea tipului de graf depinde de sensul legaturii din problema.
            </p>
          </div>
        </section>
      </main>

      <footer>
        <strong>Recapitulare:</strong> neorientat = muchii fara sens, orientat = arce cu sens.
      </footer>
    </div>
  );
}
