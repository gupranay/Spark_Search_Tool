import NextHead from "next/head";

interface HeadProps {
  title: string;
}
export default function Head({ title }: HeadProps) {
  return (
    <NextHead>
      <title>V1 | {title}</title>
      <link rel="icon" href="/spark_logo.png" />
      <link rel="apple-touch-icon" href="https://annarborusa.org/wp-content/uploads/2022/08/spark-logo.svg" />
      <meta
        name="description"
        content="V1 is the community for ambitious student builders at the University of Michigan."
      />
      <meta name="og:title" content="V1 | University of Michigan" />
      <meta
        name="og:description"
        content="V1 is the community for ambitious student builders at the University of Michigan."
      />
      <meta property="og:image" content="https://annarborusa.org/wp-content/uploads/2022/08/spark-logo.svg" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </NextHead>
  );
}