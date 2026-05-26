"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plug,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  Clock,
  Database,
  Settings,
  Shield,
  ChevronDown,
  ChevronUp,
  Users,
  CreditCard,
  HeadphonesIcon,
  Search,
  X,
  Key,
  Globe,
  Lock,
  Eye,
  EyeOff,
  Copy,
  Check,
  Megaphone,
  FolderKanban,
  UserCog,
  MessageSquare,
  LineChart,
  Link2,
  Sparkles,
  Info,
} from "lucide-react";
import { formatNumber } from "@/lib/utils";

// ─── Types ───────────────────────────────────────────────────────────
type AuthType = "oauth" | "api_key" | "token" | "webhook_url" | "oauth_key";
type IntegrationStatus = "connected" | "available";
type CategoryKey =
  | "marketing"
  | "crm"
  | "billing"
  | "ticketing"
  | "project_management"
  | "hrms"
  | "communication"
  | "product_analytics";

interface IntegrationItem {
  id: string;
  name: string;
  description: string;
  logo: string; // emoji/letter placeholder — in production these would be real logos
  logoBg: string;
  logoColor: string;
  category: CategoryKey;
  status: IntegrationStatus;
  authType: AuthType;
  authLabel: string; // e.g. "API Key", "OAuth 2.0", "API Token"
  authPlaceholder?: string;
  authSecondary?: { label: string; placeholder: string }; // for platforms needing 2 fields
  website: string;
  popular?: boolean;
  // Connected-only fields
  lastSync?: string;
  healthScore?: number;
  recordsSynced?: number;
  connectedSince?: string;
  syncFrequency?: string;
  features?: string[];
  dataPoints?: { label: string; value: string }[];
}

interface CategoryMeta {
  key: CategoryKey;
  label: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  ringColor: string;
}

// ─── Categories ──────────────────────────────────────────────────────
const categories: CategoryMeta[] = [
  { key: "marketing", label: "Marketing & Automation", description: "Email campaigns, lead scoring & marketing ops", icon: Megaphone, color: "text-pink-600", bg: "bg-pink-50", ringColor: "ring-pink-200" },
  { key: "crm", label: "CRM & Sales", description: "Pipeline, contacts & deal management", icon: Users, color: "text-orange-600", bg: "bg-orange-50", ringColor: "ring-orange-200" },
  { key: "billing", label: "Billing & Payments", description: "Subscriptions, invoices & revenue tracking", icon: CreditCard, color: "text-purple-600", bg: "bg-purple-50", ringColor: "ring-purple-200" },
  { key: "ticketing", label: "Ticketing & Support", description: "Help desk, tickets & customer satisfaction", icon: HeadphonesIcon, color: "text-green-600", bg: "bg-green-50", ringColor: "ring-green-200" },
  { key: "project_management", label: "Project Management", description: "Tasks, sprints & team collaboration", icon: FolderKanban, color: "text-blue-600", bg: "bg-blue-50", ringColor: "ring-blue-200" },
  { key: "hrms", label: "HRMS & People", description: "Employee data, payroll & workforce analytics", icon: UserCog, color: "text-teal-600", bg: "bg-teal-50", ringColor: "ring-teal-200" },
  { key: "communication", label: "Communication & Collab", description: "Messaging, docs & workspace tools", icon: MessageSquare, color: "text-yellow-600", bg: "bg-yellow-50", ringColor: "ring-yellow-200" },
  { key: "product_analytics", label: "Product Analytics", description: "User behavior, funnels & engagement tracking", icon: LineChart, color: "text-indigo-600", bg: "bg-indigo-50", ringColor: "ring-indigo-200" },
];

// ─── Integration Catalog ─────────────────────────────────────────────
const allIntegrations: IntegrationItem[] = [
  // ── CONNECTED (existing 6) ──
  {
    id: "hubspot",
    name: "HubSpot",
    description: "Marketing automation, CRM & inbound marketing platform",
    logo: "H",
    logoBg: "bg-orange-500",
    logoColor: "text-white",
    category: "crm",
    status: "connected",
    authType: "oauth",
    authLabel: "OAuth 2.0",
    website: "hubspot.com",
    popular: true,
    lastSync: "2 min ago",
    healthScore: 98,
    recordsSynced: 4821,
    connectedSince: "Jan 15, 2025",
    syncFrequency: "Real-time + 15 min full sync",
    features: ["Contacts", "Companies", "Deals", "Lifecycle Stages", "Custom Properties", "Engagement Tracking"],
    dataPoints: [
      { label: "Contacts Synced", value: "4,821" },
      { label: "Companies", value: "25" },
      { label: "Active Deals", value: "18" },
      { label: "Lifecycle Stages", value: "6" },
    ],
  },
  {
    id: "stripe",
    name: "Stripe",
    description: "Subscription billing, payment processing & revenue recognition",
    logo: "S",
    logoBg: "bg-purple-600",
    logoColor: "text-white",
    category: "billing",
    status: "connected",
    authType: "api_key",
    authLabel: "Secret API Key",
    authPlaceholder: "sk_live_...",
    website: "stripe.com",
    popular: true,
    lastSync: "5 min ago",
    healthScore: 95,
    recordsSynced: 15420,
    connectedSince: "Jan 15, 2025",
    syncFrequency: "Real-time webhooks + 30 min reconciliation",
    features: ["Subscriptions", "Invoices", "Payment Intents", "Failed Payments", "Refunds", "Revenue Recognition"],
    dataPoints: [
      { label: "Active Subscriptions", value: "23" },
      { label: "Monthly Volume", value: "$485,250" },
      { label: "Failed Payments", value: "12" },
      { label: "Invoices (YTD)", value: "284" },
    ],
  },
  {
    id: "zendesk",
    name: "Zendesk",
    description: "Customer support ticketing, CSAT tracking & SLA management",
    logo: "Z",
    logoBg: "bg-green-600",
    logoColor: "text-white",
    category: "ticketing",
    status: "connected",
    authType: "oauth_key",
    authLabel: "OAuth 2.0 + API Token",
    website: "zendesk.com",
    popular: true,
    lastSync: "8 min ago",
    healthScore: 92,
    recordsSynced: 8934,
    connectedSince: "Feb 3, 2025",
    syncFrequency: "Every 10 min + real-time escalation alerts",
    features: ["Tickets", "CSAT Surveys", "SLA Tracking", "Agent Metrics", "Escalation Rules", "Satisfaction Ratings"],
    dataPoints: [
      { label: "Open Tickets", value: "47" },
      { label: "Avg Resolution", value: "4.2h" },
      { label: "CSAT Score", value: "81%" },
      { label: "SLA Breaches (MTD)", value: "8" },
    ],
  },
  {
    id: "jira",
    name: "Jira",
    description: "Engineering project tracking, sprints, velocity & time logging",
    logo: "J",
    logoBg: "bg-blue-600",
    logoColor: "text-white",
    category: "project_management",
    status: "connected",
    authType: "oauth",
    authLabel: "OAuth 2.0 (Atlassian)",
    website: "atlassian.com/jira",
    popular: true,
    lastSync: "12 min ago",
    healthScore: 88,
    recordsSynced: 12680,
    connectedSince: "Feb 3, 2025",
    syncFrequency: "Every 15 minutes",
    features: ["Issues", "Sprints", "Time Tracking", "Story Points", "Bug Tracking", "Client Allocation"],
    dataPoints: [
      { label: "Active Sprints", value: "4" },
      { label: "Open Issues", value: "156" },
      { label: "Velocity (Avg)", value: "34 pts" },
      { label: "Eng Hours (MTD)", value: "892h" },
    ],
  },
  {
    id: "mixpanel",
    name: "Mixpanel",
    description: "Product analytics — events, funnels, retention & feature adoption",
    logo: "M",
    logoBg: "bg-indigo-600",
    logoColor: "text-white",
    category: "product_analytics",
    status: "connected",
    authType: "api_key",
    authLabel: "Project Token + API Secret",
    authPlaceholder: "Project Token",
    authSecondary: { label: "API Secret", placeholder: "Enter API Secret" },
    website: "mixpanel.com",
    popular: true,
    lastSync: "3 min ago",
    healthScore: 96,
    recordsSynced: 2400000,
    connectedSince: "Mar 10, 2025",
    syncFrequency: "Every 5 min (event stream)",
    features: ["Events", "User Profiles", "Cohorts", "Funnels", "Retention", "Feature Flags"],
    dataPoints: [
      { label: "Tracked Events (MTD)", value: "2.4M" },
      { label: "Active Users (DAU)", value: "3,842" },
      { label: "Feature Adoption", value: "68%" },
      { label: "Avg Session", value: "12.4 min" },
    ],
  },
  {
    id: "slack",
    name: "Slack",
    description: "Team messaging, channel alerts & notification routing",
    logo: "S",
    logoBg: "bg-yellow-500",
    logoColor: "text-white",
    category: "communication",
    status: "connected",
    authType: "oauth",
    authLabel: "OAuth 2.0 (Workspace)",
    website: "slack.com",
    popular: true,
    lastSync: "1 min ago",
    healthScore: 100,
    recordsSynced: 342,
    connectedSince: "Jan 20, 2025",
    syncFrequency: "Real-time (outbound only)",
    features: ["Channel Alerts", "DM Notifications", "Thread Updates", "Scheduled Digests"],
    dataPoints: [
      { label: "Alerts Sent (MTD)", value: "342" },
      { label: "Channels Connected", value: "4" },
      { label: "Critical Alerts", value: "28" },
      { label: "Avg Response", value: "8 min" },
    ],
  },

  // ── MARKETING & AUTOMATION (available) ──
  {
    id: "hubspot-mkt",
    name: "HubSpot Marketing",
    description: "Email campaigns, landing pages, lead scoring & marketing automation",
    logo: "H",
    logoBg: "bg-orange-500",
    logoColor: "text-white",
    category: "marketing",
    status: "available",
    authType: "oauth",
    authLabel: "OAuth 2.0",
    website: "hubspot.com",
    popular: true,
  },
  {
    id: "marketo",
    name: "Marketo",
    description: "Enterprise marketing automation, lead management & email marketing",
    logo: "M",
    logoBg: "bg-purple-700",
    logoColor: "text-white",
    category: "marketing",
    status: "available",
    authType: "api_key",
    authLabel: "Client ID + Client Secret",
    authPlaceholder: "Client ID",
    authSecondary: { label: "Client Secret", placeholder: "Enter Client Secret" },
    website: "marketo.com",
  },
  {
    id: "google-analytics",
    name: "Google Analytics",
    description: "Web analytics, traffic sources, user behavior & conversion tracking",
    logo: "G",
    logoBg: "bg-amber-500",
    logoColor: "text-white",
    category: "marketing",
    status: "available",
    authType: "oauth",
    authLabel: "OAuth 2.0 (Google)",
    website: "analytics.google.com",
    popular: true,
  },
  {
    id: "amplitude-mkt",
    name: "Amplitude",
    description: "Digital analytics, behavioral cohorts & experimentation platform",
    logo: "A",
    logoBg: "bg-blue-700",
    logoColor: "text-white",
    category: "marketing",
    status: "available",
    authType: "api_key",
    authLabel: "API Key + Secret Key",
    authPlaceholder: "API Key",
    authSecondary: { label: "Secret Key", placeholder: "Enter Secret Key" },
    website: "amplitude.com",
  },
  {
    id: "ahrefs",
    name: "Ahrefs",
    description: "SEO analytics, backlink monitoring & keyword research",
    logo: "A",
    logoBg: "bg-orange-600",
    logoColor: "text-white",
    category: "marketing",
    status: "available",
    authType: "api_key",
    authLabel: "API Key",
    authPlaceholder: "Enter Ahrefs API Key",
    website: "ahrefs.com",
  },
  {
    id: "semrush",
    name: "Semrush",
    description: "SEO, content marketing, competitive analysis & PPC research",
    logo: "S",
    logoBg: "bg-orange-500",
    logoColor: "text-white",
    category: "marketing",
    status: "available",
    authType: "api_key",
    authLabel: "API Key",
    authPlaceholder: "Enter Semrush API Key",
    website: "semrush.com",
  },
  {
    id: "mailchimp",
    name: "Mailchimp",
    description: "Email marketing, audience management & campaign automation",
    logo: "M",
    logoBg: "bg-yellow-400",
    logoColor: "text-black",
    category: "marketing",
    status: "available",
    authType: "api_key",
    authLabel: "API Key",
    authPlaceholder: "Enter Mailchimp API Key (e.g. xxx-us21)",
    website: "mailchimp.com",
    popular: true,
  },
  {
    id: "customerio",
    name: "Customer.io",
    description: "Behavioral messaging, automated workflows & customer engagement",
    logo: "C",
    logoBg: "bg-violet-600",
    logoColor: "text-white",
    category: "marketing",
    status: "available",
    authType: "api_key",
    authLabel: "Site ID + API Key",
    authPlaceholder: "Site ID",
    authSecondary: { label: "API Key", placeholder: "Tracking API Key" },
    website: "customer.io",
  },

  // ── CRM & SALES (available) ──
  {
    id: "salesforce",
    name: "Salesforce",
    description: "Enterprise CRM — accounts, opportunities, forecasts & pipeline",
    logo: "S",
    logoBg: "bg-sky-500",
    logoColor: "text-white",
    category: "crm",
    status: "available",
    authType: "oauth",
    authLabel: "OAuth 2.0 (Connected App)",
    website: "salesforce.com",
    popular: true,
  },
  {
    id: "dynamics365",
    name: "Dynamics 365",
    description: "Microsoft CRM — sales, customer service & field operations",
    logo: "D",
    logoBg: "bg-blue-800",
    logoColor: "text-white",
    category: "crm",
    status: "available",
    authType: "oauth",
    authLabel: "OAuth 2.0 (Azure AD)",
    website: "dynamics.microsoft.com",
  },
  {
    id: "pipedrive",
    name: "Pipedrive",
    description: "Sales pipeline management, deal tracking & activity-based selling",
    logo: "P",
    logoBg: "bg-green-700",
    logoColor: "text-white",
    category: "crm",
    status: "available",
    authType: "api_key",
    authLabel: "API Token",
    authPlaceholder: "Enter Pipedrive API Token",
    website: "pipedrive.com",
  },
  {
    id: "zoho-crm",
    name: "Zoho CRM",
    description: "Sales automation, contact management & multichannel communication",
    logo: "Z",
    logoBg: "bg-red-600",
    logoColor: "text-white",
    category: "crm",
    status: "available",
    authType: "oauth",
    authLabel: "OAuth 2.0",
    website: "zoho.com/crm",
  },
  {
    id: "freshworks",
    name: "Freshworks CRM",
    description: "AI-powered CRM with sales, marketing & support in one platform",
    logo: "F",
    logoBg: "bg-emerald-600",
    logoColor: "text-white",
    category: "crm",
    status: "available",
    authType: "api_key",
    authLabel: "API Key",
    authPlaceholder: "Enter Freshworks API Key",
    website: "freshworks.com",
  },

  // ── BILLING & PAYMENTS (available) ──
  {
    id: "quickbooks",
    name: "QuickBooks",
    description: "Accounting, invoicing, expense tracking & financial reporting",
    logo: "Q",
    logoBg: "bg-green-600",
    logoColor: "text-white",
    category: "billing",
    status: "available",
    authType: "oauth",
    authLabel: "OAuth 2.0 (Intuit)",
    website: "quickbooks.intuit.com",
    popular: true,
  },
  {
    id: "xero",
    name: "Xero",
    description: "Cloud accounting, bank reconciliation & financial management",
    logo: "X",
    logoBg: "bg-sky-500",
    logoColor: "text-white",
    category: "billing",
    status: "available",
    authType: "oauth",
    authLabel: "OAuth 2.0",
    website: "xero.com",
  },
  {
    id: "chargebee",
    name: "Chargebee",
    description: "Subscription billing, revenue operations & retention management",
    logo: "C",
    logoBg: "bg-orange-500",
    logoColor: "text-white",
    category: "billing",
    status: "available",
    authType: "api_key",
    authLabel: "API Key + Site Name",
    authPlaceholder: "API Key",
    authSecondary: { label: "Site Name", placeholder: "your-site.chargebee.com" },
    website: "chargebee.com",
  },
  {
    id: "paddle",
    name: "Paddle",
    description: "Complete payments infrastructure for SaaS — billing, tax & compliance",
    logo: "P",
    logoBg: "bg-blue-900",
    logoColor: "text-white",
    category: "billing",
    status: "available",
    authType: "api_key",
    authLabel: "API Key",
    authPlaceholder: "Enter Paddle API Key",
    website: "paddle.com",
  },
  {
    id: "recurly",
    name: "Recurly",
    description: "Subscription management, dunning & revenue optimization",
    logo: "R",
    logoBg: "bg-pink-600",
    logoColor: "text-white",
    category: "billing",
    status: "available",
    authType: "api_key",
    authLabel: "Private API Key",
    authPlaceholder: "Enter Recurly Private API Key",
    website: "recurly.com",
  },
  {
    id: "zoho-books",
    name: "Zoho Books",
    description: "Online accounting, invoicing & bank connections",
    logo: "Z",
    logoBg: "bg-red-600",
    logoColor: "text-white",
    category: "billing",
    status: "available",
    authType: "oauth",
    authLabel: "OAuth 2.0",
    website: "zoho.com/books",
  },
  {
    id: "paypal",
    name: "PayPal",
    description: "Payment processing, invoicing & business transactions",
    logo: "P",
    logoBg: "bg-blue-700",
    logoColor: "text-white",
    category: "billing",
    status: "available",
    authType: "oauth",
    authLabel: "OAuth 2.0 (Client ID + Secret)",
    website: "paypal.com",
  },
  {
    id: "razorpay",
    name: "Razorpay",
    description: "Payment gateway, subscriptions & smart collect for Indian businesses",
    logo: "R",
    logoBg: "bg-blue-600",
    logoColor: "text-white",
    category: "billing",
    status: "available",
    authType: "api_key",
    authLabel: "Key ID + Key Secret",
    authPlaceholder: "Key ID (rzp_live_...)",
    authSecondary: { label: "Key Secret", placeholder: "Enter Key Secret" },
    website: "razorpay.com",
  },

  // ── TICKETING & SUPPORT (available) ──
  {
    id: "intercom",
    name: "Intercom",
    description: "Customer messaging, live chat, bots & help center",
    logo: "I",
    logoBg: "bg-blue-500",
    logoColor: "text-white",
    category: "ticketing",
    status: "available",
    authType: "token",
    authLabel: "Access Token",
    authPlaceholder: "Enter Intercom Access Token",
    website: "intercom.com",
    popular: true,
  },
  {
    id: "freshdesk",
    name: "Freshdesk",
    description: "Help desk, ticket management & multichannel customer support",
    logo: "F",
    logoBg: "bg-emerald-500",
    logoColor: "text-white",
    category: "ticketing",
    status: "available",
    authType: "api_key",
    authLabel: "API Key + Domain",
    authPlaceholder: "API Key",
    authSecondary: { label: "Domain", placeholder: "yourcompany.freshdesk.com" },
    website: "freshdesk.com",
  },
  {
    id: "servicenow",
    name: "ServiceNow",
    description: "Enterprise IT service management, ITSM & workflow automation",
    logo: "S",
    logoBg: "bg-green-800",
    logoColor: "text-white",
    category: "ticketing",
    status: "available",
    authType: "oauth",
    authLabel: "OAuth 2.0 (Instance)",
    website: "servicenow.com",
  },

  // ── PROJECT MANAGEMENT (available) ──
  {
    id: "clickup",
    name: "ClickUp",
    description: "All-in-one project management — tasks, docs, goals & time tracking",
    logo: "C",
    logoBg: "bg-purple-500",
    logoColor: "text-white",
    category: "project_management",
    status: "available",
    authType: "api_key",
    authLabel: "Personal API Token",
    authPlaceholder: "pk_...",
    website: "clickup.com",
    popular: true,
  },
  {
    id: "basecamp",
    name: "Basecamp",
    description: "Project organization, team communication & to-do management",
    logo: "B",
    logoBg: "bg-yellow-500",
    logoColor: "text-white",
    category: "project_management",
    status: "available",
    authType: "oauth",
    authLabel: "OAuth 2.0",
    website: "basecamp.com",
  },
  {
    id: "asana",
    name: "Asana",
    description: "Work management, project timelines & cross-team coordination",
    logo: "A",
    logoBg: "bg-pink-500",
    logoColor: "text-white",
    category: "project_management",
    status: "available",
    authType: "token",
    authLabel: "Personal Access Token",
    authPlaceholder: "Enter Asana Personal Access Token",
    website: "asana.com",
    popular: true,
  },
  {
    id: "monday",
    name: "Monday.com",
    description: "Work OS — customizable workflows, dashboards & automation",
    logo: "M",
    logoBg: "bg-red-500",
    logoColor: "text-white",
    category: "project_management",
    status: "available",
    authType: "api_key",
    authLabel: "API Token (v2)",
    authPlaceholder: "Enter Monday.com API Token",
    website: "monday.com",
  },
  {
    id: "linear",
    name: "Linear",
    description: "Modern issue tracking for software teams — fast & streamlined",
    logo: "L",
    logoBg: "bg-violet-700",
    logoColor: "text-white",
    category: "project_management",
    status: "available",
    authType: "api_key",
    authLabel: "Personal API Key",
    authPlaceholder: "lin_api_...",
    website: "linear.app",
  },

  // ── HRMS & PEOPLE (available) ──
  {
    id: "bamboohr",
    name: "BambooHR",
    description: "HR management, employee records, time off & performance tracking",
    logo: "B",
    logoBg: "bg-green-600",
    logoColor: "text-white",
    category: "hrms",
    status: "available",
    authType: "api_key",
    authLabel: "API Key + Subdomain",
    authPlaceholder: "API Key",
    authSecondary: { label: "Subdomain", placeholder: "yourcompany.bamboohr.com" },
    website: "bamboohr.com",
    popular: true,
  },
  {
    id: "zoho-people",
    name: "Zoho People",
    description: "HR platform — attendance, leave, performance & employee self-service",
    logo: "Z",
    logoBg: "bg-red-600",
    logoColor: "text-white",
    category: "hrms",
    status: "available",
    authType: "oauth",
    authLabel: "OAuth 2.0",
    website: "zoho.com/people",
  },
  {
    id: "rippling",
    name: "Rippling",
    description: "Unified HR, IT & finance — payroll, benefits & device management",
    logo: "R",
    logoBg: "bg-amber-500",
    logoColor: "text-white",
    category: "hrms",
    status: "available",
    authType: "api_key",
    authLabel: "API Key",
    authPlaceholder: "Enter Rippling API Key",
    website: "rippling.com",
  },

  // ── COMMUNICATION & COLLAB (available) ──
  {
    id: "ms-teams",
    name: "Microsoft Teams",
    description: "Team chat, video meetings, file collaboration & channel notifications",
    logo: "T",
    logoBg: "bg-indigo-600",
    logoColor: "text-white",
    category: "communication",
    status: "available",
    authType: "oauth",
    authLabel: "OAuth 2.0 (Azure AD)",
    website: "teams.microsoft.com",
    popular: true,
  },
  {
    id: "notion",
    name: "Notion",
    description: "Wiki, docs, project management & team knowledge base",
    logo: "N",
    logoBg: "bg-gray-900",
    logoColor: "text-white",
    category: "communication",
    status: "available",
    authType: "token",
    authLabel: "Internal Integration Token",
    authPlaceholder: "secret_...",
    website: "notion.so",
    popular: true,
  },
  {
    id: "confluence",
    name: "Confluence",
    description: "Team wiki, documentation & knowledge management by Atlassian",
    logo: "C",
    logoBg: "bg-blue-700",
    logoColor: "text-white",
    category: "communication",
    status: "available",
    authType: "api_key",
    authLabel: "API Token + Email",
    authPlaceholder: "API Token",
    authSecondary: { label: "Email", placeholder: "user@company.com" },
    website: "atlassian.com/confluence",
  },
  {
    id: "google-workspace",
    name: "Google Workspace",
    description: "Gmail, Drive, Calendar & Docs — full workspace integration",
    logo: "G",
    logoBg: "bg-blue-500",
    logoColor: "text-white",
    category: "communication",
    status: "available",
    authType: "oauth",
    authLabel: "OAuth 2.0 (Google)",
    website: "workspace.google.com",
    popular: true,
  },
  {
    id: "dropbox",
    name: "Dropbox",
    description: "Cloud storage, file sharing & team content collaboration",
    logo: "D",
    logoBg: "bg-blue-600",
    logoColor: "text-white",
    category: "communication",
    status: "available",
    authType: "oauth",
    authLabel: "OAuth 2.0",
    website: "dropbox.com",
  },

  // ── PRODUCT ANALYTICS (available) ──
  {
    id: "amplitude",
    name: "Amplitude",
    description: "Digital analytics, behavioral cohorts & experimentation",
    logo: "A",
    logoBg: "bg-blue-700",
    logoColor: "text-white",
    category: "product_analytics",
    status: "available",
    authType: "api_key",
    authLabel: "API Key + Secret Key",
    authPlaceholder: "API Key",
    authSecondary: { label: "Secret Key", placeholder: "Enter Secret Key" },
    website: "amplitude.com",
    popular: true,
  },
  {
    id: "posthog",
    name: "PostHog",
    description: "Open-source product analytics, session recording & feature flags",
    logo: "P",
    logoBg: "bg-yellow-500",
    logoColor: "text-black",
    category: "product_analytics",
    status: "available",
    authType: "api_key",
    authLabel: "Personal API Key",
    authPlaceholder: "phx_...",
    website: "posthog.com",
  },
  {
    id: "hotjar",
    name: "Hotjar",
    description: "Heatmaps, session recordings, surveys & user feedback",
    logo: "H",
    logoBg: "bg-red-500",
    logoColor: "text-white",
    category: "product_analytics",
    status: "available",
    authType: "api_key",
    authLabel: "API Key",
    authPlaceholder: "Enter Hotjar API Key",
    website: "hotjar.com",
  },
  {
    id: "fullstory",
    name: "FullStory",
    description: "Digital experience intelligence — session replay, analytics & error tracking",
    logo: "F",
    logoBg: "bg-indigo-800",
    logoColor: "text-white",
    category: "product_analytics",
    status: "available",
    authType: "api_key",
    authLabel: "API Key",
    authPlaceholder: "Enter FullStory API Key",
    website: "fullstory.com",
  },
];

// ─── Connection Modal ────────────────────────────────────────────────
function ConnectionModal({
  integration,
  onClose,
}: {
  integration: IntegrationItem;
  onClose: () => void;
}) {
  const [step, setStep] = useState<"auth" | "permissions" | "success">("auth");
  const [showSecret, setShowSecret] = useState(false);
  const [showSecret2, setShowSecret2] = useState(false);
  const [primaryValue, setPrimaryValue] = useState("");
  const [secondaryValue, setSecondaryValue] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const isOAuth = integration.authType === "oauth" || integration.authType === "oauth_key";
  const webhookUrl = `https://api.eos-platform.com/webhooks/${integration.id}/inbound`;

  const handleConnect = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep("success");
    }, 1500);
  };

  const handleCopyWebhook = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative bg-white rounded-2xl shadow-panel w-full max-w-lg overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center gap-3 p-5 border-b border-surface-100">
          <div className={`w-10 h-10 rounded-xl ${integration.logoBg} flex items-center justify-center`}>
            <span className={`text-sm font-bold ${integration.logoColor}`}>{integration.logo}</span>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-surface-900">
              {step === "success" ? `${integration.name} Connected!` : `Connect ${integration.name}`}
            </h3>
            <p className="text-xs text-surface-500">
              {step === "success"
                ? "Integration is now active and syncing"
                : `Authentication via ${integration.authLabel}`}
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface-100 transition-colors">
            <X className="w-4 h-4 text-surface-400" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5">
          <AnimatePresence mode="wait">
            {step === "auth" && (
              <motion.div
                key="auth"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-4"
              >
                {isOAuth ? (
                  <>
                    {/* OAuth Flow */}
                    <div className="p-4 rounded-xl bg-surface-50 border border-surface-200">
                      <div className="flex items-center gap-2 mb-3">
                        <Globe className="w-4 h-4 text-brand-600" />
                        <span className="text-xs font-semibold text-surface-700">OAuth 2.0 Authorization</span>
                      </div>
                      <p className="text-xs text-surface-500 mb-4">
                        You&apos;ll be redirected to {integration.name} to authorize EOS Platform. We request read-only access to your data by default.
                      </p>
                      <div className="space-y-2">
                        {["Read account data & metadata", "Access contacts/records (read-only)", "Webhook event subscriptions"].map(
                          (perm) => (
                            <div key={perm} className="flex items-center gap-2 text-xs text-surface-600">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                              {perm}
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    {integration.authType === "oauth_key" && (
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-surface-700">API Token (Optional — for extended access)</label>
                        <div className="relative">
                          <input
                            type={showSecret ? "text" : "password"}
                            placeholder="Enter API Token"
                            value={primaryValue}
                            onChange={(e) => setPrimaryValue(e.target.value)}
                            className="input-field pr-10 text-xs"
                          />
                          <button
                            onClick={() => setShowSecret(!showSecret)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600"
                          >
                            {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={handleConnect}
                      disabled={loading}
                      className="btn-primary w-full text-sm flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Globe className="w-4 h-4" />
                      )}
                      {loading ? "Authorizing..." : `Authorize with ${integration.name}`}
                    </button>
                  </>
                ) : (
                  <>
                    {/* API Key / Token Flow */}
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-surface-700">{integration.authLabel}</label>
                        <div className="relative">
                          <input
                            type={showSecret ? "text" : "password"}
                            placeholder={integration.authPlaceholder || `Enter ${integration.authLabel}`}
                            value={primaryValue}
                            onChange={(e) => setPrimaryValue(e.target.value)}
                            className="input-field pr-10 text-xs"
                          />
                          <button
                            onClick={() => setShowSecret(!showSecret)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600"
                          >
                            {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {integration.authSecondary && (
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-surface-700">{integration.authSecondary.label}</label>
                          <div className="relative">
                            <input
                              type={showSecret2 ? "text" : "password"}
                              placeholder={integration.authSecondary.placeholder}
                              value={secondaryValue}
                              onChange={(e) => setSecondaryValue(e.target.value)}
                              className="input-field pr-10 text-xs"
                            />
                            <button
                              onClick={() => setShowSecret2(!showSecret2)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600"
                            >
                              {showSecret2 ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Where to find key */}
                      <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-50 border border-blue-100">
                        <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                        <div className="text-xs text-blue-700">
                          <span className="font-medium">Where to find this:</span> Go to your {integration.name} dashboard → Settings → API / Integrations → Generate or copy your key.
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleConnect}
                      disabled={loading || !primaryValue}
                      className="btn-primary w-full text-sm flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Key className="w-4 h-4" />
                      )}
                      {loading ? "Verifying credentials..." : "Connect Integration"}
                    </button>
                  </>
                )}

                {/* Webhook URL */}
                <div className="pt-3 border-t border-surface-100">
                  <label className="text-xs font-semibold text-surface-700 mb-2 block">Webhook Endpoint (for real-time sync)</label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 px-3 py-2.5 rounded-lg bg-surface-50 border border-surface-200 text-xs text-surface-500 font-mono truncate">
                      {webhookUrl}
                    </div>
                    <button
                      onClick={handleCopyWebhook}
                      className="p-2.5 rounded-lg border border-surface-200 hover:bg-surface-50 transition-colors shrink-0"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-surface-500" />}
                    </button>
                  </div>
                  <p className="text-[10px] text-surface-400 mt-1.5">
                    Add this URL in your {integration.name} webhook settings for real-time event delivery.
                  </p>
                </div>

                {/* Security note */}
                <div className="flex items-center gap-2 text-[10px] text-surface-400">
                  <Lock className="w-3 h-3" />
                  Credentials are encrypted at rest with AES-256 and never stored in plain text.
                </div>
              </motion.div>
            )}

            {step === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6 space-y-4"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-surface-900">Successfully Connected</h4>
                  <p className="text-xs text-surface-500 mt-1">
                    {integration.name} is now linked to EOS Platform. Initial data sync will begin shortly.
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-3 pt-2">
                  {[
                    { label: "Status", value: "Active", color: "text-emerald-600" },
                    { label: "Sync Mode", value: isOAuth ? "Webhooks" : "Polling", color: "text-blue-600" },
                    { label: "First Sync", value: "Starting...", color: "text-amber-600" },
                  ].map((s) => (
                    <div key={s.label} className="p-3 rounded-lg bg-surface-50 border border-surface-100">
                      <div className="text-[10px] text-surface-400">{s.label}</div>
                      <div className={`text-xs font-semibold ${s.color} mt-0.5`}>{s.value}</div>
                    </div>
                  ))}
                </div>
                <button onClick={onClose} className="btn-primary text-sm w-full mt-2">
                  Done
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Configure Modal (for connected integrations) ────────────────────
function ConfigureModal({
  integration,
  onClose,
}: {
  integration: IntegrationItem;
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = useState<"general" | "sync" | "credentials">("general");
  const [showSecret, setShowSecret] = useState(false);
  const isOAuth = integration.authType === "oauth" || integration.authType === "oauth_key";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative bg-white rounded-2xl shadow-panel w-full max-w-xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center gap-3 p-5 border-b border-surface-100">
          <div className={`w-10 h-10 rounded-xl ${integration.logoBg} flex items-center justify-center`}>
            <span className={`text-sm font-bold ${integration.logoColor}`}>{integration.logo}</span>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-surface-900">Configure {integration.name}</h3>
            <p className="text-xs text-surface-500">Manage connection settings, sync rules & credentials</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface-100 transition-colors">
            <X className="w-4 h-4 text-surface-400" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-surface-100 px-5">
          {(["general", "sync", "credentials"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-xs font-medium border-b-2 transition-colors capitalize ${
                activeTab === tab
                  ? "border-brand-600 text-brand-700"
                  : "border-transparent text-surface-500 hover:text-surface-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-5 space-y-4 max-h-[400px] overflow-y-auto">
          {activeTab === "general" && (
            <>
              <div className="grid grid-cols-2 gap-3">
                {[
                  ["Status", "Active", "text-emerald-600"],
                  ["Connected Since", integration.connectedSince || "—", "text-surface-700"],
                  ["API Version", "Latest", "text-surface-700"],
                  ["Health Score", `${integration.healthScore}%`, integration.healthScore && integration.healthScore >= 90 ? "text-emerald-600" : "text-amber-600"],
                ].map(([label, value, color]) => (
                  <div key={label as string} className="p-3 rounded-lg bg-surface-50 border border-surface-100">
                    <div className="text-[10px] text-surface-400 uppercase tracking-wide">{label}</div>
                    <div className={`text-sm font-semibold ${color} mt-0.5`}>{value}</div>
                  </div>
                ))}
              </div>
              {integration.features && (
                <div>
                  <h4 className="text-xs font-semibold text-surface-700 mb-2">Enabled Features</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {integration.features.map((f) => (
                      <span key={f} className="px-2 py-1 text-[10px] font-medium rounded-md bg-brand-50 text-brand-700 ring-1 ring-brand-200">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === "sync" && (
            <>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-surface-700">Sync Frequency</label>
                  <select className="input-field text-xs mt-1">
                    <option>Real-time (webhooks)</option>
                    <option>Every 5 minutes</option>
                    <option>Every 15 minutes</option>
                    <option>Every 30 minutes</option>
                    <option>Every hour</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-surface-700">Last Sync</label>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-surface-600">{integration.lastSync || "Never"}</span>
                    <button className="btn-secondary text-xs flex items-center gap-1.5 py-1.5 px-3">
                      <RefreshCw className="w-3 h-3" /> Force Sync Now
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-surface-700">Records Synced</label>
                  <p className="text-xs text-surface-600 mt-1">
                    {integration.recordsSynced ? formatNumber(integration.recordsSynced) : "0"} total records
                  </p>
                </div>
              </div>
            </>
          )}

          {activeTab === "credentials" && (
            <>
              {isOAuth ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span className="text-xs font-semibold text-emerald-700">OAuth 2.0 — Authorized</span>
                    </div>
                    <p className="text-xs text-emerald-600">
                      Token is valid and auto-refreshes. Last refreshed 2 hours ago.
                    </p>
                  </div>
                  <button className="btn-secondary text-xs flex items-center gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5" /> Re-authorize
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-surface-700">{integration.authLabel}</label>
                    <div className="relative">
                      <input
                        type={showSecret ? "text" : "password"}
                        defaultValue="••••••••••••••••••••"
                        className="input-field pr-10 text-xs font-mono"
                        readOnly
                      />
                      <button
                        onClick={() => setShowSecret(!showSecret)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600"
                      >
                        {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <button className="btn-secondary text-xs flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5" /> Rotate Key
                  </button>
                </div>
              )}
              <div className="flex items-center gap-2 text-[10px] text-surface-400 pt-2">
                <Lock className="w-3 h-3" />
                Credentials encrypted with AES-256 at rest. Decrypted only during sync operations.
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-5 border-t border-surface-100">
          <button className="text-xs text-red-500 hover:text-red-600 font-medium px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors">
            Disconnect Integration
          </button>
          <button onClick={onClose} className="btn-primary text-sm px-6 py-2.5">
            Save Changes
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────
export default function IntegrationsPage() {
  const [view, setView] = useState<"connected" | "available">("connected");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey | "all">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [connectingIntegration, setConnectingIntegration] = useState<IntegrationItem | null>(null);
  const [configuringIntegration, setConfiguringIntegration] = useState<IntegrationItem | null>(null);

  const connected = allIntegrations.filter((i) => i.status === "connected");
  const available = allIntegrations.filter((i) => i.status === "available");

  const totalRecords = connected.reduce((s, i) => s + (i.recordsSynced || 0), 0);
  const avgHealth = Math.round(connected.reduce((s, i) => s + (i.healthScore || 0), 0) / connected.length);

  // Filter logic
  const currentList = view === "connected" ? connected : available;
  const filtered = currentList.filter((i) => {
    const matchesSearch = !search || i.name.toLowerCase().includes(search.toLowerCase()) || i.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "all" || i.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Group by category for available view
  const groupedByCategory = categories
    .map((cat) => ({
      ...cat,
      items: filtered.filter((i) => i.category === cat.key),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <div className="space-y-5">
      {/* Modals */}
      <AnimatePresence>
        {connectingIntegration && (
          <ConnectionModal
            integration={connectingIntegration}
            onClose={() => setConnectingIntegration(null)}
          />
        )}
        {configuringIntegration && (
          <ConfigureModal
            integration={configuringIntegration}
            onClose={() => setConfiguringIntegration(null)}
          />
        )}
      </AnimatePresence>

      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
            <Plug className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-surface-900 tracking-tight">Integrations Hub</h1>
            <p className="text-xs text-surface-500">
              Connect your tech stack to power operational intelligence across every function
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-surface-400">
            {connected.length} connected · {available.length} available
          </span>
        </div>
      </motion.div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        {[
          { label: "Connected", value: `${connected.length} of ${allIntegrations.length}`, sub: "integrations active", icon: CheckCircle2, bg: "bg-emerald-50", color: "#10b981" },
          { label: "Records Synced", value: totalRecords > 1000000 ? `${(totalRecords / 1000000).toFixed(1)}M` : formatNumber(totalRecords), sub: "total data points", icon: Database, bg: "bg-blue-50", color: "#3b82f6" },
          { label: "Categories Covered", value: `${new Set(connected.map((c) => c.category)).size} of ${categories.length}`, sub: "functional areas", icon: FolderKanban, bg: "bg-amber-50", color: "#f59e0b" },
          { label: "Avg Health Score", value: `${avgHealth}%`, sub: "across all connections", icon: Shield, bg: "bg-purple-50", color: "#8b5cf6" },
        ].map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="kpi-card"
          >
            <div className={`w-9 h-9 rounded-lg ${card.bg} flex items-center justify-center mb-3`}>
              <card.icon className="w-4.5 h-4.5" style={{ color: card.color }} />
            </div>
            <div className="text-xs font-medium text-surface-500 mb-1">{card.label}</div>
            <div className="text-lg font-bold text-surface-900">{card.value}</div>
            <div className="text-[10px] text-surface-400 mt-0.5">{card.sub}</div>
          </motion.div>
        ))}
      </div>

      {/* Connected / Available Tabs + Search */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-1 bg-surface-50 rounded-lg p-0.5 border border-surface-200">
          {[
            { key: "connected" as const, label: `Connected (${connected.length})`, icon: CheckCircle2 },
            { key: "available" as const, label: `Available (${available.length})`, icon: Sparkles },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => { setView(tab.key); setSearch(""); setSelectedCategory("all"); setExpandedId(null); }}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-1.5 ${
                view === tab.key
                  ? "bg-white text-surface-900 shadow-sm"
                  : "text-surface-500 hover:text-surface-700"
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
          <input
            type="text"
            placeholder="Search integrations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 rounded-lg border border-surface-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all w-56"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X className="w-3.5 h-3.5 text-surface-400" />
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Pills (shown on Available tab) */}
      {view === "available" && (
        <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              selectedCategory === "all"
                ? "bg-brand-700 text-white shadow-sm"
                : "bg-white text-surface-600 border border-surface-200 hover:border-surface-300"
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => {
            const count = available.filter((a) => a.category === cat.key).length;
            if (count === 0) return null;
            return (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(selectedCategory === cat.key ? "all" : cat.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                  selectedCategory === cat.key
                    ? "bg-brand-700 text-white shadow-sm"
                    : "bg-white text-surface-600 border border-surface-200 hover:border-surface-300"
                }`}
              >
                <cat.icon className="w-3 h-3" />
                {cat.label}
                <span className={`text-[10px] ${selectedCategory === cat.key ? "text-white/70" : "text-surface-400"}`}>({count})</span>
              </button>
            );
          })}
        </motion.div>
      )}

      {/* ── CONNECTED VIEW ── */}
      {view === "connected" && (
        <div className="space-y-3">
          {filtered.map((integration, i) => {
            const isExpanded = expandedId === integration.id;
            const cat = categories.find((c) => c.key === integration.category)!;

            return (
              <motion.div
                key={integration.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="glass-card overflow-hidden"
              >
                {/* Main Row */}
                <div
                  className="p-5 flex items-center gap-4 cursor-pointer hover:bg-surface-50/50 transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : integration.id)}
                >
                  <div className={`w-11 h-11 rounded-xl ${integration.logoBg} flex items-center justify-center shrink-0`}>
                    <span className={`text-sm font-bold ${integration.logoColor}`}>{integration.logo}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-surface-900">{integration.name}</h3>
                      <span className="badge ring-1 bg-emerald-50 text-emerald-600 ring-emerald-200">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Active
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ring-1 ${cat.bg} ${cat.color} ${cat.ringColor}`}>
                        {cat.label}
                      </span>
                    </div>
                    <p className="text-xs text-surface-500 mt-0.5 truncate">{integration.description}</p>
                  </div>

                  <div className="hidden lg:flex items-center gap-6 shrink-0">
                    <div className="text-right">
                      <div className="text-[10px] text-surface-400 uppercase tracking-wide">Last Sync</div>
                      <div className="text-xs font-medium text-surface-700 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {integration.lastSync}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-surface-400 uppercase tracking-wide">Health</div>
                      <div className={`text-xs font-bold ${(integration.healthScore || 0) >= 90 ? "text-emerald-600" : "text-amber-600"}`}>
                        {integration.healthScore}%
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={(e) => { e.stopPropagation(); setConfiguringIntegration(integration); }}
                      className="p-2 rounded-lg border border-surface-200 hover:bg-surface-50 transition-colors"
                      title="Configure"
                    >
                      <Settings className="w-4 h-4 text-surface-500" />
                    </button>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-surface-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-surface-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 border-t border-surface-100 pt-4 space-y-4">
                        {/* Data Points */}
                        {integration.dataPoints && (
                          <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
                            {integration.dataPoints.map((dp) => (
                              <div key={dp.label} className="p-3 rounded-lg bg-surface-50 border border-surface-100">
                                <div className="text-[10px] text-surface-500 uppercase tracking-wide">{dp.label}</div>
                                <div className="text-sm font-bold text-surface-900 mt-0.5">{dp.value}</div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Connection Details + Features */}
                        <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-2.5">
                            <h4 className="text-xs font-semibold text-surface-700">Connection Details</h4>
                            {[
                              ["Connected Since", integration.connectedSince || "—"],
                              ["Auth Method", integration.authLabel],
                              ["Sync Frequency", integration.syncFrequency || "—"],
                              ["Records Synced", integration.recordsSynced ? formatNumber(integration.recordsSynced) : "0"],
                            ].map(([label, val]) => (
                              <div key={label} className="flex justify-between text-xs">
                                <span className="text-surface-500">{label}</span>
                                <span className="font-medium text-surface-700">{val}</span>
                              </div>
                            ))}
                          </div>
                          {integration.features && (
                            <div>
                              <h4 className="text-xs font-semibold text-surface-700 mb-2.5">Synced Features</h4>
                              <div className="flex flex-wrap gap-1.5">
                                {integration.features.map((f) => (
                                  <span key={f} className="px-2 py-1 text-[10px] font-medium rounded-md bg-brand-50 text-brand-700 ring-1 ring-brand-200">
                                    {f}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 pt-2 border-t border-surface-100">
                          <button className="btn-secondary text-xs flex items-center gap-1.5">
                            <RefreshCw className="w-3.5 h-3.5" /> Force Sync
                          </button>
                          <button
                            onClick={() => setConfiguringIntegration(integration)}
                            className="btn-secondary text-xs flex items-center gap-1.5"
                          >
                            <Settings className="w-3.5 h-3.5" /> Configure
                          </button>
                          <button className="btn-secondary text-xs flex items-center gap-1.5">
                            <ExternalLink className="w-3.5 h-3.5" /> View in {integration.name}
                          </button>
                          <div className="ml-auto">
                            <button className="text-xs text-red-500 hover:text-red-600 font-medium px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors">
                              Disconnect
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}

          {filtered.length === 0 && (
            <div className="text-center py-12 text-surface-400">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No connected integrations match your search.</p>
            </div>
          )}
        </div>
      )}

      {/* ── AVAILABLE VIEW (grouped by category) ── */}
      {view === "available" && (
        <div className="space-y-6">
          {groupedByCategory.map((group, gi) => {
            const CatIcon = group.icon;
            return (
              <motion.div
                key={group.key}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: gi * 0.06 }}
              >
                {/* Category Header */}
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-8 h-8 rounded-lg ${group.bg} flex items-center justify-center`}>
                    <CatIcon className={`w-4 h-4 ${group.color}`} />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-surface-900">{group.label}</h2>
                    <p className="text-[11px] text-surface-500">{group.description}</p>
                  </div>
                  <span className="text-[10px] text-surface-400 ml-auto bg-surface-100 px-2 py-0.5 rounded-full">
                    {group.items.length} {group.items.length === 1 ? "integration" : "integrations"}
                  </span>
                </div>

                {/* Integration Cards Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
                  {group.items.map((integration, ii) => (
                    <motion.div
                      key={integration.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: gi * 0.06 + ii * 0.03 }}
                      className="glass-card p-4 flex flex-col group"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-xl ${integration.logoBg} flex items-center justify-center shrink-0`}>
                          <span className={`text-sm font-bold ${integration.logoColor}`}>{integration.logo}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h3 className="text-sm font-semibold text-surface-900">{integration.name}</h3>
                            {integration.popular && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-amber-50 text-amber-600 ring-1 ring-amber-200">
                                Popular
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-surface-500 mt-0.5 line-clamp-2">{integration.description}</p>
                        </div>
                      </div>

                      {/* Auth method badge */}
                      <div className="flex items-center gap-2 mb-3 mt-auto">
                        <span className="flex items-center gap-1 text-[10px] text-surface-400 bg-surface-50 px-2 py-1 rounded-md">
                          {integration.authType === "oauth" || integration.authType === "oauth_key" ? (
                            <Globe className="w-3 h-3" />
                          ) : (
                            <Key className="w-3 h-3" />
                          )}
                          {integration.authLabel}
                        </span>
                      </div>

                      {/* Connect Button */}
                      <button
                        onClick={() => setConnectingIntegration(integration)}
                        className="w-full py-2.5 rounded-xl text-xs font-semibold border border-surface-200 text-surface-700 hover:bg-brand-700 hover:text-white hover:border-brand-700 transition-all flex items-center justify-center gap-1.5 group-hover:border-brand-300"
                      >
                        <Link2 className="w-3.5 h-3.5" />
                        Connect
                      </button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })}

          {groupedByCategory.length === 0 && (
            <div className="text-center py-12 text-surface-400">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No integrations match your search.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
