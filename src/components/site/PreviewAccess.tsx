"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import styles from "./PreviewAccess.module.css";

export function PreviewAccess() {
  const router = useRouter();
  const [key, setKey] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: key.trim() }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setError(data.error ?? "Access denied.");
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <p className={styles.kicker}>Team access</p>
        <h1 className={styles.title}>Preview the full site</h1>
        <p className={styles.lead}>
          Enter your private access key to browse samarammar while the public sees the
          under-development page.
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.label} htmlFor="preview-key">
            Access key
          </label>
          <input
            id="preview-key"
            className={styles.input}
            type="password"
            name="key"
            autoComplete="current-password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Enter key"
            required
          />
          {error ? <p className={styles.error}>{error}</p> : null}
          <button className={styles.button} type="submit" disabled={loading}>
            {loading ? "Verifying…" : "Enter site"}
          </button>
        </form>
      </div>
    </main>
  );
}
