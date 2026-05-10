"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Activity, ArrowRight, Database, Network, Zap } from "lucide-react";
import { DashboardNavigation } from "@/components/dashboard-navigation";
import { Button } from "@/components/ui/button";

const dashboardPages = [
  {
    title: "Investigation Console",
    href: "/investigation",
    description: "Run GraphRAG threat investigations and inspect the attack-chain graph.",
    icon: Network,
    metric: "Live analysis",
    accent: "text-primary",
  },
  {
    title: "Benchmark Dashboard",
    href: "/benchmark",
    description: "Compare LLM-only, vector RAG, and GraphRAG pipelines side by side.",
    icon: Zap,
    metric: "3 pipelines",
    accent: "text-yellow-400",
  },
  {
    title: "Dataset Explorer",
    href: "/dataset",
    description: "Browse threat actors, CVEs, malware, and graph relationships.",
    icon: Database,
    metric: "14,284 entities",
    accent: "text-green-400",
  },
];

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-background font-sans">
      <DashboardNavigation />

      <section className="pt-24 pb-12 px-6 lg:px-8 max-w-[1600px] mx-auto w-full">
        <div className="flex flex-col gap-3 mb-8">
          <div className="flex items-center gap-2 text-sm font-mono text-primary">
            <Activity className="w-4 h-4" />
            IntelGraph Operations
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground max-w-2xl">
            Access all three IntelGraph workspaces from one place.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {dashboardPages.map((page, index) => (
            <motion.div
              key={page.href}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="glass-panel border border-border/50 rounded-lg p-6 hover:border-primary/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-4 mb-6">
                <div className="w-11 h-11 rounded-lg bg-secondary/60 border border-border/50 flex items-center justify-center">
                  <page.icon className={`w-5 h-5 ${page.accent}`} />
                </div>
                <span className="text-xs font-mono text-muted-foreground border border-border/50 rounded-md px-2 py-1">
                  {page.metric}
                </span>
              </div>

              <h2 className="text-xl font-semibold mb-2">{page.title}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed min-h-12">
                {page.description}
              </p>

              <Button asChild className="mt-6 w-full bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href={page.href}>
                  Open
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}
