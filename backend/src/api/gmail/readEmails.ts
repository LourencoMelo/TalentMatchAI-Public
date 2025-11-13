import { gmail_v1 } from "googleapis";
import { GaxiosResponse } from "googleapis-common";

export function getEmailSubject(
  email: GaxiosResponse<gmail_v1.Schema$Message>
) {
  try {
    return getEmailHeader(email, "Subject");
  } catch (error) {
    throw new Error(`Failed to get email subject: ${error}`);
  }
}

export function getEmailBody(email: GaxiosResponse<gmail_v1.Schema$Message>) {
  try {
    const parts = email.data.payload?.parts;
    if (parts) {
      const body = parts[0].body?.data;
      if (body) {
        const decodedBody = Buffer.from(body, "base64").toString();
        return decodedBody;
      }
    }
  } catch (error) {
    throw new Error(`Failed to get email body: ${error}`);
  }
}

export function getEmailHeader(
  email: GaxiosResponse<gmail_v1.Schema$Message>,
  headerName: string
): string | undefined {
  try {
    const headers = email.data.payload?.headers || [];
    const header = headers.find((header) => header.name === headerName);
    return header && header.value !== null ? header.value : undefined;
  } catch (error) {
    throw new Error(`Failed to get email header: ${error}`);
  }
}

export function getEmailFrom(
  email: GaxiosResponse<gmail_v1.Schema$Message>
): string {
  try {
    const fromHeader = getEmailHeader(email, "From");

    if (!fromHeader) {
      return "";
    }

    const match = fromHeader.match(/<([^>]+)>/);

    return match ? match[1] : fromHeader;
  } catch (error) {
    throw new Error(`Failed to get email from: ${error}`);
  }
}

export function markAsRead(
  gmail: gmail_v1.Gmail,
  email: GaxiosResponse<gmail_v1.Schema$Message>
) {
  try {
    if (!email.data.id) {
      throw new Error("Email ID not found");
    }

    gmail.users.messages.modify({
      userId: "me",
      id: email.data.id,
      requestBody: {
        removeLabelIds: ["UNREAD"],
      },
    });
  } catch (error) {
    throw new Error(`Failed to mark email as read: ${error}`);
  }
}

export function isEmailUnread(
  email: GaxiosResponse<gmail_v1.Schema$Message>
): boolean {
  try {
    const labels = email.data.labelIds || [];
    return labels.includes("UNREAD");
  } catch (error) {
    throw new Error(`Failed to check if email is unread: ${error}`);
  }
}
