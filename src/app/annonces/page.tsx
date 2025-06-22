import { Suspense } from "react";
import AnnoncesSection from "@/components/annonces/AnnoncesSection";

export default function AnnoncesPage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <AnnoncesSection />
    </Suspense>
  );
} 