import { EntityModel } from "../models/entity.model";

export class EntityDtm {
    id: number;
    libelle: string;
    code: string;

    constructor(id: number, libelle: string, code: string) {
        this.id = id;
        this.libelle = libelle;
        this.code = code;
    }

    static fromEntityDtm(entity: EntityModel): EntityDtm {
        return new EntityDtm(entity.id, entity.libelle, entity.code);
    }
}