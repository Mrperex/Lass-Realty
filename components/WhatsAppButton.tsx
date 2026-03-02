import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
    // This phone number would typically be pulled from a global config or env var
    const phoneNumber = "18095550123";
    const message = encodeURIComponent("Hello! I'm interested in viewing some properties on LASS Realty.");
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:bg-[#20bd5a] hover:scale-110 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center group"
            aria-label="Chat on WhatsApp"
        >
            <MessageCircle className="w-8 h-8" />

            {/* Tooltip */}
            <span className="absolute right-full mr-4 bg-slate-900 text-white text-sm px-4 py-2 rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 whitespace-nowrap shadow-lg">
                Chat with an Agent
                {/* Little triangle pointer */}
                <span className="absolute top-1/2 -right-1 w-2 h-2 bg-slate-900 rotate-45 transform -translate-y-1/2"></span>
            </span>
        </a>
    );
}
