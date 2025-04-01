import Anthropic from "@anthropic-ai/sdk";
import "dotenv/config";

export const generateLearningPath = async (skillName, category, timeframe, considerSkills, considerExperience) => {
  const resourcePriorities = {
    'Technical Skills': 'Scrimba > freeCodeCamp > Codecademy > YouTube',
    'Design Skills': 'Figma Learn > Adobe Tutorials > Behance > Dribbble',
    'Business & Management': 'Harvard Business Review > Coursera > LinkedIn Learning',
    'Creative Skills': 'Domestika > Skillshare > CreativeLive > Proko',
    'Languages': 'Duolingo > Babbel > iTalki > Pimsleur',
    'Physical & Wellness': 'Nike Training Club > Down Dog > Yoga with Adriene',
    'Culinary Skills': 'MasterClass > Serious Eats > BBC Good Food',
    'Music & Performance': 'Yousician > Simply Piano > ArtistWorks > MasterClass',
    'Outdoor & Adventure': 'REI Expert Advice > National Geographic > AllTrails > Mountain Project',
    'Soft Skills': 'TED Talks > Coursera > MindTools > Harvard Business Review',
    'Other': 'YouTube > Khan Academy > Udemy > Local Community Resources'
  };
  
  const projectTypeMap = {
    'Technical Skills': 'project',
    'Design Skills': 'portfolio piece',
    'Business & Management': 'case study',
    'Creative Skills': 'creative work',
    'Languages': 'conversation exercise',
    'Physical & Wellness': 'workout routine',
    'Culinary Skills': 'signature dish',
    'Music & Performance': 'performance piece',
    'Outdoor & Adventure': 'expedition plan',
    'Soft Skills': 'role-play scenario',
    'Other': 'custom project'
  };
  
  const categoryRules = {
    'Languages': 'Include speaking/listening exercises',
    'Physical & Wellness': 'Include safety considerations',
    'Culinary Skills': 'Include ingredient lists',
    'Creative Skills': 'Include portfolio development stages',
    'Music & Performance': 'Include practice routines',
    'Outdoor & Adventure': 'Include safety and equipment checks',
    'Soft Skills': 'Include real-world application scenarios'
  };

  const skillsInfo = considerSkills ? 
    `Consider user's existing skills: ${considerSkills.map(s => `${s.name} (${s.proficiency}, ${s.yearsOfExperience} years)`).join(', ')}. ` : '';
  
  const experienceInfo = considerExperience ? 
    `Consider user's work experience: ${considerExperience.map(e => `${e.title} at ${e.company} (${e.duration}): ${e.description}`).join('; ')}. ` : '';

  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
  });

  const msg = await anthropic.messages.create({
    model: "claude-3-7-sonnet-20250219",
    max_tokens: 4000,
    temperature: 0.8,
    system: `You are an expert AI tutor specializing in personalized learning paths.
            CRITICAL: Respond ONLY with a valid, parseable JSON object.
            Do not include any text before or after the JSON.
            Do not use markdown code blocks or backticks.
            Do not include any explanation or commentary.
            The JSON should start with '{' and end with '}'.
            Ensure your response is complete and not truncated.
            Keep responses concise to avoid hitting token limits.
            There must be no repetitions in the JSON`,
    messages: [
      {
        role: "user",
        content: `Create a ${skillName} learning path for ${category} with the following structure:
        
        {
          "title": (string),
          "phases": [
            {
              "order": (number),
              "title": (string),
              "type": (either "theory" or "practice"),
              "resources": { 
                "free": [{"title": (string), "url": (string)}],
                "paid": [{"title": (string), "url": (string)}]
              },
              "practiceDetails": {
                "objective": (string),
                "deliverables": [(string array)]
              },
              "estimatedHours": (number),
              "checklist": [(string array of 5-7 items max)]
            }
          ],
          "meta": {
            "id": (uuid string),
            "totalSteps": (number),
            "totalHours": (number),
            "timeframe": "${timeframe}",
            "keyConcepts": [(string array of 5-10 items max)]
          }
        }
        
        Create 4-6 phases total to ensure the response fits within limits. Include 'practiceDetails' only for practice type phases. Include your best resources based on these priorities: ${resourcePriorities[category] || 'high-quality, reputable sources'}.
        
        ${skillsInfo}${experienceInfo}`
      }
    ]
  });

  try {
    const responseText = msg.content[0].text;
    
    // Direct parsing attempt
    try {
      return JSON.parse(responseText);
    } catch (directParseError) {
      console.warn("Direct parsing failed, attempting to extract JSON:", directParseError.message);
      
      // Fallback: Extract JSON from code blocks if direct parsing fails
      const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        try {
          return JSON.parse(jsonMatch[1]);
        } catch (codeBlockError) {
          console.warn("Code block parsing failed:", codeBlockError.message);
        }
      }
      
      // If still no valid JSON, try to find anything that looks like a JSON object
      const potentialJson = responseText.match(/(\{[\s\S]*\})/);
      if (potentialJson) {
        try {
          return JSON.parse(potentialJson[1]);
        } catch (potentialJsonError) {
          console.warn("Potential JSON parsing failed:", potentialJsonError.message);
        }
      }
      
      // Final fallback: Try to repair truncated JSON
      try {
        // Check if the JSON appears to be truncated
        if (responseText.includes('{') && !responseText.endsWith('}')) {
          console.warn("JSON appears to be truncated, attempting repair");
          
          // Simple JSON repair for common truncation cases
          let repairedJson = responseText;
          
          // Find the last complete array or object
          const lastClosingBracket = Math.max(
            repairedJson.lastIndexOf(']'),
            repairedJson.lastIndexOf('}')
          );
          
          if (lastClosingBracket > -1) {
            // Truncate to last complete structure and add missing closures
            repairedJson = repairedJson.substring(0, lastClosingBracket + 1);
            
            // Count opening and closing brackets to determine what's missing
            const openBraces = (repairedJson.match(/\{/g) || []).length;
            const closeBraces = (repairedJson.match(/\}/g) || []).length;
            const missingBraces = openBraces - closeBraces;
            
            // Add missing closing braces
            repairedJson += '}'.repeat(missingBraces > 0 ? missingBraces : 0);
            
            console.warn("Attempting to parse repaired JSON");
            return JSON.parse(repairedJson);
          }
        }
      } catch (repairError) {
        console.warn("JSON repair attempt failed:", repairError.message);
      }
      
      throw new Error("Could not extract valid JSON from response");
    }
  } catch (error) {
    console.error("Error parsing JSON response:", error);
    console.log("Raw response:", msg.content[0].text);
    throw error;
  }
};
