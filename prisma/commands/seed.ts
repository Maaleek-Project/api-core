import CountrySeeder from './seed/country';
import EntitySeeder from './seed/entity';
import RoleSeeder from './seed/role';
import UserSeeder from './seed/user';

async function main() {

  await CountrySeeder();
  await EntitySeeder();
  await RoleSeeder();
  await UserSeeder();

  console.log('🎉 Seeding done.');
}

main()
