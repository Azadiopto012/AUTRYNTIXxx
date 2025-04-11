import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import { useWallet } from '@/lib/walletAdapter';
import { BrutalistCard } from '@/components/ui/brutalist-card';
import { ExternalLink, Server, Code, Shield, Award, Globe, RefreshCw, CheckCircle, XCircle, AlertTriangle, Clock } from 'lucide-react';

interface MCPEntry {
  name: string;
  description: string;
  url: string;
  category: string;
  license?: string;
  security?: string;
  quality?: string;
  official?: boolean;
  language?: string;
  status?: 'online' | 'offline' | 'unknown';
  requiresAuth?: boolean;
  lastUpdated?: string;
  baseUrl?: string;
  documentation?: string;
}

interface FilterOption {
  id: string;
  label: string;
  count: number;
}

const MCPPage: React.FC = () => {
  const { wallet } = useWallet();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [mcpData, setMcpData] = useState<MCPEntry[]>([]);
  
  // Add beta mode state
  const [isBetaMode, setIsBetaMode] = useState<boolean>(true);
  
  // Initial MCP data
  const initialMcpData: MCPEntry[] = [
    // Core MCP Servers
    {
      name: "302AI Sandbox MCP Server",
      description: "Model Context Protocol (MCP) server for Claude Desktop that connects to 302AI's API services",
      url: "https://github.com/302ai/mcp-server",
      category: "Core",
      license: "MIT",
      security: "high",
      quality: "high",
      official: true,
      language: "JavaScript",
      status: "online"
    },
    {
      name: "Tavily MCP Server",
      description: "Enables AI systems to integrate with Tavily's search and data extraction tools",
      url: "https://github.com/tavily-ai/mcp-server",
      category: "Core",
      license: "MIT",
      security: "high",
      quality: "high",
      official: true,
      language: "JavaScript",
      status: "online"
    },
    {
      name: "Inkdrop MCP Server",
      description: "Integrates Inkdrop note-taking app with Claude AI through Model Context Protocol",
      url: "https://github.com/inkdropapp/mcp-server",
      category: "Core",
      license: "Apache-2.0",
      security: "high",
      quality: "high",
      official: true,
      language: "JavaScript",
      status: "online"
    },
    {
      name: "Genkit MCP",
      description: "Provides integration between Genkit and the Model Context Protocol (MCP)",
      url: "https://github.com/firebase/genkit-mcp",
      category: "Core",
      license: "Apache-2.0",
      security: "high",
      quality: "high",
      official: true,
      language: "TypeScript",
      status: "online"
    },
    {
      name: "Vectorize",
      description: "Vectorize MCP server for advanced retrieval, Private Deep Research, and file extraction",
      url: "https://github.com/vectorize-io/mcp-server",
      category: "Core",
      license: "MIT",
      security: "high",
      quality: "high",
      official: true,
      language: "JavaScript",
      status: "online"
    },
    {
      name: "Elasticsearch MCP Server",
      description: "Connects Claude and other MCP clients to Elasticsearch data",
      url: "https://github.com/elastic/mcp-server",
      category: "Core",
      license: "Apache-2.0",
      security: "high",
      quality: "high",
      official: true,
      language: "JavaScript",
      status: "online"
    },
    {
      name: "PostHog MCP Server",
      description: "Enables Claude Desktop users to interact directly with PostHog",
      url: "https://github.com/PostHog/mcp-server",
      category: "Core",
      license: "MIT",
      security: "high",
      quality: "high",
      official: true,
      language: "Python",
      status: "online"
    },
    {
      name: "JSON Resume MCP Server",
      description: "Enhances AI assistants with the ability to update your JSON Resume",
      url: "https://github.com/jsonresume/mcp-server",
      category: "Core",
      license: "The Unlicense",
      security: "high",
      quality: "high",
      official: true,
      language: "TypeScript",
      status: "online"
    },
    {
      name: "Audiense Insights MCP Server",
      description: "Enables interaction with Audiense Insights accounts via the Model Context Protocol",
      url: "https://github.com/AudienseCo/mcp-server",
      category: "Core",
      license: "Apache-2.0",
      security: "high",
      quality: "high",
      official: true,
      language: "TypeScript",
      status: "online"
    },
    {
      name: "Hologres MCP Server",
      description: "Enables AI Agents to communicate with Hologres databases",
      url: "https://github.com/aliyun/mcp-server",
      category: "Core",
      license: "Apache-2.0",
      security: "high",
      quality: "high",
      official: true,
      language: "Python",
      status: "online"
    },
    {
      name: "CodeLogic",
      description: "Interact with CodeLogic, a Software Intelligence platform",
      url: "https://github.com/CodeLogicIncEngineering/mcp-server",
      category: "Core",
      license: "Mozilla Public License 2.0",
      security: "high",
      quality: "high",
      official: true,
      language: "Python",
      status: "online"
    },
    {
      name: "Sensei MCP",
      description: "Provides expert guidance for Dojo and Cairo development on Starknet",
      url: "https://github.com/dojoengine/mcp-server",
      category: "Core",
      license: "MIT",
      security: "high",
      quality: "high",
      official: true,
      language: "TypeScript",
      status: "online"
    },
    {
      name: "Paddle MCP Server",
      description: "Provides tools for interacting with the Paddle Billing API",
      url: "https://github.com/PaddleHQ/mcp-server",
      category: "Core",
      license: "Apache-2.0",
      security: "high",
      quality: "high",
      official: true,
      language: "TypeScript",
      status: "online"
    },
    {
      name: "Opik MCP Server",
      description: "Implementation of the Model Context Protocol for the Opik platform",
      url: "https://github.com/comet-ml/mcp-server",
      category: "Core",
      license: "Apache-2.0",
      security: "high",
      quality: "high",
      official: true,
      language: "TypeScript",
      status: "online"
    },
    {
      name: "@chargebee/mcp",
      description: "MCP Server that connects AI agents to Chargebee Platform",
      url: "https://github.com/chargebee/mcp-server",
      category: "Core",
      license: "MIT",
      security: "high",
      quality: "high",
      official: true,
      language: "TypeScript",
      status: "online"
    },
    {
      name: "Astra DB MCP Server",
      description: "Allows Large Language Models to interact with Astra DB databases",
      url: "https://github.com/datastax/mcp-server",
      category: "Core",
      license: "Apache-2.0",
      security: "high",
      quality: "high",
      official: true,
      language: "TypeScript",
      status: "online"
    },
    {
      name: "Lara Translate MCP Server",
      description: "Provides machine translation capabilities via the Lara Translate API",
      url: "https://github.com/translated/mcp-server",
      category: "Core",
      license: "MIT",
      security: "high",
      quality: "high",
      official: true,
      language: "TypeScript",
      status: "online"
    },
    {
      name: "Nefino MCP Server",
      description: "Provides access to news and information about renewable energy projects",
      url: "https://github.com/nefino/mcp-server",
      category: "Core",
      license: "Apache-2.0",
      security: "high",
      quality: "high",
      official: true,
      language: "Python",
      status: "online"
    },
    {
      name: "LlamaCloud MCP Server",
      description: "Connects to a managed index on LlamaCloud",
      url: "https://github.com/run-llama/mcp-server",
      category: "Core",
      license: "MIT",
      security: "high",
      quality: "high",
      official: true,
      language: "JavaScript",
      status: "online"
    },
    {
      name: "Tinybird MCP server",
      description: "Interact with a Tinybird Workspace from any MCP client",
      url: "https://github.com/tinybirdco/mcp-server",
      category: "Core",
      license: "Apache-2.0",
      security: "high",
      quality: "high",
      official: true,
      language: "Python",
      status: "online"
    },
    {
      name: "BigGo MCP Server",
      description: "Enables product searches across e-commerce platforms",
      url: "https://github.com/Funmula-Corp/mcp-server",
      category: "Core",
      license: "MIT",
      security: "high",
      quality: "high",
      official: true,
      language: "Python",
      status: "online"
    },
    {
      name: "mcp-clickhouse",
      description: "ClickHouse database integration with schema inspection and query capabilities",
      url: "https://github.com/ClickHouse/mcp-server",
      category: "Core",
      license: "Apache-2.0",
      security: "high",
      quality: "high",
      official: true,
      language: "Python",
      status: "online"
    },
    {
      name: "Make MCP Server",
      description: "Transform your Make scenarios into callable tools for AI assistants",
      url: "https://github.com/integromat/mcp-server",
      category: "Core",
      license: "MIT",
      security: "high",
      quality: "high",
      official: true,
      language: "TypeScript",
      status: "online"
    },
    {
      name: "Needle MCP Server",
      description: "Manage documents and perform Claude-powered searches using Needle",
      url: "https://github.com/needle-ai/mcp-server",
      category: "Core",
      license: "MIT",
      security: "high",
      quality: "high",
      official: true,
      language: "Python",
      status: "online"
    },
    {
      name: "Eyevinn Open Source Cloud MCP Server",
      description: "MCP Server for Eyevinn Open Source Cloud API",
      url: "https://github.com/EyevinnOSC/mcp-server",
      category: "Core",
      license: "MIT",
      security: "high",
      quality: "high",
      official: true,
      language: "TypeScript",
      status: "online"
    },
    {
      name: "Square MCP Server",
      description: "Enables interaction with Square's API via Goose",
      url: "https://github.com/block/mcp-server",
      category: "Core",
      license: "MIT",
      security: "high",
      quality: "high",
      official: true,
      language: "Python",
      status: "online"
    },
    {
      name: "Graphlit MCP Server",
      description: "Enables integration between MCP clients and the Graphlit service",
      url: "https://github.com/graphlit/mcp-server",
      category: "Core",
      license: "MIT",
      security: "high",
      quality: "high",
      official: true,
      language: "TypeScript",
      status: "online"
    },
    {
      name: "MetaMCP MCP Server",
      description: "A proxy server that unifies multiple MCP servers",
      url: "https://github.com/metatool-ai/mcp-server",
      category: "Core",
      license: "Apache-2.0",
      security: "high",
      quality: "high",
      official: true,
      language: "TypeScript",
      status: "online"
    },
    {
      name: "Redis Cloud API MCP Server",
      description: "Provides an MCP Server for Redis Cloud's API",
      url: "https://github.com/redis/mcp-server",
      category: "Core",
      license: "MIT",
      security: "high",
      quality: "high",
      official: true,
      language: "TypeScript",
      status: "online"
    },
    {
      name: "UseGrant MCP Server",
      description: "Provides tools for managing providers, clients, tenants, and access tokens",
      url: "https://github.com/usegranthq/mcp-server",
      category: "Core",
      license: "MIT",
      security: "high",
      quality: "high",
      official: true,
      language: "JavaScript",
      status: "online"
    },
    {
      name: "Aiven MCP Server",
      description: "Provides access to Aiven services (PostgreSQL, Kafka, ClickHouse, Valkey, OpenSearch)",
      url: "https://github.com/Aiven-Open/mcp-server",
      category: "Core",
      license: "Apache-2.0",
      security: "high",
      quality: "high",
      official: true,
      language: "Python",
      status: "online"
    },
    {
      name: "Semgrep MCP Server",
      description: "Provides a comprehensive interface to Semgrep",
      url: "https://github.com/semgrep/mcp-server",
      category: "Core",
      license: "MIT",
      security: "high",
      quality: "high",
      official: true,
      language: "Python",
      status: "online"
    },
    
    // Agent Frameworks
    {
      name: "LangChain",
      description: "Framework for developing applications powered by language models",
      url: "https://github.com/langchain-ai/langchain",
      category: "Agent Frameworks",
      license: "MIT",
      security: "high",
      quality: "high",
      language: "Python",
      status: "online"
    },
    {
      name: "AutoGPT",
      description: "Autonomous GPT-based agent that performs tasks with minimal human input",
      url: "https://github.com/Significant-Gravitas/Auto-GPT",
      category: "Agent Frameworks",
      license: "MIT",
      security: "medium",
      quality: "high",
      language: "Python",
      status: "online"
    },
    {
      name: "BabyAGI",
      description: "A simple AI agent that uses OpenAI and vector DBs to complete tasks",
      url: "https://github.com/yoheinakajima/babyagi",
      category: "Agent Frameworks",
      license: "MIT",
      security: "medium",
      quality: "medium",
      language: "Python",
      status: "online"
    },
    {
      name: "AgentGPT",
      description: "UI-based autonomous agent that runs in browser",
      url: "https://github.com/reworkd/AgentGPT",
      category: "Agent Frameworks",
      license: "MIT",
      security: "medium",
      quality: "high",
      language: "TypeScript",
      status: "online"
    },
    {
      name: "OpenAgents",
      description: "Flexible LLM agent framework with modular planning & tools",
      url: "https://github.com/xlang-ai/OpenAgents",
      category: "Agent Frameworks",
      license: "MIT",
      security: "medium",
      quality: "high",
      language: "Python",
      status: "online"
    },
    {
      name: "SuperAGI",
      description: "Production-grade agent framework with GUI, task queues, and vector DBs",
      url: "https://github.com/TransformerOptimus/SuperAGI",
      category: "Agent Frameworks",
      license: "MIT",
      security: "high",
      quality: "high",
      language: "Python",
      status: "online"
    },
    {
      name: "CrewAI",
      description: "Multi-agent framework with team & role structure",
      url: "https://github.com/joaomdmoura/crewAI",
      category: "Agent Frameworks",
      license: "MIT",
      security: "medium",
      quality: "high",
      language: "Python",
      status: "online"
    },
    {
      name: "CAMEL",
      description: "Collaborative agents using role-play dialogues",
      url: "https://github.com/camel-ai/camel",
      category: "Agent Frameworks",
      license: "Apache-2.0",
      security: "medium",
      quality: "high",
      language: "Python",
      status: "online"
    },
    {
      name: "MetaGPT",
      description: "Multi-agent system that mimics software engineering team roles",
      url: "https://github.com/geekan/MetaGPT",
      category: "Agent Frameworks",
      license: "MIT",
      security: "medium",
      quality: "high",
      language: "Python",
      status: "online"
    },
    {
      name: "AWA (Agent Work Arena)",
      description: "Agent ecosystem focused on composability",
      url: "https://github.com/awa-ai/awa",
      category: "Agent Frameworks",
      license: "MIT",
      security: "medium",
      quality: "high",
      language: "Python",
      status: "online"
    },
    
    // Toolchains & Tools
    {
      name: "LangGraph",
      description: "LangChain-powered stateful agents with graph planning",
      url: "https://github.com/langchain-ai/langgraph",
      category: "Toolchains & Tools",
      license: "MIT",
      security: "high",
      quality: "high",
      language: "Python",
      status: "online"
    },
    {
      name: "Autogen",
      description: "Microsoft's multi-agent orchestration library",
      url: "https://github.com/microsoft/autogen",
      category: "Toolchains & Tools",
      license: "MIT",
      security: "high",
      quality: "high",
      language: "Python",
      status: "online"
    },
    {
      name: "Gorilla",
      description: "Agent-LLM powered by Gorilla LLM models and APIs",
      url: "https://github.com/ShishirPatil/gorilla",
      category: "Toolchains & Tools",
      license: "Apache-2.0",
      security: "medium",
      quality: "high",
      language: "Python",
      status: "online"
    },
    {
      name: "LlamaIndex",
      description: "Data framework for LLM agents to access private data",
      url: "https://github.com/run-llama/llama_index",
      category: "Toolchains & Tools",
      license: "MIT",
      security: "high",
      quality: "high",
      language: "Python",
      status: "online"
    },
    {
      name: "Semantic Kernel",
      description: "Lightweight SDK from Microsoft for building semantic agents",
      url: "https://github.com/microsoft/semantic-kernel",
      category: "Toolchains & Tools",
      license: "MIT",
      security: "high",
      quality: "high",
      language: "C#",
      status: "online"
    },
    {
      name: "ToolLLM",
      description: "Toolkit-first agent framework optimized for tool calling",
      url: "https://github.com/OpenBMB/ToolLLM",
      category: "Toolchains & Tools",
      license: "Apache-2.0",
      security: "medium",
      quality: "high",
      language: "Python",
      status: "online"
    },
    {
      name: "Flowise",
      description: "Drag-and-drop visual builder for LLM flows",
      url: "https://github.com/FlowiseAI/Flowise",
      category: "Toolchains & Tools",
      license: "MIT",
      security: "medium",
      quality: "high",
      language: "TypeScript",
      status: "online"
    },
    {
      name: "PromptLayer",
      description: "Prompt version control and debugging for agents",
      url: "https://github.com/MagnivOrg/prompt-layer-docs",
      category: "Toolchains & Tools",
      license: "MIT",
      security: "medium",
      quality: "high",
      language: "Python",
      status: "online"
    },
    {
      name: "Promptfoo",
      description: "Testing framework for prompt engineering",
      url: "https://github.com/promptfoo/promptfoo",
      category: "Toolchains & Tools",
      license: "MIT",
      security: "medium",
      quality: "high",
      language: "TypeScript",
      status: "online"
    },
    
    // Infra & Execution
    {
      name: "ReWOO",
      description: "Modular reasoning agent with external memory integration",
      url: "https://github.com/google-research/google-research/tree/master/rewoo",
      category: "Infra & Execution",
      license: "Apache-2.0",
      security: "high",
      quality: "high",
      language: "Python",
      status: "online"
    },
    {
      name: "Marvin",
      description: "Framework for building AI-driven microservices",
      url: "https://github.com/PrefectHQ/marvin",
      category: "Infra & Execution",
      license: "Apache-2.0",
      security: "high",
      quality: "high",
      language: "Python",
      status: "online"
    },
    {
      name: "LangServe",
      description: "Deploy LangChain agents via FastAPI easily",
      url: "https://github.com/langchain-ai/langserve",
      category: "Infra & Execution",
      license: "MIT",
      security: "high",
      quality: "high",
      language: "Python",
      status: "online"
    },
    {
      name: "AIx",
      description: "Minimalist agent runtime for autonomous agents",
      url: "https://github.com/techmaxus/AIx",
      category: "Infra & Execution",
      license: "MIT",
      security: "medium",
      quality: "medium",
      language: "Python",
      status: "online"
    },
    {
      name: "Gaia-Agents",
      description: "Modular, distributed agent environment",
      url: "https://github.com/gaia-os/gaia-agents",
      category: "Infra & Execution",
      license: "MIT",
      security: "medium",
      quality: "medium",
      language: "Python",
      status: "online"
    },
    {
      name: "AutoGenStudio",
      description: "No-code UI for Microsoft Autogen agents",
      url: "https://github.com/microsoft/autogen/tree/main/samples/apps/autogen-studio",
      category: "Infra & Execution",
      license: "MIT",
      security: "high",
      quality: "high",
      language: "Python",
      status: "online"
    },
    {
      name: "BeLLM",
      description: "Tool-oriented agents with API tool ingestion",
      url: "https://github.com/openbmb/bellm",
      category: "Infra & Execution",
      license: "Apache-2.0",
      security: "medium",
      quality: "high",
      language: "Python",
      status: "online"
    },
    {
      name: "CrewAI Studio",
      description: "Visual IDE for building CrewAI workflows",
      url: "https://github.com/joaomdmoura/crewAI-studio",
      category: "Infra & Execution",
      license: "MIT",
      security: "medium",
      quality: "high",
      language: "JavaScript",
      status: "online"
    },
    {
      name: "Cognosys",
      description: "Multi-agent orchestrator with real-time task flow",
      url: "https://github.com/cognosys-ai/cognosys",
      category: "Infra & Execution",
      license: "MIT",
      security: "medium",
      quality: "medium",
      language: "Python",
      status: "online"
    },
    
    // Multimodal Agents
    {
      name: "MiniAGI",
      description: "Vision, audio, text-based autonomous agent toolkit",
      url: "https://github.com/muellerberndt/mini-agi",
      category: "Multimodal Agents",
      license: "MIT",
      security: "medium",
      quality: "high",
      language: "Python",
      status: "online"
    },
    {
      name: "Multion",
      description: "Agents that operate UI-based web apps directly",
      url: "https://github.com/Multion/multion",
      category: "Multimodal Agents",
      license: "MIT",
      security: "medium",
      quality: "high",
      language: "JavaScript",
      status: "online"
    },
    {
      name: "Genie Agents",
      description: "Visual multimodal autonomous agents",
      url: "https://github.com/OpenGVLab/Genie",
      category: "Multimodal Agents",
      license: "Apache-2.0",
      security: "medium",
      quality: "high",
      language: "Python",
      status: "online"
    },
    {
      name: "Transformers Agent",
      description: "HuggingFace's multi-modal transformer agents",
      url: "https://github.com/huggingface/transformers/tree/main/src/transformers/agents",
      category: "Multimodal Agents",
      license: "Apache-2.0",
      security: "high",
      quality: "high",
      language: "Python",
      status: "online"
    },
    
    // Planner & Memory
    {
      name: "MemGPT",
      description: "Memory-augmented GPT agents",
      url: "https://github.com/cpacker/MemGPT",
      category: "Planner & Memory",
      license: "Apache-2.0",
      security: "medium",
      quality: "high",
      language: "Python",
      status: "online"
    },
    {
      name: "DSPy",
      description: "Declarative agent composition framework from Stanford",
      url: "https://github.com/stanfordnlp/dspy",
      category: "Planner & Memory",
      license: "Apache-2.0",
      security: "high",
      quality: "high",
      language: "Python",
      status: "online"
    },
    {
      name: "E2B",
      description: "Create cloud agents that can spawn environments",
      url: "https://github.com/e2b-dev/e2b",
      category: "Planner & Memory",
      license: "MIT",
      security: "medium",
      quality: "high",
      language: "TypeScript",
      status: "online"
    },
    {
      name: "Agently",
      description: "Abstract agent runtime with dynamic task assignment",
      url: "https://github.com/Maplemx/Agently",
      category: "Planner & Memory",
      license: "MIT",
      security: "medium",
      quality: "medium",
      language: "JavaScript",
      status: "online"
    }
  ];

  useEffect(() => {
    setMcpData(initialMcpData);
  }, []);

  const syncMcpServers = async () => {
    setIsSyncing(true);
    try {
      // Here you would typically fetch from a curated list or GitHub API
      // For now, we'll just simulate a sync
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMcpData(prevData => [...prevData]);
    } catch (error) {
      console.error('Error syncing MCP servers:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  // Filter types based on count
  const filterTypes: FilterOption[] = [
    { id: 'all', label: 'All', count: mcpData.length },
    { id: 'official', label: 'Official', count: mcpData.filter(item => item.official).length },
    { id: 'core', label: 'Core', count: mcpData.filter(item => item.category === 'Core').length },
    { id: 'agent_frameworks', label: 'Agent Frameworks', count: mcpData.filter(item => item.category === 'Agent Frameworks').length },
    { id: 'toolchains', label: 'Toolchains', count: mcpData.filter(item => item.category === 'Toolchains & Tools').length },
    { id: 'infra', label: 'Infrastructure', count: mcpData.filter(item => item.category === 'Infra & Execution').length },
    { id: 'multimodal', label: 'Multimodal', count: mcpData.filter(item => item.category === 'Multimodal Agents').length },
    { id: 'planner', label: 'Planner & Memory', count: mcpData.filter(item => item.category === 'Planner & Memory').length },
    { id: 'online', label: 'Online', count: mcpData.filter(item => item.status === 'online').length }
  ];

  // Filter data based on search query and selected type
  const filteredData = mcpData.filter(item => {
    const matchesSearch = searchQuery === '' || 
                         item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesType = true;
    if (selectedType !== 'all') {
      if (selectedType === 'official') {
        matchesType = !!item.official;
      } else if (selectedType === 'core') {
        matchesType = item.category === 'Core';
      } else if (selectedType === 'agent_frameworks') {
        matchesType = item.category === 'Agent Frameworks';
      } else if (selectedType === 'toolchains') {
        matchesType = item.category === 'Toolchains & Tools';
      } else if (selectedType === 'infra') {
        matchesType = item.category === 'Infra & Execution';
      } else if (selectedType === 'multimodal') {
        matchesType = item.category === 'Multimodal Agents';
      } else if (selectedType === 'planner') {
        matchesType = item.category === 'Planner & Memory';
      } else if (selectedType === 'online') {
        matchesType = item.status === 'online';
      } else if (selectedType === 'requires_auth') {
        matchesType = !!item.requiresAuth;
      }
    }
    
    return matchesSearch && matchesType;
  });

  // Group filtered data by category
  const groupedData: Record<string, MCPEntry[]> = {};
  filteredData.forEach(item => {
    if (!groupedData[item.category]) {
      groupedData[item.category] = [];
    }
    groupedData[item.category].push(item);
  });

  // Generate badge for specified type
  const renderBadge = (type: string, value?: string) => {
    if (!value) return null;
    
    let color, icon;
    
    if (type === 'license') {
      color = 'bg-blue-100 text-blue-800';
      icon = <Award className="h-3 w-3 mr-1" />;
    } else if (type === 'security') {
      color = 'bg-green-100 text-green-800';
      icon = <Shield className="h-3 w-3 mr-1" />;
    } else if (type === 'quality') {
      color = 'bg-purple-100 text-purple-800';
      icon = <Award className="h-3 w-3 mr-1" />;
    } else if (type === 'official') {
      color = 'bg-indigo-100 text-indigo-800';
      icon = <Globe className="h-3 w-3 mr-1" />;
    } else if (type === 'language') {
      color = 'bg-gray-100 text-gray-800';
      icon = <Code className="h-3 w-3 mr-1" />;
    } else if (type === 'status') {
      if (value === 'online') {
        color = 'bg-green-100 text-green-800';
        icon = <CheckCircle className="h-3 w-3 mr-1" />;
      } else {
        color = 'bg-red-100 text-red-800';
        icon = <XCircle className="h-3 w-3 mr-1" />;
      }
    }
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded text-xs ${color}`}>
        {icon}
        {value}
      </span>
    );
  };

  // Add coming soon tooltip component
  const ComingSoonTooltip: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="relative group">
      {children}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        Coming Soon
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto">
      <Header title="MCP Library" wallet={wallet} />
      
      {/* Beta Mode Banner */}
      {isBetaMode && (
        <div className="mb-4 p-3 bg-yellow-100 border-4 border-yellow-400 rounded-lg flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-yellow-600" />
          <span className="text-yellow-800 font-medium">Beta Mode: Some features may be experimental or in development</span>
        </div>
      )}
      
      {/* Sync Button and Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <ComingSoonTooltip>
          <button
            onClick={syncMcpServers}
            disabled={isSyncing}
            className="px-4 py-2 bg-brutalism-purple text-white rounded-lg border-4 border-black 
                     hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Syncing...' : 'Sync MCP Servers'}
          </button>
        </ComingSoonTooltip>
        
            <input
              type="text"
          placeholder="Search MCP servers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-grow px-4 py-2 rounded-lg border-4 border-gray-300 focus:border-brutalism-purple 
                   focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]"
            />
          </div>
          
      {/* Filter Options */}
      <div className="mb-8">
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {filterTypes.map((filter) => (
              <ComingSoonTooltip key={filter.id}>
              <button
                  className={`px-3 py-3 flex justify-between items-center border-4 rounded-md transition-colors ${
                  selectedType === filter.id 
                      ? 'border-black bg-brutalism-purple text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' 
                      : 'border-gray-300 bg-white hover:bg-gray-50 hover:border-gray-400'
                }`}
                onClick={() => setSelectedType(filter.id)}
              >
                  <span className={`font-mono font-semibold text-base ${
                    selectedType === filter.id ? 'text-white' : 'text-[#888888]'
                  }`}>{filter.label}</span>
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                    selectedType === filter.id 
                      ? 'bg-white text-brutalism-purple' 
                      : 'bg-gray-200 text-gray-800'
                  }`}>
                  {filter.count}
                </span>
              </button>
              </ComingSoonTooltip>
            ))}
          </div>
        </div>
      </div>
      
      {/* Content */}
      {Object.keys(groupedData).length > 0 ? (
        Object.entries(groupedData).map(([category, items]) => (
          <div key={category} className="mb-16">
            <h2 className="text-2xl font-mono font-bold mb-8 border-b-4 border-black pb-3 flex items-center gap-2">
              {category}
              {isBetaMode && (
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Beta
                </span>
              )}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <BrutalistCard key={item.name} className="p-6 border-4 border-black h-full flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold">{item.name}</h3>
                    <div className="flex gap-2">
                      {item.status && renderBadge('status', item.status)}
                      {item.requiresAuth && (
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-yellow-100 text-yellow-800">
                          <Shield className="h-3 w-3 mr-1" />
                          Auth Required
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-4 flex-grow">{item.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.language && renderBadge('language', item.language)}
                    {item.license && renderBadge('license', item.license)}
                    {item.security && renderBadge('security', item.security)}
                    {item.quality && renderBadge('quality', item.quality)}
                    {item.official && renderBadge('official', 'Official')}
                  </div>
                  
                  <div className="mt-auto pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <ComingSoonTooltip>
                        <a 
                          href={item.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-brutalism-purple hover:underline text-sm flex items-center"
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          GitHub
                        </a>
                      </ComingSoonTooltip>
                      {item.documentation && (
                        <ComingSoonTooltip>
                          <a 
                            href={item.documentation} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-brutalism-purple text-sm"
                          >
                            Documentation
                          </a>
                        </ComingSoonTooltip>
                      )}
                      </div>
                    {item.baseUrl && (
                      <div className="mt-2 text-xs text-gray-500">
                        Base URL: {item.baseUrl}
                      </div>
                    )}
                  </div>
                </BrutalistCard>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-16 border-4 border-dashed border-gray-300 rounded-lg">
          <h3 className="text-2xl font-bold mb-2">No results found</h3>
          <p className="text-gray-600">Try adjusting your search query or filters</p>
        </div>
      )}
    </div>
  );
};

export default MCPPage;