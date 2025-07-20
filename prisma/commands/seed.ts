import CountrySeeder from './seed/country';
import EntitySeeder from './seed/entity';
import RoleSeeder from './seed/role';

async function main() {

  await CountrySeeder();
  await EntitySeeder();
  await RoleSeeder();

  console.log('🎉 Seeding done.');
}

main()
