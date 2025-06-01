import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const entry = await prisma.inventoryEntry.findUnique({
      where: { id: params.id },
    });
    
    if (!entry) {
      return NextResponse.json({ error: 'Inventory entry not found' }, { status: 404 });
    }
    
    return NextResponse.json(entry);
  } catch (error) {
    console.error('Error fetching inventory entry:', error);
    return NextResponse.json({ error: 'Failed to fetch inventory entry' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await req.json();
    
    // First check if entry exists
    const exists = await prisma.inventoryEntry.findUnique({
      where: { id: params.id },
      select: { id: true },
    });
    
    if (!exists) {
      return NextResponse.json({ error: 'Inventory entry not found' }, { status: 404 });
    }
    
    const entry = await prisma.inventoryEntry.update({
      where: { id: params.id },
      data,
    });
    
    return NextResponse.json(entry);
  } catch (error) {
    console.error('Error updating inventory entry:', error);
    return NextResponse.json({ error: 'Failed to update inventory entry' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // First check if entry exists
    const exists = await prisma.inventoryEntry.findUnique({
      where: { id: params.id },
      select: { id: true },
    });
    
    if (!exists) {
      return NextResponse.json({ error: 'Inventory entry not found' }, { status: 404 });
    }
    
    await prisma.inventoryEntry.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Error deleting inventory entry:', error);
    return NextResponse.json({ error: 'Failed to delete inventory entry' }, { status: 500 });
  }
}
