import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const entries = await prisma.inventoryEntry.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(entries);
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const entry = await prisma.inventoryEntry.create({ data });
  return NextResponse.json(entry);
}
