-- CreateTable
CREATE TABLE "InventoryEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "returnTo" TEXT,
    "materialDescription" TEXT NOT NULL,
    "units" TEXT,
    "quantity" INTEGER NOT NULL,
    "orderBy" TEXT,
    "remark" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'completed'
);
