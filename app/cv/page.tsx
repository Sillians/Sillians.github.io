import type { Metadata } from "next";
import { CvActions } from "@/components/cv-actions";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "CV",
  description: "Basil Ihuoma's CV — Machine Learning Engineer.",
};

const experience = [
  {
    role: "Machine Learning Engineer | LLM Trainer",
    company: "Turing Enterprises Inc.",
    location: "Palo Alto, California (Remote)",
    dates: "Jan. 2023 - Present",
    points: [
      "Architected a production ML platform covering data pipelines, Feast + Redis feature store, distributed training, MLflow registry, Prefect orchestration, scalable inference, monitoring, and rollback.",
      "Designed cost-aware, reliability-first ML systems, optimizing Spark + Delta Lake pipelines, model serving, and monitoring for performance, fault tolerance, and cloud efficiency.",
      "Contributed to LLM post-training workflows (RLHF), supporting data pipelines, evaluation loops, and scalable training infrastructure.",
      "Built decision-centric ML systems that convert model outputs into optimization objectives, policy logic, and automated control loops.",
      "Productionized quantitative time-series forecasting systems with leakage prevention and live data/model drift monitoring.",
    ],
  },
  {
    role: "Data | MLOps Engineer",
    company: "Hamoye AI Labs.",
    location: "Hamilton, Bermuda (Remote)",
    dates: "May 2020 - Dec. 2022",
    points: [
      "Architected and operated distributed data and ML platforms on AWS using Spark, Delta Lake, Kafka, and Kubernetes.",
      "Designed event-driven ingestion systems for global datasets, reducing manual data handling by 70%+.",
      "Implemented Spark-on-Kubernetes workloads with resource-aware scheduling.",
      "Built secure Delta Sharing architecture for governed, cross-team data access.",
      "Established Dockerized services, Git workflows, CI/CD pipelines, and data-pipeline testing standards.",
    ],
  },
  {
    role: "Data Scientist | Engineer",
    company: "Hamoye AI Labs.",
    location: "Hamilton, Bermuda (Remote)",
    dates: "Feb. 2019 - Apr. 2020",
    points: [
      "Built end-to-end time-series forecasting workflows using ARIMA, SARIMA, and LSTM.",
      "Developed Kubeflow pipelines for scalable, reproducible ML training.",
      "Engineered automated acquisition pipelines for remote sensing and climate raster data.",
      "Designed preprocessing frameworks for multivariate forecasting.",
      "Standardized ML codebases with modular design, version control, and testing.",
    ],
  },
  {
    role: "Data Scientist | Analyst (Intern)",
    company: "Alara Lagos.",
    location: "Victoria Island, Lagos, Nigeria",
    dates: "Feb. 2018 - Jan. 2019",
    points: [
      "Built analytics pipelines and dashboards that reduced profit leakage by 8%.",
      "Designed customer and product segmentation models.",
      "Developed marketing mix models that contributed to a 20% improvement in marketing ROI.",
      "Automated reporting workflows, improving operational efficiency by 7%.",
      "Delivered production-grade dashboards with validated data sources and consistent metric definitions.",
    ],
  },
];

const skills = [
  ["Languages", "Python, SQL, C++"],
  ["ML/AI", "PyTorch, TensorFlow, Scikit-Learn, Hugging Face, LLM Post-Training (RLHF)"],
  ["ML Systems & MLOps", "MLflow, Prefect, Feast, Redis, CI/CD, Experiment Tracking"],
  ["Data Engineering", "Apache Spark, Kafka, Delta Lake, PostgreSQL, Snowflake"],
  ["Cloud & Infrastructure", "AWS, Kubernetes, Docker, Terraform"],
  ["Serving & Monitoring", "BentoML, FastAPI, Prometheus, Grafana, Evidently, Great Expectations"],
];

export default function CvPage() {
  return (
    <>
      <SiteHeader />
      <main className="cv-page shell">
        <div className="cv-toolbar">
          <div>
            <span className="section-index">CURRICULUM VITAE / 2026</span>
            <p>Web version · PDF available for download or printing</p>
          </div>
          <CvActions />
        </div>

        <article className="cv-sheet">
          <header className="cv-header">
            <div>
              <h1>Basil Ihuoma</h1>
              <p>Machine Learning Engineer</p>
            </div>
            <div className="cv-contact">
              <a href="mailto:ihuomacbasil@gmail.com">ihuomacbasil@gmail.com</a>
              <a href="https://github.com/Sillians">github.com/Sillians</a>
              <a href="https://www.linkedin.com/in/basil-ihuoma-004356ab/">LinkedIn</a>
            </div>
          </header>

          <section className="cv-section cv-summary">
            <h2>Summary</h2>
            <p>
              Machine Learning Engineer with 6+ years of experience building scalable,
              production-grade ML systems end-to-end. Expertise in distributed training,
              ML platforms, feature stores, model lifecycle management, and decision-driven
              ML systems, with a focus on reliability, cost-efficiency, and software
              engineering excellence.
            </p>
          </section>

          <section className="cv-section">
            <h2>Professional experience</h2>
            <div className="cv-experience">
              {experience.map((job) => (
                <section className="cv-role" key={`${job.company}-${job.role}`}>
                  <div className="cv-role-heading">
                    <div><h3>{job.role}</h3><p>{job.company}</p></div>
                    <div><strong>{job.dates}</strong><p>{job.location}</p></div>
                  </div>
                  <ul>{job.points.map((point) => <li key={point}>{point}</li>)}</ul>
                </section>
              ))}
            </div>
          </section>

          <section className="cv-section">
            <h2>Technical skills</h2>
            <dl className="cv-skills">
              {skills.map(([label, value]) => (
                <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
              ))}
            </dl>
          </section>

          <section className="cv-section cv-two-column">
            <div>
              <h2>Education</h2>
              <h3>Federal University of Technology, Owerri</h3>
              <p>B.Tech., Information Management Technology · 4.2 / 5.0</p>
              <span>Nov. 2012 - Nov. 2017 · Imo State, Nigeria</span>
            </div>
            <div>
              <h2>Certifications</h2>
              <ul>
                <li>Scientific Computing & Python for Data Science — WorldQuant University, 2020</li>
                <li>Cloud DevOps Engineer — Udacity, 2022</li>
                <li>Mathematics for Machine Learning Track — Maths Academy</li>
              </ul>
            </div>
          </section>
        </article>
      </main>
    </>
  );
}
