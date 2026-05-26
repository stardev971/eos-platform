"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import {
  Settings,
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Key,
  Mail,
  Smartphone,
  Monitor,
  Moon,
  Sun,
  CheckCircle2,
  Camera,
  Building2,
} from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [saved, setSaved] = useState(false);

  const showSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "organization", label: "Organization", icon: Building2 },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-surface-600 to-surface-800 flex items-center justify-center">
            <Settings className="w-4.5 h-4.5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-surface-900 tracking-tight">Settings</h1>
            <p className="text-xs text-surface-500">Manage your account and platform preferences</p>
          </div>
        </div>
      </motion.div>

      {/* Saved Toast */}
      {saved && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="fixed top-20 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-sm font-medium text-emerald-700 shadow-lg"
        >
          <CheckCircle2 className="w-4 h-4" /> Settings saved successfully
        </motion.div>
      )}

      <div className="flex gap-5">
        {/* Tab Nav */}
        <div className="w-48 shrink-0 space-y-0.5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-brand-50 text-brand-700"
                  : "text-surface-600 hover:bg-surface-100 hover:text-surface-900"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === "profile" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="glass-card p-6">
                <h2 className="text-lg font-semibold text-surface-900 mb-5">Profile Information</h2>
                <div className="flex items-center gap-5 mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white text-2xl font-bold">
                    {user?.avatar || "AM"}
                  </div>
                  <div>
                    <button className="btn-secondary text-xs flex items-center gap-1.5">
                      <Camera className="w-3.5 h-3.5" /> Change Photo
                    </button>
                    <p className="text-[10px] text-surface-400 mt-1.5">JPG, PNG up to 2MB</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-surface-600 mb-1.5">Full Name</label>
                    <input className="input-field text-sm" defaultValue={user?.name || "Alex Morgan"} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-surface-600 mb-1.5">Email Address</label>
                    <input className="input-field text-sm" defaultValue={user?.email || "ceo@saascompany.com"} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-surface-600 mb-1.5">Role / Title</label>
                    <input className="input-field text-sm" defaultValue="Chief Executive Officer" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-surface-600 mb-1.5">Phone</label>
                    <input className="input-field text-sm" defaultValue="+1 (555) 012-3456" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-surface-600 mb-1.5">Bio</label>
                    <textarea className="input-field text-sm h-20 resize-none" defaultValue="CEO & Co-founder at SaaSCo Inc. Passionate about building data-driven operational systems for modern SaaS companies." />
                  </div>
                </div>
                <div className="flex justify-end mt-5">
                  <button onClick={showSaved} className="btn-primary text-sm">Save Changes</button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "notifications" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="glass-card p-6">
                <h2 className="text-lg font-semibold text-surface-900 mb-5">Notification Preferences</h2>
                {[
                  { category: "Churn Alerts", items: [
                    { label: "Critical churn risk detected", desc: "When a customer reaches >75% churn score", email: true, push: true, slack: true },
                    { label: "Payment failure alerts", desc: "When a customer has consecutive payment failures", email: true, push: true, slack: true },
                    { label: "Engagement cliff warnings", desc: "When product usage drops >30% in 30 days", email: true, push: false, slack: true },
                  ]},
                  { category: "Revenue Events", items: [
                    { label: "Expansion opportunities", desc: "When AI detects upsell potential", email: true, push: false, slack: false },
                    { label: "Renewal reminders", desc: "30/60/90 days before contract renewal", email: true, push: true, slack: true },
                    { label: "Profitability alerts", desc: "When a customer margin drops below threshold", email: true, push: false, slack: true },
                  ]},
                  { category: "System", items: [
                    { label: "Integration sync errors", desc: "When a connected platform fails to sync", email: true, push: true, slack: false },
                    { label: "Weekly executive digest", desc: "Summary of key metrics every Monday", email: true, push: false, slack: false },
                  ]},
                ].map((section) => (
                  <div key={section.category} className="mb-6 last:mb-0">
                    <h3 className="text-sm font-semibold text-surface-900 mb-3">{section.category}</h3>
                    <div className="space-y-3">
                      {section.items.map((item) => (
                        <div key={item.label} className="flex items-center justify-between p-3 rounded-lg bg-surface-50 border border-surface-100">
                          <div>
                            <div className="text-sm font-medium text-surface-800">{item.label}</div>
                            <div className="text-xs text-surface-500">{item.desc}</div>
                          </div>
                          <div className="flex items-center gap-4">
                            {[
                              { key: "email", icon: Mail, val: item.email },
                              { key: "push", icon: Smartphone, val: item.push },
                              { key: "slack", icon: Monitor, val: item.slack },
                            ].map((ch) => (
                              <label key={ch.key} className="flex items-center gap-1.5 cursor-pointer">
                                <input type="checkbox" defaultChecked={ch.val} className="w-4 h-4 rounded border-surface-300 text-brand-600 focus:ring-brand-500" />
                                <ch.icon className="w-3.5 h-3.5 text-surface-400" />
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <div className="flex justify-end mt-5">
                  <button onClick={showSaved} className="btn-primary text-sm">Save Preferences</button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "security" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="glass-card p-6">
                <h2 className="text-lg font-semibold text-surface-900 mb-5">Security Settings</h2>
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-surface-50 border border-surface-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Key className="w-5 h-5 text-surface-500" />
                        <div>
                          <div className="text-sm font-medium text-surface-900">Password</div>
                          <div className="text-xs text-surface-500">Last changed 45 days ago</div>
                        </div>
                      </div>
                      <button className="btn-secondary text-xs">Change Password</button>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-surface-50 border border-surface-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-emerald-500" />
                        <div>
                          <div className="text-sm font-medium text-surface-900">Two-Factor Authentication</div>
                          <div className="text-xs text-emerald-600 font-medium">Enabled via authenticator app</div>
                        </div>
                      </div>
                      <button className="btn-secondary text-xs">Manage 2FA</button>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-surface-50 border border-surface-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Globe className="w-5 h-5 text-surface-500" />
                        <div>
                          <div className="text-sm font-medium text-surface-900">Active Sessions</div>
                          <div className="text-xs text-surface-500">2 active sessions across devices</div>
                        </div>
                      </div>
                      <button className="btn-secondary text-xs">View Sessions</button>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-surface-50 border border-surface-100">
                    <h3 className="text-sm font-semibold text-surface-900 mb-3">API Access</h3>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-white border border-surface-200">
                      <code className="flex-1 text-xs font-mono text-surface-600 truncate">eos_live_sk_7f8a••••••••••••••••3b2d</code>
                      <button className="text-xs text-brand-600 font-medium hover:text-brand-700">Reveal</button>
                      <button className="text-xs text-brand-600 font-medium hover:text-brand-700">Regenerate</button>
                    </div>
                    <p className="text-[10px] text-surface-400 mt-2">Your API key grants full access. Keep it secure.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "appearance" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="glass-card p-6">
                <h2 className="text-lg font-semibold text-surface-900 mb-5">Appearance</h2>
                <div className="space-y-5">
                  <div>
                    <label className="text-sm font-medium text-surface-700 mb-3 block">Theme</label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: "Light", icon: Sun, active: true },
                        { label: "Dark", icon: Moon, active: false },
                        { label: "System", icon: Monitor, active: false },
                      ].map((t) => (
                        <button
                          key={t.label}
                          className={`p-4 rounded-xl border text-center transition-all ${
                            t.active
                              ? "border-brand-500 bg-brand-50 ring-2 ring-brand-500/20"
                              : "border-surface-200 hover:border-surface-300"
                          }`}
                        >
                          <t.icon className={`w-5 h-5 mx-auto mb-2 ${t.active ? "text-brand-600" : "text-surface-400"}`} />
                          <div className={`text-sm font-medium ${t.active ? "text-brand-700" : "text-surface-600"}`}>{t.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-surface-700 mb-3 block">Dashboard Density</label>
                    <div className="grid grid-cols-3 gap-3">
                      {["Comfortable", "Default", "Compact"].map((d, i) => (
                        <button
                          key={d}
                          className={`p-3 rounded-xl border text-sm font-medium text-center transition-all ${
                            i === 1
                              ? "border-brand-500 bg-brand-50 text-brand-700 ring-2 ring-brand-500/20"
                              : "border-surface-200 text-surface-600 hover:border-surface-300"
                          }`}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-surface-700 mb-3 block">Date Format</label>
                    <select className="input-field text-sm w-64">
                      <option>MM/DD/YYYY</option>
                      <option>DD/MM/YYYY</option>
                      <option>YYYY-MM-DD</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end mt-5">
                  <button onClick={showSaved} className="btn-primary text-sm">Save Preferences</button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "organization" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="glass-card p-6">
                <h2 className="text-lg font-semibold text-surface-900 mb-5">Organization</h2>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-xs font-medium text-surface-600 mb-1.5">Company Name</label>
                    <input className="input-field text-sm" defaultValue="SaaSCo Inc." />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-surface-600 mb-1.5">Industry</label>
                    <input className="input-field text-sm" defaultValue="B2B SaaS" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-surface-600 mb-1.5">Company Size</label>
                    <select className="input-field text-sm">
                      <option>51-200 employees</option>
                      <option>201-500 employees</option>
                      <option>501-1000 employees</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-surface-600 mb-1.5">Timezone</label>
                    <select className="input-field text-sm">
                      <option>US/Eastern (UTC-5)</option>
                      <option>US/Pacific (UTC-8)</option>
                      <option>Europe/London (UTC+0)</option>
                    </select>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-surface-50 border border-surface-100">
                  <h3 className="text-sm font-semibold text-surface-900 mb-3">Team Members</h3>
                  <div className="space-y-2">
                    {[
                      { name: "Alex Morgan", email: "ceo@saascompany.com", role: "Owner" },
                      { name: "Sarah Chen", email: "sarah@saascompany.com", role: "Admin" },
                      { name: "Marcus Rivera", email: "marcus@saascompany.com", role: "Admin" },
                      { name: "James Park", email: "james@saascompany.com", role: "Member" },
                    ].map((m) => (
                      <div key={m.email} className="flex items-center justify-between p-2.5 rounded-lg hover:bg-white transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 text-xs font-bold">
                            {m.name.split(" ").map((n) => n[0]).join("")}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-surface-900">{m.name}</div>
                            <div className="text-xs text-surface-500">{m.email}</div>
                          </div>
                        </div>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          m.role === "Owner" ? "bg-brand-50 text-brand-700" :
                          m.role === "Admin" ? "bg-emerald-50 text-emerald-700" :
                          "bg-surface-100 text-surface-600"
                        }`}>
                          {m.role}
                        </span>
                      </div>
                    ))}
                  </div>
                  <button className="mt-3 text-sm text-brand-600 font-medium hover:text-brand-700">+ Invite Team Member</button>
                </div>
                <div className="flex justify-end mt-5">
                  <button onClick={showSaved} className="btn-primary text-sm">Save Changes</button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
