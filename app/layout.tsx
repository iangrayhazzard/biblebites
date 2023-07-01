import { cn } from "@/lib/utils"

import "./globals.css"

import { Inter } from "next/font/google"

import PassageSelection from "@/components/passage-selection"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
    title: "Bible Bites",
    description: "A Quick Scripture Browser",
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body
                className={cn(inter.className, "bg-background text-foreground")}
            >
                <section className="relative h-screen overflow-hidden">
                    <main className="scrollbar-hide mx-auto flex h-full max-w-xl items-center overflow-auto px-20">
                        {children}
                        <div className="pointer-events-none absolute inset-x-0 bottom-1/2 top-0 bg-gradient-to-t from-transparent to-white"></div>
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 top-1/4 bg-gradient-to-t from-white to-transparent"></div>
                    </main>
                    <footer className="absolute bottom-0 left-0 z-10 w-full shrink-0 grow-0">
                        <PassageSelection />
                    </footer>
                </section>
            </body>
        </html>
    )
}
