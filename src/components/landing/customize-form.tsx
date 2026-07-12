"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { TagInput } from "@/components/shared/tag-input";
import { PackageSelector } from "@/components/landing/package-selector";
import { createTourRequestSchema, type CreateTourRequestInput } from "@/server/dto/tour-request.dto";
import { useCreateTourRequest } from "@/hooks/use-tours";
import type { PackageDto } from "@/types";
import { toast } from "sonner";

export function CustomizeForm({
  packages,
  preselectedSlug,
}: {
  packages: PackageDto[];
  preselectedSlug?: string;
}) {
  const preselected = packages.find((p) => p.slug === preselectedSlug);
  const [bookingReference, setBookingReference] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<z.input<typeof createTourRequestSchema>, unknown, z.output<typeof createTourRequestSchema>>({
    resolver: zodResolver(createTourRequestSchema),
    defaultValues: {
      packages: preselected ? [{ packageId: preselected.id, attributeIds: [] }] : [],
      numberOfTravelers: 2,
      preferredDestinations: [],
      activities: [],
    },
  });

  const createRequest = useCreateTourRequest();

  async function onSubmit(values: CreateTourRequestInput) {
    try {
      const res = await createRequest.mutateAsync(values);
      setBookingReference(res.data.bookingReference);
    } catch {
      toast.error("Something went wrong submitting your request. Please try again.");
    }
  }

  if (bookingReference) {
    return (
      <div className="flex flex-col items-center py-8 text-center">
        <CheckCircle2 className="h-12 w-12 text-green-600" />
        <h2 className="mt-4 font-display text-2xl text-pine-900">Request received</h2>
        <p className="mt-2 max-w-sm text-ink-muted">
          We&apos;ll personally review your trip and get back to you soon. Save your booking
          reference to track its status any time.
        </p>
        <p className="mt-4 rounded-lg bg-pine-50 px-4 py-2 font-display text-xl tracking-wide text-pine-900">
          {bookingReference}
        </p>
        <Button asChild variant="brand" className="mt-6">
          <Link href={`/track?ref=${bookingReference}`}>Track this booking</Link>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <fieldset className="space-y-4">
        <legend className="mb-1 font-display text-lg text-pine-900">Your details</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="fullName">Full name</Label>
            <Input id="fullName" {...register("fullName")} placeholder="Jordan Rivera" />
            {errors.fullName && <p className="text-xs text-danger">{errors.fullName.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} placeholder="you@example.com" />
            {errors.email && <p className="text-xs text-danger">{errors.email.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="phone">Phone number</Label>
            <Input id="phone" {...register("phone")} placeholder="+1 555 010 2938" />
            {errors.phone && <p className="text-xs text-danger">{errors.phone.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="country">Country</Label>
            <Input id="country" {...register("country")} placeholder="Where you're traveling from" />
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="mb-1 font-display text-lg text-pine-900">Your trip</legend>

        <div className="space-y-1.5">
          <Label>Choose your package(s)</Label>
          <p className="text-xs text-ink-muted">
            Select at least one package. You can combine as many as you like (e.g. Kandy +
            Dambulla + Trincomalee) and pick which options you want on each.
          </p>
          <Controller
            control={control}
            name="packages"
            render={({ field }) => (
              <PackageSelector packages={packages} value={field.value} onChange={field.onChange} />
            )}
          />
          {errors.packages && (
            <p className="text-xs text-danger">
              {errors.packages.message ?? "Select at least one package"}
            </p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-1.5">
            <Label htmlFor="travelDateStart">Start date</Label>
            <Input id="travelDateStart" type="date" {...register("travelDateStart")} />
            {errors.travelDateStart && (
              <p className="text-xs text-danger">{errors.travelDateStart.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="travelDateEnd">End date (optional)</Label>
            <Input id="travelDateEnd" type="date" {...register("travelDateEnd")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="numberOfTravelers">Travelers</Label>
            <Input id="numberOfTravelers" type="number" min={1} {...register("numberOfTravelers")} />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Preferred destinations</Label>
          <Controller
            control={control}
            name="preferredDestinations"
            render={({ field }) => (
              <TagInput value={field.value ?? []} onChange={field.onChange} placeholder="Type a place and press Enter" />
            )}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="hotelPreference">Hotel preference</Label>
            <Input id="hotelPreference" {...register("hotelPreference")} placeholder="e.g. boutique, 4-star, budget" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="budget">Budget (optional, USD)</Label>
            <Input id="budget" type="number" min={0} {...register("budget")} placeholder="2000" />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Activities you&apos;re interested in</Label>
          <Controller
            control={control}
            name="activities"
            render={({ field }) => (
              <TagInput value={field.value ?? []} onChange={field.onChange} placeholder="e.g. hiking, diving, food tours" />
            )}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="specialRequests">Special requests</Label>
          <Textarea
            id="specialRequests"
            {...register("specialRequests")}
            placeholder="Anything else we should know?"
            rows={4}
          />
        </div>
      </fieldset>

      <Button type="submit" variant="brand" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">
        {isSubmitting ? "Submitting..." : "Submit request"}
      </Button>
    </form>
  );
}
