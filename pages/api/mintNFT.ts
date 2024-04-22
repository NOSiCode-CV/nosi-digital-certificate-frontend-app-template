import { NextApiRequest, NextApiResponse } from "next";
import { Fields, IncomingForm } from "formidable";
import { Engine } from "@thirdweb-dev/engine";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { PolygonAmoyTestnet } from "@thirdweb-dev/chains";
import { NDC_API_IMAGE, NEXT_PUBLIC_NFT_COLLECTION_CONTRACT_ADDRESS } from "../../constants/constants";
import fs, { unlinkSync } from "fs";
import fetch from "node-fetch"; // Import 'node-fetch' if using server-side fetching
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ error: "Method not allowed, please use POST" });
  }

  const form = new IncomingForm();

  form.parse(req, async (err: any, fields: Fields) => {
    if (err) {
      return res.status(500).json({ error: "Error parsing the file upload" });
    }

    const name = Array.isArray(fields.name) ? fields.name[0] : fields.name;
    const description = Array.isArray(fields.description)
      ? fields.description[0]
      : fields.description;
    const address = Array.isArray(fields.address)
      ? fields.address[0]
      : fields.address;
    const imageUrl = Array.isArray(fields.imageUrl) ? fields.imageUrl[0] : null;
    const recipientName = Array.isArray(fields.recipientName)
      ? fields.recipientName[0]
      : null;
    const recipientEmail = Array.isArray(fields.recipientName)
      ? fields.recipientName[0]
      : null;
    const issueDate = Array.isArray(fields.issueDate)
      ? fields.issueDate[0]
      : null;

    if (
      !name ||
      !description ||
      !address ||
      !recipientName ||
      !recipientEmail ||
      !issueDate
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const { TW_ENGINE_URL, TW_ACCESS_TOKEN, TW_BACKEND_WALLET, TW_SECRET_KEY } =
      process.env;

    if (
      !TW_ENGINE_URL ||
      !TW_ACCESS_TOKEN ||
      !TW_BACKEND_WALLET ||
      !TW_SECRET_KEY
    ) {
      return res.status(500).json({ error: "Missing environment variables" });
    }

    try {
      const certificatebody = {
        recipientName: recipientName,
        recipientEmail: recipientEmail,
        courseName: name,
        courseDescription: description,
        issueDate: issueDate,
      };

      const certicateImage = await fetch(NDC_API_IMAGE, {
        method: "POST",
        body: JSON.stringify(certificatebody),
        headers: {
          accept: "image/png",
          "Content-Type": "application/json",
        },
      });

      const imageBuffer = await certicateImage.arrayBuffer();

      const timestamp = Date.now(); // Timestamp
      
      const fileName = path.join(
        "public",
        "uploads",
        `temp_image_${timestamp}.jpg`
      );

      fs.writeFileSync(fileName, Buffer.from(imageBuffer));

      const storage = new ThirdwebStorage({ secretKey: TW_SECRET_KEY });

      const fileData = fs.readFileSync(fileName);

      const uri = await storage.upload(fileData);

      console.log("Image uploaded to IPFS: " + uri);

      try {
        unlinkSync(fileName);
      } catch (error) {
        console.log("Unable to delete");
      }

      const engine = new Engine({
        url: TW_ENGINE_URL,
        accessToken: TW_ACCESS_TOKEN,
      });

      const nftMetadata = {
        name: name,
        image: uri,
        description: description,
      };
      const response = await engine.erc721.mintTo(
        PolygonAmoyTestnet.slug,
        NEXT_PUBLIC_NFT_COLLECTION_CONTRACT_ADDRESS ?? "",
        TW_BACKEND_WALLET,
        {
          receiver: address,
          metadata: nftMetadata,
        }
      );

      console.log("NFT minted: ", response);

      res.status(200).json({ message: "NFT minted successfully", response });

      // Cleanup: Delete the temporary file
      //fs.unlinkSync(imageFile.filepath);
    } catch (error: any) {
      console.error("Error processing file: ", error);
      res
        .status(500)
        .json({ error: error.message || "An error occurred during minting" });
    }
  });
};

export default handler;
