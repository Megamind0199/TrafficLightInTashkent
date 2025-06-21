"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { useState } from "react";
import "leaflet/dist/leaflet.css";

const formSchema = z.object({
  greenTime: z.number().min(5, "Kamida 5 sekund bo‘lishi kerak"),
  redTime: z.number().min(5, "Kamida 5 sekund bo‘lishi kerak"),
});

type FormValues = z.infer<typeof formSchema>;

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function CreateTrafficLightForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onTouched",
  });

  const [selectedPosition, setSelectedPosition] = useState<
    [number, number] | null
  >(null);

  const handleMapClick = (lat: number, lng: number) => {
    setSelectedPosition([lat, lng]);
  };

  const onSubmit = async (data: FormValues) => {
    if (!selectedPosition) {
      toast.error("Iltimos, xaritada svetafor joylashuvini tanlang");
      return;
    }

    const [lat, lng] = selectedPosition;

    const payload = {
      lat,
      lng,
      greenTime: data.greenTime,
      redTime: data.redTime,
    };

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Server xatosi");

      toast.success("✅ Svetafor muvaffaqiyatli qo‘shildi");
      reset();
      setSelectedPosition(null);
    } catch (error) {
      console.error(error);
      toast.error("❌ Svetafor qo‘shishda xatolik yuz berdi");
    }
  };

  function ClickHandler() {
    useMapEvents({
      click: (e) => {
        handleMapClick(e.latlng.lat, e.latlng.lng);
      },
    });
    return null;
  }

  return (
    <Card className="max-w-3xl mx-auto mt-6 p-6 shadow">
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <h2 className="text-xl font-bold mb-4">🟢 Svetafor joylashuvi</h2>

          <MapContainer
            center={[41.3, 69.2]}
            zoom={13}
            style={{ height: "400px", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
            />
            <ClickHandler />
            {selectedPosition && (
              <Marker position={selectedPosition} icon={markerIcon} />
            )}
          </MapContainer>

          <p className="text-sm text-muted-foreground">
            Xaritada bitta nuqtani bosing — svetafor shu yerga qo‘shiladi
          </p>

          <div>
            <Label>Green Time (sekund)</Label>
            <Input
              type="number"
              {...register("greenTime", { valueAsNumber: true })}
            />
            {errors.greenTime && (
              <p className="text-red-500 text-sm">{errors.greenTime.message}</p>
            )}
          </div>

          <div>
            <Label>Red Time (sekund)</Label>
            <Input
              type="number"
              {...register("redTime", { valueAsNumber: true })}
            />
            {errors.redTime && (
              <p className="text-red-500 text-sm">{errors.redTime.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full mt-4">
            Qo‘shish
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
