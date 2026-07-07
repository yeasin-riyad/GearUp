-- CreateIndex
CREATE INDEX "gear_items_name_idx" ON "gear_items"("name");

-- CreateIndex
CREATE INDEX "gear_items_brand_idx" ON "gear_items"("brand");

-- CreateIndex
CREATE INDEX "gear_items_categoryId_idx" ON "gear_items"("categoryId");

-- CreateIndex
CREATE INDEX "gear_items_providerId_idx" ON "gear_items"("providerId");

-- CreateIndex
CREATE INDEX "gear_items_availability_idx" ON "gear_items"("availability");

-- CreateIndex
CREATE INDEX "gear_items_pricePerDay_idx" ON "gear_items"("pricePerDay");

-- CreateIndex
CREATE INDEX "gear_items_createdAt_idx" ON "gear_items"("createdAt");
