"use server";

import { getServerSession } from "./auth.action";
import { syncAndGetSubscription } from "@/lib/database/subscription.helper";
import { ActionResponse } from "@/lib/utils";

export async function getSubscription() {
  try {
    const session = await getServerSession();

    if (!session) {
      throw new Error("Unauthorized user");
    }

    const subs = await syncAndGetSubscription(session.user.id);

    return ActionResponse({
      message: "Success",
      description: "",
      data: subs,
      status: 200,
    });
  } catch (error) {
    console.log("Error in getting subscription: ", error);

    throw error;
  }
}
