import { useMemo, useRef, useState } from "react";

const initialNodes = [
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

const initialGraphs = {
  undirected: {
    nodes: initialNodes,
    edges: undirectedEdges
  },
  directed: {
    nodes: initialNodes,
    edges: directedEdges
  }
};

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
  "Problema comis-voiajorului: cauta un traseu scurt care viziteaza fiecare oras o singura data si revine la start."
];

const quizQuestions = [
  {
    question: "Ce reprezinta o muchie intr-un graf neorientat?",
    options: ["O legatura fara sens intre doua varfuri", "Un varf izolat", "O legatura care merge doar intr-un sens"],
    answer: 0
  },
  {
    question: "Ce inseamna arcul A -> B intr-un graf orientat?",
    options: ["Se poate merge doar de la B la A", "Exista o legatura orientata de la A la B", "A si B sunt acelasi varf"],
    answer: 1
  },
  {
    question: "Cum este matricea de adiacenta pentru un graf neorientat?",
    options: ["Intotdeauna are doar zerouri", "Este simetrica fata de diagonala principala", "Are valori negative"],
    answer: 1
  },
  {
    question: "Ce masoara gradul unui varf intr-un graf neorientat?",
    options: ["Numarul muchiilor incidente cu acel varf", "Pozitia varfului in desen", "Numarul total de grafuri posibile"],
    answer: 0
  },
  {
    question: "Ce algoritm este folosit des pentru parcurgerea in latime a unui graf?",
    options: ["Dijkstra", "BFS", "Problema comis-voiajorului"],
    answer: 1
  }
];

function getNode(nodes, id) {
  return nodes.find((node) => node.id === id);
}

function isSameEdge(edge, nextEdge, mode) {
  const [from, to] = edge;
  const [nextFrom, nextTo] = nextEdge;
  if (mode === "directed") {
    return from === nextFrom && to === nextTo;
  }
  return (from === nextFrom && to === nextTo) || (from === nextTo && to === nextFrom);
}

function Matrix({ mode, nodes, edges }) {
  const matrix = nodes.map((row) =>
    nodes.map((col) => {
      const forward = edges.some(([from, to]) => from === row.id && to === col.id);
      const reverse = mode === "undirected" && edges.some(([from, to]) => from === col.id && to === row.id);
      return forward || reverse ? 1 : 0;
    })
  );

  return (
    <div
      className="matrix"
      aria-label="Matrice de adiacenta"
      style={{ gridTemplateColumns: `48px repeat(${nodes.length}, minmax(44px, 1fr))` }}
    >
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

function GraphEditor({ mode, nodes, edges, selectedIds, onSelectNode, onMoveNode }) {
  const [draggingId, setDraggingId] = useState(null);
  const svgRef = useRef(null);

  function getPointerPosition(event) {
    const rect = svgRef.current.getBoundingClientRect();
    return {
      x: Math.min(322, Math.max(28, ((event.clientX - rect.left) / rect.width) * 350)),
      y: Math.min(252, Math.max(28, ((event.clientY - rect.top) / rect.height) * 280))
    };
  }

  function handlePointerDown(event, id) {
    event.currentTarget.setPointerCapture(event.pointerId);
    setDraggingId(id);
    onSelectNode(id);
  }

  function handlePointerMove(event) {
    if (!draggingId) return;
    onMoveNode(draggingId, getPointerPosition(event));
  }

  function handlePointerUp(event) {
    if (draggingId && event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setDraggingId(null);
  }

  return (
    <svg
      ref={svgRef}
      className="graph-editor"
      viewBox="0 0 350 280"
      role="img"
      aria-label={`Editor de graf ${mode === "directed" ? "orientat" : "neorientat"}`}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => setDraggingId(null)}
    >
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#d54f2a" />
        </marker>
      </defs>
      <rect x="0" y="0" width="350" height="280" rx="18" fill="#f7fbfa" />
      <g>
        {edges.map(([from, to]) => {
          const start = getNode(nodes, from);
          const end = getNode(nodes, to);
          if (!start || !end) return null;
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
          <g
            key={node.id}
            className="node-control"
            onPointerDown={(event) => handlePointerDown(event, node.id)}
            onPointerUp={handlePointerUp}
          >
            <circle
              cx={node.x}
              cy={node.y}
              r="24"
              className={selectedIds.includes(node.id) ? "node-circle selected" : "node-circle"}
            />
            <text x={node.x} y={node.y + 7} textAnchor="middle" className="node-text">
              {node.id}
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
}

function DegreePanel({ mode, nodes, edges }) {
  const data = useMemo(() => {
    return nodes.map((node) => {
      if (mode === "undirected") {
        const degree = edges.filter(([a, b]) => a === node.id || b === node.id).length;
        return { id: node.id, degree };
      }
      const out = edges.filter(([from]) => from === node.id).length;
      const incoming = edges.filter(([, to]) => to === node.id).length;
      return { id: node.id, incoming, out };
    });
  }, [mode, nodes, edges]);

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

function KnowledgeQuiz() {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const answeredCount = Object.keys(answers).length;
  const score = quizQuestions.reduce((total, question, index) => {
    return total + (answers[index] === question.answer ? 1 : 0);
  }, 0);

  function chooseAnswer(questionIndex, optionIndex) {
    setAnswers((current) => ({
      ...current,
      [questionIndex]: optionIndex
    }));
    setSubmitted(false);
  }

  function resetQuiz() {
    setAnswers({});
    setSubmitted(false);
  }

  return (
    <section className="content-band quiz-band" id="test">
      <div className="section-heading">
        <p className="eyebrow">Verifica-te</p>
        <h2>Test de cunostinte</h2>
        <p>Raspunde la intrebarile de baza despre grafuri, apoi verifica scorul si vezi unde ai gresit.</p>
      </div>

      <div className="quiz-layout">
        <div className="quiz-questions">
          {quizQuestions.map((question, questionIndex) => {
            const selectedAnswer = answers[questionIndex];
            return (
              <article className="quiz-card" key={question.question}>
                <div className="quiz-question-head">
                  <span>{questionIndex + 1}</span>
                  <h3>{question.question}</h3>
                </div>
                <div className="quiz-options">
                  {question.options.map((option, optionIndex) => {
                    const isSelected = selectedAnswer === optionIndex;
                    const isCorrect = question.answer === optionIndex;
                    const showCorrect = submitted && isCorrect;
                    const showWrong = submitted && isSelected && !isCorrect;
                    return (
                      <button
                        className={[
                          isSelected ? "selected" : "",
                          showCorrect ? "correct" : "",
                          showWrong ? "wrong" : ""
                        ]
                          .filter(Boolean)
                          .join(" ")}
                        key={option}
                        type="button"
                        onClick={() => chooseAnswer(questionIndex, optionIndex)}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </article>
            );
          })}
        </div>

        <aside className="quiz-summary">
          <h3>Rezultat</h3>
          <strong>
            {submitted ? `${score}/${quizQuestions.length}` : `${answeredCount}/${quizQuestions.length}`}
          </strong>
          <p>
            {submitted
              ? score === quizQuestions.length
                ? "Perfect. Ai inteles conceptele principale."
                : "Revizuieste intrebarile marcate si incearca din nou."
              : "Completeaza raspunsurile, apoi apasa pe verificare."}
          </p>
          <button type="button" onClick={() => setSubmitted(true)} disabled={answeredCount !== quizQuestions.length}>
            Verifica raspunsurile
          </button>
          <button type="button" onClick={resetQuiz}>
            Reia testul
          </button>
        </aside>
      </div>
    </section>
  );
}

export default function App() {
  const [mode, setMode] = useState("undirected");
  const [graphs, setGraphs] = useState(initialGraphs);
  const [selectedIds, setSelectedIds] = useState([]);
  const [edgeDirection, setEdgeDirection] = useState("forward");
  const isDirected = mode === "directed";
  const currentGraph = graphs[mode];
  const selectedEdge =
    selectedIds.length === 2
      ? edgeDirection === "forward"
        ? selectedIds
        : [selectedIds[1], selectedIds[0]]
      : null;
  const selectedEdgeExists = selectedEdge
    ? currentGraph.edges.some((edge) => isSameEdge(edge, selectedEdge, mode))
    : false;

  function updateCurrentGraph(updater) {
    setGraphs((current) => ({
      ...current,
      [mode]: updater(current[mode])
    }));
  }

  function handleModeChange(nextMode) {
    setMode(nextMode);
    setSelectedIds([]);
    setEdgeDirection("forward");
  }

  function handleSelectNode(id) {
    setSelectedIds((current) => {
      if (current.includes(id)) {
        return current.filter((selectedId) => selectedId !== id);
      }
      return [...current, id].slice(-2);
    });
    setEdgeDirection("forward");
  }

  function handleMoveNode(id, position) {
    updateCurrentGraph((graph) => ({
      ...graph,
      nodes: graph.nodes.map((node) => (node.id === id ? { ...node, ...position } : node))
    }));
  }

  function getNextNodeId(nodes) {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    return alphabet.find((letter) => !nodes.some((node) => node.id === letter)) || `N${nodes.length + 1}`;
  }

  function addNode() {
    updateCurrentGraph((graph) => {
      const id = getNextNodeId(graph.nodes);
      const index = graph.nodes.length;
      return {
        ...graph,
        nodes: [
          ...graph.nodes,
          {
            id,
            x: 70 + (index % 4) * 72,
            y: 70 + Math.floor(index / 4) * 74
          }
        ]
      };
    });
  }

  function deleteSelection() {
    if (selectedIds.length === 0) return;
    updateCurrentGraph((graph) => ({
      nodes: graph.nodes.filter((node) => !selectedIds.includes(node.id)),
      edges: graph.edges.filter(([from, to]) => !selectedIds.includes(from) && !selectedIds.includes(to))
    }));
    setSelectedIds([]);
    setEdgeDirection("forward");
  }

  function toggleEdge(action) {
    if (!selectedEdge) return;
    updateCurrentGraph((graph) => {
      if (action === "remove") {
        return {
          ...graph,
          edges: graph.edges.filter((edge) => !isSameEdge(edge, selectedEdge, mode))
        };
      }
      const exists = graph.edges.some((edge) => isSameEdge(edge, selectedEdge, mode));
      if (exists) return graph;
      return {
        ...graph,
        edges: [...graph.edges, selectedEdge]
      };
    });
  }

  function resetGraph() {
    setGraphs((current) => ({
      ...current,
      [mode]: initialGraphs[mode]
    }));
    setSelectedIds([]);
    setEdgeDirection("forward");
  }

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
          <a href="#test">Test</a>
        </nav>
      </header>

      <main id="top">
        <section className="intro-section">
          <div className="intro-copy">
            <p className="eyebrow">Informatica - clasa a XI-a</p>
            <h1>Grafuri orientate si neorientate, explicate vizual</h1>
            <p>
              Invata rapid diferenta dintre muchii si arce, cum se citesc gradele varfurilor si cum arata matricea de
              adiacenta pentru fiecare tip de graf.
            </p>
            <div className="mode-switch" role="group" aria-label="Alege tipul grafului">
              <button className={!isDirected ? "selected" : ""} onClick={() => handleModeChange("undirected")} type="button">
                Neorientat
              </button>
              <button className={isDirected ? "selected" : ""} onClick={() => handleModeChange("directed")} type="button">
                Orientat
              </button>
            </div>
          </div>
          <div className="graph-panel" aria-live="polite">
            <GraphEditor
              mode={mode}
              nodes={currentGraph.nodes}
              edges={currentGraph.edges}
              selectedIds={selectedIds}
              onSelectNode={handleSelectNode}
              onMoveNode={handleMoveNode}
            />
            <div className="graph-caption">
              <strong>{isDirected ? "Arcele au directie" : "Muchiile nu au directie"}</strong>
              <span>
                Selecteaza doua noduri pentru o legatura, trage nodurile pentru a schimba forma grafului. Apasa din nou
                pe un nod selectat ca sa il deselectezi.
              </span>
            </div>
            {isDirected && selectedIds.length === 2 && (
              <div className="direction-switch" role="group" aria-label="Alege sensul arcului">
                <span>Sens arc</span>
                <button
                  className={edgeDirection === "forward" ? "selected" : ""}
                  type="button"
                  onClick={() => setEdgeDirection("forward")}
                >
                  {selectedIds[0]} {"->"} {selectedIds[1]}
                </button>
                <button
                  className={edgeDirection === "reverse" ? "selected" : ""}
                  type="button"
                  onClick={() => setEdgeDirection("reverse")}
                >
                  {selectedIds[1]} {"->"} {selectedIds[0]}
                </button>
              </div>
            )}
            <div className="graph-actions" aria-label="Instrumente pentru editarea grafului">
              <button type="button" onClick={addNode}>
                Adauga nod
              </button>
              <button type="button" onClick={() => toggleEdge("add")} disabled={!selectedEdge || selectedEdgeExists}>
                {isDirected && selectedEdge ? `Adauga ${selectedEdge[0]} -> ${selectedEdge[1]}` : "Leaga selectia"}
              </button>
              <button type="button" onClick={() => toggleEdge("remove")} disabled={!selectedEdgeExists}>
                {isDirected && selectedEdge ? `Sterge ${selectedEdge[0]} -> ${selectedEdge[1]}` : "Sterge legatura"}
              </button>
              <button type="button" onClick={deleteSelection} disabled={selectedIds.length === 0}>
                Sterge nod
              </button>
              <button type="button" onClick={resetGraph}>
                Reset
              </button>
            </div>
            <p className="selection-status">
              {selectedIds.length > 0 ? `Selectat: ${selectedIds.join(", ")}` : "Selecteaza un nod din graf."}
            </p>
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
              varfurilor, deci A {"->"} B este diferit de B {"->"} A.
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
            <Matrix mode={mode} nodes={currentGraph.nodes} edges={currentGraph.edges} />
            <div className="info-panel">
              <h3>Gradele varfurilor</h3>
              <DegreePanel mode={mode} nodes={currentGraph.nodes} edges={currentGraph.edges} />
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

        <KnowledgeQuiz />
      </main>

      <footer>
        <strong>Recapitulare:</strong> neorientat = muchii fara sens, orientat = arce cu sens.
      </footer>
    </div>
  );
}
