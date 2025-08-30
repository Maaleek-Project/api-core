import { Injectable } from "@nestjs/common";
import { BusinessCardModel } from "src/core/domain/models/business_card.model";
import { IBusinessCardRepo } from "src/core/interfaces/i_business_card_repo";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class BusinessCardRepo implements IBusinessCardRepo {

    constructor(
        private readonly prisma: PrismaService,
    ) {}

    async save(businessCard : BusinessCardModel) : Promise<BusinessCardModel> {
        const saved = await this.prisma.businessCard.upsert({
            where: {id : businessCard.id},
            update: {
                number : businessCard.number,
                email : businessCard.email,
                job : businessCard.job
            },
            create: this.toDatabase(businessCard),
            include : {
                 user : {
                    include : {
                        businessCard : {
                            include : {
                                offer : true
                            }
                        }
                    }
                },
                company : true
            }
        })
        return this.toBusinessCard(saved);
    }

    async findByUserId(user_id : string) : Promise<BusinessCardModel | null> {
        const businessCard = await this.prisma.businessCard.findFirst({
            where : {user_id : user_id},
            include : {
                user : {
                    include : {
                        businessCard : {
                            include : {
                                offer : true
                            }
                        }
                    }
                }
            } 
        })
       return businessCard ? this.toBusinessCard(businessCard) : null;
    }

    async findByEmailOrNumber(email : string, number : string) : Promise<BusinessCardModel | null> {
        const businessCard = await this.prisma.businessCard.findFirst({
            where : {
                OR : [
                    {email},
                    {number}
                ]
            },
            include : {
                user : {
                    include : {
                        businessCard : {
                            include : {
                                offer : true
                            }
                        }
                    }
                }
            } 
        })
        return businessCard ? this.toBusinessCard(businessCard) : null;
    }
    async findById(id : string) : Promise<BusinessCardModel> {
        const businessCard = await this.prisma.businessCard.findUnique({
            where : {
                id : id
            },
            include : {
                user : {
                    include : {
                        businessCard : {
                            include : {
                                offer : true
                            }
                        }
                    }
                },
                company : true
            }
        });
        return this.toBusinessCard(businessCard);
    }

    async haveTheBusinessCardsReceived(senders_id : string[]) : Promise<BusinessCardModel[]> {
        const businessCards = await this.prisma.businessCard.findMany({
            where : {user_id : {
                in : senders_id
            }},
            include : {
                user : {
                    include : {
                        businessCard : {
                            include : {
                                offer : true
                            }
                        }
                    }
                },
                company : true
            }
        })
        return businessCards.map(businessCard => this.toBusinessCard(businessCard));
    }

    private toBusinessCard(businessCard : any) : BusinessCardModel {
        return {
            id : businessCard.id,
            user : businessCard.user,
            number : businessCard.number,
            email : businessCard.email,
            job : businessCard.job,
            offer : businessCard.offer,
            created_at : businessCard.created_at,
        };
    }

    private toDatabase(businessCard : BusinessCardModel) : any {
        return {
            id : businessCard.id,
            user_id : businessCard.user.id,
            number : businessCard.number,
            email : businessCard.email,
            job : businessCard.job,
            offer : businessCard.user.businessCard?.offer
        }
    }
}