"use client";

import { FormEvent, useState } from "react";

type Status =
  | { type: "idle"; message: string }
  | { type: "loading"; message: string }
  | { type: "error"; message: string }
  | { type: "success"; message: string };

const initialStatus: Status = {
  type: "idle",
  message: "Your backup file will download as soon as the export completes.",
};

export function BackupForm() {
  const [status, setStatus] = useState<Status>(initialStatus);

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
        Service account JSON
        <textarea
          name="serviceAccountJson"
          rows={12}
          placeholder='{"type":"service_account","project_id":"my-firestore-project",...}'
          required
        />
      </label>

      <button type="submit" disabled={status.type === "loading"}>
        {status.type === "loading" ? "Exporting..." : "Download backup"}
      </button>

      <p className={`form-status status-${status.type}`}>{status.message}</p>
    </form>
  );
}
