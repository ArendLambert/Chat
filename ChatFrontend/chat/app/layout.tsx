import Layout, { Content } from "antd/es/layout/layout";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Layout>
          <Content>
            {children}
          </Content>
        </Layout>
      </body>
    </html>
  );
}
