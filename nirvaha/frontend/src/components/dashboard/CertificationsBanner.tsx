import heroBg from "../../assets/meditation/hero-bg.png";
export const CertificationsBanner = () => {
    return (
        <section className="w-full h-[100vh] relative overflow-hidden">
            {/* Full Cover Image */}
            <img
                src={heroBg}
                alt="Banner"
                className="w-full h-full object-cover"
            />

            {/* Optional subtle overlay for depth */}
            <div className="absolute inset-0 bg-black/5 pointer-events-none" />
        </section>
    );
};
