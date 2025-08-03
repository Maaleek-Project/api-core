export class ProviderDtm {
    id : string ;
    libelle : string ;
    activated : boolean ;
    cover : string ;
    description : string ;
    created_at? : Date;

    constructor(id : string, libelle : string, activated : boolean, cover : string, description : string, created_at? : Date) {
        this.id = id;
        this.libelle = libelle;
        this.activated = activated;
        this.cover = cover;
        this.description = description;
        this.created_at = created_at;
    }

    static fromProviderDtm(provider : any) : ProviderDtm {
        return new ProviderDtm(provider.id, provider.libelle, provider.activated, provider.cover, provider.description, provider.created_at);
    }
}