import { BadRequestException } from '@nestjs/common';

export class HandleValidationBodyRequest extends BadRequestException {
    constructor(validationErrors: any[]) {
        super({
            message: 'Données de validation incorrectes',
            errors: validationErrors.map(error => ({
                field: error.property,
                issues: Object.values(error.constraints),
            })),
        });
    }
}
