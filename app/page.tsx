import { BackupForm } from "@/components/backup-form";
import { FireDumpLogo } from "@/components/firedump-logo";

const githubRepositoryUrl = "https://github.com/wookingwoo/firedump";

const features = [
  "Upload or paste your service account and export in one shot.",
  "Target a top-level collection or a nested path like teams/acme/members.",
  "Receive a clean JSON file immediately with no server-side credential storage.",
];

const steps = [
  {
    title: "Connect",
    body: "Upload a Firebase service account JSON, or paste it directly with your Firebase project ID.",
  },
  {
    title: "Choose scope",
    body: "Export a single collection path when you need a quick snapshot or migration seed.",
  },
  {
    title: "Download",
    body: "FireDump streams the backup as a JSON file so you can archive it anywhere.",
  },
];

export default function Home() {
  return (
    <main className="shell">
      <header className="brand-bar">
        <FireDumpLogo />
      </header>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Firestore backup, minus the scripting</p>
          <h1>FireDump turns Firestore access into a portable file in minutes.</h1>
          <p className="lede">
            Built for operators, founders, and engineers who need a backup now, not
            after wiring up a one-off CLI.
          </p>
          <ul className="feature-list">
            {features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </div>
        <div className="hero-card">
          <div className="metric">
            <span>Output</span>
            <strong>JSON backup</strong>
          </div>
          <div className="metric">
            <span>Credentials</span>
            <strong>In-memory only</strong>
          </div>
          <div className="metric">
            <span>Deployment</span>
            <strong>Vercel-ready</strong>
          </div>
          <div className="github-callout">
            <p className="eyebrow">GitHub</p>
            <h2>Follow the product in public.</h2>
            <p>
              Review the source, share the repository, and keep the project link
              close at hand while you operate FireDump.
            </p>
            <a
              className="github-link"
              href={githubRepositoryUrl}
              target="_blank"
              rel="noreferrer"
            >
              github.com/wookingwoo/firedump
            </a>
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Launch MVP</p>
            <h2>Create a backup file</h2>
          </div>
          <p className="panel-copy">
            The service account JSON is processed on the server and discarded after
            the request finishes.
          </p>
        </div>
        <BackupForm />
      </section>

      <section className="steps">
        {steps.map((step, index) => (
          <article key={step.title} className="step-card">
            <span className="step-index">0{index + 1}</span>
            <h3>{step.title}</h3>
            <p>{step.body}</p>
          </article>
        ))}
      </section>

      <footer className="site-footer">
        <p>FireDump is available as a public repository on GitHub.</p>
        <a href={githubRepositoryUrl} target="_blank" rel="noreferrer">
          View the repository
        </a>
      </footer>
    </main>
  );
}
