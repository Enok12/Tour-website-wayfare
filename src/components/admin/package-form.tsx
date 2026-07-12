"use client";

import { useRouter } from "next/navigation";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Trash2, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TagInput } from "@/components/shared/tag-input";
import { ImageUploadField } from "@/components/shared/image-upload-field";
import { createPackageSchema, type CreatePackageInput } from "@/server/dto/package.dto";
import { useCreatePackage, useUpdatePackage } from "@/hooks/use-packages";
import type { PackageDto } from "@/types";
import { ApiRequestError } from "@/lib/api-client";

export function PackageForm({ initial }: { initial?: PackageDto }) {
  const router = useRouter();
  const isEditing = Boolean(initial);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<z.input<typeof createPackageSchema>, unknown, z.output<typeof createPackageSchema>>({
    resolver: zodResolver(createPackageSchema),
    defaultValues: initial
      ? {
          name: initial.name,
          description: initial.description,
          durationDays: initial.durationDays,
          currency: initial.currency,
          coverImage: initial.coverImage ?? "",
          galleryImages: initial.galleryImages,
          includedServices: initial.includedServices,
          excludedServices: initial.excludedServices,
          isActive: initial.isActive,
          locations: initial.locations.map((loc) => ({
            id: loc.id,
            name: loc.name,
            description: loc.description ?? "",
            price: Number(loc.price),
            isActive: loc.isActive,
          })),
          attributes: initial.attributes.map((attr) => ({
            id: attr.id,
            name: attr.name,
            description: attr.description ?? "",
            price: Number(attr.price),
            isActive: attr.isActive,
          })),
          accommodations: initial.accommodations.map((acc) => ({
            id: acc.id,
            name: acc.name,
            description: acc.description ?? "",
            image: acc.image ?? "",
            starRating: acc.starRating,
            price: Number(acc.price),
            isActive: acc.isActive,
          })),
        }
      : {
          currency: "USD",
          galleryImages: [],
          includedServices: [],
          excludedServices: [],
          isActive: true,
          locations: [],
          attributes: [],
          accommodations: [],
        },
  });

  const { fields: locationFields, append: appendLocation, remove: removeLocation } = useFieldArray({
    control,
    name: "locations",
  });

  const { fields: attributeFields, append: appendAttribute, remove: removeAttribute } = useFieldArray({
    control,
    name: "attributes",
  });

  const { fields: accommodationFields, append: appendAccommodation, remove: removeAccommodation } = useFieldArray({
    control,
    name: "accommodations",
  });

  const createPackage = useCreatePackage();
  const updatePackage = useUpdatePackage(initial?.id ?? "");

  async function onSubmit(values: CreatePackageInput) {
    try {
      if (isEditing) {
        await updatePackage.mutateAsync(values);
        toast.success("Package updated");
      } else {
        await createPackage.mutateAsync(values);
        toast.success("Package created");
      }
      router.push("/admin/packages");
    } catch (err) {
      toast.error(err instanceof ApiRequestError ? err.message : "Something went wrong");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="name">Package name</Label>
          <Input id="name" {...register("name")} />
          {errors.name && <p className="text-xs text-danger">{errors.name.message}</p>}
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" rows={4} {...register("description")} />
          {errors.description && <p className="text-xs text-danger">{errors.description.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="durationDays">Duration (days)</Label>
          <Input id="durationDays" type="number" min={1} {...register("durationDays")} />
          {errors.durationDays && <p className="text-xs text-danger">{errors.durationDays.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="currency">Currency</Label>
          <Input id="currency" maxLength={3} {...register("currency")} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="coverImage">Cover image</Label>
          <Controller
            control={control}
            name="coverImage"
            render={({ field }) => (
              <ImageUploadField value={field.value} onChange={field.onChange} label="Cover image" />
            )}
          />
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <Label>Gallery image URLs</Label>
          <Controller
            control={control}
            name="galleryImages"
            render={({ field }) => (
              <TagInput value={field.value ?? []} onChange={field.onChange} placeholder="Paste a URL and press Enter" />
            )}
          />
        </div>

        <div className="space-y-1.5">
          <Label>Included services</Label>
          <Controller
            control={control}
            name="includedServices"
            render={({ field }) => (
              <TagInput value={field.value ?? []} onChange={field.onChange} placeholder="e.g. Hotel, breakfast" />
            )}
          />
        </div>

        <div className="space-y-1.5">
          <Label>Excluded services</Label>
          <Controller
            control={control}
            name="excludedServices"
            render={({ field }) => (
              <TagInput value={field.value ?? []} onChange={field.onChange} placeholder="e.g. Flights, insurance" />
            )}
          />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Locations</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => appendLocation({ name: "", description: "", price: 0, isActive: true })}
          >
            <Plus className="h-4 w-4" /> Add location
          </Button>
        </div>
        <p className="text-xs text-text-secondary">
          The itinerary stops that make up this package (e.g. &quot;Temple of the Tooth&quot;).
          Included by default for customers, who can deselect ones they don&apos;t want (at least one
          must stay selected) — the package&apos;s price is the sum of the locations they keep.
        </p>
        {errors.locations?.message && (
          <p className="text-xs text-danger">{errors.locations.message}</p>
        )}

        {locationFields.length === 0 && (
          <p className="text-sm text-text-secondary">No locations yet — add at least one.</p>
        )}

        {locationFields.map((field, index) => (
          <div key={field.id} className="grid gap-3 rounded-lg border border-border-subtle p-3 sm:grid-cols-[2fr_2fr_1fr_auto_auto]">
            <div className="space-y-1">
              <Label htmlFor={`locations.${index}.name`}>Name</Label>
              <Input id={`locations.${index}.name`} {...register(`locations.${index}.name`)} />
              {errors.locations?.[index]?.name && (
                <p className="text-xs text-danger">{errors.locations[index]?.name?.message}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor={`locations.${index}.description`}>Description (optional)</Label>
              <Input id={`locations.${index}.description`} {...register(`locations.${index}.description`)} />
            </div>
            <div className="space-y-1">
              <Label htmlFor={`locations.${index}.price`}>Price</Label>
              <Input
                id={`locations.${index}.price`}
                type="number"
                min={0}
                step="0.01"
                {...register(`locations.${index}.price`)}
              />
              {errors.locations?.[index]?.price && (
                <p className="text-xs text-danger">{errors.locations[index]?.price?.message}</p>
              )}
            </div>
            <div className="flex items-end gap-2 pb-1.5">
              <Controller
                control={control}
                name={`locations.${index}.isActive`}
                render={({ field: checkboxField }) => (
                  <Checkbox
                    checked={checkboxField.value}
                    onCheckedChange={checkboxField.onChange}
                    id={`locations.${index}.isActive`}
                  />
                )}
              />
              <Label htmlFor={`locations.${index}.isActive`} className="font-normal">
                Active
              </Label>
            </div>
            <div className="flex items-end pb-1.5">
              <Button type="button" variant="outline" size="sm" onClick={() => removeLocation(index)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Customizable options</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => appendAttribute({ name: "", description: "", price: 0, isActive: true })}
          >
            <Plus className="h-4 w-4" /> Add option
          </Button>
        </div>
        <p className="text-xs text-text-secondary">
          Selectable sub-locations/activities customers can add to this package (e.g. &quot;Cultural
          Dance Show&quot;), each with its own price on top of the price of the locations visited.
        </p>

        {attributeFields.length === 0 && (
          <p className="text-sm text-text-secondary">No options yet.</p>
        )}

        {attributeFields.map((field, index) => (
          <div key={field.id} className="grid gap-3 rounded-lg border border-border-subtle p-3 sm:grid-cols-[2fr_2fr_1fr_auto_auto]">
            <div className="space-y-1">
              <Label htmlFor={`attributes.${index}.name`}>Name</Label>
              <Input id={`attributes.${index}.name`} {...register(`attributes.${index}.name`)} />
              {errors.attributes?.[index]?.name && (
                <p className="text-xs text-danger">{errors.attributes[index]?.name?.message}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor={`attributes.${index}.description`}>Description (optional)</Label>
              <Input id={`attributes.${index}.description`} {...register(`attributes.${index}.description`)} />
            </div>
            <div className="space-y-1">
              <Label htmlFor={`attributes.${index}.price`}>Price</Label>
              <Input
                id={`attributes.${index}.price`}
                type="number"
                min={0}
                step="0.01"
                {...register(`attributes.${index}.price`)}
              />
              {errors.attributes?.[index]?.price && (
                <p className="text-xs text-danger">{errors.attributes[index]?.price?.message}</p>
              )}
            </div>
            <div className="flex items-end gap-2 pb-1.5">
              <Controller
                control={control}
                name={`attributes.${index}.isActive`}
                render={({ field: checkboxField }) => (
                  <Checkbox
                    checked={checkboxField.value}
                    onCheckedChange={checkboxField.onChange}
                    id={`attributes.${index}.isActive`}
                  />
                )}
              />
              <Label htmlFor={`attributes.${index}.isActive`} className="font-normal">
                Active
              </Label>
            </div>
            <div className="flex items-end pb-1.5">
              <Button type="button" variant="outline" size="sm" onClick={() => removeAttribute(index)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Accommodation options</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              appendAccommodation({
                name: "",
                description: "",
                image: "",
                starRating: 3,
                price: 0,
                isActive: true,
              })
            }
          >
            <Plus className="h-4 w-4" /> Add accommodation
          </Button>
        </div>
        <p className="text-xs text-text-secondary">
          Hotels/stays customers choose one of for this package (e.g. &quot;Jetwing Kandy Gallery -
          Luxury&quot;), shown to customers as a picture tile with its own price on top of the
          package price.
        </p>

        {accommodationFields.length === 0 && (
          <p className="text-sm text-text-secondary">No accommodations yet.</p>
        )}

        {accommodationFields.map((field, index) => (
          <div key={field.id} className="flex gap-4 rounded-lg border border-border-subtle p-3">
            <div className="shrink-0 space-y-1">
              <Label>Photo</Label>
              <Controller
                control={control}
                name={`accommodations.${index}.image`}
                render={({ field: imageField }) => (
                  <ImageUploadField value={imageField.value} onChange={imageField.onChange} label="Accommodation photo" />
                )}
              />
            </div>

            <div className="flex-1 space-y-3">
              <div className="grid gap-3 sm:grid-cols-[2fr_1fr_1fr]">
                <div className="space-y-1">
                  <Label htmlFor={`accommodations.${index}.name`}>Name</Label>
                  <Input id={`accommodations.${index}.name`} {...register(`accommodations.${index}.name`)} />
                  {errors.accommodations?.[index]?.name && (
                    <p className="text-xs text-danger">{errors.accommodations[index]?.name?.message}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label>Star rating</Label>
                  <Controller
                    control={control}
                    name={`accommodations.${index}.starRating`}
                    render={({ field: ratingField }) => (
                      <Select
                        value={String(ratingField.value)}
                        onValueChange={(v) => ratingField.onChange(Number(v))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[3, 4, 5].map((n) => (
                            <SelectItem key={n} value={String(n)}>
                              {n} Star
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor={`accommodations.${index}.price`}>Price</Label>
                  <Input
                    id={`accommodations.${index}.price`}
                    type="number"
                    min={0}
                    step="0.01"
                    {...register(`accommodations.${index}.price`)}
                  />
                  {errors.accommodations?.[index]?.price && (
                    <p className="text-xs text-danger">{errors.accommodations[index]?.price?.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor={`accommodations.${index}.description`}>Description (optional)</Label>
                <Input
                  id={`accommodations.${index}.description`}
                  {...register(`accommodations.${index}.description`)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Controller
                    control={control}
                    name={`accommodations.${index}.isActive`}
                    render={({ field: checkboxField }) => (
                      <Checkbox
                        checked={checkboxField.value}
                        onCheckedChange={checkboxField.onChange}
                        id={`accommodations.${index}.isActive`}
                      />
                    )}
                  />
                  <Label htmlFor={`accommodations.${index}.isActive`} className="font-normal">
                    Active
                  </Label>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={() => removeAccommodation(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <Button type="submit" variant="brand" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : isEditing ? "Save changes" : "Create package"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/packages")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
