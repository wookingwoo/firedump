"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

type Status =
  | { type: "idle"; message: string }
  | { type: "loading"; message: string }
  | { type: "error"; message: string }
  | { type: "success"; message: string };

const initialStatus: Status = {
  type: "idle",
  message: "Your backup file will download as soon as the export completes.",
};

const credentialSteps = [
  "Open Firebase Console and select your project.",
  "Go to Project settings and open the Service accounts tab.",
  'Click "Generate new private key" and confirm the download.',
  "Open the downloaded JSON file and paste the full contents here.",
];

export function BackupForm() {
  const [status, setStatus] = useState<Status>(initialStatus);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isGuideOpen) {
      return undefined;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsGuideOpen(false);
      }
    }

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isGuideOpen]);

  function closeGuide() {
    setIsGuideOpen(false);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus({ type: "loading", message: "Exporting Firestore data..." });

    const formData = new FormData(event.currentTarget);
    const payload = {
      projectId: formData.get("projectId"),
      collectionPath: formData.get("collectionPath"),
      serviceAccountJson: formData.get("serviceAccountJson"),
    };

    try {
      const response = await fetch("/api/backup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(error?.error ?? "Backup failed.");
      }

      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);
      const contentDisposition = response.headers.get("Content-Disposition");
      const fileNameMatch = contentDisposition?.match(/filename="([^"]+)"/)?.[1];
      const link = document.createElement("a");

      link.href = downloadUrl;
      link.download = fileNameMatch ?? "firedump-backup.json";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(downloadUrl);

      setStatus({
        type: "success",
        message: "Backup complete. Your JSON file has been downloaded.",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong while exporting your backup.",
      });
    }
  }

  return (
    <form className="backup-form" onSubmit={handleSubmit}>
      <label>
        Firebase project ID
        <input
          name="projectId"
          type="text"
          placeholder="my-firestore-project"
          required
        />
      </label>

      <label>
        Collection path
        <input
          name="collectionPath"
          type="text"
          placeholder="users or teams/acme/members"
          required
        />
      </label>

      <label>
        <span className="field-heading">
          <span>Service account JSON</span>
          <button
            type="button"
            className="help-trigger"
            aria-label="How to get your service account JSON"
            aria-haspopup="dialog"
            aria-expanded={isGuideOpen}
            onClick={() => setIsGuideOpen(true)}
          >
            ?
          </button>
        </span>
        <textarea
          name="serviceAccountJson"
          rows={12}
          placeholder='{"type":"service_account","project_id":"my-firestore-project",...}'
          required
        />
      </label>

      <button
        type="submit"
        className="submit-button"
        disabled={status.type === "loading"}
      >
        {status.type === "loading" ? "Exporting..." : "Download backup"}
      </button>

      <p className={`form-status status-${status.type}`}>{status.message}</p>

      {isGuideOpen ? (
        <div
          className="modal-backdrop"
          onClick={closeGuide}
          role="presentation"
        >
          <div
            className="guide-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="service-account-guide-title"
            ref={dialogRef}
            onClick={(event) => event.stopPropagation()}
            tabIndex={-1}
          >
            <div className="guide-modal-header">
              <div>
                <p className="eyebrow">Need credentials?</p>
                <h3 id="service-account-guide-title">
                  How to get your service account JSON
                </h3>
              </div>
              <button
                type="button"
                className="modal-close"
                aria-label="Close guide"
                onClick={closeGuide}
              >
                Close
              </button>
            </div>

            <ol className="guide-list">
              {credentialSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>

            <div className="guide-note">
              <strong>Firebase path</strong>
              <p>
                Firebase Console → Project settings → Service accounts → Generate
                new private key
              </p>
            </div>

            <div className="guide-note guide-note-warning">
              <strong>Security note</strong>
              <p>
                Treat this JSON like a secret. Do not commit it to Git, send it in
                chat, or store it in a shared doc.
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </form>
  );
}
