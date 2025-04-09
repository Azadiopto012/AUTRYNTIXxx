import React, { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import OverviewCard from "@/components/dashboard/OverviewCard";
import { useWallet } from "@/lib/walletAdapter";
import { useLocation } from "wouter";
import { getTokenCount, getMCPCount, getLLMCount } from "@/lib/dashboardMetrics";
import { formatCurrency, formatPercentage } from "@/lib/utils";

const Dashboard: React.FC = () => {
  const { wallet } = useWallet();
  const [location, setLocation] = useLocation();
  const [metrics, setMetrics] = useState({
    tokenCount: 0,
    mcpCount: 0,
    llmCount: 0,
  });

  // Load metrics on component mount
  useEffect(() => {
    setMetrics({
      tokenCount: getTokenCount(),
      mcpCount: getMCPCount(),
      llmCount: getLLMCount(),
    });
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      <Header title="Dashboard" wallet={wallet} />

      {/* Dashboard Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <OverviewCard
          title="Tokens Created"
          value={String(metrics.tokenCount)}
          description={wallet ? "Create more tokens in the Token Creator" : "Connect wallet to create tokens"}
          icon="ri-coin-line"
          iconColor="bg-brutalism-yellow"
          action={{
            label: "Create New Token",
            onClick: () => setLocation("/token-creator"),
          }}
        />

        <OverviewCard
          title="Total MCP"
          value={String(metrics.mcpCount)}
          description="Model Context Protocol integrations"
          icon="ri-cpu-line"
          iconColor="bg-brutalism-purple"
          action={{
            label: "View MCP Library",
            onClick: () => setLocation("/mcp"),
            color: "purple",
          }}
        />

        <OverviewCard
          title="LLM Library"
          value={String(metrics.llmCount)}
          icon="ri-ai-generate"
          iconColor="bg-brutalism-blue"
          description="Explore the LLM library collection"
          action={{
            label: "Browse LLMs",
            onClick: () => setLocation("/llm"),
            color: "blue",
          }}
        />
      </div>

      {/* Recent Activity */}
      <div className="mb-8">
        <h2 className="text-2xl font-mono font-bold mb-4">Recent Activity</h2>
        <div className="brutalist-card p-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-gray-700 pb-3">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-lg bg-brutalism-green flex items-center justify-center mr-4 border-2 border-black">
                  <i className="ri-token-line text-white"></i>
                </div>
                <div>
                  <p className="font-bold">Token Created</p>
                  <p className="text-sm text-gray-400">SOLX Token</p>
                </div>
              </div>
              <p className="text-sm text-gray-400">10 minutes ago</p>
            </div>

            <div className="flex items-center justify-between border-b border-gray-700 pb-3">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-lg bg-brutalism-blue flex items-center justify-center mr-4 border-2 border-black">
                  <i className="ri-coin-line text-white"></i>
                </div>
                <div>
                  <p className="font-bold">Wallet Connected</p>
                  <p className="text-sm text-gray-400">via Phantom</p>
                </div>
              </div>
              <p className="text-sm text-gray-400">25 minutes ago</p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-lg bg-brutalism-purple flex items-center justify-center mr-4 border-2 border-black">
                  <i className="ri-flow-chart text-white"></i>
                </div>
                <div>
                  <p className="font-bold">AI Agent Created</p>
                  <p className="text-sm text-gray-400">Market Analyzer Agent</p>
                </div>
              </div>
              <p className="text-sm text-gray-400">1 hour ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
