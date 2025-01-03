/*
  Warnings:

  - You are about to drop the column `response_times` on the `Response` table. All the data in the column will be lost.
  - Added the required column `llm` to the `Evaluations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `responseTime` to the `Evaluations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Evaluations" ADD COLUMN     "llm" TEXT NOT NULL,
ADD COLUMN     "responseTime" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Experiment" ALTER COLUMN "Eval_criteria" SET NOT NULL,
ALTER COLUMN "Eval_criteria" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Response" DROP COLUMN "response_times";
