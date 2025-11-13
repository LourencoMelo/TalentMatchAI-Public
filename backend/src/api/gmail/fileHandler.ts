import fs from "fs/promises";
import path from "path";
import { gmail_v1 } from "googleapis";
import { pdfToText } from "pdf-ts";

const pathToEmailDir = `${process.cwd()}/pdfs`;
const pathTextOutput = pathToEmailDir + "/pdfOutput.txt";

export async function downloadAttachment(
  gmail: gmail_v1.Gmail,
  messageId: string,
  attachment: gmail_v1.Schema$MessagePart
) {
  if (
    !attachment.filename ||
    !attachment.body ||
    !attachment.body.attachmentId
  ) {
    throw new Error("Invalid attachment");
  }
  const attachmentId = attachment.body.attachmentId;
  const response = await gmail.users.messages.attachments.get({
    userId: "me",
    messageId,
    id: attachmentId,
  });

  const data = response.data?.data;
  if (!data) {
    throw new Error("Attachment data not found");
  }

  const fileData = Buffer.from(data, "base64");

  const filePath = path.join(pathToEmailDir, attachment.filename);
  await fs.writeFile(filePath, new Uint8Array(fileData));

  return filePath;
}

export async function readPDF(pdfPath: string): Promise<string> {
  try {
    const data = await fs.readFile(pdfPath);
    const fullText = await pdfToText(data);

    return fullText;
  } catch (error) {
    throw new Error("Error parsing PDF: " + error);
  }
}

export async function writeToTxt(content: string) {
  try {
    fs.appendFile(pathTextOutput, content + "\n");
  } catch {
    console.error("Error writing on .txt file");
  }
}

export async function readFromTxt(): Promise<string> {
  try {
    const content = await fs.readFile(pathTextOutput, "utf-8");
    return content;
  } catch (error) {
    console.error("Error reading from .txt file:", error);
    throw error;
  }
}

export async function deleteTextFromFile() {
  try {
    await fs.writeFile(pathTextOutput, "");
  } catch (error) {
    console.error("Error deleting text from file:", error);
    throw error;
  }
}
