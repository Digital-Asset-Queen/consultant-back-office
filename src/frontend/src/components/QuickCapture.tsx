import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  useAddUpdateNote,
  useClients,
  useEngagements,
} from "@/hooks/useQueries";
import { useT } from "@/i18n/LanguageContext";
import { dateToNanos, generateId } from "@/lib/formatting";
import { Loader2, Plus, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function QuickCaptureButton() {
  const t = useT();
  const [open, setOpen] = useState(false);
  const [clientId, setClientId] = useState("");
  const [engagementId, setEngagementId] = useState("");
  const [content, setContent] = useState("");
  const [followUp, setFollowUp] = useState(false);
  const [reminderDate, setReminderDate] = useState("");

  const { data: clients = [] } = useClients();
  const { data: allEngagements = [] } = useEngagements();
  const addNote = useAddUpdateNote();

  const clientEngagements = allEngagements.filter(
    (e) => !clientId || e.clientId === clientId,
  );

  function handleOpen() {
    setClientId("");
    setEngagementId("");
    setContent("");
    setFollowUp(false);
    setReminderDate("");
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  async function handleSubmit() {
    if (!content.trim()) return;
    if (!engagementId) {
      toast.error(t("quickCapture.selectEngagementError"));
      return;
    }

    try {
      await addNote.mutateAsync({
        id: generateId(),
        engagementId,
        content: content.trim(),
        createdAt: BigInt(Date.now()) * 1_000_000n,
        isMeetingNote: false,
        followUp,
        reminderDate:
          followUp && reminderDate ? dateToNanos(reminderDate) : undefined,
      });
      toast.success(t("quickCapture.captured"));
      setOpen(false);
    } catch (_err) {
      toast.error(t("quickCapture.captureFailed"));
    }
  }

  return (
    <>
      {/* FAB — clears mobile bottom nav (h-14/56px) with bottom-20 below md */}
      <div className="fixed bottom-20 md:bottom-6 right-6 z-50">
        <Button
          onClick={handleOpen}
          size="icon"
          className="w-12 h-12 rounded-full shadow-lg"
          data-ocid="quick_capture.open_modal_button"
        >
          <Plus className="w-5 h-5" />
        </Button>
      </div>

      {/*
        Panel — always in DOM, fixed at bottom, opacity + pointer-events toggle.
        No transforms, no movement. Left offset matches sidebar width on lg+.
      */}
      <div
        className={`fixed bottom-0 left-0 lg:left-[248px] right-0 z-40 bg-card border-t border-border shadow-2xl transition-opacity duration-150 ease-out ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        data-ocid="quick_capture.dialog"
        aria-hidden={!open}
      >
        <div className="px-6 py-5 max-w-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-lg">{t("common.quickCapture")}</h3>
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8"
              onClick={handleClose}
              data-ocid="quick_capture.close_button"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="qc-client">{t("common.client")}</Label>
              <Select
                value={clientId}
                onValueChange={(v) => {
                  setClientId(v);
                  setEngagementId("");
                }}
              >
                <SelectTrigger id="qc-client" data-ocid="quick_capture.select">
                  <SelectValue placeholder={t("common.selectClient")} />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="qc-engagement">{t("common.engagement")}</Label>
              <Select value={engagementId} onValueChange={setEngagementId}>
                <SelectTrigger
                  id="qc-engagement"
                  data-ocid="quick_capture.select"
                >
                  <SelectValue placeholder={t("common.selectEngagement")} />
                </SelectTrigger>
                <SelectContent>
                  {clientEngagements.map((e) => (
                    <SelectItem key={e.id} value={e.id}>
                      {e.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4 space-y-1.5">
            <Label htmlFor="qc-note">{t("common.note")}</Label>
            <Textarea
              id="qc-note"
              placeholder={t("common.whatHappened")}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={2}
              data-ocid="quick_capture.textarea"
            />
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch
                id="qc-followup"
                checked={followUp}
                onCheckedChange={setFollowUp}
                data-ocid="quick_capture.switch"
              />
              <Label htmlFor="qc-followup" className="text-sm">
                {t("common.requiresFollowUp")}
              </Label>
            </div>
            {/* Reserve height for reminder field to prevent shift inside panel */}
            <div className="min-h-9 flex items-center">
              {followUp && (
                <div className="flex items-center gap-2">
                  <Label
                    htmlFor="qc-reminder"
                    className="text-sm whitespace-nowrap"
                  >
                    {t("common.followUpDate")}
                  </Label>
                  <Input
                    id="qc-reminder"
                    type="date"
                    value={reminderDate}
                    onChange={(e) => setReminderDate(e.target.value)}
                    className="w-40 h-8"
                    data-ocid="quick_capture.input"
                  />
                </div>
              )}
            </div>

            <div className="ml-auto flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleClose}
                data-ocid="quick_capture.cancel_button"
              >
                {t("common.cancel")}
              </Button>
              <Button
                size="sm"
                onClick={handleSubmit}
                disabled={addNote.isPending || !content.trim()}
                data-ocid="quick_capture.submit_button"
              >
                {addNote.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t("common.saving")}
                  </>
                ) : (
                  t("common.capture")
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
