"use client";
import posthog from "posthog-js";

let inited = false;

export function initPH() {
  if (inited) return;
  
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) {
    console.log("[PostHog] No API key provided, analytics disabled");
    return;
  }

  try {
    posthog.init(key, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com",
      capture_pageview: true,
      capture_pageleave: true,
      autocapture: true,
      disable_session_recording: false,
      session_recording: {
        maskAllInputs: true,
        maskInputOptions: {
          password: true,
        },
      },
    });
    inited = true;
    console.log("[PostHog] Initialized successfully");
  } catch (error) {
    console.error("[PostHog] Initialization failed:", error);
  }
}

export function track(ev: string, props?: Record<string, unknown>) {
  try {
    initPH();
    posthog.capture(ev, props);
    console.log(`[PostHog] Event tracked: ${ev}`, props);
  } catch (error) {
    console.error("[PostHog] Tracking failed:", error);
  }
}

export function identify(userId: string, properties?: Record<string, unknown>) {
  try {
    initPH();
    posthog.identify(userId, properties);
    console.log(`[PostHog] User identified: ${userId}`, properties);
  } catch (error) {
    console.error("[PostHog] Identify failed:", error);
  }
}

export function setUserProperties(properties: Record<string, unknown>) {
  try {
    initPH();
    posthog.people.set(properties);
    console.log(`[PostHog] Properties set:`, properties);
  } catch (error) {
    console.error("[PostHog] Set properties failed:", error);
  }
}

export function reset() {
  try {
    initPH();
    posthog.reset();
    console.log("[PostHog] User reset");
  } catch (error) {
    console.error("[PostHog] Reset failed:", error);
  }
}

// Server-side/event table tracker (Supabase)
export async function trackEvent(user_id: string | null, event: string, meta?: Record<string, unknown>) {
  try {
    const { supabase } = await import("@/lib/supabaseClient");
    await supabase.from("analytics_events").insert([{ user_id, event, meta }]);
  } catch (e) {
    console.warn("[trackEvent] insert failed", e);
  }
}