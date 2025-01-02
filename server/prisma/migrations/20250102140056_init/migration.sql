/*
  Warnings:

  - The `Eval_criteria` column on the `Experiment` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `expirment_id` on the `Response` table. All the data in the column will be lost.
  - The `LLM_Responses` column on the `Response` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `title` to the `Experiment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Experiment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Projects` table without a default value. This is not possible if the table is not empty.
  - Made the column `title` on table `Projects` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `experiment_id` to the `Response` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Response" DROP CONSTRAINT "Response_expirment_id_fkey";

-- AlterTable
ALTER TABLE "Experiment" ADD COLUMN     "description" TEXT,
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
DROP COLUMN "Eval_criteria",
ADD COLUMN     "Eval_criteria" TEXT[];

-- AlterTable
ALTER TABLE "Projects" ADD COLUMN     "description" TEXT,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "title" SET NOT NULL;

-- AlterTable
ALTER TABLE "Response" DROP COLUMN "expirment_id",
ADD COLUMN     "experiment_id" INTEGER NOT NULL,
ADD COLUMN     "response_times" JSONB[],
DROP COLUMN "LLM_Responses",
ADD COLUMN     "LLM_Responses" JSONB[];

-- CreateTable
CREATE TABLE "Evaluations" (
    "id" TEXT NOT NULL,
    "response_id" TEXT NOT NULL,
    "criteria" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "comments" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Evaluations_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_experiment_id_fkey" FOREIGN KEY ("experiment_id") REFERENCES "Experiment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evaluations" ADD CONSTRAINT "Evaluations_response_id_fkey" FOREIGN KEY ("response_id") REFERENCES "Response"("id") ON DELETE CASCADE ON UPDATE CASCADE;
