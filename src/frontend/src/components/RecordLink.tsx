import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";

type RecordType = "client" | "engagement" | "invoice" | "proposal" | "pipeline";

interface RecordLinkProps {
  label: string;
  path: string;
  tab: string;
  recordId: string;
  recordType: RecordType;
  className?: string;
}

export function RecordLink({
  label,
  path,
  tab,
  recordId,
  recordType,
  className,
}: RecordLinkProps) {
  return (
    <Link
      to={path}
      search={{ tab, [`${recordType}Id`]: recordId } as Record<string, string>}
      className={cn("text-primary hover:underline cursor-pointer", className)}
      data-ocid="record.link"
    >
      {label}
    </Link>
  );
}

export default RecordLink;
