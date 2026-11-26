"use client";

import {
  deleteFile,
  generateUrl,
  renameFile,
  updateFilePermissions,
} from "@/action/file.action";
import { KebabMenuIcon } from "@/components/icons/kebab";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IFile } from "@/lib/database/schema/file.model";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { dynamicDownload, parseError } from "@/lib/utils";
import {
  Download,
  Loader2,
  Mail,
  Pencil,
  Share2,
  Trash2,
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dispatch, ReactNode, SetStateAction, useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { usePathname } from "next/navigation";

interface Action {
  name: string;
  icon: ReactNode;
  permissions: "file:read" | "file:update" | "file:delete";
}

const actions: Action[] = [
  {
    name: "Rename",
    icon: <Pencil className="size-4" strokeWidth={2} />,
    permissions: "file:update",
  },
  {
    name: "Share",
    icon: <Share2 className="size-4" strokeWidth={2} />,
    permissions: "file:read",
  },
  {
    name: "Download",
    icon: <Download className="size-4" strokeWidth={2} />,
    permissions: "file:read",
  },
  {
    name: "Delete",
    icon: <Trash2 className="size-4" strokeWidth={2} />,
    permissions: "file:delete",
  },
];

const FileMenu = ({
  file,
  isLinkInProgress,
  setIsLinkInProgress,
}: {
  file: IFile;
  isLinkInProgress: boolean;
  setIsLinkInProgress: Dispatch<SetStateAction<boolean>>;
}) => {
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);

  const isShared = pathname.split("/")[2] === "shared";
  const { sharedWith } = file;

  const mutation = useMutation({
    mutationFn: deleteFile,
    onSuccess: (data) => {
      const updateKey = isShared ? ["files", "shared"] : ["files", data.category];
      queryClient.setQueryData(
        updateKey,
        (oldData: { files: IFile[] } | undefined) => {
          const updatedFiles = (oldData?.files || []).filter(
            (f) => f._id !== data.fileId
          );

          return { ...oldData, files: updatedFiles };
        }
      );

      queryClient.invalidateQueries({ queryKey: ["subscription"] });

      toast("File Deleted", {
        description: file.name,
      });
    },
    onError: (error) => {
      const err = parseError(error);
      toast("Error", {
        description: `${err}`,
      });
    },
  });

  return (
    <>
      <DropdownMenu>
        {!mutation.isPending && !isLinkInProgress ? (
          <DropdownMenuTrigger className="flex size-9 items-center justify-center rounded-pill border border-transparent bg-fog text-ink transition-colors hover:border-ink hover:bg-butter">
            <KebabMenuIcon className="size-4 opacity-100" />
          </DropdownMenuTrigger>
        ) : (
          <div className="flex size-9 items-center justify-center">
            <Loader2 className="size-5 animate-spin text-ink" />
          </div>
        )}
        <DropdownMenuContent align="end" className="w-44 p-2">
          <DropdownMenuLabel>Vault Action</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {actions.map((action, i) => (
            <DropdownMenuItem
              key={i}
              className="flex items-center justify-start gap-2.5 px-3 py-2.5 font-medium text-ink"
              onClick={async () => {
                if (action.name === "Delete") {
                  if (
                    isShared &&
                    !sharedWith[0]?.permissions.includes("file:delete")
                  ) {
                    toast("Access Denied", {
                      description:
                        "You do not have permission to delete this file.",
                    });
                    return;
                  }
                  mutation.mutateAsync(file);
                }

                if (action.name === "Share") {
                  if (isShared) {
                    toast("Access Denied", {
                      description:
                        "You do not have permission to share this file.",
                    });
                    return;
                  }
                  setIsShareDialogOpen(true);
                }

                if (action.name === "Rename") {
                  if (
                    isShared &&
                    !sharedWith[0]?.permissions.includes("file:update")
                  ) {
                    toast("Access Denied", {
                      description:
                        "You do not have permission to rename this file.",
                    });
                    return;
                  }
                  setIsRenameDialogOpen(true);
                }

                if (action.name === "Download") {
                  if (
                    isShared &&
                    !sharedWith[0]?.permissions.includes("file:read")
                  ) {
                    toast("Access Denied", {
                      description:
                        "You do not have permission to download this file.",
                    });
                    return;
                  }

                  setIsLinkInProgress(true);
                  const { data, status } = await generateUrl(file.cid);

                  if (status !== 201) {
                    toast(`${data}`, {
                      description: data as string,
                    });
                    setIsLinkInProgress(false);
                    return;
                  }

                  setIsLinkInProgress(false);
                  dynamicDownload(data as string, file.name);
                }
              }}
            >
              {action.icon}
              <span>{action.name}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <ShareFileForm
        isShareDialogOpen={isShareDialogOpen}
        setIsShareDialogOpen={setIsShareDialogOpen}
        file={file}
      />

      <RenameFileForm
        file={file}
        isRenameDialogOpen={isRenameDialogOpen}
        setIsRenameDialogOpen={setIsRenameDialogOpen}
      />
    </>
  );
};

const permissions = [
  {
    id: "file:read",
    label: "Read",
  },
  {
    id: "file:update",
    label: "Update",
  },
  {
    id: "file:delete",
    label: "Delete",
  },
] as const;

const permissionFormSchema = z.object({
  email: z.string().email(),
  permissions: z
    .array(z.string())
    .refine((value) => value.some((item) => item), {
      message: "You have to select at least one item.",
    }),
});

export type TShareFileForm = z.infer<typeof permissionFormSchema>;

export const ShareFileForm = ({
  file,
  isShareDialogOpen,
  setIsShareDialogOpen,
}: {
  file: IFile;
  isShareDialogOpen: boolean;
  setIsShareDialogOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<TShareFileForm>({
    resolver: zodResolver(permissionFormSchema),
    defaultValues: {
      email: "",
      permissions: ["file:read"],
    },
  });

  async function onSubmit(values: TShareFileForm) {
    setIsLoading(true);
    const res = await updateFilePermissions(file, values);

    toast(res.message, {
      description: res.description,
    });

    setIsLoading(false);
    setIsShareDialogOpen(false);
  }

  return (
    <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>SHARE VAULT FILE</DialogTitle>
          <DialogDescription>
            Grant scoped permissions for {file.name}.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-ink">
                    Recipient Email
                  </FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-3 rounded-pill border-[1.5px] border-ink bg-fog px-4 py-1">
                      <Mail className="size-4 shrink-0 text-ink" strokeWidth={2} />
                      <Input
                        className="input bg-transparent px-0"
                        placeholder="teammate@domain.com"
                        {...field}
                        type="email"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="permissions"
              render={() => (
                <FormItem className="space-y-3 rounded-card bg-fog p-4">
                  <FormLabel className="font-display text-base font-bold uppercase tracking-[-0.02em] text-ink">
                    Select Permissions
                  </FormLabel>
                  <div className="flex flex-wrap gap-4">
                    {permissions.map((permission) => (
                      <FormField
                        key={permission.id}
                        control={form.control}
                        name="permissions"
                        render={({ field }) => (
                          <FormItem
                            key={permission.id}
                            className="flex flex-row items-center space-x-2.5 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(permission.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([
                                        ...field.value,
                                        permission.id,
                                      ])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== permission.id
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="cursor-pointer text-sm font-semibold text-ink">
                              {permission.label}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button disabled={isLoading} type="submit" variant="lift">
              {!isLoading ? (
                "Share Access"
              ) : (
                <Loader2 className="size-4 animate-spin" />
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

const renameFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

export type TRenameFileForm = z.infer<typeof renameFormSchema>;

export const RenameFileForm = ({
  file,
  isRenameDialogOpen,
  setIsRenameDialogOpen,
}: {
  file: IFile;
  isRenameDialogOpen: boolean;
  setIsRenameDialogOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const pathname = usePathname();
  const isShared = pathname.split("/")[2] === "shared";
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: renameFile,
    onSuccess: (newData) => {
      const updateKey = isShared ? ["files", "shared"] : ["files", file.category];
      queryClient.setQueryData(
        updateKey,
        (oldData: { files: IFile[] } | undefined) => {
          const oldFiles = oldData?.files || [];
          const newFile = newData.file;

          const withNewFiles = oldFiles.map((oldFile) =>
            oldFile._id === newFile?._id ? newFile : oldFile
          );

          return {
            ...oldData,
            files: withNewFiles,
          };
        }
      );

      toast("File Renamed", {
        description: newData.file?.name || file.name,
      });
    },
    onSettled: () => {
      setIsLoading(false);
      setIsRenameDialogOpen(false);
    },
    onError: (e) => {
      toast(e.name, {
        description: e.message,
      });
    },
  });

  const form = useForm<TRenameFileForm>({
    resolver: zodResolver(renameFormSchema),
    defaultValues: {
      name: file.name || "",
    },
  });

  async function onSubmit(values: TRenameFileForm) {
    setIsLoading(true);
    mutation.mutateAsync({ values, file });
  }

  return (
    <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>RENAME FILE</DialogTitle>
          <DialogDescription>
            Update the display name for this pinned asset.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-ink">
                    New File Name
                  </FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-3 rounded-pill border-[1.5px] border-ink bg-fog px-4 py-1">
                      <Pencil className="size-4 shrink-0 text-ink" strokeWidth={2} />
                      <Input
                        className="input bg-transparent px-0"
                        placeholder="Enter new file name..."
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={isLoading} type="submit" variant="lift">
              {!isLoading ? (
                "Save Name"
              ) : (
                <Loader2 className="size-4 animate-spin" />
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default FileMenu;
