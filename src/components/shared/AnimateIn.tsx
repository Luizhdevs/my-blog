"use client"

import { type ReactNode } from "react"
import { motion, type Variants } from "framer-motion"

import { cn } from "@/lib/utils"

/* ── Variant definitions ───────────────────────────────────────── */
const VARIANTS = {
  fadeIn: {
    hidden:  { opacity: 0 },
    visible: { opacity: 1 },
  },
  fadeInUp: {
    hidden:  { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  },
  fadeInDown: {
    hidden:  { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  },
  scaleIn: {
    hidden:  { opacity: 0, scale: 0.94 },
    visible: { opacity: 1, scale: 1 },
  },
  slideInLeft: {
    hidden:  { opacity: 0, x: -24 },
    visible: { opacity: 1, x: 0 },
  },
  slideInRight: {
    hidden:  { opacity: 0, x: 24 },
    visible: { opacity: 1, x: 0 },
  },
} satisfies Record<string, Variants>

export type AnimateVariant = keyof typeof VARIANTS

/* ── Stagger container — aplica nos pais de listas ─────────────── */
export const staggerContainer: Variants = {
  hidden:  {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
}

/* ── Component ─────────────────────────────────────────────────── */
interface AnimateInProps {
  variant?:  AnimateVariant
  delay?:    number
  duration?: number
  className?: string
  children:  ReactNode
}

export function AnimateIn({
  variant = "fadeInUp",
  delay   = 0,
  duration = 0.4,
  className,
  children,
}: AnimateInProps) {
  const base = VARIANTS[variant]

  const v: Variants = {
    hidden:  base.hidden,
    visible: {
      ...base.visible,
      transition: { duration, delay, ease: [0.25, 0.1, 0.25, 1] },
    },
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-64px" }}
      variants={v}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}

/* ── Stagger wrapper ───────────────────────────────────────────── */
interface StaggerProps {
  className?: string
  children:   ReactNode
  delay?:     number
}

export function StaggerIn({ className, children, delay = 0 }: StaggerProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-64px" }}
      variants={{
        hidden:  {},
        visible: {
          transition: { staggerChildren: 0.09, delayChildren: delay },
        },
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}

/* ── Stagger child — usar dentro de StaggerIn ──────────────────── */
export function StaggerChild({
  variant = "fadeInUp",
  duration = 0.4,
  className,
  children,
}: Omit<AnimateInProps, "delay">) {
  const base = VARIANTS[variant]

  return (
    <motion.div
      variants={{
        hidden:  base.hidden,
        visible: {
          ...base.visible,
          transition: { duration, ease: [0.25, 0.1, 0.25, 1] },
        },
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}
