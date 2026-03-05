export const ADMIN_ROLE = 'admin';
export const MANAGER_ROLE = 'manager';
export const STAFF_ROLE = 'staff';

export const ROLE_OPTIONS = [ADMIN_ROLE, MANAGER_ROLE, STAFF_ROLE];

const LEGACY_ROLE_MAP = {
    super_admin: ADMIN_ROLE,
    company_admin: ADMIN_ROLE,
    admin: ADMIN_ROLE,
    manager: MANAGER_ROLE,
    staff: STAFF_ROLE
};

export const normalizeRole = (role) => {
    if (!role) return role;
    return LEGACY_ROLE_MAP[role] || STAFF_ROLE;
};

export const hasAdminAccess = (user) => normalizeRole(user?.role) === ADMIN_ROLE;
export const hasManagerAccess = (user) => [ADMIN_ROLE, MANAGER_ROLE].includes(normalizeRole(user?.role));

export const isAllowedRole = (user, allowedRoles = []) => {
    if (!user) return false;
    const normalized = normalizeRole(user.role);
    return allowedRoles.includes(normalized);
};
