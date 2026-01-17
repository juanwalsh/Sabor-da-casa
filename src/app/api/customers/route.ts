import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { Customer } from '@/types';

const DATA_DIR = join(process.cwd(), 'data');
const CUSTOMERS_FILE = join(DATA_DIR, 'customers.json');

async function ensureDataDir() {
  try {
    await mkdir(DATA_DIR, { recursive: true });
  } catch {
    // Diretorio ja existe
  }
}

async function getCustomers(): Promise<Customer[]> {
  try {
    await ensureDataDir();
    const data = await readFile(CUSTOMERS_FILE, 'utf-8');
    const customers = JSON.parse(data);
    return customers.map((customer: Customer) => ({
      ...customer,
      createdAt: new Date(customer.createdAt),
      updatedAt: new Date(customer.updatedAt),
    }));
  } catch {
    return [];
  }
}

async function saveCustomers(customers: Customer[]): Promise<void> {
  await ensureDataDir();
  await writeFile(CUSTOMERS_FILE, JSON.stringify(customers, null, 2), 'utf-8');
}

// Normaliza telefone para comparacao
function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, '');
}

// Normaliza nome para comparacao
function normalizeName(name: string): string {
  return name.toLowerCase().trim();
}

// GET - Busca cliente por telefone ou lista todos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get('phone');
    const name = searchParams.get('name');

    const customers = await getCustomers();

    // Busca especifica por telefone + nome
    if (phone && name) {
      const normalizedPhone = normalizePhone(phone);
      const normalizedName = normalizeName(name);

      const customer = customers.find(c =>
        normalizePhone(c.phone) === normalizedPhone &&
        normalizeName(c.name) === normalizedName
      );

      if (customer) {
        return NextResponse.json({ success: true, customer });
      }
      return NextResponse.json({ success: true, customer: null });
    }

    // Busca por telefone
    if (phone) {
      const normalizedPhone = normalizePhone(phone);
      const filtered = customers.filter(c => normalizePhone(c.phone) === normalizedPhone);
      return NextResponse.json({ success: true, customers: filtered });
    }

    // Lista todos
    return NextResponse.json({ success: true, customers });
  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar clientes' },
      { status: 500 }
    );
  }
}

// POST - Cria novo cliente ou atualiza pontos do existente
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, email, orderTotal } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { success: false, error: 'Nome e telefone sao obrigatorios' },
        { status: 400 }
      );
    }

    const customers = await getCustomers();
    const normalizedPhone = normalizePhone(phone);
    const normalizedName = normalizeName(name);

    // Procura cliente existente
    const existingIndex = customers.findIndex(c =>
      normalizePhone(c.phone) === normalizedPhone &&
      normalizeName(c.name) === normalizedName
    );

    const now = new Date();
    const pointsToAdd = Math.floor(orderTotal || 0); // 1 real = 1 ponto

    if (existingIndex >= 0) {
      // Atualiza cliente existente
      customers[existingIndex] = {
        ...customers[existingIndex],
        email: email || customers[existingIndex].email,
        points: customers[existingIndex].points + pointsToAdd,
        totalSpent: customers[existingIndex].totalSpent + (orderTotal || 0),
        ordersCount: customers[existingIndex].ordersCount + 1,
        updatedAt: now,
      };

      await saveCustomers(customers);
      return NextResponse.json({
        success: true,
        customer: customers[existingIndex],
        pointsAdded: pointsToAdd,
        isNew: false
      });
    }

    // Cria novo cliente
    const newCustomer: Customer = {
      id: `customer-${Date.now()}`,
      name,
      phone,
      email,
      points: pointsToAdd,
      totalSpent: orderTotal || 0,
      ordersCount: 1,
      createdAt: now,
      updatedAt: now,
    };

    customers.push(newCustomer);
    await saveCustomers(customers);

    return NextResponse.json({
      success: true,
      customer: newCustomer,
      pointsAdded: pointsToAdd,
      isNew: true
    });
  } catch (error) {
    console.error('Erro ao criar/atualizar cliente:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao criar/atualizar cliente' },
      { status: 500 }
    );
  }
}

// PUT - Atualiza dados do cliente (resgatar pontos, etc)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, pointsToRedeem, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID do cliente e obrigatorio' },
        { status: 400 }
      );
    }

    const customers = await getCustomers();
    const index = customers.findIndex(c => c.id === id);

    if (index === -1) {
      return NextResponse.json(
        { success: false, error: 'Cliente nao encontrado' },
        { status: 404 }
      );
    }

    // Resgate de pontos
    if (pointsToRedeem && pointsToRedeem > 0) {
      if (customers[index].points < pointsToRedeem) {
        return NextResponse.json(
          { success: false, error: 'Pontos insuficientes' },
          { status: 400 }
        );
      }
      customers[index].points -= pointsToRedeem;
    }

    customers[index] = {
      ...customers[index],
      ...updates,
      updatedAt: new Date(),
    };

    await saveCustomers(customers);

    return NextResponse.json({ success: true, customer: customers[index] });
  } catch (error) {
    console.error('Erro ao atualizar cliente:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao atualizar cliente' },
      { status: 500 }
    );
  }
}
