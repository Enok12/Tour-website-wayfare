"use client";

import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TagInput } from "@/components/shared/tag-input";
import { ImageUploadField } from "@/components/shared/image-upload-field";
import { createMemberSchema, type CreateMemberInput } from "@/server/dto/member.dto";
import { useCreateMember, useUpdateMember } from "@/hooks/use-members";
import type { MemberDto } from "@/types";
import { ApiRequestError } from "@/lib/api-client";

const memberFormSchema = createMemberSchema.partial({ password: true });

export function MemberForm({ initial }: { initial?: MemberDto }) {
  const router = useRouter();
  const isEditing = Boolean(initial);

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<z.input<typeof memberFormSchema>, unknown, z.output<typeof memberFormSchema>>({
    resolver: zodResolver(memberFormSchema),
    defaultValues: initial
      ? {
          name: initial.name,
          email: initial.email,
          phone: initial.phone ?? "",
          languages: initial.languages,
          availabilityStatus: initial.availabilityStatus,
          profileImage: initial.profileImage ?? "",
        }
      : {
          languages: [],
          availabilityStatus: "OFFLINE",
        },
  });

  const createMember = useCreateMember();
  const updateMember = useUpdateMember(initial?.id ?? "");

  async function onSubmit(values: z.output<typeof memberFormSchema>) {
    if (!isEditing && !values.password) {
      setError("password", { message: "Password is required" });
      return;
    }

    try {
      if (isEditing) {
        const { email: _email, password, ...rest } = values;
        await updateMember.mutateAsync(password ? { ...rest, password } : rest);
        toast.success("Member updated");
      } else {
        // Safe: the guard above already confirmed `password` is present.
        await createMember.mutateAsync(values as CreateMemberInput);
        toast.success("Member created");
      }
      router.push("/admin/members");
    } catch (err) {
      toast.error(err instanceof ApiRequestError ? err.message : "Something went wrong");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="name">Full name</Label>
        <Input id="name" {...register("name")} />
        {errors.name && <p className="text-xs text-danger">{errors.name.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" disabled={isEditing} {...register("email")} />
        {errors.email && <p className="text-xs text-danger">{errors.email.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password">{isEditing ? "New password (optional)" : "Password"}</Label>
        <Input id="password" type="password" {...register("password")} />
        {errors.password && <p className="text-xs text-danger">{errors.password.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="phone">Phone number</Label>
        <Input id="phone" {...register("phone")} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="profileImage">Profile picture</Label>
        <Controller
          control={control}
          name="profileImage"
          render={({ field }) => (
            <ImageUploadField value={field.value} onChange={field.onChange} label="Profile picture" />
          )}
        />
      </div>

      <div className="space-y-1.5">
        <Label>Languages</Label>
        <Controller
          control={control}
          name="languages"
          render={({ field }) => (
            <TagInput value={field.value ?? []} onChange={field.onChange} placeholder="e.g. English, Spanish" />
          )}
        />
      </div>

      <div className="space-y-1.5">
        <Label>Availability</Label>
        <Controller
          control={control}
          name="availabilityStatus"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AVAILABLE">Available</SelectItem>
                <SelectItem value="BUSY">Busy</SelectItem>
                <SelectItem value="OFFLINE">Offline</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" variant="brand" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : isEditing ? "Save changes" : "Create member"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/members")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
