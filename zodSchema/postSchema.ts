import { districts, divisions, thanas } from "@/data/admin/data";
import { z } from "zod";

export const allowed_file_types = ["image/png", "image/jpg", "image/jpeg"];
const allowed_file_size = 1024 * 1024 * 5;

const imageSchema = z
  .instanceof(File, { message: "Please Upload A Valid File" })
  .refine(
    (file) =>
      file.size === 0 ||
      (allowed_file_types.includes(file.type) && file.size < allowed_file_size)
  );

const Property_for = ["rent", "sale"] as const;
const Property_type = ["residential", "commercial"] as const;

export const postSchema = z
  .object({
    title: z
      .string({ message: "Title is required" })
      .min(5, { message: "Title must contain at least 5 character" })
      .max(255, { message: "Title must contain at less than 255 character" }),
    description: z
      .string({ message: "Description is required" })
      .min(50, { message: "Description must contain at least 50 character" })
      .max(5000, { message: "Description must be less than 5000 character" }),
    area: z.coerce
      .number({ message: "Area(sqft) is required" })
      .min(1, { message: "Area(sqft) Must Be Grater Than 1" }),
    // .min(50, { message: "Description must contain at least 50 character" })
    // .max(5000, { message: "Title must be less than 5000 character" }),
    // image: imageSchema.refine((image) => image.size > 0, {
    //   message: "Image is required",
    // }),
    division: z.string({ message: "Division is required" }),
    district: z.string({ message: "District is required" }),
    thana: z.string({ message: "Thana is required" }),
    location: z
      .string({ message: "Location is required" })
      .min(20, { message: "Location must contain at least 20 character" })
      .max(255, {
        message: "Location must contain at less than 255 character",
      }),
    bedroom: z.coerce
      .number()
      .min(1, {
        message: "Number Of Bedroom is required",
      })
      .max(11)
      .optional(),
    bathroom: z.coerce
      .number()
      .min(1, {
        message: "Number Of Bathroom is required",
      })
      .max(11)
      .optional(),
    property_for: z.enum(Property_for, {
      required_error: "Property for is required",
    }),
    property_type: z.enum(Property_type, {
      message: "Property Type is required",
    }),
  })
  .refine(
    (data) =>
      data.property_type === "residential" ? Boolean(data.bathroom) : true,
    { message: "Number Of Bathroom is required", path: ["bathroom"] }
  )
  .refine(
    (data) =>
      data.property_type === "residential" ? Boolean(data.bedroom) : true,
    {
      message: "Number Of Bedroom is required",
      path: ["bedroom"],
    }
  )
  .refine((data) => divisions.includes(data.division), {
    message: "Please Select A Valid Division",
    path: ["division"],
  })
  .refine(
    (data) =>
      districts[data.division] &&
      districts[data.division].includes(data.district),
    {
      message: "Please Select A Valid District",
      path: ["district"],
    }
  )
  .refine(
    (data) =>
      thanas[data.district] && thanas[data.district].includes(data.thana),
    {
      message: "Please Select A Valid Thana",
      path: ["thana"],
    }
  );

export const createPostSchema = postSchema;
