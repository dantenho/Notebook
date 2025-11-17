import axios from 'axios';

export interface AIRequest {
  provider: string;
  model: string;
  apiKey?: string;
  prompt: string;
  context?: string;
  thinking?: boolean;
}

export interface AIResponse {
  content: string;
  thinking?: string;
}

export class AIService {
  static async generateCompletion(request: AIRequest): Promise<AIResponse> {
    const { provider, model, apiKey, prompt, context, thinking } = request;

    switch (provider.toLowerCase()) {
      case 'openai':
        return this.callOpenAI(model, apiKey!, prompt, context, thinking);
      case 'anthropic':
        return this.callAnthropic(model, apiKey!, prompt, context, thinking);
      case 'google':
        return this.callGoogle(model, apiKey!, prompt, context, thinking);
      default:
        throw new Error(`Provider ${provider} not supported`);
    }
  }

  private static async callOpenAI(
    model: string,
    apiKey: string,
    prompt: string,
    context?: string,
    thinking?: boolean
  ): Promise<AIResponse> {
    const messages: any[] = [];

    if (context) {
      messages.push({
        role: 'user',
        content: `Current text:\n${context}\n\nInstruction: ${prompt}`
      });
    } else {
      messages.push({
        role: 'user',
        content: prompt
      });
    }

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: model || 'gpt-4-turbo-preview',
        messages
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return {
      content: response.data.choices[0].message.content
    };
  }

  private static async callAnthropic(
    model: string,
    apiKey: string,
    prompt: string,
    context?: string,
    thinking?: boolean
  ): Promise<AIResponse> {
    const userMessage = context
      ? `Current text:\n${context}\n\nInstruction: ${prompt}`
      : prompt;

    const requestBody: any = {
      model: model || 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: userMessage
        }
      ]
    };

    // Enable extended thinking for Claude models
    if (thinking && model?.includes('claude')) {
      requestBody.thinking = {
        type: 'enabled',
        budget_tokens: 2000
      };
    }

    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      requestBody,
      {
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json'
        }
      }
    );

    let thinkingContent = '';
    let textContent = '';

    for (const block of response.data.content) {
      if (block.type === 'thinking') {
        thinkingContent = block.thinking || '';
      } else if (block.type === 'text') {
        textContent = block.text;
      }
    }

    return {
      content: textContent,
      thinking: thinkingContent || undefined
    };
  }

  private static async callGoogle(
    model: string,
    apiKey: string,
    prompt: string,
    context?: string,
    thinking?: boolean
  ): Promise<AIResponse> {
    const userMessage = context
      ? `Current text:\n${context}\n\nInstruction: ${prompt}`
      : prompt;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/${model || 'gemini-pro'}:generateContent?key=${apiKey}`,
      {
        contents: [
          {
            parts: [
              {
                text: userMessage
              }
            ]
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    return {
      content: response.data.candidates[0].content.parts[0].text
    };
  }
}
