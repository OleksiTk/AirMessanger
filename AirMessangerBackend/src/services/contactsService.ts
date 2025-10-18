import { prisma } from "../config/prisma.js";

export const contactsService = {
  async addContacts(name_profile: string, userId: string) {
    const addContact = await prisma.contacts.create({
      data: {
        name_profile,
        userId,
      },
    });

    return addContact;
  },
  async getContacts(userId: string) {
    const contactProfiles = await prisma.contacts.findMany({
      where: { userId },
      select: { name_profile: true },
    });

    // 2. Дістаємо список name_profile (googleId користувачів-контактів)
    const profileIds = contactProfiles.map((c) => c.name_profile);

    // 3. Отримуємо дані користувачів по name_profile (googleId)
    const users = await prisma.user.findMany({
      where: {
        name_profile: {
          in: profileIds,
        },
      },
      select: {
        id: true,
        name: true,
        avatar: true,
        name_profile: true,
      },
    });

    return users;
  },
  deletContacts() {},
};
