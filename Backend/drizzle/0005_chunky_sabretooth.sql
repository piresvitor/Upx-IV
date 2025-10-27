ALTER TABLE "reports" ADD COLUMN "rampa_acesso" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "reports" ADD COLUMN "banheiro_acessivel" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "reports" ADD COLUMN "estacionamento_acessivel" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "reports" ADD COLUMN "acessibilidade_visual" boolean DEFAULT false NOT NULL;