import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(circle at 30% 30%, #d8b36a 0%, #5e3f16 35%, #0b0d12 100%)",
          color: "#f6f2ea",
          fontSize: 20,
          fontWeight: 800,
          letterSpacing: "-0.08em",
        }}
      >
        W
      </div>
    ),
    size
  );
}
