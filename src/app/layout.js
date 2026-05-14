import Script from "next/script";
import "bootstrap/dist/css/bootstrap.min.css";
import "@/css/globals.css";

export const metadata = {
  title: {
    absolute: "",
    default: "Tender bharo",
    template: "%s - Tender bharo",
  },
  description:
    "TenderBharo is a reliable tender consulting partner offering end-to-end support for tender registration, portal login, product uploads, and tender bidding services across India.",
};

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
          crossOrigin="true"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css"
          rel="stylesheet"
        />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width user-scalable=no"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wght@8..144,100..1000&display=swap"
          rel="stylesheet"
        />
        <meta property="og:title" content="Tender bharo" />
        <meta
          property="og:description"
          content="TenderBharo is a reliable tender consulting partner offering end-to-end support for tender registration, portal login, product uploads, and tender bidding services across India."
        />
        <meta
          property="og:image"
          content="https://tender-bharo-tender-documents.s3.dualstack.ap-south-1.amazonaws.com/client/email/TenderBharoSmallLogo.jpg"
        />
        <meta property="og:url" content={process.env.FRONTEND_DOMAIN} />
      </head>
      <body>
        <div className="wrapper">{children}</div>
      </body>
    </html>
  );
}
