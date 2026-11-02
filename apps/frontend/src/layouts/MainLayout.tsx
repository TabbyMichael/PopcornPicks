import { Outlet } from "react-router-dom";
import Navigation from "@/shared/components/Navigation";
import Footer from "@/shared/components/Footer";

/**
 * MainLayout wraps every content page with the shared header and footer.
 * Auth and any future full-bleed screens live outside this layout.
 */
const MainLayout = () => (
  <div className="min-h-screen bg-background text-foreground flex flex-col">
    <Navigation />
    <main className="flex-1 pt-16">
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default MainLayout;
