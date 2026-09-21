"use client";

import { useEffect, useState } from "react";
import { createSupabaseClient } from "@/lib/supabase/client";
import type { SiteSettings } from "@/lib/types";

const defaults: SiteSettings = {
  id: "4d0a4a7f-f7d6-4127-b7a2-6beef0a9c55c", farm_name: "", tagline: "", about_text: "", hero_image: "", contact_email: "", contact_phone: "", contact_address: "", instagram_url: "", facebook_url: "", created_at: "", updated_at: "",
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState(defaults);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    createSupabaseClient()?.from("site_settings").select("*").limit(1).maybeSingle().then(({ data }) => {
      if (data) setSettings(data as SiteSettings);
    });
  }, []);

  async function saveSettings(event: React.FormEvent) {
    event.preventDefault();
    setMessage("");
    setError("");
    const supabase = createSupabaseClient();
    if (!supabase) return;
    const { error: saveError } = await supabase.from("site_settings").upsert({
      id: settings.id,
      farm_name: settings.farm_name,
      tagline: settings.tagline,
      about_text: settings.about_text,
      hero_image: settings.hero_image,
      contact_email: settings.contact_email,
      contact_phone: settings.contact_phone,
      contact_address: settings.contact_address,
      instagram_url: settings.instagram_url,
      facebook_url: settings.facebook_url,
    });
    if (saveError) setError(saveError.message);
    else setMessage("Settings saved.");
  }

  function update(key: keyof SiteSettings, value: string) {
    setSettings((current) => ({ ...current, [key]: value }));
  }

  return (
    <main className="space-y-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-stone-500">Settings</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-stone-900">Farm profile</h1>
      </div>

      <form onSubmit={saveSettings} className="space-y-6 rounded-[22px] border border-stone-200 bg-white p-6 shadow-sm">
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-stone-700">Farm name</label>
            <input value={settings.farm_name} onChange={(event) => update("farm_name", event.target.value)} className="w-full rounded-xl border border-stone-200 bg-[#fafaf7] px-3 py-2.5 outline-none focus:border-[#2F5D3A]" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-stone-700">Tagline</label>
            <input value={settings.tagline} onChange={(event) => update("tagline", event.target.value)} className="w-full rounded-xl border border-stone-200 bg-[#fafaf7] px-3 py-2.5 outline-none focus:border-[#2F5D3A]" />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-stone-700">About text</label>
          <textarea rows={5} value={settings.about_text} onChange={(event) => update("about_text", event.target.value)} className="w-full rounded-xl border border-stone-200 bg-[#fafaf7] px-3 py-2.5 outline-none focus:border-[#2F5D3A]" />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-stone-700">Email</label>
            <input value={settings.contact_email} onChange={(event) => update("contact_email", event.target.value)} className="w-full rounded-xl border border-stone-200 bg-[#fafaf7] px-3 py-2.5 outline-none focus:border-[#2F5D3A]" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-stone-700">Phone</label>
            <input value={settings.contact_phone} onChange={(event) => update("contact_phone", event.target.value)} className="w-full rounded-xl border border-stone-200 bg-[#fafaf7] px-3 py-2.5 outline-none focus:border-[#2F5D3A]" />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-stone-700">Address</label>
          <input value={settings.contact_address} onChange={(event) => update("contact_address", event.target.value)} className="w-full rounded-xl border border-stone-200 bg-[#fafaf7] px-3 py-2.5 outline-none focus:border-[#2F5D3A]" />
        </div>

        {error && <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        {message && <p role="status" className="rounded-xl bg-[#edf3ed] px-3 py-2 text-sm text-[#2F5D3A]">{message}</p>}
        <button type="submit" className="rounded-full bg-[#2F5D3A] px-4 py-2.5 text-sm font-medium text-white">Save settings</button>
      </form>
    </main>
  );
}
