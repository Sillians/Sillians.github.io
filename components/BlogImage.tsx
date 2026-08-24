// components/BlogImage.tsx

interface BlogImageProps {
  src: string;
  alt: string;
  caption?: string;
  width?: number | string;
  height?: number | string;
}

export default function BlogImage({
  src,
  alt,
  caption,
  width = "100%",
  height = "auto",
}: BlogImageProps) {
  return (
    <figure style={{ margin: "2rem auto", textAlign: "center" }}>
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        style={{
          maxWidth: "100%",
          height: "auto",
          display: "block",
          margin: "0 auto",
        }}
      />

      {caption && (
        <figcaption
          style={{
            marginTop: "0.75rem",
            fontSize: "0.9rem",
            color: "#666",
          }}
        >
          {caption}
        </figcaption>
      )}
    </figure>
  );
}