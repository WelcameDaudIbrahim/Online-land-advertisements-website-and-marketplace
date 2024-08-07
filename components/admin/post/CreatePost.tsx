import React, { useEffect, useRef, useState } from "react";
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
import { z } from "zod";
import { Input } from "@/components/ui/input";
import Editor from "@/components/Editor";
import { useFormState } from "react-dom";
import { createPost } from "@/actions/post.action";
import { createPostSchema } from "@/zodSchema/postSchema";
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

export default function CreatePost() {
  const [descriptionInput, setDescriptionInput] = useState("");
  const [imageInput, setImageInput] = useState<File>();

  const [state, action] = useFormState(createPost, null);

  const form = useForm<z.infer<typeof createPostSchema>>({
    resolver: zodResolver(createPostSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const selected_division = form.watch("division");
  const selected_district = form.watch("district");

  const propertyType = form.watch("property_type");

  useEffect(() => {
    if (state?.title !== undefined) {
      form.setError("title", {
        type: "value",
        message: state?.title?.at(0) || "",
      });
    }
    if (state?.description !== undefined) {
      form.setError("description", {
        type: "value",
        message: state?.description?.at(0) || "",
      });
    }
    if (state?.bathroom !== undefined) {
      form.setError("bathroom", {
        type: "value",
        message: state?.bathroom?.at(0) || "",
      });
    }
    if (state?.bedroom !== undefined) {
      form.setError("bedroom", {
        type: "value",
        message: state?.bedroom?.at(0) || "",
      });
    }
    if (state?.property_for !== undefined) {
      form.setError("property_for", {
        type: "value",
        message: state?.property_for?.at(0) || "",
      });
    }
    if (state?.property_type !== undefined) {
      form.setError("property_type", {
        type: "value",
        message: state?.property_type?.at(0) || "",
      });
    }
    if (state?.area !== undefined) {
      form.setError("area", {
        type: "value",
        message: state?.area?.at(0) || "",
      });
    }
    if (state?.division !== undefined) {
      form.setError("division", {
        type: "value",
        message: state?.division?.at(0) || "",
      });
    }
    if (state?.district !== undefined) {
      form.setError("district", {
        type: "value",
        message: state?.district?.at(0) || "",
      });
    }
    if (state?.thana !== undefined) {
      form.setError("thana", {
        type: "value",
        message: state?.thana?.at(0) || "",
      });
    }
    if (state?.location !== undefined) {
      form.setError("location", {
        type: "value",
        message: state?.location?.at(0) || "",
      });
    }
    // if (state?.image !== undefined) {
    //   form.setError("image", {
    //     type: "value",
    //     message: state?.image?.at(0) || "",
    //   });
    // }
  }, [
    form,
    state?.title,
    state?.description,
    state?.bathroom,
    state?.bedroom,
    state?.area,
    state?.property_for,
    state?.property_type,
    state?.division,
    state?.district,
    state?.thana,
    state?.location,
    // state?.image,
  ]);

  const formRef = useRef<HTMLFormElement>(null);

  return (
    <Form {...form}>
      <form
        ref={formRef}
        action={action}
        // onSubmit={form.handleSubmit((_, e) => {
        //   e?.preventDefault();
        //   formRef?.current?.submit();
        // })}
      >
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
                        <input
                          type="hidden"
                          hidden
                          value={descriptionInput}
                          {...form.register("description")}
                          className="hidden opacity-0 invisible"
                        />{" "}
                        <Editor
                          description={"Description"}
                          onChange={(text) => {
                            setDescriptionInput(text);
                            field.onChange(text);
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
            {/* <FormField
              control={form.control}
              name="image"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Main Image Or Thumbnail</FormLabel>
                    <FormControl>
                      <>
                        <input
                          type="text"
                          hidden
                          value={imageInput && +imageInput}
                          {...form.register("image")}
                          className="hidden opacity-0 invisible"
                          multiple
                        />
                        <Dragdrop
                          className="w-full"
                          onFilesSelected={(file) => {
                            file.length > 0 ? field.onChange("file[0]") : "";
                            setImageInput(file[0]);
                          }}
                          allowedFileTypes=".jpg,.jpeg,.png"
                          maxFileAllowed={1}
                          onError={(err) => {
                            toast({
                              variant: "destructive",
                              title: err,
                            });
                            form.setError("image", {
                              type: "value",
                              message: err,
                            });
                          }}
                        />
                      </>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            /> */}
          </div>
          <div></div>
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
                      className="p-3 border-2 border-stone-300 rounded-sm w-full placeholder-stone-500 text-black text-base font-normal font-roboto leading-normal"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className={`${propertyType === "commercial" && "col-span-2"}`}>
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
          <SubmitButton className="col-span-2">Create</SubmitButton>
        </div>
      </form>
    </Form>
  );
}
