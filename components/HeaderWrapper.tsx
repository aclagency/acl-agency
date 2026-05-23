import { readData } from "@/lib/data";
import Header from "./Header";

export default async function HeaderWrapper() {
  const settings = await readData<{
    logoUrl: string;
    logoText: string;
    companyShort: string;
    companySuffix: string;
    navLinks: { label: string; href: string }[];
    navCTA: { text: string; href: string };
  }>("settings.json");

  return (
    <Header
      logoUrl={settings.logoUrl}
      logoText={settings.logoText}
      companyShort={settings.companyShort}
      companySuffix={settings.companySuffix}
      navLinks={settings.navLinks}
      navCTA={settings.navCTA}
    />
  );
}
