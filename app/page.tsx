import { readData } from "@/lib/data";
import Header from "@/components/HeaderWrapper";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import WhyUs from "@/components/WhyUs";
import Testimonials from "@/components/Testimonials";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";

interface ContactData {
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  hours: string;
  sectionLabel: string;
  headline: string;
  subheadline: string;
}

export default async function Home() {
  const contact = await readData<ContactData>("contact.json");

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Services />
        <WhyUs />
        <Testimonials />
        <ContactForm contact={contact} />
      </main>
      <Footer />
    </>
  );
}
