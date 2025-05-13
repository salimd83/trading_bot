-- CreateTable
CREATE TABLE "TradeSignal" (
    "id" TEXT NOT NULL,
    "timestamp" TEXT NOT NULL,
    "triggerPrice" TEXT NOT NULL,
    "exchange" TEXT NOT NULL,
    "instrument" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TradeSignal_pkey" PRIMARY KEY ("id")
);
