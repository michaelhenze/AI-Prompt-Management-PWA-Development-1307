// OpenAI API integration for prompt enhancement via Netlify Functions
class OpenAIService {
  constructor() {
    // Use Netlify function endpoint
    this.enhanceEndpoint = '/.netlify/functions/enhance-prompt';
  }

  async enhancePrompt(originalPrompt) {
    console.log('🤖 Starting prompt enhancement...');
    console.log('Original prompt:', originalPrompt.substring(0, 100) + '...');

    if (!originalPrompt || originalPrompt.trim().length === 0) {
      throw new Error('No prompt content provided for enhancement.');
    }

    try {
      console.log('📤 Sending request to Netlify function...');

      const response = await fetch(this.enhanceEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: originalPrompt
        })
      });

      console.log('📥 Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Enhancement API Error:', errorData);
        
        if (response.status === 401) {
          throw new Error('Invalid OpenAI API key. Please check your server configuration.');
        } else if (response.status === 429) {
          throw new Error('OpenAI API rate limit exceeded. Please try again later.');
        } else if (response.status === 500) {
          throw new Error(errorData.error || 'Server error occurred');
        } else {
          throw new Error(`Enhancement API Error (${response.status}): ${errorData.error || 'Unknown error'}`);
        }
      }

      const result = await response.json();
      console.log('✅ Enhancement completed successfully');
      
      return {
        enhanced: result.enhanced,
        improvements: result.improvements || [],
        suggestions: result.suggestions || []
      };

    } catch (error) {
      console.error('❌ Enhancement failed:', error);
      
      // Network or other errors
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network error: Unable to connect to enhancement service. Please check your internet connection.');
      }
      
      throw error;
    }
  }

  async generatePromptIdeas(topic, category = 'general') {
    console.log('💡 Generating prompt ideas for:', topic);
    
    // For now, return mock data since this feature requires additional setup
    return {
      prompts: [
        {
          title: "Creative Writing Assistant",
          prompt: `Write a compelling ${category} piece about ${topic}. Include vivid descriptions, engaging dialogue, and a clear narrative structure.`,
          description: "Perfect for creative writing projects"
        },
        {
          title: "Analytical Deep Dive",
          prompt: `Analyze ${topic} from multiple perspectives. Consider the historical context, current implications, and future possibilities.`,
          description: "Great for research and analysis"
        },
        {
          title: "Problem-Solution Framework",
          prompt: `Identify key challenges related to ${topic} and propose innovative solutions with actionable steps.`,
          description: "Ideal for problem-solving scenarios"
        }
      ]
    };
  }
}

export default new OpenAIService();