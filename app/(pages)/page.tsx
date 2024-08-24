import { getFilterPosts } from "@/actions/post.action";
import Hero from "@/components/Home/Hero";
import WhyChooseUs from "@/components/Home/WhyChooseUs";
import Posts from "@/components/posts/Posts";
import db from "@/db/db";

export default function Home() {
  const getPosts = async () => {
    return await getFilterPosts({ take: 8 });
  };
  return (
    <>
      <Hero />
      <WhyChooseUs />
      <Posts getPosts={getPosts} />
    </>
  );
}
