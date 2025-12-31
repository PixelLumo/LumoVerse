import { supabase } from './supabase.js';
import { ADMIN_EMAILS } from "./admin-config.js";

// Sign up
export async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  // Generate referral code
  function generateCode() {
    return Math.random().toString(36).substring(2, 8);
  }
  const userId = data.user?.id;
  if (userId) {
    // Insert profile with referral code
    await supabase.from("profiles").insert({
      user_id: userId,
      referral_code: generateCode()
    });
    // Handle referral
    const ref = localStorage.getItem("referral");
    if (ref) {
      await supabase.from("profiles").update({
        referred_by: ref
      }).eq("user_id", userId);
      // Reward both users
      await supabase.rpc("increment_referral", { ref_code: ref });
    }
  }

  return data;
}

// Handle referral link on landing
export function handleReferralLink() {
  const ref = new URLSearchParams(window.location.search).get("ref");
  if (ref) localStorage.setItem("referral", ref);
}

// Sign in
export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

// Sign out
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

// Current user
export function getUser() {
  return supabase.auth.getUser();
}

// Online users heartbeat

export async function startOnlineHeartbeat() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  const update = async () => {
    await supabase.from("online_users").upsert({
      user_id: user.id,
      last_seen: new Date().toISOString()
    });
    await supabase.from("profiles").update({
      last_seen: new Date().toISOString()
    }).eq("user_id", user.id);
  };
  update();
  setInterval(update, 30000);
}


// Client-side admin-only guard
export async function guardAdminOnly() {
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", user.id)
      .single();
    if (!profile || profile.role !== "admin") {
      document.querySelectorAll(".admin-only")
        .forEach(e => e.remove());
    }
  }
}

// Frontend perk locking by tier
export function applyTier(tier) {
  document.querySelectorAll('[class$="-only"]').forEach(el => {
    const required = el.className.replace("-only", "");
    if (required !== tier && tier !== "creator") {
      el.remove();
    }
  });
}

export function login(email) {
  const isAdmin = ADMIN_EMAILS.includes(email.toLowerCase());
  localStorage.setItem("user", JSON.stringify({
    email,
    role: isAdmin ? "admin" : "user"
  }));
  if (isAdmin) {
    window.location.href = "admin.html";
  } else {
    window.location.href = "start.html";
  }
}
