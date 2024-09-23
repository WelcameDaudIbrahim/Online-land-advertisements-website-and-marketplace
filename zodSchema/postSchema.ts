import { districts, divisions, upazilas } from "@/data/admin/data";
import { months_name } from "@/data/data";
import { z, ZodTypeAny } from "zod";

export const allowed_file_types = ["image/png", "image/jpg", "image/jpeg"];
const allowed_file_size = 1024 * 1024 * 5;

const imageSchema = z
  .instanceof(File, { message: "Please Upload A Valid Image" })
  .refine(
    (file) =>
      file.size === 0 ||
      (allowed_file_types.includes(file.type) && file.size < allowed_file_size),
    {
      message:
        "You Can Only Upload Jpg, Jpeg, And Png Images And Bellow 5 MB Images",
    }
  );

const Months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
  "",
] as const;
const Property_for = ["rent", "sale"] as const;
const Property_type = ["residential", "commercial"] as const;
const Transaction_type = ["new", "used"] as const;
const Facing = [
  "south_facing",
  "north_facing ",
  "east_facing ",
  "west_facing ",
] as const;

const createImageSchema = z
  .any()
  .refine((data) =>
    data?.size
      ? data.size <= allowed_file_size &&
        allowed_file_types.includes(data?.type)
      : true
  );

export const postSchema = z.object({
  title: z
    .string({ message: "Title is required" })
    .trim()
    .min(5, { message: "Title must contain at least 5 character" })
    .max(128, { message: "Title must contain at less than 128 character" }),
  description: z
    .string({ message: "Description is required" })
    .min(32, { message: "Description must contain at least 32 character" })
    .max(800, { message: "Description must be less than 800 character" }),
  tags: z
    .string({ message: "Tags is required" })
    .refine((tags) => tags.split(",").length > 0, {
      message: "Tags is required",
    })
    .refine((tags) => tags.split(",").length <= 12, {
      message: "Maximum 12 Tags Allowed",
    })
    .refine(
      (tags) =>
        !(tags.split(" , #").filter((tag) => tag.length > 20).length > 0),
      {
        message: "Maximum 20 character allowed in one tag",
      }
    ),
  phoneNumber: z
    .string()
    .trim()
    .min(8, { message: "Phone Number must be at least 8 Digits" })
    .max(11, { message: "Phone Number Must Be Smaller Than 11 Digits" })
    .refine(
      (number) => {
        return !isNaN(Number(number.toLowerCase().replace("e", "a")));
      },
      {
        message: "Phone Number Must Be Valid",
      }
    ),
  price: z.coerce
    .number({ message: "Price is required" })
    .min(1, { message: "Price Must Be Grater Than 1" })
    .max(2147483647, { message: "Price Must Be Less Than 2147483647" }),
  isNegotiable: z.coerce.boolean().default(false),
  availableFrom: z
    .enum(Months, {
      required_error: "Available From is required",
    })
    .optional()
    .transform((e) => (e === "" ? undefined : e)),
  area: z.coerce
    .number({ message: "Area(sqft) is required" })
    .min(1, { message: "Area(sqft) Must Be Grater Than 1" })
    .max(2147483647, { message: "Area(sqft) Must Be Less Than 2147483647" }),
  image: imageSchema.refine((image) => image.size > 0, {
    message: "Image is required",
  }),
  photos: z.optional(z.array(createImageSchema)),
  photos0: createImageSchema,
  photos1: createImageSchema,
  photos2: createImageSchema,
  photos3: createImageSchema,
  division: z.string({ message: "Division is required" }),
  district: z.string({ message: "District is required" }),
  upazila: z.string({ message: "upazila is required" }),
  address: z
    .string({ message: "Address is required" })
    .min(5, { message: "Address must contain at least 5 character" })
    .max(255, {
      message: "Address must contain at less than 255 character",
    }),
  bedroom: z.coerce
    .number()
    .max(11, { message: "Number Of Bathroom Must Be Between 1 to 11" })
    .optional(),
  bathroom: z.coerce
    .number()
    .max(11, { message: "Number Of Bathroom Must Be Between 1 to 11" })
    .optional(),
  property_for: z.enum(Property_for, {
    required_error: "Property for is required",
    message: "Property for is required",
  }),
  property_type: z.enum(Property_type, {
    message: "Property Type is required",
  }),
  total_floor: z.coerce
    .number({ message: "Total Floor is required" })
    .min(1, { message: "Total Floor Must Be Grater Than 1" })
    .max(63, { message: "Number Of Total Floor Must Be Between 1 to 63" }),
  selling_floor: z.coerce
    .number({ message: "Selling Floor is required" })
    .min(1, { message: "Selling Floor Must Be Grater Than 1" })
    .max(63, { message: "Number Of Selling Floor Must Be Between 1 to 63" }),
  balcony: z.coerce
    .number({ message: "Balcony Floor is required" })
    .min(1, { message: "Balcony Floor Must Be Grater Than 1" })
    .max(6, { message: "Number Of Balcony Floor Must Be Between 1 to 6" }),
  facing: z.enum(Facing, { message: "Facing is required" }),
  parking: z.coerce.boolean().default(false),
  transaction_type: z.enum(Transaction_type, {
    message: "Transaction Type is required",
  }),
  amenities: z
    .string()
    .max(2147483647, {
      message: "Amenities Must Be Smaller Than 2147483648 Character",
    })
    .optional()
    .default(","),
  total_land_area: z
    .string({ message: "Total Land Area is required" })
    .max(10, {
      message: "Total Land Area must contain at less than 11 character",
    })
    .optional(),
});

export const createPostSchema = postSchema
  .extend({
    image: imageSchema.refine((image) => image.size > 0, {
      message: "Image is required",
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
  .refine(
    (data) =>
      data.property_type === "residential"
        ? data.bathroom !== undefined
          ? data.bathroom <= 11 && data.bathroom >= 1
          : true
        : true,
    {
      message: "Number Of Bathroom Must Be Between 1 to 11",
      path: ["bathroom"],
    }
  )
  .refine(
    (data) =>
      data.property_type === "residential"
        ? data.bedroom !== undefined
          ? data.bedroom <= 11 && data.bedroom >= 1
          : true
        : true,
    {
      message: "Number Of Bedroom Must Be Between 1 to 11",
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
      upazilas[data.district] && upazilas[data.district].includes(data.upazila),
    {
      message: "Please Select A Valid upazila",
      path: ["upazila"],
    }
  )
  .refine((data) => data.selling_floor <= data.total_floor, {
    message: "Selling Floor must be less than Total Floor",
    path: ["selling_floor"],
  });

export const updatePostSchema = postSchema
  .extend({
    image: imageSchema.optional(),
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
  .refine(
    (data) =>
      data.property_type === "residential"
        ? data.bathroom !== undefined
          ? data.bathroom <= 11 && data.bathroom >= 1
          : true
        : true,
    {
      message: "Number Of Bathroom Must Be Between 1 to 11",
      path: ["bathroom"],
    }
  )
  .refine(
    (data) =>
      data.property_type === "residential"
        ? data.bedroom !== undefined
          ? data.bedroom <= 11 && data.bedroom >= 1
          : true
        : true,
    {
      message: "Number Of Bedroom Must Be Between 1 to 11",
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
      upazilas[data.district] && upazilas[data.district].includes(data.upazila),
    {
      message: "Please Select A Valid upazila",
      path: ["upazila"],
    }
  )
  .refine((data) => data.selling_floor <= data.total_floor, {
    message: "Selling Floor must be less than or equal to Total Floor",
    path: ["selling_floor"],
  });
// .min(1, {
//   message: "Number Of Bathroom is required",
// })
// .max(11)

export const FileToObject = (file: File) => {
  return {
    name: file.name,
    arrayBuffer: file.arrayBuffer,
    lastModified: file.lastModified,
    size: file.size,
    slice: file.slice,
    stream: file.stream,
    text: file.text,
    type: file.type,
    webkitRelativePath: file.webkitRelativePath,
  };
};
