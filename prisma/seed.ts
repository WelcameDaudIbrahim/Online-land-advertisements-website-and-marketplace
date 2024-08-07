// import { generateString } from "@/lib/utils";
import { generateString } from "@/lib/utils";
import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
async function main() {
  const desc =
    '<p><strong><em><s><span style="font-family: Comic Sans MS, Comic Sans"><u class="my-custom-class">DescriptionDescription cv Description  v      D e sc  r i    p    t    i    o        n</u></span></s></em></strong></p>';
  // const alice = await prisma.user.create({
  //   data: {
  //     email: "alice@prisma.io",
  //     name: "Alice",
  //     posts: {
  //       create: {
  //         title: "This Is A Bad Or Good Title?",
  //         area: 925,
  //         description: desc,
  //         image: "/assets/logo.png",
  //         property_for: "rent",
  //         property_type: "commercial",
  //         property_id: "ID6783",
  //         slug: "This_Is_A_Bad_Or_Good_Title".toLowerCase(),
  //         status: true,
  //       },
  //     },
  //   },
  // });
  // const bob = await prisma.user.create({
  //   data: {
  //     email: "bob@bobby.io",
  //     name: "Alice",
  //     posts: {
  //       create: {
  //         title: "This Is A Bad Or Good post?",
  //         area: 925,
  //         description: desc,
  //         image: "/assets/logo.png",
  //         property_for: "rent",
  //         property_type: "residential",
  //         property_id: "ID63",
  //         slug: "This_Is_A_Bad_Or_Good_post".toLowerCase(),
  //         status: true,
  //       },
  //     },
  //   },
  // });
  const number_of_post_per_user = 10;
  for (let i = 1; i < 10; i += 1) {
    const email_name = generateString(1);
    const user = await prisma.user.create({
      data: {
        email: `${email_name}@${email_name}.com`,
        name: email_name,
      },
    });
    // const posts: Prisma.PostCreateManyInput[] = [];
    // for (let i = 1; i < number_of_post_per_user; i += 1) {
    //   const title = generateString(18);
    //   posts.push({
    //     title: title,
    //     area: Math.floor(Math.random() * 214799),
    //     description: desc + generateString(6),
    //     image: "/assets/logo.png",
    //     property_for: "rent",
    //     property_type: "residential",
    //     property_id: "ID" + Math.floor(Math.random() * 498479),
    //     slug: title.replaceAll(" ", "_").toLowerCase(),
    //     userId: user.id,
    //     bathroom: Math.floor(Math.random() * 9),
    //     bedroom: Math.floor(Math.random() * 12),
    //     status: true,
    //   });
    // }
    // await prisma.post.createMany({
    //   data: posts,
    //   skipDuplicates: true,
    // });
  }
  // console.log({ alice, bob });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
