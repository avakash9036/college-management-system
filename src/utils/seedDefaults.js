import { env } from '../config/env.js';
import { ROLES } from '../constants/roles.js';
import { Role, User } from '../models/index.js';
import { hashPassword } from './password.js';

export async function seedDefaults() {
  const roles = await Promise.all(
    Object.values(ROLES).map((name) =>
      Role.findOrCreate({
        where: { name },
        defaults: { description: name.replaceAll('_', ' ') }
      })
    )
  );

  const superAdminRole = roles.find(([role]) => role.name === ROLES.SUPER_ADMIN)?.[0];
  if (!superAdminRole) throw new Error('SUPER_ADMIN role could not be created.');

  const [admin, created] = await User.findOrCreate({
    where: { email: env.superAdmin.email },
    defaults: {
      firstName: 'Super',
      lastName: 'Admin',
      passwordHash: await hashPassword(env.superAdmin.password),
      roleId: superAdminRole.id,
      status: 'ACTIVE'
    }
  });

  const updates = {};
  if (admin.roleId !== superAdminRole.id) updates.roleId = superAdminRole.id;
  if (admin.status !== 'ACTIVE') updates.status = 'ACTIVE';

  if (Object.keys(updates).length > 0) {
    await admin.update(updates);
  }

  return { superAdminCreated: created };
}
