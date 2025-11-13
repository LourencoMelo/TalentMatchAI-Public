import axios from "axios";

import { readFromTxt } from "../gmail/fileHandler";
// @ts-ignore
import extract from "extract-json-from-string";

export async function llama3() {
  const localhost = "127.0.0.1";
  console.log("Awaiting for AI Response...");

  const role = "Data Scientist";

  try {
    const contentTxt = await readFromTxt();

    const jsonFormat = `{
      "name": "string",
      "email": "string",
      "phone": "string",
      "academicEducation": number,         
      "work_experience": number,          
      "technical_skills": number,         
      "cultural_fit": number,              
      "problem_solving": number,          
      "leadership": number,               
      "overall_score": number              
      "notes": "string"
    }`;

    const response = await axios.post(
      `http://${localhost}:11434/api/generate`,
      {
        model: "mistral:instruct",
        prompt: `You are an API created to evaluate all the candidates for a ${role} Role and return only an array of objects in a JSON style in form of an answer without any comments.
        On the evaluation parameters that are numbers every note should be attributed between [0-10](no experience equals 0, never leave the number type parameters as null, it cant exceed 10 never).
        Please get all the correct information from the text and don't make up any information.
        The overall score is between [0-10] too.
        Never leave any attribute as null, always put a 0 or an empty string.
        On the notes field, you should write a short summary of the candidate's profile.
        Never add comments inside the JSON.
        Evaluate considering they are applying for a ${role} position.
        This is the required format ${jsonFormat}. 
        The informations is all available here: ${contentTxt}.`,
        role: "Top Tier Recruiter API",
      },
      {
        responseType: "stream",
      }
    );

    let finalResponse = "";

    await new Promise<void>((resolve, reject) => {
      response.data.on("data", (chunk: any) => {
        const data = JSON.parse(chunk.toString());
        finalResponse += data.response;
      });

      response.data.on("end", () => {
        resolve();
      });

      response.data.on("error", (err: any) => {
        reject(err);
      });
    });

    console.log("FINAL RESPONSE:", finalResponse);

    const cleanedString = finalResponse
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let extractedJson = extract(cleanedString);

    if (extractedJson.length === 0) {
      const arrayMatch = cleanedString.match(/\[[\s\S]*\]/);
      if (arrayMatch) {
        try {
          extractedJson = [JSON.parse(arrayMatch[0])];
        } catch (e) {
          console.error("Failed to parse JSON:", e);
        }
      }
    }

    console.log("EXTRACTED JSON:", extractedJson.flat());
    return extractedJson.flat();
  } catch (error: unknown) {
    console.error(
      "Error making POST request:",
      error instanceof Error ? error.message : String(error)
    );
    if (axios.isAxiosError(error) && error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
    }
  }
}
