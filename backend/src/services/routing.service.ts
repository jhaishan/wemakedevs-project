import { Category, Role, User } from '@prisma/client';
import { prisma } from '../prisma/client';

export const routingService = {
  async findStaffForCategory(category: Category): Promise<User | null> {
    let staffCategory: Category | undefined;
    let fallbackRole: Role = Role.WARDEN;

    switch (category) {
      case Category.PLUMBING:
        staffCategory = Category.PLUMBING;
        break;
      case Category.ELECTRICAL:
        staffCategory = Category.ELECTRICAL;
        break;
      case Category.INTERNET:
        staffCategory = Category.OTHER;
        break;
      case Category.STRUCTURAL:
      case Category.OTHER:
        // Handled by WARDEN fallback below
        break;
    }

    if (staffCategory) {
      const staff = await prisma.user.findFirst({
        where: {
          role: Role.STAFF,
          staffCategory,
        },
      });
      if (staff) return staff;
    }

    // Fallback to any WARDEN
    const warden = await prisma.user.findFirst({
      where: { role: Role.WARDEN },
    });
    return warden;
  }
};
