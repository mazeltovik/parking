-- CreateTable
CREATE TABLE "Reservation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "parkingSpotId" TEXT NOT NULL,
    "reservedDate" TEXT NOT NULL,
    "reservedTime" TEXT NOT NULL,
    "status" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Reservation_id_key" ON "Reservation"("id");

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_parkingSpotId_fkey" FOREIGN KEY ("parkingSpotId") REFERENCES "ParkingSpot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
