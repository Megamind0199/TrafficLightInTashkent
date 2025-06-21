"use client";

import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    ymaps?: any;
  }
}

type TrafficLight = {
  _id: string;
  location: { lat: number; lng: number };
  greenTime: number;
  redTime: number;
};

const TrafficMapYandex: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [lights, setLights] = useState<TrafficLight[]>([]);
  const [loading, setLoading] = useState(true);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [currentTime, setCurrentTime] = useState<number>(Date.now());

  useEffect(() => {
    const waitForYmaps = () =>
      new Promise<typeof window.ymaps>((resolve) => {
        const check = () => {
          if (window.ymaps?.ready) {
            resolve(window.ymaps);
          } else {
            setTimeout(check, 200);
          }
        };
        check();
      });

    let instance: any;

    waitForYmaps().then(async (ymaps) => {
      ymaps.ready(async () => {
        if (!mapRef.current) return;

        instance = new ymaps.Map(mapRef.current, {
          center: [41.3, 69.25],
          zoom: 13,
          controls: ["zoomControl", "trafficControl"],
        });

        const trafficControl = new ymaps.control.TrafficControl({
          shown: true,
        });
        instance.controls.add(trafficControl);
        setMapInstance(instance);

        try {
          const res = await fetch(`${import.meta.env.VITE_API_URL}/api/lights`);
          const lightsData: TrafficLight[] = await res.json();
          setLights(lightsData);

          lightsData.forEach((light) => {
            const placemark = new ymaps.Placemark(
              [light.location.lat, light.location.lng],
              {
                balloonContentHeader: `Svetafor`,
                balloonContentBody: `Green: ${light.greenTime}s<br/>Red: ${light.redTime}s`,
              },
              {
                iconLayout: "default#image",
                iconImageHref:
                  "https://e7.pngegg.com/pngimages/520/93/png-clipart-computer-icons-traffic-light-symbol-traffic-light-driving-traffic-sign-thumbnail.png",
                iconImageSize: [25, 41],
                iconImageOffset: [-12, -41],
              }
            );
            instance.geoObjects.add(placemark);
          });
        } catch (err) {
          console.error("Svetaforlarni olishda xato:", err);
        } finally {
          setLoading(false);
        }
      });
    });

    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000); // har 1 sekundda UI yangilanadi

    return () => {
      if (instance) instance.destroy();
      clearInterval(interval);
    };
  }, []);

  // Auto calculate status
  const getStatus = (light: TrafficLight): "green" | "red" => {
    const total = light.greenTime + light.redTime;
    const t = Math.floor((currentTime / 1000) % total);
    return t < light.greenTime ? "green" : "red";
  };

  const handleCardClick = (light: TrafficLight) => {
    if (mapInstance) {
      mapInstance.setCenter([light.location.lat, light.location.lng], 16, {
        duration: 500,
      });
    }
  };

  return (
    <div className="flex justify-center items-start w-full min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-10 px-4">
      <div className="flex w-full max-w-7xl gap-6 rounded-3xl shadow-2xl overflow-hidden">
        {/* Map */}
        <div className="w-3/4 rounded-l-3xl overflow-hidden relative shadow-xl">
          <div ref={mapRef} className="w-full h-[600px]" />
          {loading && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center font-bold text-lg">
              Xarita yuklanmoqda...
            </div>
          )}
        </div>

        {/* List */}
        <div className="w-1/4 p-4 overflow-y-auto max-h-[600px] bg-white rounded-r-3xl border-l shadow-inner">
          <h2 className="text-2xl font-bold mb-4 text-center text-slate-700">
            🚦 Svetaforlar
          </h2>
          {loading
            ? Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-xl" />
              ))
            : lights.map((light) => {
                const status = getStatus(light);
                return (
                  <Card
                    key={light._id}
                    className="border rounded-2xl mb-4 cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg"
                    onClick={() => handleCardClick(light)}
                  >
                    <CardContent className="p-4 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">Status:</span>
                        <span
                          className={cn(
                            "font-bold capitalize",
                            status === "green"
                              ? "text-green-600"
                              : "text-red-600"
                          )}
                        >
                          {status}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>🟢 {light.greenTime}s</span>
                        <span>🔴 {light.redTime}s</span>
                      </div>
                      <div className="text-xs text-gray-400">
                        📍 {light.location.lat}, {light.location.lng}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
        </div>
      </div>
    </div>
  );
};

export default TrafficMapYandex;
