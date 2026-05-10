"use client";

import { useState, useCallback, useEffect } from "react";
import { DashboardNavigation } from "@/components/dashboard-navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Send, ShieldAlert, Network, Cpu, FileText, Activity, Database, AlertTriangle, Fingerprint } from "lucide-react";
import { motion } from "framer-motion";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const initialNodes = [
  { id: '1', position: { x: 250, y: 50 }, data: { label: 'APT29 (Threat Actor)' }, style: { background: '#111', color: '#ff4444', border: '1px solid #ff4444', borderRadius: '8px', padding: '10px' } },
  { id: '2', position: { x: 100, y: 150 }, data: { label: 'Cobalt Strike (Malware)' }, style: { background: '#111', color: '#ffaa00', border: '1px solid #ffaa00', borderRadius: '8px', padding: '10px' } },
  { id: '3', position: { x: 400, y: 150 }, data: { label: 'CVE-2023-23397 (Exploit)' }, style: { background: '#111', color: '#ffaa00', border: '1px solid #ffaa00', borderRadius: '8px', padding: '10px' } },
  { id: '4', position: { x: 250, y: 250 }, data: { label: '192.168.1.45 (Target IP)' }, style: { background: '#111', color: '#00eeff', border: '1px solid #00eeff', borderRadius: '8px', padding: '10px' } },
  { id: '5', position: { x: 250, y: 350 }, data: { label: 'Healthcare Sector (Target)' }, style: { background: '#111', color: '#00ffaa', border: '1px solid #00ffaa', borderRadius: '8px', padding: '10px' } },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', label: 'USES', animated: true, style: { stroke: '#ffaa00' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#ffaa00' } },
  { id: 'e1-3', source: '1', target: '3', label: 'EXPLOITS', animated: true, style: { stroke: '#ffaa00' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#ffaa00' } },
  { id: 'e2-4', source: '2', target: '4', label: 'INFECTS', animated: true, style: { stroke: '#00eeff' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#00eeff' } },
  { id: 'e3-4', source: '3', target: '4', label: 'TARGETS', animated: true, style: { stroke: '#00eeff' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#00eeff' } },
  { id: 'e4-5', source: '4', target: '5', label: 'BELONGS_TO', animated: true, style: { stroke: '#00ffaa' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#00ffaa' } },
];

export default function InvestigationConsole() {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  
  const [streamingText, setStreamingText] = useState("");
  const [metrics, setMetrics] = useState<any>(null);

  const onConnect = useCallback((params: any) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    
    setIsSearching(true);
    setStreamingText("");
    setMetrics(null);
    
    try {
      const response = await fetch("http://localhost:8000/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });
      
      const data = await response.json();
      
      // Map the response
      const answer = data.graphrag?.answer || "No response received.";
      const runMetrics = {
        llm: data.llm_only?.metrics,
        rag: data.basic_rag?.metrics,
        graphrag: data.graphrag?.metrics
      };
      
      setMetrics(runMetrics);
      
      // Simulate streaming the real answer for UX
      let i = 0;
      const interval = setInterval(() => {
        setStreamingText(answer.substring(0, i));
        i += 5;
        if (i > answer.length) {
          clearInterval(interval);
          setIsSearching(false);
        }
      }, 20);
      
    } catch (error) {
      console.error("Error fetching from backend:", error);
      setStreamingText("Error connecting to the IntelGraph API. Please ensure the backend is running at localhost:8000.");
      setIsSearching(false);
    }
  };

  return (
    <main className="min-h-screen bg-background flex flex-col font-sans">
      <DashboardNavigation />
      
      <div className="flex-1 pt-16 flex flex-col overflow-hidden h-screen">
        {/* Top Search Bar */}
        <div className="p-4 border-b border-border/50 bg-black/40 backdrop-blur-md z-10 shrink-0">
          <form onSubmit={handleSearch} className="max-w-4xl mx-auto relative">
            <div className="relative flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask about threat actors, CVEs, or attack chains... (e.g. 'Which groups exploited Log4Shell against healthcare?')"
                className="w-full pl-12 pr-24 h-12 bg-secondary/30 border-primary/20 text-foreground placeholder:text-muted-foreground/50 rounded-xl focus-visible:ring-primary/50 text-base"
              />
              <Button 
                type="submit" 
                size="sm" 
                className="absolute right-2 h-8 px-4 bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={isSearching}
              >
                {isSearching ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  >
                    <Network className="w-4 h-4" />
                  </motion.div>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Analyze
                  </>
                )}
              </Button>
            </div>
            
            {/* Context compression indicator */}
            <div className="absolute -bottom-8 right-0 flex items-center gap-4 text-xs font-mono text-primary/70">
              <span className="flex items-center gap-1"><Cpu className="w-3 h-3" /> GraphRAG Active</span>
              <span className="flex items-center gap-1"><Activity className="w-3 h-3" /> Context Compressed: 85%</span>
            </div>
          </form>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left: Interactive Graph */}
          <div className="flex-1 relative border-r border-border/50 bg-black/20">
            <div className="absolute top-4 left-4 z-10 glass-panel px-3 py-1.5 rounded-md flex items-center gap-2 border border-border/50 text-sm font-medium">
              <Network className="w-4 h-4 text-primary" />
              Attack Chain Graph
            </div>
            
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              fitView
              className="dark"
            >
              <Background color="#333" gap={16} />
              <Controls className="bg-background border-border" />
              <MiniMap 
                nodeStrokeColor={(n) => {
                  if (n.style?.background) return n.style.background as string;
                  return '#eee';
                }}
                nodeColor={(n) => {
                  if (n.style?.background) return n.style.background as string;
                  return '#fff';
                }}
                nodeBorderRadius={2}
                className="bg-background border-border"
              />
            </ReactFlow>
          </div>

          {/* Right: AI Panel & Evidence */}
          <div className="w-[450px] shrink-0 flex flex-col bg-background/50 border-l border-border/50">
            <Tabs defaultValue="response" className="flex-1 flex flex-col overflow-hidden">
              <div className="px-4 py-3 border-b border-border/50 flex items-center justify-between">
                <TabsList className="bg-secondary/50">
                  <TabsTrigger value="response">AI Synthesis</TabsTrigger>
                  <TabsTrigger value="evidence">Evidence Chain</TabsTrigger>
                  <TabsTrigger value="metrics">Metrics</TabsTrigger>
                </TabsList>
              </div>

              {/* Response Tab */}
              <TabsContent value="response" className="flex-1 overflow-y-auto p-4 m-0 data-[state=active]:flex flex-col gap-4">
                <div className="glass-panel p-5 rounded-xl border border-primary/20 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary" />
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-primary" />
                    Investigation Result
                  </h3>
                  
                  <div className="prose prose-invert prose-sm">
                    {streamingText ? (
                      <p className="leading-relaxed text-muted-foreground whitespace-pre-wrap">{streamingText}</p>
                    ) : (
                      <div className="text-center py-10 text-muted-foreground/50">
                        <Network className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p>Submit a query to begin GraphRAG analysis.</p>
                      </div>
                    )}
                    {isSearching && (
                      <motion.span 
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ repeat: Infinity, duration: 0.8 }}
                        className="inline-block w-2 h-4 bg-primary ml-1 align-middle"
                      />
                    )}
                  </div>
                </div>

                {/* Extracted Entities */}
                {streamingText.length > 50 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-panel p-4 rounded-xl border border-border/50 mt-4"
                  >
                    <h4 className="text-sm font-medium mb-3 text-muted-foreground flex items-center gap-2">
                      <Database className="w-4 h-4" />
                      Extracted Graph Entities
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded text-xs font-mono">APT29</span>
                      <span className="px-2 py-1 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded text-xs font-mono">Cobalt Strike</span>
                      <span className="px-2 py-1 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded text-xs font-mono">CVE-2023-23397</span>
                      <span className="px-2 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded text-xs font-mono">Healthcare Sector</span>
                    </div>
                  </motion.div>
                )}
              </TabsContent>

              {/* Evidence Tab */}
              <TabsContent value="evidence" className="flex-1 overflow-y-auto p-4 m-0">
                <div className="space-y-4">
                  {[
                    { id: 1, type: 'CISA Advisory', title: 'AA23-074A', desc: 'Russian state-sponsored actors exploiting CVE-2023-23397.', icon: AlertTriangle, color: 'text-red-400' },
                    { id: 2, type: 'Malware Report', title: 'Cobalt Strike Beacon', desc: 'Analysis of payload delivery mechanism linked to APT29.', icon: FileText, color: 'text-orange-400' },
                    { id: 3, type: 'Threat Intel', title: 'Healthcare Targeting', desc: 'Increased scanning activity targeting sector infrastructure.', icon: Fingerprint, color: 'text-cyan-400' },
                  ].map((doc, i) => (
                    <motion.div 
                      key={doc.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="p-3 rounded-lg border border-border/50 bg-secondary/20 hover:bg-secondary/40 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-md bg-background ${doc.color}`}>
                          <doc.icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-mono text-muted-foreground">{doc.type}</span>
                            <span className="text-xs px-1.5 py-0.5 rounded bg-primary/10 text-primary">Match: 98%</span>
                          </div>
                          <h5 className="text-sm font-semibold mb-1 group-hover:text-primary transition-colors">{doc.title}</h5>
                          <p className="text-xs text-muted-foreground leading-snug">{doc.desc}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>

              {/* Metrics Tab */}
              <TabsContent value="metrics" className="flex-1 overflow-y-auto p-4 m-0">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium mb-4 text-muted-foreground">Pipeline Comparison</h4>
                    <div className="space-y-3">
                      <div className="p-3 rounded-lg border border-border/50 bg-background/50">
                        <div className="flex justify-between text-xs mb-2">
                          <span className="font-mono text-red-400">LLM Only (No Context)</span>
                          <span className="text-muted-foreground">Accuracy: 24%</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-1.5">
                          <div className="bg-red-400 h-1.5 rounded-full" style={{ width: '24%' }}></div>
                        </div>
                      </div>
                      
                      <div className="p-3 rounded-lg border border-border/50 bg-background/50">
                        <div className="flex justify-between text-xs mb-2">
                          <span className="font-mono text-yellow-400">Basic RAG (Vector Search)</span>
                          <span className="text-muted-foreground">Accuracy: 61%</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-1.5">
                          <div className="bg-yellow-400 h-1.5 rounded-full" style={{ width: '61%' }}></div>
                        </div>
                      </div>

                      <div className="p-3 rounded-lg border border-primary/30 bg-primary/5 shadow-[0_0_15px_rgba(0,255,255,0.1)]">
                        <div className="flex justify-between text-xs mb-2">
                          <span className="font-mono text-primary font-bold">IntelGraph (GraphRAG)</span>
                          <span className="text-primary font-bold">Accuracy: 98%</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-1.5">
                          <div className="bg-primary h-1.5 rounded-full shadow-[0_0_10px_rgba(0,255,255,0.8)]" style={{ width: '98%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg border border-border/50 bg-secondary/10">
                      <div className="text-xs text-muted-foreground mb-1">Tokens Used</div>
                      <div className="text-xl font-mono text-foreground">
                        {metrics ? metrics.graphrag.tokens_used : "842"} 
                        <span className="text-xs text-green-400 ml-1">↓ {metrics ? Math.round((1 - metrics.graphrag.tokens_used / metrics.llm.tokens_used) * 100) : "85"}%</span>
                      </div>
                    </div>
                    <div className="p-3 rounded-lg border border-border/50 bg-secondary/10">
                      <div className="text-xs text-muted-foreground mb-1">Latency</div>
                      <div className="text-xl font-mono text-foreground">
                        {metrics ? metrics.graphrag.latency_seconds.toFixed(2) : "1.2"}s 
                        <span className="text-xs text-green-400 ml-1">↓ {metrics ? Math.round((1 - metrics.graphrag.latency_seconds / metrics.rag.latency_seconds) * 100) : "60"}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </main>
  );
}
