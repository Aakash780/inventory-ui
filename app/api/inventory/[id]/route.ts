import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const data = await req.json();
  const entry = await prisma.inventoryEntry.update({
    where: { id: params.id },
    data,
  });
  return NextResponse.json(entry);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await prisma.inventoryEntry.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
