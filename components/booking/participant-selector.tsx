"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Plus, Minus, Users, Baby, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export interface ParticipantType {
  type: "adults" | "children" | "seniors"
  label: string
  icon: React.ReactNode
  price: number
  description?: string
  minAge?: number
  maxAge?: number
}

export interface ParticipantSelectorProps {
  participants: Record<string, number>
  onParticipantChange: (type: string, count: number) => void
  participantTypes: ParticipantType[]
  maxParticipants?: number
  minParticipants?: number
  disabled?: boolean
}

export function ParticipantSelector({
  participants,
  onParticipantChange,
  participantTypes,
  maxParticipants = 20,
  minParticipants = 1,
  disabled = false
}: ParticipantSelectorProps) {
  const totalParticipants = Object.values(participants).reduce(
    (sum, count) => sum + count,
    0
  )

  const handleIncrement = (type: string) => {
    if (totalParticipants < maxParticipants) {
      onParticipantChange(type, (participants[type] || 0) + 1)
    }
  }

  const handleDecrement = (type: string) => {
    const currentCount = participants[type] || 0
    if (currentCount > 0 && totalParticipants > minParticipants) {
      onParticipantChange(type, currentCount - 1)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
          <Users className="size-5 text-pink-400" />
          Select Participants
        </h3>
        <span className="text-sm text-white/60">
          Total: {totalParticipants} / {maxParticipants}
        </span>
      </div>

      <div className="space-y-3">
        {participantTypes.map(participantType => {
          const count = participants[participantType.type] || 0
          const canIncrement = totalParticipants < maxParticipants && !disabled
          const canDecrement =
            count > 0 && totalParticipants > minParticipants && !disabled

          return (
            <motion.div
              key={participantType.type}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="rounded-xl bg-white/10 p-4 backdrop-blur-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-pink-500/20 text-pink-400">
                    {participantType.icon}
                  </div>
                  <div>
                    <p className="font-medium text-white">
                      {participantType.label}
                    </p>
                    {participantType.description && (
                      <p className="text-xs text-white/60">
                        {participantType.description}
                      </p>
                    )}
                    <p className="text-sm font-semibold text-yellow-400">
                      €{participantType.price} per person
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDecrement(participantType.type)}
                    disabled={!canDecrement}
                    className={cn(
                      "size-8 rounded-lg",
                      canDecrement
                        ? "bg-white/10 text-white hover:bg-white/20"
                        : "cursor-not-allowed bg-white/5 text-white/30"
                    )}
                    aria-label={`Decrease ${participantType.label} count`}
                  >
                    <Minus className="size-4" />
                  </Button>

                  <motion.div
                    key={count}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="min-w-[40px] text-center"
                  >
                    <span className="text-lg font-semibold text-white">
                      {count}
                    </span>
                  </motion.div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleIncrement(participantType.type)}
                    disabled={!canIncrement}
                    className={cn(
                      "size-8 rounded-lg",
                      canIncrement
                        ? "bg-white/10 text-white hover:bg-white/20"
                        : "cursor-not-allowed bg-white/5 text-white/30"
                    )}
                    aria-label={`Increase ${participantType.label} count`}
                  >
                    <Plus className="size-4" />
                  </Button>
                </div>
              </div>

              {/* Price calculation for this type */}
              <AnimatePresence>
                {count > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mt-2 border-t border-white/10 pt-2"
                  >
                    <p className="text-right text-sm text-white/80">
                      Subtotal:{" "}
                      <span className="font-semibold">
                        €{(count * participantType.price).toFixed(2)}
                      </span>
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>

      {/* Total Summary */}
      {totalParticipants > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-lg bg-yellow-400/20 p-4"
        >
          <div className="flex items-center justify-between">
            <p className="font-medium text-white">Total Price:</p>
            <p className="text-2xl font-bold text-white">
              €
              {participantTypes
                .reduce((total, type) => {
                  return total + (participants[type.type] || 0) * type.price
                }, 0)
                .toFixed(2)}
            </p>
          </div>
        </motion.div>
      )}

      {/* Validation Messages */}
      {totalParticipants === 0 && (
        <p className="text-center text-sm text-red-400">
          Please select at least {minParticipants} participant
        </p>
      )}
      {totalParticipants === maxParticipants && (
        <p className="text-center text-sm text-yellow-400">
          Maximum capacity reached
        </p>
      )}
    </div>
  )
}

// Default participant types
export const defaultParticipantTypes: ParticipantType[] = [
  {
    type: "adults",
    label: "Adults",
    icon: <User className="size-5" />,
    price: 45,
    description: "Ages 18+",
    minAge: 18
  },
  {
    type: "children",
    label: "Children",
    icon: <Baby className="size-5" />,
    price: 25,
    description: "Ages 3-17",
    minAge: 3,
    maxAge: 17
  },
  {
    type: "seniors",
    label: "Seniors",
    icon: <Users className="size-5" />,
    price: 40,
    description: "Ages 65+",
    minAge: 65
  }
]
