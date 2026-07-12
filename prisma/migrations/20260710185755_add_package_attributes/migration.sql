-- DropForeignKey
ALTER TABLE "tour_requests" DROP CONSTRAINT "tour_requests_packageId_fkey";

-- AlterTable
ALTER TABLE "tour_requests" DROP COLUMN "packageId",
ADD COLUMN     "estimatedTotal" DECIMAL(10,2);

-- CreateTable
CREATE TABLE "package_attributes" (
    "id" TEXT NOT NULL,
    "packageId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DECIMAL(10,2) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "package_attributes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tour_request_packages" (
    "id" TEXT NOT NULL,
    "tourRequestId" TEXT NOT NULL,
    "packageId" TEXT NOT NULL,
    "priceAtBooking" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tour_request_packages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tour_request_package_attributes" (
    "id" TEXT NOT NULL,
    "tourRequestPackageId" TEXT NOT NULL,
    "packageAttributeId" TEXT NOT NULL,
    "priceAtBooking" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "tour_request_package_attributes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "package_attributes_packageId_idx" ON "package_attributes"("packageId");

-- CreateIndex
CREATE INDEX "tour_request_packages_tourRequestId_idx" ON "tour_request_packages"("tourRequestId");

-- CreateIndex
CREATE UNIQUE INDEX "tour_request_packages_tourRequestId_packageId_key" ON "tour_request_packages"("tourRequestId", "packageId");

-- CreateIndex
CREATE UNIQUE INDEX "tour_request_package_attributes_tourRequestPackageId_packag_key" ON "tour_request_package_attributes"("tourRequestPackageId", "packageAttributeId");

-- AddForeignKey
ALTER TABLE "package_attributes" ADD CONSTRAINT "package_attributes_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "tour_packages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tour_request_packages" ADD CONSTRAINT "tour_request_packages_tourRequestId_fkey" FOREIGN KEY ("tourRequestId") REFERENCES "tour_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tour_request_packages" ADD CONSTRAINT "tour_request_packages_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "tour_packages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tour_request_package_attributes" ADD CONSTRAINT "tour_request_package_attributes_tourRequestPackageId_fkey" FOREIGN KEY ("tourRequestPackageId") REFERENCES "tour_request_packages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tour_request_package_attributes" ADD CONSTRAINT "tour_request_package_attributes_packageAttributeId_fkey" FOREIGN KEY ("packageAttributeId") REFERENCES "package_attributes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

