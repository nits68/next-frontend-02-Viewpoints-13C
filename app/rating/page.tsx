"use client";

import axios, { isAxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export type ViewpointItems = {
  id: number;
  viewpointName: string;
  mountain: string;
};

export type RateItems = {
  viewpointId: number;
  rating: number;
  email: string;
  comment: string;
};

export default function RatingPage() {
  const router = useRouter();
  const [viewponts, setViewpoints] = useState<ViewpointItems[]>([]);
  const [rating, setRating] = useState<RateItems>({
    viewpointId: 0,
    rating: 1,
    email: "",
    comment: "",
  });
  const [accept, setAccept] = useState<boolean>(false);
  useEffect(() => {
    async function getViewpoints() {
      const res = await axios.get<ViewpointItems[]>("http://localhost:3000/api/viewpoints");
      setViewpoints(res.data);
    }
    getViewpoints();
  }, []);

  async function sendRating() {
    try {
      const res = await axios.post("http://localhost:3000/api/rate", rating);
      toast.success(
        `A kilátó eddigi értékelése ${res.data.average}, ${res.data.count} látogató véleménye alapján.`,
      );

      // Nem a feladat része: 5mp várakozás az oldalváltás előtt
      setTimeout(() => {
        router.push("/");
      }, 5000);

      // router.push("/"); // Azonnal a főoldalra navigál
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(
          `Hiba: ${error.response?.data.message || error.message || "Ismeretlen Axios hiba!"}`,
        );
      } else {
        toast.error((error as Error).message || "Ismeretlen hiba!");
      }
    }
  }
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-200">
      <div className="flex flex-col space-y-4 rounded-2xl bg-white p-10 shadow-2xl">
        <h1 className="text-3xl font-bold">Kilátók értékelése</h1>
        <div>
          <label htmlFor="viewpoint">Kilátó:</label>
          <select
            className="select select-primary"
            id="viewpoint"
            value={rating.viewpointId}
            onChange={(e) => setRating({ ...rating, viewpointId: Number(e.target.value) })}
          >
            <option value="0">Válasszon kilátót!</option>
            {viewponts.map((e) => (
              <option key={e.id} value={e.id}>
                {e.viewpointName} ({e.mountain})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="email">Az Ön e-mail címe:</label>
          <input
            className="input input-primary"
            id="email"
            type="email"
            value={rating.email}
            onChange={(e) => setRating({ ...rating, email: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="rate">Értékelés: {0} pont</label>
          <input
            className="range range-primary"
            id="rate"
            max="10"
            min="1"
            type="range"
            value={rating.rating}
            onChange={(e) => setRating({ ...rating, rating: Number(e.target.value) })}
          />
        </div>
        <div>
          <label htmlFor="comment">Megjegyzés:</label>
          <textarea
            className="textarea textarea-primary"
            id="comment"
            rows={3}
            value={rating.comment}
            onChange={(e) => setRating({ ...rating, comment: e.target.value })}
          />
        </div>
        <div>
          <input
            checked={accept}
            id="acceptedConditions"
            type="checkbox"
            onChange={(e) => setAccept(e.target.checked)}
          />
          <label className="ml-2" htmlFor="acceptedConditions">
            Felhasználási feltételeket elfogadom
          </label>
        </div>
        <div className="mx-auto">
          <button
            className="btn btn-primary"
            disabled={!accept}
            type="button"
            onClick={() => sendRating()}
          >
            Küldés
          </button>
        </div>
      </div>
      {JSON.stringify(rating)}
      {JSON.stringify(accept)}
    </div>
  );
}
