"use client"

import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useCombobox } from "downshift"
import { AnimatePresence, motion } from "framer-motion"
import { useForm } from "react-hook-form"
import * as z from "zod"

import {
    getSuggestions,
    isValidScriptureReference,
    splitScriptureReference,
} from "@/lib/utils"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"

import { Input } from "./ui/input"

const formSchema = z.object({
    passage: z.string().refine(isValidScriptureReference, {
        message: "passage not found",
        params: { minLength: 2, maxLength: 50 },
    }),
})

export default function PassageSelection() {
    const router = useRouter()
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            passage: "",
        },
    })

    const {
        isOpen,
        getMenuProps,
        getInputProps,
        highlightedIndex,
        getItemProps,
    } = useCombobox({
        items: getSuggestions(form.watch("passage")),
        onSelectedItemChange: ({ selectedItem }) => {
            form.setValue("passage", selectedItem || "")
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        const parsedReference = splitScriptureReference(values.passage)

        if (parsedReference && isValidScriptureReference(values.passage)) {
            const { book, chapter, verse } = parsedReference
            router.push(`/${book}/${chapter}/${verse}`)
        } else {
            console.error("Passage Not Found")
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-10">
                <FormField
                    control={form.control}
                    name="passage"
                    render={({ field }) => (
                        <FormItem className="relative mx-auto max-w-xs">
                            <FormControl>
                                <div>
                                    <Input
                                        placeholder="Reference..."
                                        {...getInputProps({
                                            ...form.register("passage"),
                                        })}
                                    />
                                    <ul
                                        className="absolute top-[-10px] w-full -translate-y-full"
                                        {...getMenuProps()}
                                    >
                                        <AnimatePresence>
                                            {isOpen && (
                                                <motion.div
                                                    animate={{ opacity: 1 }}
                                                    initial={{ opacity: 0 }}
                                                    transition={{
                                                        duration: 0.3,
                                                    }}
                                                    className="rounded-md border border-border bg-background p-2 shadow"
                                                >
                                                    {getSuggestions(
                                                        form.watch("passage")
                                                    ).map((item, index) => {
                                                        if (index < 10) {
                                                            return (
                                                                <li
                                                                    key={`${item}-${index}`}
                                                                    className="rounded p-2 text-sm transition-colors aria-[selected=true]:bg-muted"
                                                                    {...getItemProps(
                                                                        {
                                                                            item,
                                                                            index,
                                                                        }
                                                                    )}
                                                                >
                                                                    {item}
                                                                </li>
                                                            )
                                                        }
                                                    })}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </ul>
                                </div>
                            </FormControl>
                            <FormMessage className="top-100 absolute" />
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    )
}
