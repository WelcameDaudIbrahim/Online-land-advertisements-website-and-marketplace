import fs from "fs";

export async function GET(
  request: Request,
  { params }: { params: { path: string[] } }
) {
  try {
    const { path } = params;
    // const filePath = path.resolve("./a.jpg");
    const imageBuffer = fs.readFileSync(
      process.cwd() + "/public/" + path.join("/")
    );
    return new Response(imageBuffer, {
      headers: { "Content-Type": "image/jpg" },
    });
    // return new Response(imageBuffer);
  } catch (err) {
    console.log(err);
  }
}
