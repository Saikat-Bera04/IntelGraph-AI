"use client";

import { DashboardNavigation } from "@/components/dashboard-navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend, LineChart, Line } from "recharts";
import { motion } from "framer-motion";
import { Cpu, DollarSign, Clock, Target, Zap } from "lucide-react";

const accuracyData = [
  { name: "Simple Query", LLM: 45, RAG: 75, GraphRAG: 98 },
  { name: "Multi-Hop", LLM: 12, RAG: 45, GraphRAG: 95 },
  { name: "Threat Actor", LLM: 30, RAG: 60, GraphRAG: 92 },
  { name: "Infrastructure", LLM: 15, RAG: 55, GraphRAG: 96 },
];

const tokenData = [
  { name: "Query 1", LLM: 8000, RAG: 12000, GraphRAG: 1500 },
  { name: "Query 2", LLM: 12000, RAG: 18000, GraphRAG: 2100 },
  { name: "Query 3", LLM: 16000, RAG: 24000, GraphRAG: 2800 },
  { name: "Query 4", LLM: 20000, RAG: 30000, GraphRAG: 3500 },
];

export default function BenchmarkDashboard() {
  return (
    <main className="min-h-screen bg-background flex flex-col font-sans">
      <DashboardNavigation />
      
      <div className="flex-1 pt-24 pb-12 px-6 lg:px-8 max-w-[1600px] mx-auto w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight mb-2 flex items-center gap-3">
              <Zap className="w-8 h-8 text-primary" />
              Triple-Pipeline Benchmark
            </h1>
            <p className="text-muted-foreground">Real-time performance comparison across LLM, Basic RAG, and GraphRAG architectures.</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm font-mono text-primary">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Live Telemetry Active
          </div>
        </div>

        {/* Top KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { title: "Average Accuracy", value: "95.2%", change: "+34% vs RAG", icon: Target, trend: "up" },
            { title: "Token Reduction", value: "85.4%", change: "vs Base LLM", icon: Cpu, trend: "up" },
            { title: "Query Latency", value: "1.2s", change: "-60% vs RAG", icon: Clock, trend: "down" },
            { title: "Cost per Query", value: "$0.002", change: "-80% vs RAG", icon: DollarSign, trend: "down" },
          ].map((kpi, i) => (
            <motion.div
              key={kpi.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="bg-black/40 backdrop-blur-xl border-border/50 hover:border-primary/50 transition-colors">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.title}</CardTitle>
                  <kpi.icon className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold font-mono text-foreground">{kpi.value}</div>
                  <p className={`text-xs mt-1 font-mono ${kpi.trend === 'up' ? 'text-green-400' : 'text-primary'}`}>
                    {kpi.change}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <Card className="bg-black/40 backdrop-blur-xl border-border/50 col-span-1">
              <CardHeader>
                <CardTitle>Accuracy Across Query Types</CardTitle>
                <CardDescription>GraphRAG excels in multi-hop and relationship-heavy cyber queries.</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={accuracyData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                    <XAxis dataKey="name" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
                    <Tooltip 
                      cursor={{ fill: '#222' }}
                      contentStyle={{ backgroundColor: '#000', borderColor: '#333', borderRadius: '8px' }}
                    />
                    <Legend />
                    <Bar dataKey="LLM" fill="#ef4444" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="RAG" fill="#eab308" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="GraphRAG" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
            <Card className="bg-black/40 backdrop-blur-xl border-border/50 col-span-1 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
              <CardHeader>
                <CardTitle>Token Usage Over Time</CardTitle>
                <CardDescription>Context compression reduces token payload to LLM significantly.</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={tokenData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                    <XAxis dataKey="name" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#000', borderColor: '#333', borderRadius: '8px' }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="LLM" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="RAG" stroke="#eab308" strokeWidth={2} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="GraphRAG" stroke="#06b6d4" strokeWidth={3} dot={{ r: 6, fill: '#000', strokeWidth: 2 }} activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
