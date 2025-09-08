import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function CreateBusinessCard() {

    await prisma.$executeRawUnsafe(`
      CREATE OR REPLACE FUNCTION business_card_insert_trigger() RETURNS TRIGGER AS $$
      DECLARE
        offer_id TEXT;
        BEGIN

          SELECT "id" INTO offer_id FROM public."offers" WHERE "code" = 'Std' ;

          IF NEW."id" IS NOT NULL THEN
            INSERT INTO public."business_cards" ("id","user_id", "offer_id", "number", "email","job", "company_id", "created_at", "updated_at" , "social_networks")
            VALUES (gen_random_uuid(), NEW."id", offer_id, NEW."number", NULL, NULL, NULL, CURRENT_DATE, CURRENT_DATE,ARRAY['','','']);
          END IF;
          RETURN NEW;
        END;
      $$ LANGUAGE plpgsql;
    `);

    await prisma.$executeRawUnsafe(`
      CREATE OR REPLACE TRIGGER trigger_create_business_card
      AFTER INSERT ON public."users"
      FOR EACH ROW
      EXECUTE FUNCTION business_card_insert_trigger();
    `);

}

CreateBusinessCard()
  .catch((e) => {
    console.error('❌ Error business cards ps :', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
});