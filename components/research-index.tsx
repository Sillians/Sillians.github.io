import Link from "next/link";
import type { ContentItem } from "@/lib/content";

const researchTopics = [
  { name: "Vision", areas: ["CNNs"] },
  {
    name: "LLMs",
    areas: [
      "Transformers",
      "Language modeling + scaling",
      "LLM judges",
      "Prompt engineering",
      "Prompt optimization",
      "Fine-tuning + PEFT",
      "SFT + quantized tuning",
    ],
  },
  { name: "RAG", areas: ["RAG foundations", "RAG evaluation"] },
  { name: "Multimodal", areas: [] },
  { name: "Reasoning", areas: [] },
  {
    name: "RL",
    areas: [
      "RLHF + preference tuning",
      "RL foundations + CUDA basics",
      "RL for reasoning + CUDA kernels",
      "Inference optimization + CUDA intuition",
    ],
  },
  { name: "Agents", areas: ["Agents + tool use", "Agent evaluation"] },
  { name: "Backprop + autograd", areas: [] },
  { name: "Optimizers + training loops", areas: [] },
  {
    name: "AI Evaluation",
    areas: ["AI evaluation methodology", "Evaluating AI systems"],
  },
];

export function ResearchIndex({ items }: { items: ContentItem[] }) {
  const populatedTopics = researchTopics
    .map((topic) => ({
      ...topic,
      papers: items.filter((item) => item.topic === topic.name),
    }))
    .filter((topic) => topic.papers.length > 0);

  return (
    <>
      <section className="topic-map" aria-labelledby="topic-map-title">
        <div className="research-section-label">
          <span className="section-index">TOPIC MAP</span>
          <p id="topic-map-title">A working syllabus for the systems I study.</p>
        </div>
        <div className="topic-grid">
          {researchTopics.map((topic, index) => (
            <div className="topic-block" key={topic.name}>
              <div className="topic-heading">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h2>{topic.name}</h2>
              </div>
              {topic.areas.length > 0 && (
                <ul>
                  {topic.areas.map((area) => <li key={area}>{area}</li>)}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="research-library" aria-labelledby="research-library-title">
        <div className="research-section-label">
          <span className="section-index">PAPER NOTES</span>
          <p id="research-library-title">Structured readings, grouped by the question they help answer.</p>
        </div>
        {populatedTopics.map((topic) => (
          <div className="research-group" key={topic.name}>
            <div className="research-group-heading">
              <h2>{topic.name}</h2>
              <span>{topic.papers.length} {topic.papers.length === 1 ? "note" : "notes"}</span>
            </div>
            <div>
              {topic.papers.map((item) => (
                <Link className="research-paper-row" href={`/research/${item.slug}`} key={item.slug}>
                  <div className="paper-meta">
                    <span>{item.subtopic || topic.name}</span>
                    <span>{item.date}</span>
                  </div>
                  <div>
                    <span className="paper-kicker">{item.paper || "Paper notes"}</span>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                  <span aria-hidden="true">↗</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
