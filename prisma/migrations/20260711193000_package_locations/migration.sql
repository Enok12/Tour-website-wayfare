-- AlterTable
ALTER TABLE "tour_packages" DROP COLUMN "price";

-- CreateTable
CREATE TABLE "package_locations" (
    "id" TEXT NOT NULL,
    "packageId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DECIMAL(10,2) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "package_locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tour_request_package_locations" (
    "id" TEXT NOT NULL,
    "tourRequestPackageId" TEXT NOT NULL,
    "packageLocationId" TEXT NOT NULL,
    "priceAtBooking" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "tour_request_package_locations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "package_locations_packageId_idx" ON "package_locations"("packageId");

-- CreateIndex
CREATE UNIQUE INDEX "tour_request_package_locations_tourRequestPackageId_package_key" ON "tour_request_package_locations"("tourRequestPackageId", "packageLocationId");

-- AddForeignKey
ALTER TABLE "package_locations" ADD CONSTRAINT "package_locations_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "tour_packages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tour_request_package_locations" ADD CONSTRAINT "tour_request_package_locations_tourRequestPackageId_fkey" FOREIGN KEY ("tourRequestPackageId") REFERENCES "tour_request_packages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tour_request_package_locations" ADD CONSTRAINT "tour_request_package_locations_packageLocationId_fkey" FOREIGN KEY ("packageLocationId") REFERENCES "package_locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
