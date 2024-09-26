import axios from "axios";
import fs from "fs";
import path from "path";
import sharp from "sharp";

// Function to save the file to a folder
// export async function saveFile(
//   file: File,
//   saveFolder: string,
//   name: string
// ): Promise<void> {
//   try {
//     // Ensure the folder exists
//     if (!fs.existsSync(saveFolder)) {
//       fs.mkdirSync(saveFolder);
//     }

//     // Define the file path
//     const filePath = path.join("./public/" + saveFolder + "/" + name);

//     // Get the file buffer from the arrayBuffer
//     const buffer = await sharp(Buffer.from(await file.arrayBuffer())).toFile(
//       filePath
//     );

//     // Write the file to the folder
//     // fs.writeFileSync(filePath, buffer);

//     console.log(`File saved successfully at ${filePath}`);
//   } catch (error) {
//     console.error("Error saving file:", error);
//   }
// }

export async function deleteFile(file_name: string): Promise<void> {
  try {
    axios
      .get(`${process.env.NEXT_IMAGE_SITE_URL}/delete/${file_name}`)
      .then((response) => {
        console.log(response.data); // Handle successful upload response
      })
      .catch((error) => {
        console.error(error); // Handle upload errors2
      });
  } catch (error) {
    console.error("Error deleting file:", error);
  }
}
export async function saveSharpFile(
  file: sharp.Sharp,
  file_name: string
): Promise<any> {
  try {
    const image = new File(
      [new Blob([await file.toBuffer()])],
      file_name.replaceAll(" ", "_")
    );
    console.log(file);
    console.log(image);
    const formData = new FormData();
    formData.append("file", image);
    console.log(formData);

    axios
      .post(`${process.env.NEXT_IMAGE_SITE_URL}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log(response.data.filename); // Handle successful upload response
        // if (response.data.filename) {
        //   // return response.data.filename;
        // } else {
        //   throw new Error("Something went wrong");
        // }
      })
      .catch((error) => {
        console.error(error); // Handle upload errors
        throw error;
      });
  } catch (error) {
    console.error("Error saving file:", error);
    console.error(file);
    throw error;
  }
}
