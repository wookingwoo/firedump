import { NextRequest, NextResponse } from "next/server";
import { exportCollectionAsJson } from "@/lib/firestore-export";

export const runtime = "nodejs";

type BackupRequestBody = {
  projectId?: string;
  collectionPath?: string;
  serviceAccountJson?: string;
};

function buildFileName(collectionPath: string) {
  const safePath = collectionPath.replace(/[^\w-]+/g, "-");
  const date = new Date().toISOString().slice(0, 10);

  return `firedump-${safePath}-${date}.json`;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as BackupRequestBody;
    const projectId = body.projectId?.trim();
    const collectionPath = body.collectionPath?.trim();
    const serviceAccountJson = body.serviceAccountJson?.trim();

    if (!projectId || !collectionPath || !serviceAccountJson) {
      return NextResponse.json(
        { error: "projectId, collectionPath, and serviceAccountJson are required." },
        { status: 400 },
      );
    }

    const serviceAccount = JSON.parse(serviceAccountJson) as {
      client_email?: string;
      private_key?: string;
      project_id?: string;
    };

    if (!serviceAccount.client_email || !serviceAccount.private_key) {
      return NextResponse.json(
        { error: "The service account JSON is missing client_email or private_key." },
        { status: 400 },
      );
    }

    const payload = await exportCollectionAsJson({
      projectId,
      collectionPath,
      serviceAccount: {
        client_email: serviceAccount.client_email,
        private_key: serviceAccount.private_key,
        project_id: serviceAccount.project_id,
      },
    });

    return new NextResponse(JSON.stringify(payload, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition": `attachment; filename="${buildFileName(collectionPath)}"`,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unexpected error while exporting Firestore data.",
      },
      { status: 500 },
    );
  }
}
