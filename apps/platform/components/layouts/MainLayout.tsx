import { Navigation } from "../Navigation";
import { Footer } from "../Footer";

export default function MainLayout({ children }: any) {
  return (
    <>
      <Navigation />
      {children}
      <Footer />
    </>
  );
}
