import { useNavigate } from "@tanstack/react-router";

type ModulePath = "/work" | "/bizdev" | "/finance" | "/admin";
type RecordType = "client" | "engagement" | "invoice" | "proposal" | "pipeline";

interface NavigateToRecordConfig {
  path: ModulePath;
  tab: string;
  recordId: string;
  recordType: RecordType;
}

function pathToModuleKey(path: ModulePath): string {
  return path.replace("/", "");
}

export function useNavigateToRecord() {
  const navigate = useNavigate();

  function navigateToRecord(config: NavigateToRecordConfig) {
    const { path, tab, recordId, recordType } = config;
    const moduleKey = pathToModuleKey(path);

    // Remember the tab in localStorage so ModuleLayout picks it up
    localStorage.setItem(`lastTab_${moduleKey}`, tab);

    // Navigate with query params: ?tab=clients&clientId=ABC123
    navigate({
      to: path,
      search: {
        tab,
        [`${recordType}Id`]: recordId,
      },
    });
  }

  return { navigateToRecord };
}
