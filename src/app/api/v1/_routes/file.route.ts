import { getServerSession } from "@/action/auth.action";
import { MAX_SINGLE_UPLOAD_BYTES } from "@/lib/contants";
import db from "@/lib/database/db";
import { File } from "@/lib/database/schema/file.model";
import { Subscription } from "@/lib/database/schema/subscription.model";
import { syncAndGetSubscription } from "@/lib/database/subscription.helper";
import { pinata } from "@/lib/pinata/config";
import { getCategoryFromMimeType, parseError } from "@/lib/utils";
import { Hono } from "hono";
import { z } from "zod";

const uploadUrlSchema = z.object({
  name: z.string().trim().min(1),
  size: z.number().finite().nonnegative(),
});

const completeUploadSchema = z.object({
  pinataId: z.string().min(1),
  name: z.string().trim().min(1),
  mimeType: z.string().optional(),
  cid: z.string().min(1),
  size: z.number().finite().nonnegative(),
});

const fileRoute = new Hono();

fileRoute.get("/", async (c) => {
  try {
    await db();
    const session = await getServerSession();
    const search = c.req.query("search");

    if (!session) {
      return c.json(
        {
          message: "Unauthorized",
          description: "You need to be logged in to upload files",
        },
        { status: 401 }
      );
    }

    if (!search || search.trim() === "") {
      return c.json(
        {
          message: "Bad Request",
          description: "Search term cannot be empty.",
        },
        { status: 400 }
      );
    }

    const {
      user: { id },
    } = session;

    const files = await File.find({
      "userInfo.id": id,
      name: {
        $regex: search,
        $options: "i",
      },
    }).lean();

    return c.json(
      {
        message: "Successful",
        description: "",
        data: files,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error in searching file: ", error);

    const err = parseError(error);

    return c.json({ message: "Error", description: err }, { status: 500 });
  }
});

fileRoute.get("/:page", async (c) => {
  try {
    await db();
    const category = c.req.param("page");
    const page = Number(c.req.query("page"));
    const session = await getServerSession();
    const FILE_SIZE = 9;

    if (!session) {
      return c.json(
        {
          message: "Unauthorized",
          description: "You need to be logged in to upload files",
        },
        {
          status: 401,
        }
      );
    }

    const {
      user: { id: userId, email: userEmail },
    } = session;

    if (category === "shared") {
      const documentCount = await File.aggregate([
        { $unwind: "$sharedWith" },
        { $match: { "sharedWith.email": userEmail } },
        { $count: "totalDocuments" },
      ]);

      const totalFiles =
        documentCount.length > 0 ? documentCount[0].totalDocuments : 0;

      const files = await File.aggregate([
        { $unwind: "$sharedWith" },
        { $match: { "sharedWith.email": userEmail } },
        {
          $group: {
            _id: "$_id", // Group back the files by their original ID
            pinataId: { $first: "$pinataId" },
            name: { $first: "$name" },
            cid: { $first: "$cid" },
            size: { $first: "$size" },
            mimeType: { $first: "$mimeType" },
            userInfo: { $first: "$userInfo" },
            groupId: { $first: "$groupId" },
            sharedWith: { $push: "$sharedWith" }, // Reconstruct the sharedWith array
            category: { $first: "$category" },
            createdAt: { $first: "$createdAt" },
            updatedAt: { $first: "$updatedAt" },
          },
        },
      ]);

      return c.json(
        {
          message: "Success",
          description: "",
          data: {
            files: files,
            total: totalFiles,
            currentPage: page,
            totalPages: Math.ceil(totalFiles / FILE_SIZE),
          },
        },
        { status: 200 }
      );
    }

    const categoryFilter =
      category === "other" ? { $in: ["other", "audio"] } : category;

    const totalFiles = await File.countDocuments({
      "userInfo.id": userId,
      category: categoryFilter,
    });

    const files = await File.find({
      "userInfo.id": userId,
      category: categoryFilter,
    })
      .skip((page - 1) * FILE_SIZE)
      .limit(FILE_SIZE)
      .sort({ createdAt: -1 })
      .lean();

    return c.json(
      {
        message: "Success",
        description: "",
        data: {
          files: files,
          total: totalFiles,
          currentPage: page,
          totalPages: Math.ceil(totalFiles / FILE_SIZE),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error in fetching files: ", error);
    const err = parseError(error);

    return c.json(
      {
        message: "Error",
        description: err,
        data: null,
      },
      { status: 500 }
    );
  }
});

fileRoute.post("/upload-url", async (c) => {
  try {
    await db();

    const session = await getServerSession();

    if (!session) {
      return c.json(
        {
          url: null,
          message: "Unauthorized",
          description: "You need to be logged in to upload files",
        },
        { status: 401 }
      );
    }

    const body = await c.req.json().catch(() => null);
    const parsed = uploadUrlSchema.safeParse(body);

    if (!parsed.success) {
      return c.json(
        {
          url: null,
          message: "Bad Request",
          description: "Invalid file metadata",
        },
        { status: 400 }
      );
    }

    if (parsed.data.size > MAX_SINGLE_UPLOAD_BYTES) {
      return c.json(
        {
          url: null,
          message: "⚠️ Warning",
          description: "Maximum single-file upload size is 100 MB.",
        },
        { status: 400 }
      );
    }

    const userId = session.user.id;
    const userName = session.user.name || "User";
    const subs = await syncAndGetSubscription(userId);

    if (
      subs.selectedStorage <= subs.usedStorage ||
      subs.usedStorage + parsed.data.size > subs.selectedStorage
    ) {
      return c.json(
        {
          url: null,
          message: "⚠️ Warning",
          description:
            "Storage limit exceeded. Delete some files to free up space.",
        },
        { status: 400 }
      );
    }

    // Issue a short-lived signed URL so the browser uploads directly to Pinata,
    // bypassing Vercel's 4.5 MB serverless request body limit.
    const signedUrl = await pinata.upload.createSignedURL({
      expires: 300,
      name: parsed.data.name,
      keyvalues: {
        userId,
        name: userName,
      },
    });

    return c.json({ url: signedUrl }, { status: 200 });
  } catch (error) {
    console.log("Error in generating upload URL: ", error);

    const err = parseError(error);

    return c.json(
      { url: null, message: "Error", description: err },
      { status: 500 }
    );
  }
});

fileRoute.post("/upload/complete", async (c) => {
  try {
    await db();

    const session = await getServerSession();

    if (!session) {
      return c.json(
        {
          file: null,
          message: "Unauthorized",
          description: "You need to be logged in to upload files",
        },
        { status: 401 }
      );
    }

    const body = await c.req.json().catch(() => null);
    const parsed = completeUploadSchema.safeParse(body);

    if (!parsed.success) {
      return c.json(
        {
          file: null,
          message: "Bad Request",
          description: "Invalid upload payload",
        },
        { status: 400 }
      );
    }

    const userId = session.user.id;
    const userName = session.user.name || "User";
    const { pinataId, name, cid, size } = parsed.data;
    const mimeType = parsed.data.mimeType?.trim() || "application/octet-stream";

    const subs = await syncAndGetSubscription(userId);

    if (
      subs.selectedStorage <= subs.usedStorage ||
      subs.usedStorage + size > subs.selectedStorage
    ) {
      await pinata.files.delete([pinataId]).catch(() => {});

      return c.json(
        {
          message: "⚠️ Warning",
          category: null,
          description:
            "Storage limit exceeded. Delete some files to free up space.",
          file: null,
        },
        { status: 400 }
      );
    }

    const category = getCategoryFromMimeType(mimeType);

    const uploadedFile = await File.create({
      pinataId,
      name,
      mimeType,
      cid,
      size,
      userInfo: { id: userId, name: userName },
      category,
    });

    await Subscription.updateOne(
      { subscriber: userId },
      {
        $inc: {
          usedStorage: size,
        },
      }
    );

    return c.json(
      {
        message: "Upload Successful",
        category,
        description: `File: ${name}`,
        file: uploadedFile,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("Error in completing file upload: ", error);

    const err = parseError(error);

    return c.json(
      { message: "Error", description: err, file: null },
      { status: 500 }
    );
  }
});

export default fileRoute;
