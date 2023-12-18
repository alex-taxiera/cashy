-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "UserImage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "altText" TEXT,
    "contentType" TEXT NOT NULL,
    "blob" BLOB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "UserImage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Password" (
    "hash" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Password_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "expirationDate" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Permission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "access" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Verification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" TEXT NOT NULL,
    "target" TEXT NOT NULL,
    "secret" TEXT NOT NULL,
    "algorithm" TEXT NOT NULL,
    "digits" INTEGER NOT NULL,
    "period" INTEGER NOT NULL,
    "charSet" TEXT NOT NULL,
    "expiresAt" DATETIME
);

-- CreateTable
CREATE TABLE "Connection" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "providerName" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Connection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_PermissionToRole" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_PermissionToRole_A_fkey" FOREIGN KEY ("A") REFERENCES "Permission" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_PermissionToRole_B_fkey" FOREIGN KEY ("B") REFERENCES "Role" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_RoleToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_RoleToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Role" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_RoleToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "PlaidItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "accessToken" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    CONSTRAINT "PlaidItem_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "UserImage_userId_key" ON "UserImage"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Password_userId_key" ON "Password"("userId");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_action_entity_access_key" ON "Permission"("action", "entity", "access");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Verification_target_type_key" ON "Verification"("target", "type");

-- CreateIndex
CREATE UNIQUE INDEX "Connection_providerName_providerId_key" ON "Connection"("providerName", "providerId");

-- CreateIndex
CREATE UNIQUE INDEX "_PermissionToRole_AB_unique" ON "_PermissionToRole"("A", "B");

-- CreateIndex
CREATE INDEX "_PermissionToRole_B_index" ON "_PermissionToRole"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_RoleToUser_AB_unique" ON "_RoleToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_RoleToUser_B_index" ON "_RoleToUser"("B");

-- CreateIndex
CREATE INDEX "PlaidItem_ownerId_idx" ON "PlaidItem"("ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "PlaidItem_itemId_key" ON "PlaidItem"("itemId");

--------------------------------- Manual Seeding --------------------------
-- Hey there, Kent here! This is how you can reliably seed your database with
-- some data. You edit the migration.sql file and that will handle it for you.

INSERT INTO Permission VALUES('clqabboyq0000xns7ktt3y8ol','create','user','own','',1702867469858,1702867469858);
INSERT INTO Permission VALUES('clqabboys0001xns7filr3h4a','create','user','any','',1702867469861,1702867469861);
INSERT INTO Permission VALUES('clqabboyv0002xns7ykhyztky','read','user','own','',1702867469863,1702867469863);
INSERT INTO Permission VALUES('clqabboyx0003xns7t0ni5wx0','read','user','any','',1702867469866,1702867469866);
INSERT INTO Permission VALUES('clqabboz00004xns7ftq9h2ei','update','user','own','',1702867469869,1702867469869);
INSERT INTO Permission VALUES('clqabboz30005xns7k0tfw5xm','update','user','any','',1702867469871,1702867469871);
INSERT INTO Permission VALUES('clqabboz70006xns7qw0wcgp7','delete','user','own','',1702867469875,1702867469875);
INSERT INTO Permission VALUES('clqabboz90007xns7s5v2nom2','delete','user','any','',1702867469878,1702867469878);
INSERT INTO Permission VALUES('clqabbozc0008xns7r3uf8q7a','create','plaidItem','own','',1702867469881,1702867469881);
INSERT INTO Permission VALUES('clqabbozf0009xns7lpg56e0a','create','plaidItem','any','',1702867469884,1702867469884);
INSERT INTO Permission VALUES('clqabbozh000axns7djmdn4vr','read','plaidItem','own','',1702867469886,1702867469886);
INSERT INTO Permission VALUES('clqabbozk000bxns751u4eysv','read','plaidItem','any','',1702867469888,1702867469888);
INSERT INTO Permission VALUES('clqabbozn000cxns75t8qw8d5','update','plaidItem','own','',1702867469891,1702867469891);
INSERT INTO Permission VALUES('clqabbozp000dxns7dw0xvaak','update','plaidItem','any','',1702867469894,1702867469894);
INSERT INTO Permission VALUES('clqabbozt000exns7024zsil2','delete','plaidItem','own','',1702867469897,1702867469897);
INSERT INTO Permission VALUES('clqabbozw000fxns7b9wd4ac6','delete','plaidItem','any','',1702867469900,1702867469900);

INSERT INTO Role VALUES('clqabbp01000gxns7carjhesq','admin','',1702867469905,1702867469905);
INSERT INTO Role VALUES('clqabbp07000hxns7tu8hcfkp','user','',1702867469911,1702867469911);

INSERT INTO _PermissionToRole VALUES('clqabboys0001xns7filr3h4a','clqabbp01000gxns7carjhesq');
INSERT INTO _PermissionToRole VALUES('clqabboyx0003xns7t0ni5wx0','clqabbp01000gxns7carjhesq');
INSERT INTO _PermissionToRole VALUES('clqabboz30005xns7k0tfw5xm','clqabbp01000gxns7carjhesq');
INSERT INTO _PermissionToRole VALUES('clqabboz90007xns7s5v2nom2','clqabbp01000gxns7carjhesq');
INSERT INTO _PermissionToRole VALUES('clqabbozf0009xns7lpg56e0a','clqabbp01000gxns7carjhesq');
INSERT INTO _PermissionToRole VALUES('clqabbozk000bxns751u4eysv','clqabbp01000gxns7carjhesq');
INSERT INTO _PermissionToRole VALUES('clqabbozp000dxns7dw0xvaak','clqabbp01000gxns7carjhesq');
INSERT INTO _PermissionToRole VALUES('clqabbozw000fxns7b9wd4ac6','clqabbp01000gxns7carjhesq');
INSERT INTO _PermissionToRole VALUES('clqabboyq0000xns7ktt3y8ol','clqabbp07000hxns7tu8hcfkp');
INSERT INTO _PermissionToRole VALUES('clqabboyv0002xns7ykhyztky','clqabbp07000hxns7tu8hcfkp');
INSERT INTO _PermissionToRole VALUES('clqabboz00004xns7ftq9h2ei','clqabbp07000hxns7tu8hcfkp');
INSERT INTO _PermissionToRole VALUES('clqabboz70006xns7qw0wcgp7','clqabbp07000hxns7tu8hcfkp');
INSERT INTO _PermissionToRole VALUES('clqabbozc0008xns7r3uf8q7a','clqabbp07000hxns7tu8hcfkp');
INSERT INTO _PermissionToRole VALUES('clqabbozh000axns7djmdn4vr','clqabbp07000hxns7tu8hcfkp');
INSERT INTO _PermissionToRole VALUES('clqabbozn000cxns75t8qw8d5','clqabbp07000hxns7tu8hcfkp');
INSERT INTO _PermissionToRole VALUES('clqabbozt000exns7024zsil2','clqabbp07000hxns7tu8hcfkp');
