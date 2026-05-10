"use client";

import { useState } from "react";
import { DashboardNavigation } from "@/components/dashboard-navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Database, Fingerprint, ShieldAlert, FileCode2, Network, Filter } from "lucide-react";
import { motion } from "framer-motion";

const mockData = {
  actors: [
    { id: "TA0029", name: "APT29", alias: "Cozy Bear, NOBELIUM", origin: "Russia", targets: "Government, Think Tanks, Healthcare", severity: "Critical" },
    { id: "TA0003", name: "APT28", alias: "Fancy Bear, STRONTIUM", origin: "Russia", targets: "Defense, Energy, Media", severity: "High" },
    { id: "TA0010", name: "Lazarus Group", alias: "HIDDEN COBRA", origin: "North Korea", targets: "Financial, Cryptocurrency, Defense", severity: "Critical" },
  ],
  cves: [
    { id: "CVE-2023-23397", name: "Microsoft Outlook EoP", cvss: "9.8", exploitedBy: "APT29", status: "Exploited in wild" },
    { id: "CVE-2021-44228", name: "Log4Shell", cvss: "10.0", exploitedBy: "Multiple", status: "Widespread exploitation" },
    { id: "CVE-2024-21412", name: "Windows SmartScreen Bypass", cvss: "8.1", exploitedBy: "Water Hydra", status: "Active exploitation" },
  ],
  malware: [
    { id: "S0154", name: "Cobalt Strike", type: "Command and Control", associated: "APT29, APT32, FIN7", platform: "Windows" },
    { id: "S0552", name: "Sunburst", type: "Backdoor", associated: "APT29", platform: "Windows" },
    { id: "S0606", name: "TrickBot", type: "Trojan", associated: "Wizard Spider", platform: "Windows" },
  ]
};

export default function DatasetExplorer() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <main className="min-h-screen bg-background flex flex-col font-sans">
      <DashboardNavigation />
      
      <div className="flex-1 pt-24 pb-12 px-6 lg:px-8 max-w-[1600px] mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight mb-2 flex items-center gap-3">
              <Database className="w-8 h-8 text-primary" />
              Cyber Knowledge Graph Dataset
            </h1>
            <p className="text-muted-foreground">Browse the entities and relationships powering the IntelGraph AI multi-hop reasoning engine.</p>
          </div>
          
          <div className="flex items-center gap-4 bg-secondary/30 p-2 rounded-xl border border-border/50">
            <div className="flex flex-col px-4 border-r border-border/50">
              <span className="text-xs text-muted-foreground">Total Entities</span>
              <span className="text-lg font-mono font-semibold text-foreground">14,284</span>
            </div>
            <div className="flex flex-col px-4">
              <span className="text-xs text-muted-foreground">Relationships</span>
              <span className="text-lg font-mono font-semibold text-primary">89,102</span>
            </div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex items-center gap-3 mb-8">
          <div className="relative flex-1 max-w-2xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search threat actors, CVEs, malware families..." 
              className="pl-10 bg-black/40 border-border/50 focus-visible:ring-primary/50"
            />
          </div>
          <Button variant="outline" className="border-border/50 bg-black/40">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="actors" className="w-full">
          <TabsList className="mb-6 bg-black/40 border border-border/50">
            <TabsTrigger value="actors" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
              <Fingerprint className="w-4 h-4 mr-2" />
              Threat Actors
            </TabsTrigger>
            <TabsTrigger value="cves" className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400">
              <ShieldAlert className="w-4 h-4 mr-2" />
              Vulnerabilities
            </TabsTrigger>
            <TabsTrigger value="malware" className="data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400">
              <FileCode2 className="w-4 h-4 mr-2" />
              Malware
            </TabsTrigger>
          </TabsList>

          {/* Actors Content */}
          <TabsContent value="actors">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockData.actors.map((actor, i) => (
                <motion.div
                  key={actor.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-panel p-6 rounded-2xl border border-border/50 hover:border-primary/50 transition-all group relative overflow-hidden"
                >
                  <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-colors" />
                  
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">{actor.name}</h3>
                      <span className="text-xs font-mono text-muted-foreground">{actor.id}</span>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
                      {actor.severity}
                    </span>
                  </div>
                  
                  <div className="space-y-3 relative z-10">
                    <div>
                      <span className="text-xs text-muted-foreground block mb-1">Aliases</span>
                      <p className="text-sm">{actor.alias}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-xs text-muted-foreground block mb-1">Origin</span>
                        <p className="text-sm">{actor.origin}</p>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground block mb-1">Target Sectors</span>
                        <p className="text-sm truncate" title={actor.targets}>{actor.targets}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-border/50 relative z-10 flex justify-between items-center">
                    <span className="text-xs text-muted-foreground flex items-center">
                      <Network className="w-3 h-3 mr-1" />
                      14 Connected Entities
                    </span>
                    <Button variant="ghost" size="sm" className="h-8 text-primary hover:bg-primary/10 hover:text-primary">
                      Explore Graph
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* CVEs Content */}
          <TabsContent value="cves">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockData.cves.map((cve, i) => (
                <motion.div
                  key={cve.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-panel p-6 rounded-2xl border border-border/50 hover:border-orange-500/50 transition-all group relative overflow-hidden"
                >
                  <div className="absolute -right-10 -top-10 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl group-hover:bg-orange-500/10 transition-colors" />
                  
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div>
                      <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-orange-400 transition-colors">{cve.id}</h3>
                      <span className="text-sm text-muted-foreground line-clamp-1">{cve.name}</span>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-orange-500/10 text-orange-400 border border-orange-500/20">
                      CVSS {cve.cvss}
                    </span>
                  </div>
                  
                  <div className="space-y-3 relative z-10">
                    <div>
                      <span className="text-xs text-muted-foreground block mb-1">Known Exploitation</span>
                      <p className="text-sm font-medium text-red-400">{cve.status}</p>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block mb-1">Exploited By</span>
                      <p className="text-sm">{cve.exploitedBy}</p>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-border/50 relative z-10 flex justify-between items-center">
                    <span className="text-xs text-muted-foreground flex items-center">
                      <Network className="w-3 h-3 mr-1" />
                      8 Connected Entities
                    </span>
                    <Button variant="ghost" size="sm" className="h-8 text-orange-400 hover:bg-orange-500/10 hover:text-orange-400">
                      Explore Graph
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Malware Content */}
          <TabsContent value="malware">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockData.malware.map((mw, i) => (
                <motion.div
                  key={mw.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-panel p-6 rounded-2xl border border-border/50 hover:border-red-500/50 transition-all group relative overflow-hidden"
                >
                  <div className="absolute -right-10 -top-10 w-32 h-32 bg-red-500/5 rounded-full blur-2xl group-hover:bg-red-500/10 transition-colors" />
                  
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-red-400 transition-colors">{mw.name}</h3>
                      <span className="text-xs font-mono text-muted-foreground">{mw.id}</span>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-secondary text-foreground border border-border/50">
                      {mw.type}
                    </span>
                  </div>
                  
                  <div className="space-y-3 relative z-10">
                    <div>
                      <span className="text-xs text-muted-foreground block mb-1">Associated Actors</span>
                      <p className="text-sm">{mw.associated}</p>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block mb-1">Platform Target</span>
                      <p className="text-sm">{mw.platform}</p>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-border/50 relative z-10 flex justify-between items-center">
                    <span className="text-xs text-muted-foreground flex items-center">
                      <Network className="w-3 h-3 mr-1" />
                      24 Connected Entities
                    </span>
                    <Button variant="ghost" size="sm" className="h-8 text-red-400 hover:bg-red-500/10 hover:text-red-400">
                      Explore Graph
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
