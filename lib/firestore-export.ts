import { App, cert, deleteApp, getApp, getApps, initializeApp } from "firebase-admin/app";
import { DocumentData, getFirestore, Timestamp } from "firebase-admin/firestore";

type ServiceAccountPayload = {
  client_email: string;
  private_key: string;
  project_id?: string;
};

type SerializedValue =
  | null
  | boolean
  | number
  | string
  | SerializedValue[]
  | { [key: string]: SerializedValue };

type ExportedDocument = {
  id: string;
  path: string;
  data: Record<string, SerializedValue>;
  subcollections?: Record<string, ExportedDocument[]>;
};

function getScopedApp(projectId: string, serviceAccount: ServiceAccountPayload): App {
  const appName = `firedump-${projectId}`;
  const existing = getApps().find((app) => app.name === appName);

  if (existing) {
    return getApp(appName);
  }

  return initializeApp(
    {
      credential: cert({
        projectId,
        clientEmail: serviceAccount.client_email,
        privateKey: serviceAccount.private_key,
      }),
      projectId,
    },
    appName,
  );
}

function serializeValue(value: unknown): SerializedValue {
  if (value === null || value === undefined) {
    return null;
  }

  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return value;
  }

  if (value instanceof Timestamp) {
    return value.toDate().toISOString();
  }

  if (Array.isArray(value)) {
    return value.map((item) => serializeValue(item));
  }

  if (typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, item]) => [
        key,
        serializeValue(item),
      ]),
    );
  }

  return String(value);
}

async function exportDocument(
  doc: FirebaseFirestore.QueryDocumentSnapshot<DocumentData>,
): Promise<ExportedDocument> {
  const collections = await doc.ref.listCollections();
  const subcollections: Record<string, ExportedDocument[]> = {};

  for (const collection of collections) {
    const snapshot = await collection.get();
    subcollections[collection.id] = await Promise.all(
      snapshot.docs.map((childDoc) => exportDocument(childDoc)),
    );
  }

  const exported: ExportedDocument = {
    id: doc.id,
    path: doc.ref.path,
    data: serializeValue(doc.data()) as Record<string, SerializedValue>,
  };

  if (Object.keys(subcollections).length > 0) {
    exported.subcollections = subcollections;
  }

  return exported;
}

export async function exportCollectionAsJson(options: {
  projectId: string;
  collectionPath: string;
  serviceAccount: ServiceAccountPayload;
}) {
  const app = getScopedApp(options.projectId, options.serviceAccount);

  try {
    const firestore = getFirestore(app);
    const snapshot = await firestore.collection(options.collectionPath).get();

    const documents = await Promise.all(
      snapshot.docs.map((doc) => exportDocument(doc)),
    );

    return {
      exportedAt: new Date().toISOString(),
      projectId: options.projectId,
      collectionPath: options.collectionPath,
      documentCount: documents.length,
      documents,
    };
  } finally {
    await deleteApp(app).catch(() => undefined);
  }
}
