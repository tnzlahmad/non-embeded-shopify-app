-- CreateTable
CREATE TABLE "Collections" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "collectionId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "bodyHtml" TEXT NOT NULL,
    "handle" TEXT NOT NULL,
    "image" TEXT,
    "published" TEXT,
    "publishedAt" DATETIME NOT NULL,
    "publishedScope" TEXT NOT NULL,
    "sortOrder" TEXT NOT NULL,
    "templateSuffix" TEXT,
    "updatedAt" DATETIME NOT NULL,
    "adminGraphqlApiId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Collections_collectionId_key" ON "Collections"("collectionId");
