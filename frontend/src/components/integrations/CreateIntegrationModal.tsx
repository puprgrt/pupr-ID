"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createOidcClient, createWebhook } from "@/app/dashboard/integrations/actions";
import { Loader2 } from "lucide-react";

// Schemas
const oidcSchema = z.object({
  name: z.string().min(3, "Nama klien minimal 3 karakter"),
  redirectUri: z.string().url("Format URL tidak valid (harus diawali http/https)"),
});

const webhookSchema = z.object({
  name: z.string().min(3, "Nama webhook minimal 3 karakter"),
  url: z.string().url("Format URL tidak valid"),
  events: z.array(z.string()).min(1, "Pilih minimal satu event trigger"),
});

export type IntegrationType = "oidc" | "webhooks" | "apikeys" | null;

interface CreateIntegrationModalProps {
  type: IntegrationType;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: any, type: string) => void;
}

const WEBHOOK_EVENTS = [
  { id: "user.created", label: "User Created" },
  { id: "user.updated", label: "User Updated" },
  { id: "role.changed", label: "Role Changed" },
  { id: "login.failed", label: "Login Failed" },
];

export default function CreateIntegrationModal({ type, isOpen, onClose, onSuccess }: CreateIntegrationModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const oidcForm = useForm<z.infer<typeof oidcSchema>>({
    resolver: zodResolver(oidcSchema),
    defaultValues: { name: "", redirectUri: "" },
  });

  const webhookForm = useForm<z.infer<typeof webhookSchema>>({
    resolver: zodResolver(webhookSchema),
    defaultValues: { name: "", url: "", events: [] },
  });

  useEffect(() => {
    if (!isOpen) {
      oidcForm.reset();
      webhookForm.reset();
      setErrorMsg("");
    }
  }, [isOpen, oidcForm, webhookForm]);

  const handleClose = () => {
    onClose();
  };

  const onSubmitOidc = async (values: z.infer<typeof oidcSchema>) => {
    setIsSubmitting(true);
    setErrorMsg("");
    try {
      const res = await createOidcClient(values.name, values.redirectUri);
      if (res.error) {
        setErrorMsg(res.error);
      } else {
        onSuccess(res.data, "oidc");
        handleClose();
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Terjadi kesalahan sistem");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmitWebhook = async (values: z.infer<typeof webhookSchema>) => {
    setIsSubmitting(true);
    setErrorMsg("");
    try {
      const res = await createWebhook(values.name, values.url, values.events);
      if (res.error) {
        setErrorMsg(res.error);
      } else {
        onSuccess(res.data, "webhooks");
        handleClose();
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Terjadi kesalahan sistem");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!type) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[425px] bg-[#071A3D] border-white/10 text-white">
        <DialogHeader>
          <DialogTitle>Buat {type === "oidc" ? "OIDC Client" : type === "webhooks" ? "Webhook" : "API Key"}</DialogTitle>
          <DialogDescription className="text-slate-400">
            {type === "oidc" && "Tambahkan kredensial SSO baru untuk aplikasi eksternal."}
            {type === "webhooks" && "Buat trigger event ke sistem eksternal saat ada perubahan di PUPR-ID."}
            {type === "apikeys" && "Fitur API Key saat ini dikonfigurasi melalui CLI/Backend."}
          </DialogDescription>
        </DialogHeader>

        {errorMsg && (
          <div className="p-3 rounded-md bg-rose-500/10 border border-rose-500/20 text-sm text-rose-400">
            {errorMsg}
          </div>
        )}

        {type === "oidc" && (
          <form onSubmit={oidcForm.handleSubmit(onSubmitOidc)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-300">Nama Aplikasi</Label>
              <Input id="name" placeholder="Misal: SIMBG Pusat" {...oidcForm.register("name")} className="bg-slate-900 border-white/10" />
              {oidcForm.formState.errors.name && <p className="text-xs text-rose-400">{oidcForm.formState.errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="redirectUri" className="text-slate-300">Redirect URI</Label>
              <Input id="redirectUri" placeholder="https://app.example.com/callback" {...oidcForm.register("redirectUri")} className="bg-slate-900 border-white/10" />
              {oidcForm.formState.errors.redirectUri && <p className="text-xs text-rose-400">{oidcForm.formState.errors.redirectUri.message}</p>}
            </div>
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={handleClose} className="border-white/10 bg-transparent text-slate-300 hover:bg-white/5 hover:text-white">Batal</Button>
              <Button type="submit" disabled={isSubmitting} className="bg-pink-500 hover:bg-pink-600 text-white">
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Simpan
              </Button>
            </DialogFooter>
          </form>
        )}

        {type === "webhooks" && (
          <form onSubmit={webhookForm.handleSubmit(onSubmitWebhook)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="webhookName" className="text-slate-300">Nama Webhook</Label>
              <Input id="webhookName" placeholder="Misal: Sync Profil" {...webhookForm.register("name")} className="bg-slate-900 border-white/10" />
              {webhookForm.formState.errors.name && <p className="text-xs text-rose-400">{webhookForm.formState.errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="url" className="text-slate-300">URL Endpoint</Label>
              <Input id="url" placeholder="https://api.example.com/webhook" {...webhookForm.register("url")} className="bg-slate-900 border-white/10" />
              {webhookForm.formState.errors.url && <p className="text-xs text-rose-400">{webhookForm.formState.errors.url.message}</p>}
            </div>
            <div className="space-y-3 pt-2">
              <Label className="text-slate-300">Events Trigger</Label>
              <div className="grid grid-cols-2 gap-3">
                {WEBHOOK_EVENTS.map(ev => (
                  <div key={ev.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={ev.id} 
                      onCheckedChange={(checked) => {
                        const currentEvents = webhookForm.getValues("events");
                        if (checked) {
                          webhookForm.setValue("events", [...currentEvents, ev.id]);
                        } else {
                          webhookForm.setValue("events", currentEvents.filter(e => e !== ev.id));
                        }
                      }}
                      className="border-white/20 data-[state=checked]:bg-pink-500"
                    />
                    <Label htmlFor={ev.id} className="text-sm font-normal text-slate-400 cursor-pointer">{ev.label}</Label>
                  </div>
                ))}
              </div>
              {webhookForm.formState.errors.events && <p className="text-xs text-rose-400">{webhookForm.formState.errors.events.message}</p>}
            </div>
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={handleClose} className="border-white/10 bg-transparent text-slate-300 hover:bg-white/5 hover:text-white">Batal</Button>
              <Button type="submit" disabled={isSubmitting} className="bg-pink-500 hover:bg-pink-600 text-white">
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Simpan
              </Button>
            </DialogFooter>
          </form>
        )}
        
        {type === "apikeys" && (
          <div className="py-6 flex flex-col items-center justify-center text-center">
             <p className="text-slate-300 text-sm mb-6">Master Key harus di-generate oleh Super Admin langsung di Server Database (backend) demi keamanan.</p>
             <Button variant="outline" onClick={handleClose} className="border-white/10 bg-transparent text-slate-300 hover:bg-white/5 hover:text-white">Tutup</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
