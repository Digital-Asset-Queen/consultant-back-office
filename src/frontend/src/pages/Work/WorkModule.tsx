import { ModuleLayout } from "@/components/layout/ModuleLayout";
import { Briefcase, Clock, UserCircle, Users } from "lucide-react";
import ClientsTab from "./ClientsTab";
import ContactsTab from "./ContactsTab";
import EngagementsTab from "./EngagementsTab";
import TimeExpensesTab from "./TimeExpensesTab";

export default function WorkModule() {
  const IconClients = Users;
  const IconEngagements = Briefcase;
  const IconTime = Clock;
  const IconContacts = UserCircle;

  const tabs = [
    {
      key: "clients",
      label: "Clients",
      icon: IconClients,
      content: <ClientsTab />,
    },
    {
      key: "engagements",
      label: "Engagements",
      icon: IconEngagements,
      content: <EngagementsTab />,
    },
    {
      key: "time",
      label: "Time & Expenses",
      icon: IconTime,
      content: <TimeExpensesTab />,
    },
    {
      key: "contacts",
      label: "Contacts",
      icon: IconContacts,
      content: <ContactsTab />,
    },
  ];

  return (
    <ModuleLayout
      title="Work"
      storageKey="work-module"
      defaultTab="clients"
      tabs={tabs}
    />
  );
}
