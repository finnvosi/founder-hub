import { ArchitecturalLoader } from "@/components/shared/architectural-loader";

export default function DashboardLoading() {
  return (
    <div className="h-full w-full relative bg-titanium-black">
      <ArchitecturalLoader 
        messages={["INITIALIZING VIEW", "SYNCING DOCUMENTS", "RETRIEVING DATA", "READY"]} 
        fullScreen={false} 
      />
    </div>
  );
}
