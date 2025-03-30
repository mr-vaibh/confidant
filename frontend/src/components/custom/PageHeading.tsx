import { ArrowLeft } from "lucide-react"; // Import Lucid Icon

export default function PageHeading({ text }: Readonly<{ text?: string }>) {
    // Go back one step in the history
    const handleGoBack = () => {
        window.history.back();
    };

    return <div className="flex items-center mb-6">
        {/* Back Button */}
        <button
            onClick={handleGoBack}
            className="flex items-center justify-center w-10 h-10 bg-black text-white dark:bg-white dark:text-black shadow-md hover:bg-gray-600 transition duration-200 ease-in-out"
        >
            <ArrowLeft />
        </button>

        <h1 className="text-2xl font-bold ml-4">{text}</h1>
    </div>
}
