import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

type Coordinates = {
  lat: number;
  lng: number;
};

type TrafficLight = {
  _id: string;
  location: {
    start: Coordinates;
    end: Coordinates;
  };
  greenTime: number;
  redTime: number;
  status: "green" | "red";
  lastUpdated: string;
};

const TrafficLights: React.FC = () => {
  const [lights, setLights] = useState<TrafficLight[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/lights`)
      .then((res) => res.json())
      .then((data: TrafficLight[]) => {
        setLights(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Ma’lumotlarni yuklashda xato:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center py-10">Yuklanmoqda...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Traffic Lights Info
      </h1>

      {lights.length === 0 ? (
        <div className="text-center text-muted-foreground">
          Hech qanday svetafor topilmadi.
        </div>
      ) : (
        lights.map((light) => (
          <Card key={light._id} className="mb-4">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold mb-1">📍 Manzil</h2>
                  <p className="text-sm text-muted-foreground">
                    From: ({light.location.start.lat},{" "}
                    {light.location.start.lng})
                    <br />
                    To: ({light.location.end.lat}, {light.location.end.lng})
                  </p>
                </div>
                <Badge>{light.status.toUpperCase()}</Badge>
              </div>

              <Separator className="my-4" />

              <div className="flex gap-4 text-sm">
                <div>
                  <strong>🟢 Yashil vaqt:</strong> {light.greenTime}s
                </div>
                <div>
                  <strong>🔴 Qizil vaqt:</strong> {light.redTime}s
                </div>
                <div className="ml-auto text-right text-xs text-muted-foreground">
                  Oxirgi o‘zgarish:
                  <br />
                  {new Date(light.lastUpdated).toLocaleString()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default TrafficLights;
