import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Criar usuário padrão
  const hashedPassword = await bcrypt.hash('@D4n63rl0l', 10);
  
  const defaultUser = await prisma.user.upsert({
    where: { username: 'Cayres' },
    update: {},
    create: {
      username: 'Cayres',
      password: hashedPassword,
      name: 'Administrador Cayres',
      email: 'admin@covenos.com.br',
      role: 'ADMIN',
    },
  });

  console.log('Usuário padrão criado:', defaultUser);

  // Criar alguns procedimentos básicos
  const procedures = [
    {
      name: 'Corte Feminino',
      description: 'Corte de cabelo feminino estilo gótico',
      duration: 60,
      price: 80.00,
    },
    {
      name: 'Coloração',
      description: 'Coloração inspirada em tons sombrios',
      duration: 180,
      price: 150.00,
    },
    {
      name: 'Escova Progressiva',
      description: 'Alisamento com produtos naturais',
      duration: 240,
      price: 200.00,
    },
    {
      name: 'Hidratação',
      description: 'Tratamento capilar nutritivo',
      duration: 90,
      price: 60.00,
    },
  ];

  for (const procedure of procedures) {
    const existing = await prisma.procedure.findFirst({
      where: { name: procedure.name }
    });
    
    if (!existing) {
      await prisma.procedure.create({
        data: procedure,
      });
    }
  }

  console.log('Procedimentos básicos criados');

  // Criar alguns produtos de exemplo
  const products = [
    {
      name: 'Shampoo Hidratante',
      type: 'USO_INTERNO' as const,
      stock: 500,
      minStock: 100,
      unit: 'ml',
    },
    {
      name: 'Condicionador Reparador',
      type: 'USO_INTERNO' as const,
      stock: 500,
      minStock: 100,
      unit: 'ml',
    },
    {
      name: 'Máscara Capilar Dark',
      type: 'VENDA' as const,
      price: 45.00,
      stock: 20,
      minStock: 5,
      unit: 'unidade',
    },
    {
      name: 'Óleo Capilar Gothic',
      type: 'VENDA' as const,
      price: 35.00,
      stock: 15,
      minStock: 3,
      unit: 'unidade',
    },
  ];

  for (const product of products) {
    const existing = await prisma.product.findFirst({
      where: { name: product.name }
    });
    
    if (!existing) {
      await prisma.product.create({
        data: product,
      });
    }
  }

  console.log('Produtos básicos criados');

  console.log('Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });