import { google } from "googleapis";
import { authenticate } from "@google-cloud/local-auth";
import path from "path";
import fs from "fs/promises";
import { OAuth2Client } from "google-auth-library";
import { getEmailFrom, getEmailSubject } from "../gmail/readEmails";
import { downloadAttachment, readPDF, writeToTxt } from "./fileHandler";

const SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"];

const pathToEmailDir = `${process.cwd()}/emailFiles`;

const TOKEN_PATH = path.join(pathToEmailDir, "token.json");
const CREDENTIALS_PATH = path.join(pathToEmailDir, "credentials.json");

async function loadSavedCredentialsIfExist(): Promise<OAuth2Client | null> {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content.toString());

    if (
      !credentials.client_id ||
      !credentials.client_secret ||
      !credentials.refresh_token
    ) {
      throw new Error("Invalid credentials");
    }

    const client = new OAuth2Client(
      credentials.client_id,
      credentials.client_secret
    );

    client.setCredentials({
      refresh_token: credentials.refresh_token,
    });

    return client;
  } catch (err) {
    console.warn("No saved credentials found.");
    return null;
  }
}

async function saveCredentials(client: OAuth2Client) {
  try {
    const content = await fs.readFile(CREDENTIALS_PATH);
    const keys = JSON.parse(content.toString());
    const key = keys.installed || keys.web;
    const payload = JSON.stringify({
      type: "authorized_user",
      client_id: key.client_id,
      client_secret: key.client_secret,
      refresh_token: client.credentials.refresh_token,
    });
    await fs.writeFile(TOKEN_PATH, payload);
  } catch (err) {
    throw Error("Failed to save credentials: " + err);
  }
}

export async function authorize() {
  try {
    let client = await loadSavedCredentialsIfExist();
    if (client) {
      return client;
    }
    client = await authenticate({
      scopes: SCOPES,
      keyfilePath: CREDENTIALS_PATH,
    });
    if (client.credentials) {
      await saveCredentials(client);
    }
    return client;
  } catch (err) {
    throw Error("Authorization failed: " + err);
  }
}

export async function gmailAccess(auth: OAuth2Client) {
  try {
    const gmail = google.gmail({ version: "v1", auth });
    const response = await gmail.users.messages.list({
      userId: "me",
      maxResults: 10,
    });

    const messages = response.data.messages || [];

    for (const message of messages) {
      if (!message.id) {
        continue;
      }
      const email = await gmail.users.messages.get({
        userId: "me",
        id: message.id,
      });

      console.log("Email From:", getEmailFrom(email));
      console.log("Email Subject:", getEmailSubject(email));

      if (
        email.data.payload &&
        email.data.payload.parts &&
        email.data.payload.parts.length > 0
      ) {
        for (const part of email.data.payload.parts) {
          if (part.filename && part.filename.includes(".pdf")) {
            const emailPdfFilePath = await downloadAttachment(
              gmail,
              message.id,
              part
            );
            console.log("PDF attachment downloaded.");
            const text = await readPDF(emailPdfFilePath);
            writeToTxt(text);
          }
        }
      }
      console.log("---------------------------");
    }
  } catch (err) {
    throw Error("Failed to access Gmail: " + err);
  }
}
