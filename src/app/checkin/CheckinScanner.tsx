"use client";

import { useEffect, useRef, useState } from "react";
import jsQR from "jsqr";

type LiveSession = {
  id: string;
  type: "match" | "movie_showing";
  name: string;
  eventDate: string;
};

type ScanResult = {
  result: "ok" | "already_used" | "invalid";
  message: string;
  checkedInAt?: string;
} | null;

export default function CheckinScanner() {
  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [sessionId, setSessionId] = useState<string>("");
  const [scanning, setScanning] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<ScanResult>(null);
  const [busy, setBusy] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const lastDecodedRef = useRef<{ value: string; at: number }>({ value: "", at: 0 });
  const busyRef = useRef(false);
  const sessionIdRef = useRef(sessionId);

  useEffect(() => {
    sessionIdRef.current = sessionId;
  }, [sessionId]);

  useEffect(() => {
    fetch("/api/sessions")
      .then((r) => r.json())
      .then((data) => {
        const list: LiveSession[] = data.sessions ?? [];
        setSessions(list);
        if (list.length > 0) setSessionId(list[0].id);
      })
      .catch(() => setCameraError("Couldn't load sessions."));
  }, []);

  useEffect(() => {
    if (!scanning) return;
    let stream: MediaStream | null = null;
    let cancelled = false;

    async function handleDecoded(payload: string) {
      if (!sessionIdRef.current) return;
      busyRef.current = true;
      setBusy(true);
      try {
        const res = await fetch("/api/checkin/scan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: payload, sessionId: sessionIdRef.current }),
        });
        const data = await res.json();
        setLastResult(data);
      } catch {
        setLastResult({ result: "invalid", message: "Network error, try again" });
      } finally {
        busyRef.current = false;
        setBusy(false);
      }
    }

    function tick() {
      if (cancelled) return;
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (video && canvas && video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          if (code && code.data) {
            const now = Date.now();
            const isDuplicateRecent =
              code.data === lastDecodedRef.current.value && now - lastDecodedRef.current.at < 2500;
            if (!isDuplicateRecent && !busyRef.current) {
              lastDecodedRef.current = { value: code.data, at: now };
              void handleDecoded(code.data);
            }
          }
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    }

    async function start() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        rafRef.current = requestAnimationFrame(tick);
      } catch {
        setCameraError("Couldn't access the camera, check browser permissions.");
        setScanning(false);
      }
    }
    start();

    return () => {
      cancelled = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, [scanning]);

  const activeSession = sessions.find((s) => s.id === sessionId);

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col gap-6 px-5 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-navy">Check-in</h1>
        <form action="/api/checkin/logout" method="post">
          <button type="submit" className="text-sm font-semibold text-navy/60 underline hover:text-navy">
            Log out
          </button>
        </form>
      </div>

      <div>
        <label htmlFor="session" className="text-sm font-bold uppercase tracking-wide text-navy/60">
          Gate / session
        </label>
        <select
          id="session"
          value={sessionId}
          onChange={(e) => setSessionId(e.target.value)}
          className="mt-1 w-full rounded-button border border-navy/20 bg-white px-3 py-2.5 text-navy"
        >
          {sessions.map((s) => (
            <option key={s.id} value={s.id}>
              {s.type === "match" ? "Charity Match" : s.name}
            </option>
          ))}
        </select>
      </div>

      {!scanning ? (
        <button
          type="button"
          onClick={() => {
            setCameraError(null);
            setLastResult(null);
            setScanning(true);
          }}
          disabled={!sessionId}
          className="rounded-button bg-navy px-6 py-4 text-base font-bold text-cream disabled:opacity-50"
        >
          Start scanning
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setScanning(false)}
          className="rounded-button border-2 border-navy px-6 py-3 text-sm font-bold text-navy"
        >
          Stop scanning
        </button>
      )}

      {cameraError && <p className="text-sm font-medium text-red-700">{cameraError}</p>}

      {scanning && (
        <div className="relative overflow-hidden rounded-card bg-black">
          <video ref={videoRef} muted playsInline className="aspect-square w-full object-cover" />
          <canvas ref={canvasRef} className="hidden" />
          {busy && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-sm font-bold text-white">
              Checking…
            </div>
          )}
        </div>
      )}

      {lastResult && (
        <div
          role="status"
          className={`rounded-card p-4 text-center font-bold ${
            lastResult.result === "ok"
              ? "bg-green/40 text-navy"
              : lastResult.result === "already_used"
                ? "bg-yellow/60 text-navy"
                : "bg-red-100 text-red-800"
          }`}
        >
          {lastResult.result === "ok" && "✓ Checked in"}
          {lastResult.result === "already_used" && `Already used${lastResult.checkedInAt ? ` at ${new Date(lastResult.checkedInAt).toLocaleTimeString()}` : ""}`}
          {lastResult.result === "invalid" && lastResult.message}
        </div>
      )}

      {activeSession && (
        <p className="text-center text-xs text-navy/50">
          Scanning for: {activeSession.type === "match" ? "Charity Match" : activeSession.name}
        </p>
      )}
    </div>
  );
}
