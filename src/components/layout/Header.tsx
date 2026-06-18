"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { notifications } from "@/lib/data";
import {
  Search,
  Bell,
  Sparkles,
  ChevronDown,
  Building2,
  Calendar,
  LogOut,
  User,
  X,
  Rocket,
} from "lucide-react";

const EXPERT_CALL_URL = "https://meetings-na2.hubspot.com/jay-sonavani";

export default function Header() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <header className="h-14 bg-white/80 backdrop-blur-xl border-b border-surface-200 flex items-center justify-between px-5 sticky top-0 z-20">
      {/* Left */}
      <div className="flex items-center gap-3">
        {/* Company Switcher */}
        <button className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-surface-100 transition-colors">
          <div className="w-6 h-6 rounded-md bg-brand-700 flex items-center justify-center">
            <Building2 className="w-3 h-3 text-white" />
          </div>
          <span className="text-sm font-semibold text-surface-900">SaaSCo Inc.</span>
          <ChevronDown className="w-3 h-3 text-surface-400" />
        </button>

        {/* Search */}
        <div className={`relative transition-all duration-200 ${searchFocused ? "w-72" : "w-56"}`}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-surface-400" />
          <input
            type="text"
            placeholder="Search customers, insights..."
            className="w-full pl-9 pr-4 py-1.5 rounded-lg bg-surface-50 border border-surface-200 text-sm placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 focus:bg-white transition-all"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-surface-400 bg-surface-100 px-1.5 py-0.5 rounded font-mono">
            /
          </kbd>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1.5">
        {/* Build Your Own — Expert Call CTA */}
        <a
          href={EXPERT_CALL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 mr-1 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-sm transition-colors"
          title="Book a call to build a SaaS Operating System for your business"
        >
          <Rocket className="w-3.5 h-3.5" />
          Build Your Own SaaS OS
        </a>

        {/* Date Range */}
        <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-surface-100 transition-colors text-xs text-surface-600">
          <Calendar className="w-3.5 h-3.5" />
          <span>Last 30 days</span>
          <ChevronDown className="w-3 h-3 text-surface-400" />
        </button>

        {/* AI Insights Indicator */}
        <button className="relative p-2 rounded-lg hover:bg-surface-100 transition-colors group">
          <Sparkles className="w-4 h-4 text-brand-500 group-hover:text-brand-600" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-brand-500 rounded-full animate-pulse_slow" />
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
            className="relative p-2 rounded-lg hover:bg-surface-100 transition-colors"
          >
            <Bell className="w-4 h-4 text-surface-600" />
            {unread > 0 && (
              <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[9px] text-white font-bold">
                {unread}
              </span>
            )}
          </button>
          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 5, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 5, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-11 w-80 bg-white rounded-xl shadow-panel border border-surface-200 overflow-hidden z-50"
              >
                <div className="flex items-center justify-between p-3 border-b border-surface-100">
                  <h3 className="text-sm font-semibold text-surface-900">Notifications</h3>
                  <button onClick={() => setShowNotifications(false)}>
                    <X className="w-3.5 h-3.5 text-surface-400" />
                  </button>
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`px-3 py-2.5 border-b border-surface-50 hover:bg-surface-50 transition-colors ${!n.read ? "bg-brand-50/30" : ""}`}
                    >
                      <div className="flex items-start gap-2.5">
                        <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                          n.type === "alert" ? "bg-red-500" : n.type === "success" ? "bg-emerald-500" : "bg-blue-500"
                        }`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-surface-900">{n.title}</p>
                          <p className="text-[11px] text-surface-500 mt-0.5 truncate">{n.message}</p>
                          <p className="text-[10px] text-surface-400 mt-0.5">{n.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
            className="flex items-center gap-2 pl-2 pr-1.5 py-1 rounded-lg hover:bg-surface-100 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-brand-600 flex items-center justify-center text-white text-[10px] font-bold">
              {user?.avatar || "AM"}
            </div>
            <div className="text-left hidden xl:block">
              <div className="text-xs font-medium text-surface-900">{user?.name || "Alex Morgan"}</div>
              <div className="text-[10px] text-surface-500 -mt-0.5">{user?.role || "CEO"}</div>
            </div>
            <ChevronDown className="w-3 h-3 text-surface-400" />
          </button>
          <AnimatePresence>
            {showProfile && (
              <motion.div
                initial={{ opacity: 0, y: 5, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 5, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-11 w-52 bg-white rounded-xl shadow-panel border border-surface-200 overflow-hidden z-50"
              >
                <div className="p-3 border-b border-surface-100">
                  <p className="text-sm font-medium text-surface-900">{user?.name}</p>
                  <p className="text-xs text-surface-500">{user?.email}</p>
                </div>
                <div className="p-1">
                  <button
                    onClick={() => { setShowProfile(false); router.push("/dashboard/settings"); }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-surface-700 hover:bg-surface-50 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    Profile Settings
                  </button>
                  <button
                    onClick={() => { logout(); router.push("/"); }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
