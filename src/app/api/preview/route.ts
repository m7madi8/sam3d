import { NextResponse } from "next/server";
import {
  clearPreviewCookie,
  getPreviewSecret,
  setPreviewCookie,
  verifyPreviewToken,
} from "@/lib/siteMode";

export async function POST(request: Request) {
  const secret = getPreviewSecret();
  if (!secret) {
    return NextResponse.json({ error: "Preview access is not configured." }, { status: 503 });
  }

  let key = "";
  try {
    const body = (await request.json()) as { key?: string };
    key = body.key?.trim() ?? "";
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!verifyPreviewToken(key)) {
    return NextResponse.json({ error: "Invalid access key." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  await setPreviewCookie(response);
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  clearPreviewCookie(response);
  return response;
}
