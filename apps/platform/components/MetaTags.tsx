import Head from "next/head";
import { getDomain } from "../common/config";

type Props = {
  title: string;
  description?: string;
};

const defaultDescription =
  "Start getting founds for your project(s) in FLOW crypto currency. Create your profile and share it to your appreciators. It is easy, free and quick!";

export default function MetaTags({ title, description }: Props) {
  const domain = getDomain();
  if (!description) {
    description = defaultDescription;
  }

  return (
    <Head>
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
      <link rel="manifest" href="/site.webmanifest" />

      <title>{title}</title>

      <meta name="title" content={title} />
      <meta name="description" content={description} />

      <meta property="og:type" content="website" />
      <meta property="og:url" content={domain} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content="/thumbnail.png" />

      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={domain} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content="/thumbnail.png" />
    </Head>
  );
}
