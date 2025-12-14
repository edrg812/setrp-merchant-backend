-- CreateTable
CREATE TABLE "BalanceOverview" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "currency" TEXT NOT NULL,
    "totalBalance" REAL NOT NULL,
    "availableBalance" REAL NOT NULL,
    "holdingFunds" REAL NOT NULL,
    "todaysRevenue" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
