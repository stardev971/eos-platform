"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Activity,
  DollarSign,
  AlertTriangle,
  LayoutDashboard,
  TrendingUp,
  Users,
  Sparkles,
  Settings,
  HelpCircle,
  Lock,
  Plug,
  Brain,
  Rocket,
} from "lucide-react";

const EXPERT_CALL_URL = "https://meetings-na2.hubspot.com/jay-sonavani";

const navSections = [
  {
    title: "Intelligence Modules",
    items: [
      { label: "Executive Overview", href: "/dashboard/executive", icon: LayoutDashboard, active: true },
      { label: "Customer Profitability", href: "/dashboard/profitability", icon: DollarSign, active: true },
      { label: "Churn Risk Intelligence", href: "/dashboard/churn", icon: AlertTriangle, active: true },
      { label: "Revenue Operations", href: "/dashboard/revenue-ops", icon: TrendingUp, active: true },
      { label: "Team Efficiency", href: "/dashboard/team-efficiency", icon: Users, active: true },
      { label: "AI Recommendations", href: "/dashboard/ai-recommendations", icon: Sparkles, active: true },
    ],
  },
  {
    title: "Platform",
    items: [
      { label: "Integrations", href: "/dashboard/integrations", icon: Plug, active: true },
      { label: "AI Usage", href: "/dashboard/ai-usage", icon: Brain, active: true },
      { label: "Settings", href: "/dashboard/settings", icon: Settings, active: true },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[220px] h-screen bg-white border-r border-surface-200 flex flex-col fixed left-0 top-0 z-30">
      {/* Logo */}
      <div className="px-4 py-4 pb-3">
        <Link href="/dashboard/executive" className="flex items-center gap-2.5">
          <div className="brand-mark w-8 h-8 rounded-lg">
            <Activity className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="text-base font-bold text-surface-900 tracking-tight">SaaS OS</span>
            <p className="text-[9px] text-surface-500 -mt-0.5 font-semibold tracking-widest uppercase">
              SaaS Operating System
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2.5 py-1 overflow-y-auto scrollbar-hide">
        {navSections.map((section) => (
          <div key={section.title} className="mb-3">
            <div className="text-[9px] font-semibold text-surface-400 uppercase tracking-wider px-2.5 mb-1.5">
              {section.title}
            </div>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                const isDisabled = !item.active;

                if (isDisabled) {
                  return (
                    <div key={item.label} className="sidebar-link disabled group text-xs">
                      <item.icon className="w-4 h-4 shrink-0" />
                      <span className="truncate">{item.label}</span>
                      <Lock className="w-3 h-3 ml-auto shrink-0 text-surface-300" />
                    </div>
                  );
                }

                return (
                  <Link key={item.label} href={item.href} className="block">
                    <div className={`sidebar-link relative text-xs ${isActive ? "active" : ""}`}>
                      {isActive && (
                        <motion.div
                          layoutId="sidebar-active"
                          className="absolute inset-0 bg-brand-50 rounded-lg border border-brand-100"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                      <item.icon className={`w-4 h-4 shrink-0 relative z-10 ${isActive ? "text-brand-700" : ""}`} />
                      <span className="truncate relative z-10">{item.label}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Build Your Own — Expert Call CTA */}
      <div className="px-2.5 pt-1.5 pb-1">
        <a href={EXPERT_CALL_URL} target="_blank" rel="noopener noreferrer" className="block group">
          <div className="rounded-xl bg-gradient-to-br from-brand-700 to-brand-900 p-3 shadow-sm group-hover:shadow-md transition-shadow">
            <p className="text-[11px] font-semibold text-white leading-snug">
              Want a SaaS OS like this for your business?
            </p>
            <p className="text-[10px] text-brand-200 leading-snug mt-0.5 mb-2">
              We&apos;ll build one around your own data.
            </p>
            <div className="flex items-center justify-center gap-1.5 bg-white text-brand-800 rounded-lg py-1.5 text-[11px] font-semibold group-hover:bg-brand-50 transition-colors">
              <Rocket className="w-3.5 h-3.5" />
              Book a Call with Our Expert
            </div>
          </div>
        </a>
      </div>

      {/* Bottom */}
      <div className="border-t border-surface-200 p-2.5">
        <Link href="/dashboard/settings" className="block">
          <div className={`sidebar-link text-xs ${pathname === "/dashboard/settings" ? "active" : ""}`}>
            <HelpCircle className="w-4 h-4 shrink-0" />
            <span>Help & Support</span>
          </div>
        </Link>
      </div>

      {/* Connected Platforms */}
      <div className="px-4 py-3 border-t border-surface-100">
        <Link href="/dashboard/integrations" className="block group">
          <div className="text-[9px] text-surface-400 font-semibold mb-1.5 group-hover:text-surface-600 transition-colors uppercase tracking-wider">
            Connected Platforms
          </div>
          <div className="flex items-center gap-1 flex-wrap">
            {["HubSpot", "Stripe", "Zendesk", "Jira", "Mixpanel"].map((p) => (
              <span key={p} className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-emerald-50 text-emerald-700">
                {p}
              </span>
            ))}
          </div>
        </Link>
      </div>
    </aside>
  );
}
