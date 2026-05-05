import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import MaterialsClient from "./MaterialsClient";

export default async function MaterialsPage({ searchParams }) {
  // Extract track from URL search params
  const { track } = await searchParams;
  const trackSlug = track || "ai"; // fallback

  // Fetch track and its real materials from DB
  const trackData = await prisma.track.findUnique({
    where: { slug: trackSlug },
    include: {
      materials: {
        orderBy: { createdAt: "asc" }
      }
    }
  });

  if (!trackData) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h1>Track not found</h1>
      </div>
    );
  }

  // Pass it down to client component
  return (
    <Suspense fallback={<div>Loading materials...</div>}>
      <MaterialsClient trackData={trackData} materials={trackData.materials} />
    </Suspense>
  );
}
