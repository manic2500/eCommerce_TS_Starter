import prisma from "./client";

async function main() {
    console.log('Starting database seeding...');

    // --- Define Permissions ---
    const permissions = [
        // Global Permissions
        { name: 'all' }, // Special permission for SUPER_ADMIN

        // User Management Permissions
        { name: 'user:all' },
        { name: 'user:create' },
        { name: 'user:read' },
        { name: 'user:update' },
        { name: 'user:delete' },
        { name: 'user:impersonate' }, // For admin to act as a user

        // Role & Permission Management Permissions
        { name: 'role:all' },
        { name: 'role:read' },
        { name: 'role:update' },
        { name: 'permission:read' },

        // Product Management Permissions
        { name: 'product:all' },
        { name: 'product:create' },
        { name: 'product:read' },
        { name: 'product:update' },
        { name: 'product:delete' },
        { name: 'product:publish' },

        // Category Management Permissions
        { name: 'category:all' },
        { name: 'category:create' },
        { name: 'category:read' },
        { name: 'category:update' },
        { name: 'category:delete' },

        // Order Management Permissions
        { name: 'order:all' },
        { name: 'order:read' },
        { name: 'order:update' }, // Includes changing order status

        // Customer Support Permissions
        { name: 'support:all' },
        { name: 'support:read' },
        { name: 'support:update' }, // Manage support tickets

        // Content Management (e.g., blogs, pages) Permissions
        { name: 'content:all' },
        { name: 'content:create' },
        { name: 'content:read' },
        { name: 'content:update' },
        { name: 'content:delete' },

        // Analytics & Reporting Permissions
        { name: 'analytics:all' },
        { name: 'analytics:read' },

        // Inventory Management Permissions
        { name: 'inventory:all' },
        { name: 'inventory:read' },
        { name: 'inventory:update' },

        // Settings Management Permissions
        { name: 'settings:all' },
        { name: 'settings:update' },
    ];

    // --- Define Roles and their Permissions ---
    const roles = [
        {
            name: 'SUPER_ADMIN',
            permissions: ['all'],
        },
        {
            name: 'ADMIN',
            permissions: [
                'user:all',
                'role:read',
                'permission:read',
                'product:all',
                'category:all',
                'order:all',
                'support:all',
                'content:all',
                'analytics:all',
                'inventory:all',
                'settings:all',
            ],
        },
        {
            name: 'EDITOR',
            permissions: [
                'product:create',
                'product:read',
                'product:update',
                'product:publish',
                'category:create',
                'category:read',
                'category:update',
                'content:create',
                'content:read',
                'content:update',
                'inventory:read',
                'inventory:update',
            ],
        },
        {
            name: 'USER',
            permissions: [
                'product:read',
                'category:read',
                'order:read',
                'content:read',
            ],
        },
    ];

    // --- Seed Logic ---
    // Create or update permissions first
    /* const createdPermissions = await Promise.all(
        permissions.map(p =>
            prisma.permission.upsert({
                where: { name: p.name },
                update: {},
                create: { name: p.name },
            })
        )
    ); */

    await Promise.all(
        permissions.map(p =>
            prisma.permission.upsert({
                where: { name: p.name },
                update: {},
                create: { name: p.name },
            })
        )
    );

    // Get a map of permission names to their objects for easy lookup
    //const permissionMap = new Map(createdPermissions.map(p => [p.name, { id: p.id }]));

    // Create or update roles and connect permissions
    /* for (const role of roles) {
      const permissionsToConnect = role.permissions
        .map(pName => permissionMap.get(pName))
        .filter(Boolean); // Filter out any potential undefined values
  
      await prisma.role.upsert({
        where: { name: role.name },
        update: {
          permissions: { set: permissionsToConnect },
        },
        create: {
          name: role.name,
          permissions: { connect: permissionsToConnect },
        },
      });
    } */

    // Create roles and connect permissions
    for (const role of roles) {
        const permissionsToConnect = await prisma.permission.findMany({
            where: { name: { in: role.permissions } },
        });

        await prisma.role.upsert({
            where: { name: role.name },
            update: {
                permissions: { set: permissionsToConnect.map(p => ({ id: p.id })) },
            },
            create: {
                name: role.name,
                permissions: { connect: permissionsToConnect.map(p => ({ id: p.id })) },
            },
        });
    }

    console.log('Database seeding completed successfully!');
}

main()
    .catch(async (e) => {
        console.error(e);
        process.exit(1);
    });

