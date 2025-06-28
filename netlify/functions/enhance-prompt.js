export async function handler(event, context) {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Get OpenAI API key from environment variables
    const OPENAI_API_KEY = process.env.VITE_OPENAI_API_KEY;
    
    if (!OPENAI_API_KEY) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'OpenAI API key not configured on server' 
        })
      };
    }

    // Parse request body
    const { prompt } = JSON.parse(event.body);
    
    if (!prompt) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Prompt content is required' 
        })
      };
    }

    console.log('🤖 Processing prompt enhancement request...');

    // Make request to OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
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
            content: `Please enhance this prompt:\n\n"${prompt}"`
          }
        ],
        temperature: 0.7,
        max_tokens: 1500
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenAI API Error:', errorData);
      
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({
          error: `OpenAI API Error: ${errorData.error?.message || 'Unknown error'}`
        })
      };
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: 'No response content from OpenAI'
        })
      };
    }

    // Try to parse JSON response
    try {
      const parsed = JSON.parse(content);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          enhanced: parsed.enhanced || content,
          improvements: parsed.improvements || ['AI enhanced the prompt structure and clarity'],
          suggestions: parsed.suggestions || ['Consider adding more specific context', 'Test the prompt with different AI models']
        })
      };
    } catch (parseError) {
      // Fallback if JSON parsing fails
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          enhanced: content,
          improvements: ['AI enhanced the prompt structure and clarity'],
          suggestions: ['Consider adding more specific context', 'Test the prompt with different AI models']
        })
      };
    }

  } catch (error) {
    console.error('Function error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: `Server error: ${error.message}`
      })
    };
  }
}