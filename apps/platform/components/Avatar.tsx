export type AvatarProps = {
  address?: string;
  imageUrl: string | undefined;
  size?: number;
};

export function Avatar({ imageUrl, address, size = 200 }: AvatarProps) {
  const defaultImageUrl = address
    ? `https://avatars.onflow.org/avatar/avatar/${address}-Test%20Harness.svg`
    : "/images/profile-photo-main.svg";

  // TODO: Use hexagonal shape for NFTs?
  return (
    <img
      style={{
        borderRadius: "50%",
        width: size,
        height: size,
        background: "var(--light-background-color)",
        border: "1px solid",
        borderColor: "var(--dark-blue-color)",
      }}
      src={imageUrl ?? defaultImageUrl}
      alt=""
    />
  );
}
