"use server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

async function getIncomeExpense(): Promise<{
  income?: number;
  expense?: number;
  error?: string;
}> {
  const { userId } = auth();

  if (!userId) {
    return { error: "User not found" };
  }

  try {
    const transactions = await db.transaction.findMany({
      where: { userId },
    });

    const amounts: number[] = transactions.map(
      (transaction) => transaction.amount
    );
    const income: number = amounts.reduce(
      (sum, amount) => (amount > 0 ? sum + amount : sum),
      0
    );

    const expense = amounts
      .filter((amount) => amount < 0)
      .reduce((sum, amount) => sum + amount, 0);

    return { income, expense };
  } catch (error) {
    return { error: "Database error" };
  }
}

export default getIncomeExpense;
