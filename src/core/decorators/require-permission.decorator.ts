import { applyDecorators, SetMetadata } from '@nestjs/common';
import { DefaultObjects } from '@prisma/client';

export const RequirePermission = (permissions: string | Array<string>, permissionObject?: DefaultObjects) => {
    const authorizedPermissions = Array.isArray(permissions) ? permissions : [permissions];
    return applyDecorators(
        SetMetadata('permissions', {
            permissions: authorizedPermissions,
            permissionObject
        })
    );
};
