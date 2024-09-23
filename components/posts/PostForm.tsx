"use client";
import React, { cache, useEffect, useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  SubmitButton,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tag, TagInput } from "emblor";
import Editor from "@/components/Editor";
import {
  createPost,
  updatePost,
  updatePostStatus,
} from "@/actions/post.action";
import { createPostSchema, updatePostSchema } from "@/zodSchema/postSchema";
import Dragdrop from "@/components/ui/drag-drop";
import { toast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { capitalizeFirstLetter } from "@/lib/utils";
import { districts, divisions, upazilas } from "@/data/admin/data";
import Image from "next/image";
import { $Enums } from "@prisma/client";
import useAuth from "@/hooks/useAuth";
import { Alert } from "../ui/alert-dialog";
import { IMAGES_PATH_PREFIX } from "@/routes";
import { amenities, months_name } from "@/data/data";
import { Checkbox } from "../ui/checkbox";
import { redirect } from "next/navigation";
import { CgMoreVerticalO } from "react-icons/cg";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { MdOutlineFeaturedPlayList } from "react-icons/md";
import { FcInfo } from "react-icons/fc";
import { TiLocationArrowOutline } from "react-icons/ti";
import { Button } from "../ui/button";
import { IconType } from "react-icons";

export default function PostForm({
  id,
  postData,
}: {
  id?: number;
  postData?: {
    property_id: string;
    slug: string;
    title: string;
    photo: string;
    images: string[];
    description: string;
    phoneNumber: string;
    area: number;
    amenities: string;
    postTags: string;
    bedroom: number | null;
    facing: string;
    parking: boolean;
    selling_floor: number;
    total_floor: number;
    transaction_type: string;
    balcony: number | null;
    total_land_area: string | null;
    negotiable: boolean;
    price: number;
    availableFrom: $Enums.post_availableFrom | null;
    bathroom: number | null;
    property_for: $Enums.post_property_for;
    property_type: $Enums.post_property_type;
    upazila: string;
    district: string;
    division: string;
    address: string;
    status: boolean;
    created_at: Date;
    updated_at: Date;
  };
}) {
  type FieldName = keyof Zod.infer<typeof createPostSchema>;
  const steps: {
    id: string;
    description: string;
    icon: IconType;
    fields: FieldName[];
  }[] = [
    {
      id: "Step 1",
      description: "Basic Info",
      icon: FcInfo,
      fields: ["title", "description", "tags", "property_for", "property_type"],
    },
    {
      id: "Step 2",
      description: "More Info",
      icon: CgMoreVerticalO,
      fields: [
        "area",
        "phoneNumber",
        "photos0",
        "photos1",
        "photos2",
        "photos3",
        "price",
        "isNegotiable",
        "image",
        "availableFrom",
      ],
    },
    {
      id: "Step 3",
      description: "Amenities",
      icon: MdOutlineFeaturedPlayList,
      fields: [
        "bedroom",
        "bathroom",
        "facing",
        "parking",
        "selling_floor",
        "total_floor",
        "transaction_type",
        "amenities",
        "balcony",
        "total_land_area",
      ],
    },
    {
      id: "Step 4",
      description: "Address",
      icon: TiLocationArrowOutline,
      fields: ["division", "district", "upazila", "address"],
    },
  ];

  const [isPending, startTransition] = useTransition();
  const [isStatusPending, startStatusTransition] = useTransition();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(postData?.status || false);
  const [isNegotiable, setIsNegotiable] = useState<boolean>(
    postData?.negotiable || false
  );
  const [tags, setTags] = React.useState<string[]>(
    postData?.postTags
      .split(" , #")
      .filter((tag) => tag !== "")
      .filter((tag) => tag !== "#") || []
  );

  const [mainImagePreviewSrc, setMainImagePreviewSrc] = useState(
    postData ? IMAGES_PATH_PREFIX + postData.photo : ""
  );
  let defaultValues = {
    title: "",
    description: "",
  };
  let updateDefaultValues = {
    title: "",
    description: "",
    area: "",
    phoneNumber: "",
    bathroom: "",
    upazila: "",
    price: "",
    availableFrom: "",
    negotiable: "",
    amenities: "",
    bedroom: "",
    facing: "",
    parking: "",
    selling_floor: "",
    total_floor: "",
    transaction_type: "",
    balcony: "",
    total_land_area: "",
    district: "",
    division: "",
    address: "",
    property_for: "",
    property_type: "",
  };
  if (postData) {
    updateDefaultValues = {
      title: postData.title,
      description: postData.description,
      area: postData.area ? postData.area.toString() : "0",
      phoneNumber: postData.phoneNumber ? postData.phoneNumber.toString() : "0",
      bathroom: postData.bathroom ? postData.bathroom.toString() : "0",
      bedroom: postData.bedroom ? postData.bedroom.toString() : "0",
      facing: postData.facing,
      parking: postData.parking ? postData.parking.toString() : "0",
      selling_floor: postData.selling_floor?.toString(),
      total_floor: postData.total_floor.toString(),
      transaction_type: postData.transaction_type,
      amenities: postData.amenities,
      balcony: postData?.balcony ? postData?.balcony.toString() : "0",
      total_land_area: postData.total_land_area || "",
      upazila: postData.upazila,
      price: postData.price ? postData.price.toString() : "0",
      availableFrom: postData.availableFrom || "",
      negotiable: postData.negotiable ? postData.negotiable.toString() : "0",
      district: postData.district,
      division: postData.division,
      address: postData.address,
      property_for: postData.property_for,
      property_type: postData.property_type,
    };
  }
  const form = useForm<Zod.infer<typeof createPostSchema>>({
    resolver: zodResolver(id ? updatePostSchema : createPostSchema),
    mode: "onChange",
    defaultValues: updateDefaultValues ? updateDefaultValues : defaultValues,
  });

  const selected_division = form.watch("division");
  const selected_district = form.watch("district");

  const propertyType = form.watch("property_type");

  const onSubmit = async (data: Zod.infer<typeof createPostSchema>) => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("area", data.area.toString());
      if (data.image) {
        formData.append("image", data.image);
      }
      if (data.photos) {
        data.photos.map((photo, i: number) => {
          formData.append(`photos${i}`, photo);
        });
      }
      formData.append("division", data.division);
      formData.append("amenities", data.amenities);
      formData.append("district", data.district);
      formData.append("upazila", data.upazila);
      formData.append("address", data.address);
      formData.append("facing", data.facing);
      formData.append("parking", data.parking ? "true" : "");
      formData.append("selling_floor", data.selling_floor.toString());
      formData.append("total_floor", data.total_floor.toString());
      formData.append("transaction_type", data.transaction_type);
      formData.append("balcony", data.balcony.toString());
      formData.append(
        "total_land_area",
        data?.total_land_area?.toString() || ""
      );
      formData.append(
        "availableFrom",
        data.property_for === "rent" ? data.availableFrom || "" : ""
      );
      formData.append("price", data.price.toString());
      formData.append("isNegotiable", isNegotiable ? "true" : "");
      formData.append("tags", `#${tags.join(" , #")}`);
      if (data.bedroom) {
        formData.append("bedroom", data.bedroom.toString());
      }
      if (data.bathroom) {
        formData.append("bathroom", data.bathroom.toString());
      }
      formData.append("property_for", data.property_for);
      formData.append("property_type", data.property_type);
      formData.append("phoneNumber", data.phoneNumber);
      let returnValue;
      if (id) {
        returnValue = await updatePost(formData, id);
      } else {
        returnValue = await createPost(formData);
      }
      if (returnValue !== undefined) {
        for (const [_, value] of Object.entries(returnValue)) {
          if (value[0] === "Post Created Successfully") {
            form.reset();
            redirect(`/user/my-posts?message=created`);
            // toast({
            //   title: "Post Created Successfully",
            //   description:
            //     "This post might take some time to be approved. Usually within 48 hours",
            //   variant: "default",
            // });
            // setTimeout(function () {
            //   redirect(`/user/my-posts`);
            // }, 2000);
          }

          form.setError("root", { message: value.join("\n") });
        }
      }
    });
  };
  for (const [key, value] of Object.entries(form.formState.errors)) {
    if (
      value.message?.toString() !== "Post Created Successfully" &&
      key.toLocaleLowerCase() !== "photos"
    ) {
      toast({
        title:
          key === "root"
            ? "Field Error"
            : capitalizeFirstLetter(key.replaceAll("_", " ")) + " Field",
        description: value.message?.toString(),
        variant: "destructive",
      });
    }
  }

  const [files, setFiles] = useState<File[]>([]);
  useEffect(() => {
    form.setValue("tags", tags.join(" , #"));

    if (postData?.images !== undefined) {
      const addValue = cache(async () => {
        const newFiles = await Promise.all(
          postData?.images.map(async (val) => {
            let response = await fetch(IMAGES_PATH_PREFIX + val);
            let data = await response.blob();
            let metadata = {
              type: "image/" + val.split(".").at(-1) || "image/png",
            };

            const file = new File(
              [data],
              val.split("/").at(-1) || "image.png",
              metadata
            );
            return file;
          })
        );
        setFiles(newFiles);
        form.setValue("photos", newFiles);
      });
      addValue();
    }
  }, []);

  const user = useAuth();
  if (!user) return;

  const { role } = user;

  const prev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const next = async () => {
    if (currentStep < steps.length - 1) {
      const success = await form.trigger(steps[currentStep].fields, {
        shouldFocus: true,
      });
      if (!success) return;
    }
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <div className="flex w-full items-center flex-col">
      <ul className="relative flex flex-col md:flex-row gap-2 w-full px-4">
        {steps.map((step, i) => (
          <li
            key={i}
            className={`md:shrink md:basis-0 flex-1 group flex gap-x-2 md:block ${
              i === steps.length - 1 && "flex-grow-0 flex-shrink w-fit"
            }`}
          >
            <div className="min-size-10 flex flex-col items-center md:w-full md:inline-flex md:flex-wrap md:flex-row text-xs align-middle">
              <span
                className={`size-10 flex justify-center items-center shrink-0 font-medium text-gray-800 rounded-full ${
                  i === currentStep ? "bg-gray-200" : "bg-gray-100"
                }`}
              >
                {i < currentStep ? (
                  <IoMdCheckmarkCircleOutline className="size-6 text-green-600" />
                ) : (
                  <step.icon className={`size-6`} />
                )}
              </span>
              <div
                className={`mt-2 w-px h-full md:mt-0 md:ms-2 md:w-full md:h-0.5 rounded-3xl md:flex-1 group-last:hidden ${
                  i <= currentStep ? "bg-green-600" : "bg-gray-200"
                }`}
              ></div>
            </div>
            <div className="grow md:grow-0 md:mt-3 pb-5">
              <span className="block text-sm font-medium text-gray-800">
                {step.id}
              </span>
              <p className="text-sm text-gray-500 w-max">{step.description}</p>
            </div>
          </li>
        ))}
      </ul>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full pb-1.5">
          {form.formState.errors.root && (
            <p
              className={`${
                form.formState.errors.root.message !==
                "Post Created Successfully"
                  ? "text-red-600"
                  : "text-green-600"
              } mb-2.5 text-lg font-medium tracking-wide font-roboto`}
            >
              {form.formState.errors.root.message}
            </p>
          )}

          <div className="flex flex-col gap-y--8 md:grid grid-cols-2 gap-8">
            {currentStep === 0 && (
              <>
                <div className="col-span-2">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Title"
                            className="p-3 border-2 border-stone-300 rounded-sm w-full placeholder-stone-500 text-black text-base font-normal font-roboto leading-normal"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="col-span-2">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormLabel>Short Description</FormLabel>
                          <FormControl>
                            <>
                              <Editor
                                description={
                                  form.watch("description") ||
                                  postData?.description ||
                                  ""
                                }
                                onChange={(text) => field.onChange(text)}
                              />
                            </>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="property_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Property Type</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                          }}
                          defaultValue={field.value}
                          {...field}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Property Type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="residential">
                              Residential
                            </SelectItem>
                            <SelectItem value="commercial">
                              Commercial
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="property_for"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Property For</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                            {...field}
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="sale" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Sale
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="rent" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Rent
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="col-span-2">
                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem className="tags-form">
                        <FormLabel>Tags</FormLabel>
                        <FormControl>
                          <TagInput
                            {...field}
                            activeTagIndex={0}
                            setActiveTagIndex={() => null}
                            placeholder="Enter a tag"
                            tags={tags.map((tag, i) => {
                              return { id: i.toString(), text: tag };
                            })}
                            className="sm:min-w-[450px]"
                            setTags={(newTags) => {
                              const newTag = newTags as Tag[];
                              const tag = newTag.map((tag) => tag.text);
                              setTags(tag);

                              field.onChange(tag.join(" , #"));
                            }}
                          />
                        </FormControl>
                        <FormDescription>
                          Please don&apos;t put tag in description.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </>
            )}
            {currentStep === 1 && (
              <>
                {form.watch("property_for") === "rent" && (
                  <div>
                    <FormField
                      control={form.control}
                      name="availableFrom"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Available From (Optional)</FormLabel>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                            }}
                            defaultValue={field.value}
                            {...field}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Month" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {months_name.map((name) => (
                                <SelectItem
                                  value={name}
                                  key={name}
                                  className="cursor-pointer"
                                >
                                  {capitalizeFirstLetter(name)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
                <div
                  className={`${
                    form.watch("property_for") === "rent" ? "" : "col-span-2"
                  }`}
                >
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price (Taka)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Price"
                            className="p-3 border-2 border-stone-300 rounded-sm w-full placeholder-stone-500 text-black text-base font-normal font-roboto leading-normal"
                            {...field}
                            onChange={(event) =>
                              field.onChange(+event.target.value)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="items-top flex space-x-2 mt-1.5 ml-2.5">
                    <Checkbox
                      id="negotiable"
                      onClick={() => setIsNegotiable(!isNegotiable)}
                      checked={isNegotiable}
                    />
                    <div className="grid gap-1.5 leading-none cursor-pointer">
                      <label
                        htmlFor="negotiable"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Is The Price Negotiable
                      </label>
                    </div>
                  </div>
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormLabel>Main Image Or Thumbnail</FormLabel>
                          <FormControl>
                            <>
                              <Input
                                type="file"
                                id="mainImage"
                                accept=".jpg,.jpeg,.png"
                                className="hidden opacity-0"
                                onChange={(e) => {
                                  if (e.target.files !== null) {
                                    if (e.target.files[0] instanceof File) {
                                      field.onChange(e.target.files[0]);
                                      setMainImagePreviewSrc(
                                        URL.createObjectURL(e.target.files[0])
                                      );
                                    }
                                  }
                                }}
                              />
                              <label
                                htmlFor="mainImage"
                                className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 border border-primary text-black w-full border-dashed rounded-md bg-transparent hover:bg-transparent hover:border-solid"
                              >
                                Chick Here To Upload Image
                              </label>
                              {mainImagePreviewSrc !== "" && (
                                <Image
                                  src={mainImagePreviewSrc}
                                  width={400}
                                  height={200}
                                  alt="Main Image Or Thumbnail"
                                  className="!w-auto !h-[220px] rounded-md"
                                />
                              )}
                            </>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="photos"
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormLabel>More Image Or Photos (Optional)</FormLabel>
                          <FormControl>
                            <>
                              <Dragdrop
                                className="w-full"
                                onFilesSelected={(files) => {
                                  field.onChange(files);
                                }}
                                files={files}
                                setFiles={setFiles}
                                allowedFileTypes=".jpg,.jpeg,.png"
                                maxFileAllowed={4}
                                onError={(err) => {
                                  toast({
                                    variant: "destructive",
                                    title: err,
                                  });
                                  form.setError("photos", {
                                    type: "value",
                                  });
                                }}
                              />
                            </>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                </div>

                <div>
                  <FormField
                    control={form.control}
                    name="area"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Area(s.q.f.t)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Area(sqft)"
                            className="p-3 border-2 border-stone-300 rounded-sm w-full placeholder-stone-500 text-black text-base font-normal font-roboto leading-normal"
                            {...field}
                            onChange={(event) =>
                              field.onChange(+event.target.value)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number For This Post</FormLabel>
                        <FormControl>
                          <div className="flex items-start justify-center w-full">
                            <Input
                              type="text"
                              placeholder="+88"
                              className="p-3 w-[56px] ml-0.5 border-2 opacity-100 flex-shrink border-stone-300 rounded-sm placeholder-black text-black text-base font-normal font-roboto leading-normal"
                              disabled
                            />
                            <Input
                              type="text"
                              placeholder="Phone Number"
                              className="p-3 border-2 border-stone-300 flex-grow rounded-sm w-full placeholder-stone-500 text-black text-base font-normal font-roboto leading-normal"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </>
            )}

            {currentStep === 2 && (
              <>
                {(propertyType === "residential" ||
                  propertyType === undefined) && (
                  <div>
                    <FormField
                      control={form.control}
                      name="bedroom"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Number Of Bedroom</FormLabel>
                          <Input
                            type="number"
                            placeholder="Number Of Bedroom"
                            className="p-3 border-2 border-stone-300 rounded-sm w-full placeholder-stone-500 text-black text-base font-normal font-roboto leading-normal"
                            {...field}
                            onChange={(event) =>
                              field.onChange(+event.target.value)
                            }
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
                <div
                  className={`${
                    !propertyType || propertyType === "commercial"
                      ? "col-span-2"
                      : ""
                  }`}
                >
                  <FormField
                    control={form.control}
                    name="bathroom"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Number Of Bathroom
                          {propertyType === "commercial" && " ( Optional )"}
                        </FormLabel>
                        <Input
                          type="number"
                          placeholder="Number Of Bathroom"
                          className="p-3 border-2 border-stone-300 rounded-sm w-full placeholder-stone-500 text-black text-base font-normal font-roboto leading-normal"
                          {...field}
                          onChange={(event) =>
                            field.onChange(+event.target.value)
                          }
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="total_floor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number Of Total Floor</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Number Of Total Floor"
                            className="p-3 border-2 border-stone-300 rounded-sm w-full placeholder-stone-500 text-black text-base font-normal font-roboto leading-normal"
                            {...field}
                            onChange={(event) =>
                              field.onChange(+event.target.value)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="selling_floor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Selling Floor</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Number Of Selling Floor"
                            className="p-3 border-2 border-stone-300 rounded-sm w-full placeholder-stone-500 text-black text-base font-normal font-roboto leading-normal"
                            {...field}
                            onChange={(event) =>
                              field.onChange(+event.target.value)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="facing"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Facing</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                          }}
                          defaultValue={field.value}
                          {...field}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                className="capitalize"
                                placeholder="Facing"
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {[
                              "south_facing",
                              "north_facing ",
                              "east_facing ",
                              "west_facing ",
                            ].map((face, i) => (
                              <SelectItem
                                value={face}
                                key={i}
                                className="capitalize"
                              >
                                {face.replaceAll("_", " ")}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="total_land_area"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Land Area ( Optional )</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Total Land Area"
                            className="p-3 border-2 border-stone-300 rounded-sm w-full placeholder-stone-500 text-black text-base font-normal font-roboto leading-normal"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="balcony"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number Of Balcony ( Optional )</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Number Of Balcony"
                            className="p-3 border-2 border-stone-300 rounded-sm w-full placeholder-stone-500 text-black text-base font-normal font-roboto leading-normal"
                            {...field}
                            onChange={(event) =>
                              field.onChange(+event.target.value)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex gap-3.5 justify-start items-start">
                  <Checkbox
                    id="parking"
                    onClick={() =>
                      form.setValue("parking", !form.watch("parking"))
                    }
                    checked={form.watch("parking")}
                    className="size-5 cursor-pointer"
                  />
                  <div className="grid gap-1.5 leading-none cursor-pointer">
                    <label
                      htmlFor="parking"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Is Parking Available
                    </label>
                  </div>
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="transaction_type"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Transaction Type</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                            {...field}
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="new" />
                              </FormControl>
                              <FormLabel className="font-normal">New</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="used" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Used
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid pl-6 md:pl-0.5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 col-span-2 items-start mt-1.5 w-full">
                  {Object.entries(amenities).map(([id, amenity]) => (
                    <div
                      key={id}
                      onClick={() =>
                        form.setValue(
                          "amenities",
                          form.watch("amenities") + id + ","
                        )
                      }
                      className="cursor-pointer flex items-center gap-1 w-min"
                    >
                      <Checkbox
                        checked={form.watch("amenities")?.includes(id)}
                        onClick={() =>
                          form.setValue(
                            "amenities",
                            form.watch("amenities") + id + ","
                          )
                        }
                      />
                      <amenity.icon className="text-gray-800 size-7 mr-2.5" />
                      <p
                        className={`font-medium font-roboto text-sm md:text-lg w-max pr-1 ${
                          form.watch("amenities")?.includes(id)
                            ? "text-primary"
                            : "text-black"
                        }`}
                      >
                        {amenity.name}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            )}
            {currentStep === 3 && (
              <>
                <div>
                  <FormField
                    control={form.control}
                    name="division"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Division</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                          }}
                          defaultValue={field.value}
                          {...field}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Division" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {divisions.map((division) => (
                              <SelectItem
                                value={division}
                                key={division}
                                className="cursor-pointer"
                              >
                                {capitalizeFirstLetter(division)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="district"
                    disabled={!Boolean(districts[selected_division])}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>District</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                          }}
                          defaultValue={field.value}
                          {...field}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select District" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {districts[selected_division] &&
                              districts[selected_division].map((district) => (
                                <SelectItem
                                  value={district}
                                  key={district}
                                  className="cursor-pointer"
                                >
                                  {capitalizeFirstLetter(district)}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="upazila"
                    disabled={!Boolean(upazilas[selected_district])}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Upazila</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                          }}
                          defaultValue={field.value}
                          {...field}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Upazila" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {upazilas[selected_district] &&
                              upazilas[selected_district].map((upazila) => (
                                <SelectItem
                                  value={upazila}
                                  key={upazila}
                                  className="cursor-pointer"
                                >
                                  {capitalizeFirstLetter(upazila)}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Address"
                            disabled={!form.watch("upazila")}
                            className="p-3 border-2 border-stone-300 rounded-sm w-full placeholder-stone-500 text-black text-base font-normal font-roboto leading-normal"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </>
            )}
            {role === "admin" && id !== undefined && postData && (
              <>
                <div className="flex justify-between items-center w-full px-8 py-2.5 col-span-2">
                  <div>Post Activation :</div>
                  <div className="flex items-center">
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isActive}
                        onChange={(e) => setIsActive(e.target.checked)}
                        className="sr-only opacity-0 peer"
                      />
                      <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white peer-checked:ring-teal-800 after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                      <span
                        className={`ms-3 text-sm font-medium ${
                          isActive ? "text-teal-800" : "text-red-800"
                        } dark:text-gray-300`}
                      >
                        {isActive ? "Active" : "Inactive"}
                      </span>
                    </label>
                    {isActive !== postData.status && (
                      <Alert
                        description="Are you sure you want to update post status? And it will reflect to all the users."
                        onContinue={() => {
                          startStatusTransition(async () => {
                            const returnValue = await updatePostStatus(
                              id,
                              isActive
                            );
                            if (returnValue) {
                              setIsActive(false);
                            }
                          });
                        }}
                      >
                        <SubmitButton
                          isPending={isStatusPending}
                          disabled={isStatusPending}
                          className="ml-4"
                        >
                          ✓
                        </SubmitButton>
                      </Alert>
                    )}
                  </div>
                </div>
              </>
            )}
            <div className="col-span-2 w-full flex justify-between items-center">
              <Button
                type="button"
                variant="outline"
                className="border-primary hover:bg-primary hover:text-white tracking-wide text-lg font-roboto border-[2.5px]"
                disabled={currentStep === 0}
                onClick={() => prev()}
              >
                Back
              </Button>
              {currentStep < steps.length - 1 ? (
                <Button
                  type="button"
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-primary-foreground h-10 px-4 py-2 bg-primary hover:bg-transparent hover:text-black tracking-wide text-lg font-roboto border-[2.5px] border-primary hover:border-primary-dark col-span-2"
                  onClick={() => next()}
                >
                  Next
                </Button>
              ) : (
                <SubmitButton
                  isPending={isPending}
                  disabled={isPending}
                  className="col-span-2"
                >
                  {id === undefined ? "Post" : "Update"}
                </SubmitButton>
              )}
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
