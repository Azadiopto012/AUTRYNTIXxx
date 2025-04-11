// Dashboard metrics utility functions

// Get created token count from localStorage
export const getTokenCount = (): number => {
  try {
    const tokens = localStorage.getItem('created_tokens');
    if (tokens) {
      return JSON.parse(tokens).length;
    }
  } catch (error) {
    console.error('Error getting token count:', error);
  }
  return 0;
};

// Get MCP count from the MCP data
export const getMCPCount = (): number => {
  return 68; // Updated total from MCPPage
};

// Get LLM library count from the LLM data
export const getLLMCount = (): number => {
  return 45; // Hardcoded total from LLMPage
}; 