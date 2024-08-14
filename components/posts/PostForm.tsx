"use client";
import React, { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  SubmitButton,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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
import { districts, divisions, thanas } from "@/data/admin/data";
import Image from "next/image";
import { $Enums } from "@prisma/client";
import useAuth from "@/hooks/useAuth";
import { Alert } from "../ui/alert-dialog";

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
    area: number;
    bedroom: number | null;
    bathroom: number | null;
    property_for: $Enums.PropertyFor;
    property_type: $Enums.PropertyType;
    thana: string;
    district: string;
    division: string;
    location: string;
    status: boolean;
    created_at: Date;
    updated_at: Date;
  };
}) {
  const [isPending, startTransition] = useTransition();
  const [isStatusPending, startStatusTransition] = useTransition();
  const [isActive, setIsActive] = useState<boolean>(postData?.status || false);

  const [mainImagePreviewSrc, setMainImagePreviewSrc] = useState(
    postData ? postData.photo : ""
  );
  let defaultValues = {
    title: "",
    description: "",
  };
  let updateDefaultValues = {
    title: "",
    description: "",
    area: "",
    bathroom: "",
    thana: "",
    bedroom: "",
    district: "",
    division: "",
    location: "",
    property_for: "",
    property_type: "",
  };
  if (postData) {
    updateDefaultValues = {
      title: postData.title,
      description: postData.description,
      area: postData.area ? postData.area.toString() : "0",
      bathroom: postData.bathroom ? postData.bathroom.toString() : "0",
      bedroom: postData.bedroom ? postData.bedroom.toString() : "0",
      thana: postData.thana,
      district: postData.district,
      division: postData.division,
      location: postData.location,
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
      formData.append("district", data.district);
      formData.append("thana", data.thana);
      formData.append("location", data.location);
      if (data.bedroom) {
        formData.append("bedroom", data.bedroom.toString());
      }
      if (data.bathroom) {
        formData.append("bathroom", data.bathroom.toString());
      }
      formData.append("property_for", data.property_for);
      formData.append("property_type", data.property_type);
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
            toast({
              title: "Post Created Successfully",
              description:
                "This Post Might Take Some Time To Be Approved (1-2 Days)",
            });
          }
          form.setError("root", { message: value.join("\n") });
        }
      }
    });
  };

  const user = useAuth();
  if (!user) return;

  const { role } = user;
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {form.formState.errors.root && (
          <p className="mb-2.5 text-red-600 text-lg font-medium tracking-wide font-roboto">
            {form.formState.errors.root.message}
          </p>
        )}

        <div className="grid grid-cols-2 gap-8">
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
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <>
                        <Editor
                          description={postData?.description || "Description"}
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
                            className="w-full !h-auto rounded-md"
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
                          defaultValue={postData?.images || []}
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
                      <SelectItem value="residential">Residential</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
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
                        <FormLabel className="font-normal">Sale</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="rent" />
                        </FormControl>
                        <FormLabel className="font-normal">Rent</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
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
              name="thana"
              disabled={!Boolean(thanas[selected_district])}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thana</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                    }}
                    defaultValue={field.value}
                    {...field}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Thana" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {thanas[selected_district] &&
                        thanas[selected_district].map((thana) => (
                          <SelectItem
                            value={thana}
                            key={thana}
                            className="cursor-pointer"
                          >
                            {capitalizeFirstLetter(thana)}
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
            {" "}
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Location"
                      disabled={!form.watch("thana")}
                      className="p-3 border-2 border-stone-300 rounded-sm w-full placeholder-stone-500 text-black text-base font-normal font-roboto leading-normal"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div
            className={`${
              propertyType === undefined || propertyType === "commercial"
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
                    {propertyType === "commercial" && "( Optional )"}
                  </FormLabel>
                  <Input
                    type="number"
                    placeholder="Number Of Bathroom"
                    className="p-3 border-2 border-stone-300 rounded-sm w-full placeholder-stone-500 text-black text-base font-normal font-roboto leading-normal"
                    {...field}
                    onChange={(event) => field.onChange(+event.target.value)}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />{" "}
          </div>
          {propertyType === "residential" && (
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
                      onChange={(event) => field.onChange(+event.target.value)}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
          <div className="col-span-2">
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
                      onChange={(event) => field.onChange(+event.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
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
                          await updatePostStatus(id, isActive);
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
          <SubmitButton
            isPending={isPending}
            disabled={isPending}
            className="col-span-2"
          >
            {id === undefined ? "Post" : "Update"}
          </SubmitButton>
        </div>
      </form>
    </Form>
  );
}
