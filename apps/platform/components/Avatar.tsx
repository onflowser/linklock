export type AvatarProps = {
  imageUrl: string | undefined;
  size?: number;
};

export function Avatar({ imageUrl, size = 200 }: AvatarProps) {
  const defaultImageUrl = "/images/profile-photo-main.svg";
  // TODO: Use hexagonal shape for NFTs?
  return (
    <img
      style={{ borderRadius: "50%" }}
      width={size}
      height={size}
      src={imageUrl ?? defaultImageUrl}
      alt=""
    />
  );
}
