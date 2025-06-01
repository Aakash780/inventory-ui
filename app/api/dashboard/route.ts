import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  // Total items (sum of all quantities)
  const totalItems = await prisma.inventoryEntry.aggregate({
    _sum: { quantity: true },
  });

  // Items In (sum of quantities where status is 'completed' and quantity > 0)
  const itemsIn = await prisma.inventoryEntry.aggregate({
    _sum: { quantity: true },
    where: { status: 'completed', quantity: { gt: 0 } },
  });

  // Items Out (sum of quantities where status is 'returned' or 'pending' and quantity > 0)
  const itemsOut = await prisma.inventoryEntry.aggregate({
    _sum: { quantity: true },
    where: { status: { in: ['returned', 'pending'] }, quantity: { gt: 0 } },
  });

  // Low stock alerts (count of items with quantity less than a threshold, e.g., 10)
  // This is a simple example, you may want to adjust logic based on your needs
  const lowStockAlerts = await prisma.inventoryEntry.count({
    where: { quantity: { lt: 10 } },
  });

  return NextResponse.json({
    totalItems: totalItems._sum.quantity || 0,
    itemsIn: itemsIn._sum.quantity || 0,
    itemsOut: itemsOut._sum.quantity || 0,
    lowStockAlerts,
  });
}
