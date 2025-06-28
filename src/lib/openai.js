// OpenAI API integration for prompt enhancement
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

class OpenAIService {
  constructor() {
    this.apiKey = OPENAI_API_KEY;
    this.baseURL = 'https://api.openai.com/v1';
  }

  async enhancePrompt(originalPrompt) {
    if (!this.apiKey) {
      throw new Error('OpenAI API key not configured. Please add VITE_OPENAI_API_KEY to your environment variables.');
    }

    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `You are an expert AI prompt engineer. Your task is to enhance and improve user prompts to make them more effective, clear, and specific. 

Guidelines for enhancement:
1. Make prompts more specific and detailed
2. Add context where helpful
3. Include formatting instructions if beneficial
4. Suggest better structure and flow
5. Add examples or constraints when appropriate
6. Ensure clarity and remove ambiguity
7. Optimize for better AI responses

Return your response in this exact JSON format:
{
  "enhanced": "The improved version of the prompt",
  "improvements": [
    "List of specific improvements made",
    "Each improvement as a separate item",
    "Focus on what was changed and why"
  ],
  "suggestions": [
    "Additional suggestions for further improvement",
    "Tips for using this prompt effectively"
  ]
}`
            },
            {
              role: 'user',
              content: `Please enhance this prompt:\n\n"${originalPrompt}"`
            }
          ],
          temperature: 0.7,
          max_tokens: 1500
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`OpenAI API Error: ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;
      
      if (!content) {
        throw new Error('No response from OpenAI');
      }

      // Parse the JSON response
      try {
        const parsed = JSON.parse(content);
        return {
          enhanced: parsed.enhanced,
          improvements: parsed.improvements || [],
          suggestions: parsed.suggestions || []
        };
      } catch (parseError) {
        // Fallback if JSON parsing fails
        return {
          enhanced: content,
          improvements: ['AI enhanced the prompt structure and clarity'],
          suggestions: ['Consider adding more specific context', 'Test the prompt with different AI models']
        };
      }
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw error;
    }
  }

  async generatePromptIdeas(topic, category = 'general') {
    if (!this.apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `Generate 5 creative and effective AI prompt ideas for the topic "${topic}" in the category "${category}". Each prompt should be unique, specific, and optimized for AI interactions.

Return as JSON:
{
  "prompts": [
    {
      "title": "Brief descriptive title",
      "prompt": "The actual prompt text",
      "description": "What this prompt is useful for"
    }
  ]
}`
            },
            {
              role: 'user',
              content: `Generate prompt ideas for: ${topic}`
            }
          ],
          temperature: 0.8,
          max_tokens: 1000
        })
      });

      const data = await response.json();
      const content = data.choices[0]?.message?.content;
      
      try {
        return JSON.parse(content);
      } catch {
        return { prompts: [] };
      }
    } catch (error) {
      console.error('Prompt generation error:', error);
      throw error;
    }
  }
}

export default new OpenAIService();