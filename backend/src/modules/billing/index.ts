import { Module } from "@medusajs/framework"
import { BillingService } from "./service"

export const BillingModule = Module("billing", {
  service: BillingService,
})

export * from "./service"
