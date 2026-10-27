import Image from "next/image";

// Renders the light-theme photo always, plus the dark-theme photo on top
// when one exists — CSS (`.theme-img-*` in globals.css) shows whichever
// matches the current theme. Products without a dark photo just keep
// showing the light one in both themes.
export function ThemedProductImage({
  src,
  srcDark,
  alt,
  sizes,
  priority,
}: {
  src: string;
  srcDark?: string;
  alt: string;
  sizes: string;
  priority?: boolean;
}) {
  if (!srcDark) {
    return <Image src={src} alt={alt} fill sizes={sizes} priority={priority} />;
  }

  return (
    <>
      <Image className="theme-img-light" src={src} alt={alt} fill sizes={sizes} priority={priority} />
      <Image className="theme-img-dark" src={srcDark} alt={alt} fill sizes={sizes} priority={priority} />
    </>
  );
}
