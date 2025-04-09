import React, { useState, useRef, useEffect } from 'react';
import Header from '@/components/layout/Header';
import { useWallet } from '@/lib/walletAdapter';
import { BrutalistCard } from '@/components/ui/brutalist-card';
import { BrutalistButton } from '@/components/ui/brutalist-button';
import { Send, ArrowRight, Copy, Coins, Wallet, File, Code, ArrowRightLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Message types
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Category type for example queries
interface ExampleQuery {
  title: string;
  query: string;
  description: string;
}

const SolanaGPT: React.FC = () => {
  const { wallet } = useWallet();
  const { toast } = useToast();
  const [input, setInput] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "How can I assist you?",
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showExamples, setShowExamples] = useState<boolean>(true);
  
  // Example queries to help users get started
  const exampleQueries: ExampleQuery[] = [
    {
      title: 'Any updates from @phantom recently?',
      description: 'summarize the latest tweets from @phantom',
      query: 'Any updates from @phantom recently?'
    },
    {
      title: 'Launch a new token',
      description: 'deploy a new token on pump.fun',
      query: 'How do I create and deploy my own SPL token on Solana?'
    },
    {
      title: 'What has toly been doing recently?',
      description: 'summarize his recent tweets',
      query: 'What has toly been doing recently?'
    },
    {
      title: 'Swap 1 SOL for USDC',
      description: 'using Jupiter to swap on Solana',
      query: 'How can I swap 1 SOL for USDC on Jupiter?'
    }
  ];

  // Integrations to display
  const integrations = [
    {
      name: 'pump.fun',
      description: 'Discover new tokens, launch tokens',
      icon: <Coins className="h-6 w-6 text-green-500" />
    },
    {
      name: 'Jupiter',
      description: 'Swap tokens & DCA, Limit orders',
      icon: <ArrowRightLeft className="h-6 w-6 text-purple-500" />
    },
    {
      name: 'Magic Eden',
      description: 'Explore the best NFT collections',
      icon: <File className="h-6 w-6 text-pink-500" />
    },
    {
      name: 'Dialect',
      description: 'Create and share blinks',
      icon: <Code className="h-6 w-6 text-blue-500" />
    }
  ];

  // Scroll to bottom of chat when messages update
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Generate a unique ID for messages
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  };

  // Handle sending messages
  const handleSendMessage = (content: string = input) => {
    if (!content.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    // Simulate AI response (in a real app, this would be an API call)
    setTimeout(() => {
      const assistantMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: generateSolanaResponse(content.trim()),
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  // Function to copy code to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied to clipboard",
        description: "Code has been copied to your clipboard",
        duration: 3000
      });
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

  // Format message content with code blocks
  const formatMessageContent = (content: string) => {
    // Split by code blocks
    const parts = content.split(/```(\w*)\n([\s\S]*?)```/g);
    
    return (
      <>
        {parts.map((part, index) => {
          // Every 3rd part is a code block (language, code, ```)
          if (index % 3 === 0) {
            // Regular text
            return <div key={index} dangerouslySetInnerHTML={{ __html: formatTextWithNewlines(part) }} />;
          } else if (index % 3 === 1) {
            // Language identifier
            return null;
          } else {
            // Code block
            const language = parts[index - 1] || 'bash';
            return (
              <div key={index} className="relative mt-2 mb-3 rounded-md overflow-hidden">
                <div className="flex justify-between items-center bg-gray-800 px-4 py-1 text-white text-sm">
                  <span>{language}</span>
                  <button
                    onClick={() => copyToClipboard(part)}
                    className="p-1 hover:bg-gray-700 rounded"
                    aria-label="Copy code"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
                <pre className="bg-gray-900 p-4 overflow-x-auto text-white">
                  <code>{part}</code>
                </pre>
              </div>
            );
          }
        })}
      </>
    );
  };

  // Helper to format text with newlines
  const formatTextWithNewlines = (text: string) => {
    return text
      .replace(/\n/g, '<br />')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>');
  };

  // Generating a simulated Solana response (in a real app, this would be an API call)
  const generateSolanaResponse = (query: string): string => {
    const lowercaseQuery = query.toLowerCase();
    
    if (lowercaseQuery.includes('create') && lowercaseQuery.includes('token')) {
      return `
**Creating an SPL Token on Solana**

Here's how to create your own SPL token on Solana using the spl-token CLI:

1. First, ensure you have a Solana wallet with SOL:

\`\`\`bash
solana balance
\`\`\`

2. Create a new token:

\`\`\`bash
spl-token create-token --decimals 9
\`\`\`

3. Create a token account to hold your new tokens:

\`\`\`bash
spl-token create-account <TOKEN_ADDRESS>
\`\`\`

4. Mint some tokens:

\`\`\`bash
spl-token mint <TOKEN_ADDRESS> <AMOUNT>
\`\`\`

5. Check your token balance:

\`\`\`bash
spl-token supply <TOKEN_ADDRESS>
\`\`\`

If you'd like to customize your token with a name, symbol, and metadata, you'll need to use the Metaplex Token Metadata program. Would you like me to show you how to add metadata to your token?
`;
    } else if (lowercaseQuery.includes('phantom') && lowercaseQuery.includes('updates')) {
      return `
**Recent Updates from @phantom**

The Phantom team has announced several updates in the past week:

1. They've released a new version of their mobile wallet with improved transaction speeds
2. Added support for Jupiter v6 integration directly in the wallet
3. Released a new security feature for transaction approval
4. Announced partnerships with 3 new Solana protocols
5. Improved NFT viewing experience with expanded metadata

The most significant update is their new transaction protection feature that helps users avoid common phishing attempts and malicious smart contracts.
`;
    } else if (lowercaseQuery.includes('swap') && (lowercaseQuery.includes('sol') || lowercaseQuery.includes('usdc'))) {
      return `
**Swapping SOL for USDC on Jupiter**

Here's how to swap SOL for USDC using Jupiter:

1. Connect your wallet to Jupiter (https://jup.ag)

2. Select your tokens:
   - Input: SOL
   - Output: USDC

3. Enter the amount of SOL you want to swap (1 SOL)

4. Review the exchange rate and transaction details

5. Click "Swap" and approve the transaction in your wallet

If you'd prefer to do this programmatically:

\`\`\`typescript
import { Jupiter } from '@jup-ag/api';
import { Connection, PublicKey } from '@solana/web3.js';

// Initialize connection
const connection = new Connection('https://api.mainnet-beta.solana.com');

// Initialize Jupiter
const jupiter = await Jupiter.load({
  connection,
  cluster: 'mainnet-beta',
});

// Define the swap parameters
const inputMint = new PublicKey('So11111111111111111111111111111111111111112'); // SOL
const outputMint = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'); // USDC
const amount = 1000000000; // 1 SOL (9 decimals)

// Find routes
const routes = await jupiter.computeRoutes({
  inputMint,
  outputMint,
  amount,
  slippage: 1, // 1% slippage
});

// Execute the swap
const transaction = await jupiter.exchange({
  routeInfo: routes.routesInfos[0],
});

// Sign and send the transaction with your wallet
\`\`\`

Would you like more details on setting slippage or using a specific route?
`;
    } else if (lowercaseQuery.includes('toly')) {
      return `
**Recent Activity from Toly (Anatoly Yakovenko)**

Toly, the co-founder of Solana, has been quite active recently:

1. He's been discussing Solana's performance improvements, specifically highlighting the recent 28% decrease in block times
2. Shared updates about the upcoming Firedancer client implementation
3. Talked about new compression techniques for improving state access
4. Presented at ETH Denver about cross-chain interoperability
5. Promoted several new Solana ecosystem projects, particularly focusing on DePIN applications

He's been especially vocal about Solana's push toward decentralized physical infrastructure networks and how the network's performance makes these applications viable in a way that wasn't possible before.
`;
    } else {
      return `
I'd be happy to help with your Solana blockchain questions. As a specialized Solana assistant, I can help with:

1. **Token creation and management** - Creating SPL tokens, managing supply, adding metadata
2. **Smart contract development** - Writing and deploying Solana programs in Rust using Anchor
3. **NFT operations** - Minting, listing, and trading NFTs on Solana
4. **DeFi integrations** - Working with Jupiter, Raydium, Orca, and other Solana DeFi protocols
5. **Wallet management** - Setting up and managing Solana wallets for development
6. **Network interactions** - Using RPC endpoints, transaction monitoring, and network status

Could you provide more details about what specifically you'd like to learn or build on Solana? I can then provide tailored code examples and step-by-step instructions.
`;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <Header title="SolanaGPT" wallet={wallet} />
      
      <div className="flex flex-col h-[calc(100vh-140px)] mt-6">
        {/* Main chat area */}
        <div className="flex-grow bg-white dark:bg-gray-900 rounded-lg overflow-hidden flex flex-col shadow-lg border-4 border-black">
          {/* Chat messages */}
          <div className="flex-grow overflow-y-auto p-6 space-y-6">
            {messages.length === 1 && (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <h1 className="text-4xl font-bold mb-16 text-gray-800 dark:text-gray-100">How can I assist you with Solana?</h1>
                
                {/* Example queries */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-16 w-full max-w-3xl">
                  {exampleQueries.map((example, index) => (
                    <button
                      key={index}
                      className="text-left p-5 rounded-lg border-4 border-gray-300 dark:border-gray-700 
                      hover:border-purple-500 dark:hover:border-purple-500 hover:shadow-[4px_4px_0px_0px_rgba(168,85,247,0.5)]
                      transition-all bg-white dark:bg-gray-800"
                      onClick={() => handleSendMessage(example.query)}
                      aria-label={`Ask about ${example.title}`}
                    >
                      <p className="font-bold text-lg text-gray-900 dark:text-white mb-2">{example.title}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{example.description}</p>
                    </button>
                  ))}
                </div>
                
                {/* Integrations */}
                <div className="w-full max-w-3xl">
                  <h3 className="text-lg text-gray-700 dark:text-gray-300 mb-5 font-bold">Popular Integrations</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                    {integrations.map((integration, index) => (
                      <div 
                        key={index}
                        className="p-4 rounded-lg border-4 border-gray-300 dark:border-gray-700 flex items-start gap-3
                        hover:border-purple-500 dark:hover:border-purple-500 hover:shadow-[4px_4px_0px_0px_rgba(168,85,247,0.5)]
                        transition-all bg-white dark:bg-gray-800"
                        aria-label={`${integration.name} integration`}
                      >
                        <div className="mt-1 p-2 bg-gray-100 dark:bg-gray-700 rounded-full">{integration.icon}</div>
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white">{integration.name}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">{integration.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {messages.length > 1 && messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-3xl p-5 rounded-lg shadow-md ${
                    message.role === 'user'
                      ? 'bg-purple-600 text-white border-2 border-purple-800'
                      : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-4 border-gray-300 dark:border-gray-700'
                  }`}
                >
                  {message.role === 'assistant' 
                    ? formatMessageContent(message.content)
                    : <div>{message.content}</div>
                  }
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-5 rounded-lg border-4 border-gray-300 dark:border-gray-700 shadow-md">
                  <div className="flex space-x-2">
                    <div className="h-3 w-3 bg-purple-400 rounded-full animate-bounce"></div>
                    <div className="h-3 w-3 bg-purple-400 rounded-full animate-bounce delay-75"></div>
                    <div className="h-3 w-3 bg-purple-400 rounded-full animate-bounce delay-150"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input area */}
          <div className="p-5 border-t-4 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-3"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about Solana development, tokens, or NFTs..."
                className="flex-grow p-4 bg-white dark:bg-gray-800 rounded-lg border-4 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 dark:text-gray-100 shadow-inner"
                aria-label="Message input"
              />
              <div className="text-xs text-gray-500 dark:text-gray-400 mr-2 font-mono">
                {input.length}/2000
              </div>
              <button 
                type="submit" 
                className="p-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-4 border-purple-800 hover:shadow-[4px_4px_0px_0px_rgba(107,33,168,1)]"
                disabled={isLoading || !input.trim()}
                aria-label="Send message"
              >
                <ArrowRight className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolanaGPT; 