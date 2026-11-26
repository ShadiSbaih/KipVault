"use server";

import {
  TRenameFileForm,
  TShareFileForm,
} from "@/app/(dashboard)/_components/file-card/menu";
import { FIVE_MINUTES } from "@/lib/contants";
import db from "@/lib/database/db";
import { File, IFile } from "@/lib/database/schema/file.model";
import { syncAndGetSubscription } from "@/lib/database/subscription.helper";
import { pinata } from "@/lib/pinata/config";
import { ActionResponse, parseError } from "@/lib/utils";
import { getServerSession } from "./auth.action";

export async function generateUrl(cid: string) {
  try {
    const url = pinata.gateways.createSignedURL({
      cid,
      expires: FIVE_MINUTES,
    });

    return { data: url, status: 201 };
  } catch (error) {
    console.log("Error in generating files: ", error);
    const err = parseError(error);

    return { data: `${err}`, status: 500 };
  }
}

export async function deleteFile(file: IFile) {
  await db();

  const session = await getServerSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const dbFile = await File.findOne({ pinataId: file.pinataId });
  if (!dbFile) {
    throw new Error("File not found");
  }

  const ownerId = String(dbFile.userInfo.id);
  const isOwner = ownerId === session.user.id;
  const hasDeletePermission = dbFile.sharedWith?.some(
    (entry) =>
      entry.email === session.user.email &&
      entry.permissions.includes("file:delete")
  );

  if (!isOwner && !hasDeletePermission) {
    throw new Error("You do not have permission to delete this file");
  }

  await pinata.files.delete([dbFile.pinataId]);

  await File.deleteOne({ _id: dbFile._id });

  await syncAndGetSubscription(ownerId);

  const normalizedCategory =
    dbFile.category === "audio" ? "other" : dbFile.category;

  return ActionResponse({
    status: 200,
    category: normalizedCategory,
    fileId: String(dbFile._id),
  });
}

export async function updateFilePermissions(
  file: IFile,
  values: TShareFileForm
) {
  try {
    await db();

    const { pinataId } = file;

    const newPermission = {
      email: values.email,
      permissions: values.permissions,
    };

    const dbFiles = (await File.findOne({ pinataId })) as IFile;

    const { sharedWith } = dbFiles;

    const allPermission = sharedWith.filter(
      ({ email }) => email !== values.email
    );

    const permissionToSave = [...allPermission, newPermission];

    await File.updateOne(
      { pinataId },
      {
        $set: {
          sharedWith: permissionToSave,
        },
      }
    );

    return {
      message: `Shared with ${values.email}`,
      description: `${values.permissions}`,
      status: 200,
    };
  } catch (error) {
    console.log("Error in updating files: ", error);

    const err = parseError(error);

    return {
      message: "Error",
      description: err,
      status: 500,
    };
  }
}

export async function renameFile({
  file,
  values,
}: {
  file: IFile;
  values: TRenameFileForm;
}) {
  try {
    await db();

    const { pinataId } = file;

    const { name } = values;

    const updatedFile = await File.findOneAndUpdate(
      { pinataId },
      { name },
      { new: true } // Return the updated document
    );

    return ActionResponse({
      message: "Rename Successful",
      description: `New name: ${name}`,
      status: 200,
      file: updatedFile,
    });
  } catch (error) {
    console.log("Error in renaming file: ", error);
    const err = parseError(error);

    return ActionResponse({
      message: "Error",
      description: `${err}`,
      status: 500,
      file: null,
    });
  }
}
