"use client";

import { useMemo, useState } from "react";
import styles from "../site/site.module.css";

const guestLimits = { min: 1, max: 8 };

export function ReservationForm() {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);

  const summary = useMemo(() => {
    const inDate = checkIn || "No check-in";
    const outDate = checkOut || "No check-out";
    return `${inDate} - ${outDate} · ${guests} guest${guests > 1 ? "s" : ""}`;
  }, [checkIn, checkOut, guests]);

  const adjustGuests = (delta: number) => {
    setGuests((current) =>
      Math.min(guestLimits.max, Math.max(guestLimits.min, current + delta)),
    );
  };

  return (
    <form className={styles.bookingForm} aria-label="Reservation form">
      <label className={styles.field}>
        <span className={styles.fieldLabel}>Check-in</span>
        <input
          type="date"
          value={checkIn}
          onChange={(event) => setCheckIn(event.target.value)}
          min={new Date().toISOString().split("T")[0]}
        />
      </label>

      <label className={styles.field}>
        <span className={styles.fieldLabel}>Check-out</span>
        <input
          type="date"
          value={checkOut}
          onChange={(event) => setCheckOut(event.target.value)}
          min={checkIn || new Date().toISOString().split("T")[0]}
        />
      </label>

      <div className={styles.field}>
        <span className={styles.fieldLabel}>Guests</span>
        <div className={styles.stepper}>
          <button
            type="button"
            onClick={() => adjustGuests(-1)}
            disabled={guests <= guestLimits.min}
          >
            -
          </button>
          <span aria-live="polite">{guests}</span>
          <button
            type="button"
            onClick={() => adjustGuests(1)}
            disabled={guests >= guestLimits.max}
          >
            +
          </button>
        </div>
      </div>

      <p className={styles.bookingSummary}>{summary}</p>

      <button type="submit" className={styles.reserveButton} data-cursor-label="Reserve">
        Reserve
      </button>
    </form>
  );
}
