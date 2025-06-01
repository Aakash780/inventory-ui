import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url!);
  const limit = parseInt(searchParams.get('limit') || '0', 10);
  const lowStock = searchParams.get('lowStock');

  let where = {};
  if (lowStock) {
    where = { quantity: { lt: 10 } };
  }

  const entries = await prisma.inventoryEntry.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    ...(limit > 0 ? { take: limit } : {}),
  });
  return NextResponse.json(entries);
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const entry = await prisma.inventoryEntry.create({ data });
  return NextResponse.json(entry);
}
