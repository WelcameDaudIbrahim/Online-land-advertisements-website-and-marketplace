/**
 * ! Executing this script will delete all data in your database and seed it with 10 user.
 * ! Make sure to adjust the script to your needs.
 * Use any TypeScript runner to run this script, for example: `npx tsx seed.ts`
 * Learn more about the Seed Client by following our guide: https://docs.snaplet.dev/seed/getting-started
 */
import { createSeedClient } from "@snaplet/seed";

const main = async () => {
  // const seed = await createSeedClient();

  // // Truncate all tables in the database
  // await seed.$resetDatabase();

  // // Seed the database with 10 user
  // //   await seed.user((x) => x(10));
  // await seed.user((createMany) =>
  //   createMany(10, {
  //     // Create 10 posts for each of those users
  //     Post: (createMany) =>
  //       createMany(10, {
  //         photo: `https://picsum.photos/500/300?random=${
  //           Math.floor(Math.random() * 24) + 1
  //         }`,
  //         status: true,
  //         slug(ctx) {
  //           return (
  //             ctx.data.title
  //               ?.replaceAll(/[!@#$%^&*()+=[\]{};:'"<>,.?|\\`~ ]/g, "_")
  //               .toLocaleLowerCase() || ""
  //           );
  //         },
  //         // upazila(ctx) {
  //         //   return ctx.data.upazila?.slice(1, 4) || "Mirpur-1";
  //         // },
  //         division(ctx) {
  //           return ctx.data.division?.slice(1, 4) || "Dhaka";
  //         },
  //         district(ctx) {
  //           return ctx.data.district?.slice(1, 4) || "Dhaka";
  //         },
  //         bathroom(ctx) {
  //           return Math.floor(Math.random() * 10) + 1;
  //         },
  //         bedroom(ctx) {
  //           return Math.floor(Math.random() * 10) + 1;
  //         },
  //         Images: (createMany) =>
  //           createMany(Math.floor(Math.random() * 3) + 1, {
  //             image: `/assets/home/line.png`,
  //           }),
  //       }),
  //     name(ctx) {
  //       return ctx.data.name?.substring(0, 12) || "";
  //     },
  //   })
  // );
  // Type completion not working? You might want to reload your TypeScript Server to pick up the changes

  console.log("Database seeded successfully!");

  process.exit();
};

main();
