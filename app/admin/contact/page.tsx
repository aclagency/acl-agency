import { readData } from "@/lib/data";
import ContactEditor from "./editor";
import type { ContactData } from "./actions";

export default async function ContactPage() {
  const contact = await readData<ContactData>("contact.json");
  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Contact Info</h1>
        <p className="text-gray-500 text-sm mt-1">Manage phone, email, address, and section copy.</p>
      </div>
      <ContactEditor initialData={contact} />
    </div>
  );
}
