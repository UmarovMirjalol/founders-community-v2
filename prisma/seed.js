const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Seed admin user
  const adminPassword = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@founderscommunity.uz' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@founderscommunity.uz',
      password: adminPassword,
      role: 'ADMIN',
      region: 'Tashkent',
    },
  });

  console.log('✅ Admin user seeded:', admin.email);

  // Seed some sample applications for demo
  const demoPassword = await bcrypt.hash('demo123', 10);

  const demoUsers = [
    { name: 'Aziz Karimov', email: 'aziz@example.com', region: 'Tashkent', age: 21 },
    { name: 'Malika Usmanova', email: 'malika@example.com', region: 'Samarkand', age: 20 },
    { name: 'Bobur Rashidov', email: 'bobur@example.com', region: 'Fergana', age: 22 },
    { name: 'Nilufar Aliyeva', email: 'nilufar@example.com', region: 'Bukhara', age: 19 },
    { name: 'Jasur Toshmatov', email: 'jasur@example.com', region: 'Andijan', age: 23 },
  ];

  const tracks = ['FOUNDER', 'VENTURE', 'RESEARCH'];
  const motivations = [
    "I'm building a fintech platform for micro-lending in Central Asia. Looking for mentorship and network to scale.",
    "Passionate about venture capital and the emerging startup ecosystem in Uzbekistan. Want to learn deal flow analysis.",
    "Researching AI applications in agriculture for arid climates. Seeking academic mentors and publication support.",
    "Working on an edtech startup to make coding education accessible in regional areas. Need MVP support.",
    "Interested in the intersection of blockchain and supply chain for the cotton industry in Uzbekistan.",
  ];

  for (let i = 0; i < demoUsers.length; i++) {
    const user = await prisma.user.upsert({
      where: { email: demoUsers[i].email },
      update: {},
      create: {
        name: demoUsers[i].name,
        email: demoUsers[i].email,
        password: demoPassword,
        age: demoUsers[i].age,
        region: demoUsers[i].region,
        role: 'APPLICANT',
      },
    });

    await prisma.application.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        track: tracks[i % tracks.length],
        motivation: motivations[i],
        status: i === 0 ? 'ACCEPTED' : 'PENDING',
      },
    });

    // If accepted, create member
    if (i === 0) {
      await prisma.member.upsert({
        where: { userId: user.id },
        update: {},
        create: {
          userId: user.id,
          chapter: demoUsers[i].region,
        },
      });

      await prisma.user.update({
        where: { id: user.id },
        data: { role: 'MEMBER' },
      });
    }

    console.log(`✅ Demo user seeded: ${demoUsers[i].name} (${i === 0 ? 'ACCEPTED' : 'PENDING'})`);
  }

  console.log('\n🎉 Database seeded successfully!');
  console.log('Admin login: admin@founderscommunity.uz / admin123');
  console.log('Demo user login: aziz@example.com / demo123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
