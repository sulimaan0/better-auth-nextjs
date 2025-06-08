// scripts/seed-cleaners.ts
import { PrismaClient } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

const prisma = new PrismaClient();

async function seedCleaners() {
  try {
    console.log("🌱 Starting cleaner seeding...");

    // First, create cleaner users
    const cleanerUser1 = await prisma.user.upsert({
      where: { email: "sarah.cleaner@cleanpro.com" },
      update: {},
      create: {
        name: "Sarah Johnson",
        email: "sarah.cleaner@cleanpro.com",
        emailVerified: true,
        role: "CLEANER",
        image: "/avatars/sarah.jpg",
      },
    });

    const cleanerUser2 = await prisma.user.upsert({
      where: { email: "mike.cleaner@cleanpro.com" },
      update: {},
      create: {
        name: "Mike Thompson",
        email: "mike.cleaner@cleanpro.com",
        emailVerified: true,
        role: "CLEANER",
        image: "/avatars/mike.jpg",
      },
    });

    const cleanerUser3 = await prisma.user.upsert({
      where: { email: "emma.cleaner@cleanpro.com" },
      update: {},
      create: {
        name: "Emma Davis",
        email: "emma.cleaner@cleanpro.com",
        emailVerified: true,
        role: "CLEANER",
        image: "/avatars/emma.jpg",
      },
    });

    console.log("✅ Created cleaner users");

    // Create cleaner profiles
    const cleanerProfile1 = await prisma.cleanerProfile.upsert({
      where: { userId: cleanerUser1.id },
      update: {},
      create: {
        userId: cleanerUser1.id,
        workingPostcode: "SW1A",
        workingRadius: 15,
        latitude: 51.5014, // London Westminster area
        longitude: -0.1419,
        hourlyRate: new Decimal(22.5),
        isActive: true,
        isAvailable: true,
      },
    });

    const cleanerProfile2 = await prisma.cleanerProfile.upsert({
      where: { userId: cleanerUser2.id },
      update: {},
      create: {
        userId: cleanerUser2.id,
        workingPostcode: "E1",
        workingRadius: 10,
        latitude: 51.5118, // London East End
        longitude: -0.0755,
        hourlyRate: new Decimal(20.0),
        isActive: true,
        isAvailable: true,
      },
    });

    const cleanerProfile3 = await prisma.cleanerProfile.upsert({
      where: { userId: cleanerUser3.id },
      update: {},
      create: {
        userId: cleanerUser3.id,
        workingPostcode: "NW1",
        workingRadius: 12,
        latitude: 51.526, // London Camden area
        longitude: -0.137,
        hourlyRate: new Decimal(25.0),
        isActive: true,
        isAvailable: true,
      },
    });

    console.log("✅ Created cleaner profiles");

    // Add availability schedules for each cleaner
    const cleaners = [cleanerProfile1, cleanerProfile2, cleanerProfile3];

    for (const cleaner of cleaners) {
      // Monday to Friday, 9 AM to 5 PM
      for (let day = 1; day <= 5; day++) {
        await prisma.cleanerAvailability.upsert({
          where: {
            cleanerId_dayOfWeek: {
              cleanerId: cleaner.id,
              dayOfWeek: day,
            },
          },
          update: {},
          create: {
            cleanerId: cleaner.id,
            dayOfWeek: day,
            startTime: "09:00",
            endTime: "17:00",
            isAvailable: true,
          },
        });
      }

      // Saturday, 9 AM to 3 PM (shorter day)
      await prisma.cleanerAvailability.upsert({
        where: {
          cleanerId_dayOfWeek: {
            cleanerId: cleaner.id,
            dayOfWeek: 6,
          },
        },
        update: {},
        create: {
          cleanerId: cleaner.id,
          dayOfWeek: 6,
          startTime: "09:00",
          endTime: "15:00",
          isAvailable: true,
        },
      });
    }

    console.log("✅ Added availability schedules");

    // Add some sample postcodes for location lookup
    const samplePostcodes = [
      {
        postcode: "SW1A1AA",
        latitude: 51.5014,
        longitude: -0.1419,
        district: "Westminster",
      },
      {
        postcode: "E11AA",
        latitude: 51.5118,
        longitude: -0.0755,
        district: "Whitechapel",
      },
      {
        postcode: "NW11AA",
        latitude: 51.526,
        longitude: -0.137,
        district: "Camden",
      },
      {
        postcode: "W1A1AA",
        latitude: 51.5154,
        longitude: -0.1419,
        district: "Marylebone",
      },
      {
        postcode: "SE11AA",
        latitude: 51.5033,
        longitude: -0.1195,
        district: "Lambeth",
      },
    ];

    for (const postcodeData of samplePostcodes) {
      await prisma.postcode.upsert({
        where: { postcode: postcodeData.postcode },
        update: {},
        create: {
          postcode: postcodeData.postcode,
          latitude: postcodeData.latitude,
          longitude: postcodeData.longitude,
          district: postcodeData.district,
          country: "UK",
        },
      });
    }

    console.log("✅ Added sample postcodes");

    console.log("🎉 Successfully seeded cleaners and postcodes!");
    console.log(`Created ${cleaners.length} cleaner profiles`);
    console.log(`Added availability schedules for all cleaners`);
    console.log(`Added ${samplePostcodes.length} sample postcodes`);
  } catch (error) {
    console.error("❌ Error seeding cleaners:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Execute the seed function
if (require.main === module) {
  seedCleaners().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
