-- CreateTable
CREATE TABLE "Options" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shopifyId" TEXT NOT NULL,
    "optionId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "values" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Options_optionId_key" ON "Options"("optionId");
