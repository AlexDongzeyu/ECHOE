import { Env } from '../index';

export interface ModerationResult {
  flagged: boolean;
  reason?: string;
  message?: string;
}

export interface AIResponse {
  content: string;
  model: string;
  timestamp: string;
}

export class AIService {
  constructor(private env: Env) {}

  async moderateContent(content: string): Promise<ModerationResult> {
    try {
      // Simple keyword-based moderation (similar to original Flask app)
      const flaggedKeywords = [
        'suicide', 'kill myself', 'end my life', 'hurt myself', 'self-harm',
        'suicidal', 'kill me', 'want to die', 'planning to die', 'suicide plan'
      ];

      const contentLower = content.toLowerCase();
      const isFlagged = flaggedKeywords.some(keyword => contentLower.includes(keyword));

      if (isFlagged) {
        return {
          flagged: true,
          reason: 'Contains concerning content that may indicate self-harm',
          message: "I notice you've mentioned something concerning. If you're in crisis, please call your local crisis line immediately. In Canada, you can call 1-833-456-4566, or text 45645. Would you like me to provide more support resources?"
        };
      }

      return {
        flagged: false
      };
    } catch (error) {
      console.error('Content moderation error:', error);
      // Default to not flagged if moderation fails
      return { flagged: false };
    }
  }

  async generateSupportiveResponse(message: string): Promise<string> {
    try {
      const apiKey = this.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('GEMINI_API_KEY not configured');
      }

      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
      
      const prompt = `You are a supportive AI companion for the Light in Silence mental health platform. 
        Respond with empathy and care. Do not diagnose or provide medical advice. 
        Keep responses supportive, thoughtful and relatively brief. 
        User message: ${message}`;

      const payload = {
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data && data.candidates && data.candidates.length > 0) {
        const aiResponse = data.candidates[0].content.parts
          .map((part: any) => part.text)
          .join(' ');
        return aiResponse || this.getDefaultResponse();
      } else {
        return this.getDefaultResponse();
      }
    } catch (error) {
      console.error('AI response generation error:', error);
      return this.getDefaultResponse();
    }
  }

  async generateResponseWithType(message: string, responseType: 'supportive' | 'practical' | 'reflective'): Promise<string> {
    try {
      const apiKey = this.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('GEMINI_API_KEY not configured');
      }

      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
      
      let promptPrefix = "You are a supportive AI companion for the Light in Silence mental health platform. ";
      
      if (responseType === 'practical') {
        promptPrefix += "Offer concrete, actionable advice while being supportive and compassionate. " +
                       "Focus on small, manageable steps the user can take. ";
      } else if (responseType === 'reflective') {
        promptPrefix += "Ask thoughtful questions to help the user explore their feelings and situation more deeply. " +
                       "Help them gain insight through gentle reflection rather than direct advice. ";
      } else {
        promptPrefix += "Respond with empathy and care. Focus on emotional support and validation of feelings. ";
      }
      
      promptPrefix += "Do not diagnose or provide medical advice. Keep responses supportive and relatively brief. ";

      const payload = {
        contents: [{
          parts: [{
            text: `${promptPrefix} User message: ${message}`
          }]
        }]
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data && data.candidates && data.candidates.length > 0) {
        const aiResponse = data.candidates[0].content.parts
          .map((part: any) => part.text)
          .join(' ');
        return aiResponse || this.getDefaultResponse();
      } else {
        return this.getDefaultResponse();
      }
    } catch (error) {
      console.error('AI response generation error:', error);
      return this.getDefaultResponse();
    }
  }

  private getDefaultResponse(): string {
    const defaultResponses = [
      "Thank you for sharing with us. Your feelings are valid and you're not alone in this journey.",
      "I hear you, and I want you to know that reaching out takes courage. You've taken an important step.",
      "What you're experiencing matters, and there are people who care about your wellbeing.",
      "Thank you for trusting us with your thoughts. Please know that support is available to you.",
      "Your message is important to us. Remember that difficult times don't last, but resilient people do."
    ];

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  }

  async testConnection(): Promise<boolean> {
    try {
      const apiKey = this.env.GEMINI_API_KEY;
      if (!apiKey) {
        return false;
      }

      const response = await this.generateSupportiveResponse("Hello, this is a test.");
      return response.length > 0;
    } catch (error) {
      console.error('AI service test failed:', error);
      return false;
    }
  }
} 