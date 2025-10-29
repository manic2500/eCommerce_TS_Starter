export enum AppPermission {
    // Super Admin
    ALL = 'all',

    // User Management
    USER_ALL = 'user:all',
    USER_CREATE = 'user:create',
    USER_READ = 'user:read',
    USER_UPDATE = 'user:update',
    USER_DELETE = 'user:delete',
    USER_IMPERSONATE = 'user:impersonate',

    // Role & Permission Management
    ROLE_ALL = 'role:all',
    ROLE_READ = 'role:read',
    ROLE_UPDATE = 'role:update',
    PERMISSION_READ = 'permission:read',

    // Product Management
    PRODUCT_ALL = 'product:all',
    PRODUCT_CREATE = 'product:create',
    PRODUCT_READ = 'product:read',
    PRODUCT_UPDATE = 'product:update',
    PRODUCT_DELETE = 'product:delete',
    PRODUCT_PUBLISH = 'product:publish',

    // Category Management
    CATEGORY_ALL = 'category:all',
    CATEGORY_CREATE = 'category:create',
    CATEGORY_READ = 'category:read',
    CATEGORY_UPDATE = 'category:update',
    CATEGORY_DELETE = 'category:delete',

    // Order Management
    ORDER_ALL = 'order:all',
    ORDER_READ = 'order:read',
    ORDER_UPDATE = 'order:update',

    // Customer Support
    SUPPORT_ALL = 'support:all',
    SUPPORT_READ = 'support:read',
    SUPPORT_UPDATE = 'support:update',

    // Content Management
    CONTENT_ALL = 'content:all',
    CONTENT_CREATE = 'content:create',
    CONTENT_READ = 'content:read',
    CONTENT_UPDATE = 'content:update',
    CONTENT_DELETE = 'content:delete',

    // Analytics & Reporting
    ANALYTICS_ALL = 'analytics:all',
    ANALYTICS_READ = 'analytics:read',

    // Inventory Management
    INVENTORY_ALL = 'inventory:all',
    INVENTORY_READ = 'inventory:read',
    INVENTORY_UPDATE = 'inventory:update',

    // Settings Management
    SETTINGS_ALL = 'settings:all',
    SETTINGS_UPDATE = 'settings:update',
}
