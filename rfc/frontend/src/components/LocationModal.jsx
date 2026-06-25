import { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function LocationPicker({ setPosition }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });
  return null;
}

function LocationModal({ isOpen, onClose }) {
  const [position, setPosition] = useState(null);
  const [address, setAddress] = useState("");

  if (!isOpen) return null;

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setPosition({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      });
    });
  };

  const saveLocation = async () => {
    const token = localStorage.getItem("token");

    await fetch("/api/location", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({
        address,
        lat: position?.lat,
        lng: position?.lng,
      }),
    });

    alert("Location saved!");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

      <div className="bg-white w-[420px] rounded-xl overflow-hidden">

        {/* HEADER */}
        <div className="flex justify-between p-3 border-b">
          <h2 className="font-bold">Select Location</h2>
          <button onClick={onClose}>✕</button>
        </div>

        {/* MAP */}
        <MapContainer
          center={[31.5204, 74.3587]}
          zoom={13}
          className="h-56 w-full"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {position && <Marker position={position} />}
          <LocationPicker setPosition={setPosition} />
        </MapContainer>

        {/* CONTROLS */}
        <div className="p-4">

          <button
            onClick={getLocation}
            className="bg-gray-200 w-full py-2 rounded mb-2"
          >
            📍 Use Current Location
          </button>

          <input
            placeholder="Enter address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full border p-2 rounded mb-2"
          />

          <button
            onClick={saveLocation}
            className="bg-red-500 text-white w-full py-2 rounded mb-2"
          >
            Confirm Location
          </button>

          <button className="bg-red-600 text-white w-full py-2 rounded">
            Start Order
          </button>

        </div>
      </div>
    </div>
  );
}

export default LocationModal;