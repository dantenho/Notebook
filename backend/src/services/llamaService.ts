import axios from 'axios';

export interface LlamaRequest {
  prompt: string;
  context?: string;
  temperature?: number;
  max_tokens?: number;
}

export interface LlamaResponse {
  content: string;
}

export class LlamaService {
  private static baseUrl = process.env.LLAMA_CPP_URL || 'http://localhost:8080';

  static async generateCompletion(request: LlamaRequest): Promise<LlamaResponse> {
    const { prompt, context, temperature = 0.7, max_tokens = 2048 } = request;

    const fullPrompt = context
      ? `Current text:\n${context}\n\nInstruction: ${prompt}`
      : prompt;

    try {
      const response = await axios.post(
        `${this.baseUrl}/completion`,
        {
          prompt: fullPrompt,
          temperature,
          n_predict: max_tokens,
          stop: ['</s>', 'User:', 'Assistant:']
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 120000 // 2 minutes timeout
        }
      );

      return {
        content: response.data.content.trim()
      };
    } catch (error: any) {
      if (error.code === 'ECONNREFUSED') {
        throw new Error('llama.cpp server is not running. Please start it first.');
      }
      throw error;
    }
  }

  static async checkHealth(): Promise<boolean> {
    try {
      await axios.get(`${this.baseUrl}/health`, { timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }
}
