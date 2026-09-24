export default function Logo({ className = 'h-10 w-10' }) {
    return (
        <img
            src="/logo.png"
            alt="لوگوی پالوده"
            className={`${className} drop-shadow-[0_0_15px_rgba(34,211,238,0.35)] transition-transform duration-300 hover:scale-105`}
        />
    );
}