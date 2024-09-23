import db from "@/db/db";
import { notFound } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MdCalendarMonth,
  MdOutlineBalcony,
  MdOutlineModeEditOutline,
  MdOutlineSouthWest,
  MdVerified,
} from "react-icons/md";
import { GrMapLocation } from "react-icons/gr";
import { capitalizeFirstLetter } from "@/lib/utils";
import { IoBedOutline } from "react-icons/io5";
import { LuBath, LuParkingCircle } from "react-icons/lu";
import { PiBuildingsBold, PiMapPinSimpleAreaBold } from "react-icons/pi";
import { FiEdit2 } from "react-icons/fi";
import Posts from "@/components/posts/Posts";
import { TbCurrentLocation } from "react-icons/tb";
import { FaFortAwesomeAlt } from "react-icons/fa";
import {
  BsBuildingCheck,
  BsFillBuildingsFill,
  BsHouseDoor,
} from "react-icons/bs";
import { GiPoland } from "react-icons/gi";
import Images from "./_components/Images";
import PhoneNumber from "./_components/PhoneNumber";
import { IMAGES_PATH_PREFIX } from "@/routes";
import { Metadata } from "next";
import { cache } from "react";
import { amenities } from "@/data/data";
import ContactUs from "./_components/ContactUs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { auth } from "@/auth";
const getPost = cache(async (slug: string) => {
  const post = await db.post.findUnique({
    where: { slug: slug, status: true },
    include: { user: true, image: true },
  });
  return post;
});

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPost(params.slug);

  return {
    title: post?.title || "Not Found",
    openGraph: {
      images: IMAGES_PATH_PREFIX + post?.photo,
    },
  };
}

export default async function Page({ params }: { params: { slug: string } }) {
  const user = await auth();

  const { slug } = params;

  if (!slug) {
    return notFound();
  }

  const post = await getPost(params.slug);

  if (!post) {
    return notFound();
  }

  const getRelatedPosts = async () => {
    return await db.post.findMany({
      where: {
        NOT: { id: post.id },
        status: true,
        OR: [
          { property_type: post.property_type },
          { property_for: post.property_for },
        ],
      },
      take: 4,
      select: {
        slug: true,
        title: true,
        bathroom: true,
        bedroom: true,
        photo: true,
        area: true,
        upazila: true,
        division: true,
        district: true,
        updated_at: true,
        property_for: true,
        property_type: true,
      },
      orderBy: { updated_at: "desc" },
    });
  };

  return (
    <>
      <div className="flex max-w-[1360px] flex-col md:flex-row mx-auto mt-6 mb-14">
        <div className="flex-1">
          <div className="px-4 mt-8 w-full">
            <h1
              className={`line-clamp-2 max-w-3xl text-black text-2xl font-semibold font-roboto leading-[27px] | flex items-center w-full justify-between`}
            >
              {post.title}
              {user &&
                post.userId === user.user.id &&
                user.user.role !== "admin" && (
                  <Link href={`/user/post/edit/${post.slug}`}>
                    <Button variant={"ghost"} className="ml-2">
                      <MdOutlineModeEditOutline className="size-7 text-gray-600" />
                    </Button>
                  </Link>
                )}
              {user && user.user.role === "admin" && (
                <Link href={`/admin/post/edit/${post.id}`}>
                  <Button variant={"default"} className="ml-2 w-fit">
                    <FiEdit2 className="size-6 text-white" />
                  </Button>
                </Link>
              )}
            </h1>
            <p className="text-gray-700 hover:text-gray-900 text-md font-medium font-roboto leading-[18px] tracking-normal">
              {capitalizeFirstLetter(post.property_type)}
            </p>
            <div className="flex flex-col-reverse">
              <Images photo={post.photo} images={post.image} />
            </div>
            <div className="flex items-center gap-1 mt-2.5 max-w-3xl">
              <GrMapLocation className="text-gray-800 size-5" />
              <p className="text-black text-lg font-medium font-roboto leading-[21px]">
                {post.address}, {post.upazila}, {post.district}, {post.division}
              </p>
            </div>
          </div>
          <div
            className={`w-full flex items-center justify-start px-4 gap-8 mt-4 max-w-3xl`}
          >
            <p className="text-primary text-2xl font-semibold font-roboto leading-[30px]">
              ৳{post.price.toLocaleString("en-US")}{" "}
              {post.negotiable && (
                <span className="text-secondary text-xl">( Negotiable )</span>
              )}
            </p>
          </div>
          <div
            className={`w-full rounded-md rounded-t-none flex items-center justify-start px-4 gap-8 mt-4 max-w-3xl`}
          >
            {post.bedroom && (
              <div>
                <div className="flex items-center justify-center gap-1.5">
                  <IoBedOutline className="text-gray-800 size-5" />
                  <p className="text-black text-xl font-semibold font-roboto leading-[30px]">
                    {post.bedroom}
                  </p>
                </div>
                <p className="text-black text-sm font-semibold font-roboto leading-[15px]">
                  Bedroom
                </p>
              </div>
            )}
            {post.bathroom && (
              <div>
                <div className="flex items-center justify-center gap-1.5">
                  <LuBath className="text-gray-800 size-5" />
                  <p className="text-black text-xl font-semibold font-roboto leading-[30px]">
                    {post.bathroom}
                  </p>
                </div>
                <p className="text-black text-sm font-semibold font-roboto leading-[15px]">
                  Bathroom
                </p>
              </div>
            )}
            <div>
              <div className="flex items-center justify-center gap-1.5">
                <PiMapPinSimpleAreaBold className="text-gray-800 size-5" />
                <p className="text-black text-xl font-semibold font-roboto leading-[30px]">
                  {post.area.toLocaleString()}
                </p>
              </div>
              <p className="text-black text-sm font-semibold font-roboto leading-[15px]">
                Sqft Area
              </p>
            </div>
          </div>
          <div
            className="max-w-4xl mt-8 ml-3.5"
            dangerouslySetInnerHTML={{ __html: post.description }}
          ></div>
          <h1 className="mt-6 mb-5 text-center text-3xl text-black font-medium tracking-normal max-w-3xl">
            Deatails
          </h1>
          <div className="grid pl-6 md:pl-0.5 grid-cols-1 md:grid-cols-2 items-start mt-1.5 max-w-[886px]">
            <div className="flex flex-col gap-y-3.5">
              {post.bedroom && (
                <div className="flex items-center gap-2 w-full pr-4 md:pr-16">
                  <IoBedOutline className="text-gray-800 size-7 mr-2.5" />
                  <p className="font-medium font-roboto text-sm md:text-lg">
                    Bedroom
                  </p>
                  <p className="text-base md:text-xl text-end font-roboto tracking-wide font-semibold ml-auto">
                    {post.bedroom}
                  </p>
                </div>
              )}
              {post.bathroom && (
                <div className="flex items-center gap-2 w-full pr-4 md:pr-16">
                  <LuBath className="text-gray-800 size-7 mr-2.5" />
                  <p className="font-medium font-roboto text-sm md:text-lg">
                    Bathroom{" "}
                  </p>
                  <p className="text-base md:text-xl text-end font-roboto tracking-wide font-semibold ml-auto">
                    {post.bathroom}
                  </p>
                </div>
              )}
              <div className="flex items-center gap-2 w-full pr-4 md:pr-16">
                <BsFillBuildingsFill className="text-gray-800 size-7 mr-2.5" />
                <p className="font-medium font-roboto text-sm md:text-lg">
                  Address
                </p>
                <p className="text-base md:text-xl text-end font-roboto tracking-wide font-semibold ml-auto">
                  {post.district}
                </p>
              </div>
              <div className="flex items-center gap-2 w-full pr-4 md:pr-16">
                <PiMapPinSimpleAreaBold className="text-gray-800 size-7 mr-2.5" />
                <p className="font-medium font-roboto text-sm md:text-lg">
                  Area
                </p>
                <p className="text-base md:text-xl text-end font-roboto tracking-wide font-semibold ml-auto">
                  {post.area.toLocaleString()} SQFT
                </p>
              </div>
              <div className="flex items-center gap-2 w-full pr-4 md:pr-16">
                <LuParkingCircle className="text-gray-800 size-7 mr-2.5" />
                <p className="font-medium font-roboto text-sm md:text-lg">
                  Parking
                </p>
                <p className="text-base md:text-xl text-end font-roboto tracking-wide font-semibold ml-auto">
                  {post.parking ? "Yes" : "N/A"}
                </p>
              </div>
              <div className="flex items-center gap-2 w-full pr-4 md:pr-16">
                <BsBuildingCheck className="text-gray-800 size-7 mr-2.5" />
                <p className="font-medium font-roboto text-sm md:text-lg">
                  Selling Floors
                </p>
                <p className="text-base md:text-xl text-end font-roboto tracking-wide font-semibold ml-auto">
                  {post.selling_floor}
                </p>
              </div>
              <div className="flex items-center gap-2 w-full pr-4 md:pr-16">
                <PiBuildingsBold className="text-gray-800 size-7 mr-2.5" />
                <p className="font-medium font-roboto text-sm md:text-lg">
                  Total Floors
                </p>
                <p className="text-base md:text-xl text-end font-roboto tracking-wide font-semibold ml-auto">
                  {post.total_floor}
                </p>
              </div>
              <div className="flex items-center gap-2 w-full pr-4 md:pr-16">
                <BsHouseDoor className="text-gray-800 size-7 mr-2.5" />
                <p className="font-medium font-roboto text-sm md:text-lg">
                  Transaction Type
                </p>
                <p className="capitalize text-base md:text-xl text-end font-roboto tracking-wide font-semibold ml-auto">
                  {post.transaction_type}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-y-5">
              <div className="flex items-center gap-2 w-full pr-4 md:pr-16">
                <FaFortAwesomeAlt className="text-gray-800 size-7 mr-2.5" />
                <p className="font-medium font-roboto text-sm md:text-lg">
                  Property For
                </p>
                <p className="text-base md:text-xl text-end font-roboto tracking-wide font-semibold ml-auto">
                  {capitalizeFirstLetter(post.property_for)}
                </p>
              </div>
              <div className="flex items-center gap-2 w-full pr-4 md:pr-16">
                <TbCurrentLocation className="text-gray-800 size-7 mr-2.5" />
                <p className="font-medium font-roboto text-sm md:text-lg">
                  Property Type
                </p>
                <p className="text-base md:text-xl text-end font-roboto tracking-wide font-semibold ml-auto">
                  {capitalizeFirstLetter(post.property_type)}
                </p>
              </div>
              {post.availableFrom && (
                <div className="flex items-center gap-2 w-full pr-4 md:pr-16">
                  <MdCalendarMonth className="text-gray-800 size-7 mr-2.5" />
                  <p className="font-medium font-roboto text-sm md:text-lg">
                    Available From
                  </p>
                  <p className="text-base md:text-xl text-end font-roboto tracking-wide font-semibold ml-auto">
                    {capitalizeFirstLetter(post.availableFrom)}
                  </p>
                </div>
              )}
              {post.total_land_area && (
                <div className="flex items-center gap-2 w-full pr-4 md:pr-16">
                  <GiPoland className="text-gray-800 size-7 mr-2.5" />
                  <p className="font-medium font-roboto text-sm md:text-lg">
                    Total Land Area
                  </p>
                  <p className="text-base md:text-xl text-end font-roboto tracking-wide font-semibold ml-auto">
                    {post.total_land_area}
                  </p>
                </div>
              )}
              {post.balcony && (
                <div className="flex items-center gap-2 w-full pr-4 md:pr-16">
                  <MdOutlineBalcony className="text-gray-800 size-7 mr-2.5" />
                  <p className="font-medium font-roboto text-sm md:text-lg">
                    Number Of Balconies
                  </p>
                  <p className="text-base md:text-xl text-end font-roboto tracking-wide font-semibold ml-auto">
                    {post.balcony}
                  </p>
                </div>
              )}
              <div className="flex items-center gap-2 w-full pr-4 md:pr-16">
                <MdOutlineSouthWest className="text-gray-800 size-7 mr-2.5" />
                <p className="font-medium font-roboto text-sm md:text-lg">
                  Facing
                </p>
                <p className="capitalize text-base md:text-xl text-end font-roboto tracking-wide font-semibold ml-auto">
                  {post.facing.replaceAll("_", " ")}
                </p>
              </div>
            </div>
          </div>
          {post.amenities.split(",").length > 0 && (
            <>
              <h1 className="mt-6 mb-5 text-center text-3xl text-black font-medium tracking-normal max-w-3xl">
                Amenities
              </h1>
              <div className="grid pl-6 md:pl-0.5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-start mt-1.5 max-w-[886px]">
                {post.amenities.split(",").map((amenity, i) => {
                  if (!!(amenity in amenities)) {
                    const icon = {
                      icon: amenities[amenity as keyof typeof amenities].icon,
                    };
                    return (
                      <div
                        className="flex items-center gap-2 w-full pr-4 md:pr-16"
                        key={i}
                      >
                        <icon.icon className="text-gray-800 size-7 mr-2.5" />
                        <p className="font-medium capitalize font-roboto text-sm md:text-lg">
                          {amenities[amenity as keyof typeof amenities].name}
                        </p>
                      </div>
                    );
                  }
                })}
              </div>
            </>
          )}
        </div>
        <div className="w-full mt-8 md:mt-0 md:max-w-96 flex flex-col items-center gap-4">
          <div className="border-b border-gray-600 py-1.5 text-center w-full font-roboto text-lg">
            Owners Details
          </div>
          <div className="font-roboto-condensed text-base text-center ml-4 flex items-center gap-2">
            <div className="flex items-center justify-center bg-primary rounded-full size-7 lg:size-[40.5px]">
              <Avatar className="size-6 lg:size-9">
                <AvatarImage
                  src={
                    post.user?.image
                      ? post.user.image.startsWith("https://")
                        ? post.user?.image
                        : IMAGES_PATH_PREFIX + post.user?.image
                      : "/assets/profile.png"
                  }
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
            <div className="flex flex-col">
              <p className="text-start text-black flex items-center text-lg font-medium gap-1 font-roboto leading-ei tracking-normal">
                {post.user.name}
                <MdVerified className="size-5 text-primary-500" />
              </p>
              <p className="text-start text-primary font-roboto text-base font-medium">
                {post.user.emailVerified && "Verified"}
              </p>
            </div>
          </div>
          <div className="mt-3.5">
            <p className="text-xl mb-2.5 text-gray-800 font-roboto text-center">
              Phone Number
            </p>
            <PhoneNumber phoneNumber={post.phoneNumber} />
          </div>
          <ContactUs post_id={post.id} />
        </div>
      </div>
      <div>
        <Posts getPosts={getRelatedPosts} text="Related Posts" />
      </div>
    </>
  );
}
