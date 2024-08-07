import Hero from "@/components/Home/Hero";
import WhyChooseUs from "@/components/Home/WhyChooseUs";
import Posts from "@/components/posts/Posts";
import db from "@/db/db";

export default function Home() {
  const getPosts = async () => {
    return await db.post.findMany({
      where: { status: true },
      take: 8,
      select: {
        slug: true,
        title: true,
        bathroom: true,
        bedroom: true,
        area: true,
        updated_at: true,
        property_for: true,
        property_type: true,
      },
      orderBy: { updated_at: "desc" },
    });
  };
  return (
    <>
      <Hero />
      <WhyChooseUs />
      <Posts getPosts={getPosts} />
    </>
  );
}
