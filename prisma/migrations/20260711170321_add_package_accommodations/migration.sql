-- Dev database only: clear existing tour requests so the new NOT NULL
-- accommodation columns on tour_request_packages can be added cleanly.
-- tour_request_packages/attributes cascade automatically; assignments and
-- activity_logs reference tour_requests without cascade, so clear those
-- first. Seed script repopulates demo data afterward.
DELETE FROM "activity_logs" WHERE "tourRequestId" IS NOT NULL;
DELETE FROM "assignments";
DELETE FROM "tour_requests";

-- CreateTable
CREATE TABLE "package_accommodations" (
    "id" TEXT NOT NULL,
    "packageId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "price" DECIMAL(10,2) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "package_accommodations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "package_accommodations_packageId_idx" ON "package_accommodations"("packageId");

-- AddForeignKey
ALTER TABLE "package_accommodations" ADD CONSTRAINT "package_accommodations_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "tour_packages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "tour_request_packages" ADD COLUMN     "accommodationId" TEXT NOT NULL,
ADD COLUMN     "accommodationPriceAtBooking" DECIMAL(10,2) NOT NULL;

-- AddForeignKey
ALTER TABLE "tour_request_packages" ADD CONSTRAINT "tour_request_packages_accommodationId_fkey" FOREIGN KEY ("accommodationId") REFERENCES "package_accommodations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
