import { log } from '../vite';

// Task priority type
type TaskPriority = 'low' | 'medium' | 'high';

/**
 * AI Service for analyzing maintenance requests and suggesting priorities
 */
export class AIService {
  /**
   * Analyze a maintenance request description and suggest a priority
   * This implementation uses a rule-based approach with keyword matching
   * In a production environment, this could be replaced with a ML model or API call
   * 
   * @param description The maintenance request description
   * @returns The suggested priority ('low', 'medium', 'high')
   */
  public static suggestPriority(description: string): TaskPriority {
    if (!description) {
      return 'medium';
    }

    const lowerDesc = description.toLowerCase();
    
    // High priority keywords
    const highPriorityKeywords = [
      'emergency', 'urgent', 'immediately', 'critical', 'danger', 'safety', 
      'hazard', 'fire', 'flood', 'leak', 'gas', 'smoke', 'burning',
      'electrical', 'shock', 'not working', 'broken', 'outage', 'no water',
      'no electricity', 'no heat', 'no cooling', 'security', 'breach',
      'exposure', 'injury', 'damage', 'severe', 'failed', 'collapsed'
    ];
    
    // Low priority keywords
    const lowPriorityKeywords = [
      'minor', 'cosmetic', 'small', 'eventually', 'when possible', 'sometime',
      'update', 'replace', 'upgrade', 'improvement', 'enhance', 'convenience',
      'paint', 'touch up', 'aesthetic', 'appearance', 'not urgent', 'can wait',
      'would like', 'prefer', 'consider', 'suggest', 'recommend', 'nice to have'
    ];

    // Check for high priority indicators
    for (const keyword of highPriorityKeywords) {
      if (lowerDesc.includes(keyword)) {
        log(`AI suggested high priority due to keyword: ${keyword}`);
        return 'high';
      }
    }
    
    // Check for low priority indicators
    for (const keyword of lowPriorityKeywords) {
      if (lowerDesc.includes(keyword)) {
        log(`AI suggested low priority due to keyword: ${keyword}`);
        return 'low';
      }
    }
    
    // Default to medium if no specific indicators
    return 'medium';
  }

  /**
   * Get a confidence score for the suggested priority
   * This is a simple implementation that could be enhanced in a production setting
   * 
   * @param description The maintenance request description
   * @returns A confidence score between 0 and 1
   */
  public static getPriorityConfidence(description: string): number {
    if (!description || description.length < 10) {
      return 0.5; // Low confidence for very short descriptions
    }
    
    // Longer descriptions give higher confidence
    const lengthFactor = Math.min(description.length / 100, 1);
    
    // Calculate base confidence from length
    let confidence = 0.6 + (lengthFactor * 0.3);
    
    // Cap at 0.95 - we're never 100% confident
    return Math.min(confidence, 0.95);
  }
}