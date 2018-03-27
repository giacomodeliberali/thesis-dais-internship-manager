import { AuthService } from '../services/auth.service'
import { ServiceLocator } from '../services/service-locator.service'
import { RoleType } from '../models';

export function canExecute(roleType: number, requiredRoles: Array<RoleType>) {
    requiredRoles.forEach(role => {
        if ((roleType & role) === role)
            return true;
    });
    return false;
}

/**
 * Throws an error if the specified method is executed from someone who ha not the [[RoleType]].Admin role,
 * otherwise it will execute the method.
 *
 * @param target The target method
 * @param propertyKey The method name
 * @param descriptor  The method descriptor
 */
export function admin(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {

    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {

        if (!ServiceLocator.injector) {
            console.log(`[@admin] ServiceLocator.injector is null`);
            return originalMethod.apply(this, args);
        }

        const authService = ServiceLocator.injector.get(AuthService);

        if (!canExecute(authService.user.role.type, [RoleType.Admin]))
            throw new Error(`[@admin] Permission denied to execute method ${originalMethod}. Required RoleType.Admin`);

        return originalMethod.apply(this, args);
    };


}