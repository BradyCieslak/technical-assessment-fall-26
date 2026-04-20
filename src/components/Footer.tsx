// src/components/Footer.tsx
export default function Footer() {
    return (
        <footer className="py-10 px-6 border-t border-merc-carbon bg-merc-black text-center justify-between">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <div className="text-xs tracking-[0.2em] uppercase text-merc-silver-dim">
                    Data · <a
                    href="https://api.jolpi.ca/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-merc-teal hover:underline"
                    >
                    Jolpica-F1
                    </a>
                </div>
                <div className="text-xs uppercase text-merc-silver-dim">
                    Developed by <a
                    href="https://linkedin.com/in/brady-cieslak"
                    target="_blank"
                    rel="noreferrer"
                    className="text-merc-teal hover:underline"
                    >
                    Brady Cieslak
                    </a>
                </div>
            </div>
        </footer>
    );
}