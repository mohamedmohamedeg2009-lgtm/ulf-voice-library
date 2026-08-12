import { Dashboard } from "@/features/dashboard/dashboard"; import { listVoices } from "@/services/voices-repository";
export default async function DashboardPage(){return <Dashboard voices={await listVoices()}/>}
