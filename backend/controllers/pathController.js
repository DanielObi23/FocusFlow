import OpenAI from "openai";
import "dotenv/config";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const completion = openai.chat.completions.create({
  model: "gpt-4o-mini",
  messages: [
    {
      role: "system",
      content: "You are a learning manager that crafts perfect road maps to learn any skills with proper step by step guide, " +
              "if applicable, add a project for each section towards mastering the skill and provide an appropriate time frame "+
              "to complete the project. Each road map should include a list of resources, a timeline, and a completion checklist. " +
              "Make sure to include a section for 'Review and Reflect' at the end of each road map. Give it to me in markdown with proper formatting", 
    },
    {
      role: "user", 
      content: "I want to learn React"
    }
  ],
  temperature: 0.7,
});

completion.then((result) => console.log(result.choices[0].message));