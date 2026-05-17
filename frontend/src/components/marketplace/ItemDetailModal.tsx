import { motion, AnimatePresence } from "motion/react";
import {
  X, Star, Clock, CalendarRange, MapPin, Users, ShoppingCart,
  Zap, CheckCircle, Leaf, Heart, Award, Shield, Truck,
  MonitorPlay, Info, ChevronRight,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ProductItem {
  type: "product";
  name: string;
  description: string;
  price: string;
  category: string;
  inStock: boolean;
  rating?: number;
  reviews?: number;
  image: string;
  id?: string;
  approvedId?: string;
  benefits?: string[];
  ingredients?: string;
  usage?: string;
}

export interface SessionItem {
  type: "session";
  title: string;
  host: string;
  schedule: string;
  duration: string;
  price: string;
  topics: string[];
  rating?: number;
  attendees?: string;
  image: string;
  id?: string;
  approvedId?: string;
}

export interface RetreatItem {
  type: "retreat";
  title: string;
  guide: string;
  location: string;
  dates: string;
  price: string;
  capacity: string;
  highlights?: string[];
  rating?: number;
  image: string;
  id?: string;
  approvedId?: string;
  description?: string;
  duration?: string;
  activities?: string[];
  accommodation?: string;
  mealsIncluded?: string;
  servicesIncluded?: string;
  features?: string[];
}

export type DetailItem = ProductItem | SessionItem | RetreatItem;

interface ItemDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: DetailItem | null;
  onAddToCart?: (item: ProductItem) => void;
  onRegisterSession?: (item: SessionItem) => void;
  onRequestRetreat?: (item: RetreatItem) => void;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const getTitle = (item: DetailItem) =>
  item.type === "product" ? item.name : item.title;

// ── Component ─────────────────────────────────────────────────────────────────

export function ItemDetailModal({
  isOpen, onClose, item,
  onAddToCart, onRegisterSession, onRequestRetreat,
}: ItemDetailModalProps) {
  if (!isOpen || !item) return null;

  const title = getTitle(item);

  const handleCta = () => {
    if (item.type === "product" && onAddToCart) onAddToCart(item);
    else if (item.type === "session" && onRegisterSession) onRegisterSession(item);
    else if (item.type === "retreat" && onRequestRetreat) onRequestRetreat(item);
    onClose();
  };

  const ctaLabel =
    item.type === "product" ? "Add to Cart" :
    item.type === "session" ? "Register Now" : "Request Spot";

  const CtaIcon =
    item.type === "product" ? ShoppingCart :
    item.type === "session" ? Zap : Heart;

  const typeColor =
    item.type === "product" ? "#3db87a" :
    item.type === "session" ? "#059669" : "#0a2e1f";

  return (
    <AnimatePresence>
      <motion.div
        key="detail-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 400,
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "1rem",
          background: "rgba(5, 20, 12, 0.60)",
          backdropFilter: "blur(18px)",
          fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
        }}
      >
        <motion.div
          key="detail-modal"
          initial={{ opacity: 0, scale: 0.94, y: 28 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 28 }}
          transition={{ type: "spring", damping: 26, stiffness: 340 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            position: "relative",
            width: "100%",
            maxWidth: "900px",
            maxHeight: "92vh",
            overflowY: "auto",
            borderRadius: "28px",
            background: "#ffffff",
            boxShadow: "0 40px 120px -20px rgba(0,50,25,0.40), 0 0 0 1px rgba(61,184,122,0.12)",
            scrollbarWidth: "thin",
            scrollbarColor: "#b8d8d1 transparent",
          }}
        >
          {/* ── BANNER ────────────────────────────────────────────────── */}
          <div style={{ position: "relative", width: "100%", height: "240px", overflow: "hidden", borderRadius: "28px 28px 0 0" }}>
            <img
              src={item.image}
              alt={title}
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
            />
            {/* Gradient overlays */}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(5,15,10,0.25) 0%, transparent 40%, rgba(5,15,10,0.80) 100%)" }} />



            {/* Close */}
            <button
              onClick={onClose}
              style={{
                position: "absolute", top: 18, right: 18,
                width: 36, height: 36, borderRadius: "50%",
                background: "rgba(255,255,255,0.20)", backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.30)",
                color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", transition: "all 0.2s",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.35)")}
              onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.20)")}
            >
              <X style={{ width: 16, height: 16 }} />
            </button>

            {/* Bottom title area */}
            <div style={{ position: "absolute", bottom: 18, left: 22, right: 22 }}>
              <h2 style={{ margin: 0, fontSize: 24, fontWeight: 900, color: "#fff", lineHeight: 1.2, letterSpacing: "-0.02em", textShadow: "0 2px 12px rgba(0,0,0,0.4)" }}>
                {title}
              </h2>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 6 }}>
                {item.type === "session" && (
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", fontWeight: 700 }}>
                    by {item.host}
                  </span>
                )}
                {item.type === "retreat" && (
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", fontWeight: 700 }}>
                    Led by {item.guide}
                  </span>
                )}
                {item.type === "product" && (
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", fontWeight: 700 }}>
                    {item.category}
                  </span>
                )}
                {item.rating && (
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: 4,
                    padding: "3px 10px", borderRadius: 999,
                    background: "rgba(255,210,50,0.25)", border: "1px solid rgba(255,210,50,0.5)",
                    color: "#ffd700", fontSize: 12, fontWeight: 800,
                  }}>
                    <Star style={{ width: 12, height: 12, fill: "#ffd700" }} />
                    {item.rating}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* ── BODY: LEFT + RIGHT ────────────────────────────────────── */}
          <div style={{ display: "flex", flexDirection: "row", minHeight: 280 }}>

            {/* LEFT: Details */}
            <div style={{
              flex: 1, padding: "28px 28px 28px 28px",
              borderRight: "1px solid #edf2f0",
              display: "flex", flexDirection: "column", gap: 20,
            }}>
              <span style={{
                fontSize: 10, fontWeight: 900, color: "#6a8c7a",
                letterSpacing: "0.2em", textTransform: "uppercase",
                marginBottom: -10, display: "flex", alignItems: "center", gap: 6,
              }}>
                ✦ Nirvaha {item.type} {item.type === "product" ? `· ${item.category}` : ""}
              </span>

              {/* SESSION details */}
              {item.type === "session" && (
                <>
                  <SectionTitle>Session Details</SectionTitle>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <InfoCard icon={<Clock style={{ width: 15, height: 15, color: "#3db87a" }} />} label="Duration" value={item.duration} />
                    <InfoCard icon={<CalendarRange style={{ width: 15, height: 15, color: "#3db87a" }} />} label="Schedule" value={item.schedule} />
                    <InfoCard icon={<MonitorPlay style={{ width: 15, height: 15, color: "#3db87a" }} />} label="Platform" value={item.topics?.[0] || "Online"} />
                    {item.attendees && (
                      <InfoCard icon={<Users style={{ width: 15, height: 15, color: "#3db87a" }} />} label="Joined" value={item.attendees} />
                    )}
                  </div>

                  {item.topics?.length > 0 && (
                    <div>
                      <SectionTitle>Topics</SectionTitle>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
                        {item.topics.map((t, i) => (
                          <Tag key={i}>{t}</Tag>
                        ))}
                      </div>
                    </div>
                  )}

                  <BenefitsList items={[
                    "Live interactive session with expert host",
                    "Session recording shared post-event",
                    "Q&A and guided exercises included",
                    "Certificate of participation",
                  ]} />

                  <div style={{
                    padding: "14px 16px", borderRadius: 14,
                    background: "linear-gradient(135deg, #f0faf5, #eaf7f1)",
                    border: "1px solid #c8e6d8",
                  }}>
                    <p style={{ margin: 0, fontSize: 12, color: "#3a7c5e", fontWeight: 700, lineHeight: 1.6 }}>
                      🌿 Spot confirmed after review. No charges until approval.
                    </p>
                  </div>
                </>
              )}

              {/* RETREAT details */}
              {item.type === "retreat" && (
                <>
                  <div>
                    <SectionTitle>Retreat Overview</SectionTitle>
                    <p style={{ margin: "6px 0 0", fontSize: 13.5, color: "#4a7c65", lineHeight: 1.6, fontWeight: 500 }}>
                      {item.description || "A deep, restorative wellness experience designed to help you reconnect with nature, align your energy center, and achieve deep mental clarity."}
                    </p>
                  </div>

                  <SectionTitle>Retreat Details</SectionTitle>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 4 }}>
                    <InfoCard icon={<MapPin style={{ width: 14, height: 14, color: "#3db87a" }} />} label="Location" value={item.location} />
                    <InfoCard icon={<CalendarRange style={{ width: 14, height: 14, color: "#3db87a" }} />} label="Dates" value={item.dates} />
                    <InfoCard icon={<Clock style={{ width: 14, height: 14, color: "#3db87a" }} />} label="Duration" value={item.duration || "5 Days / 4 Nights"} />
                    <InfoCard icon={<Users style={{ width: 14, height: 14, color: "#3db87a" }} />} label="Availability" value={item.capacity} />
                  </div>

                  <BenefitsList items={[
                    "Immersive nature-based healing program",
                    "Expert-facilitated daily sessions",
                    "Nutritious sattvic meals included",
                    "Small intimate group for deep impact",
                  ]} />

                  <div style={{
                    padding: "12px 14px", borderRadius: 12,
                    background: "linear-gradient(135deg, #f0faf5, #eaf7f1)",
                    border: "1px solid #c8e6d8",
                    marginTop: 6,
                  }}>
                    <p style={{ margin: 0, fontSize: 11.5, color: "#3a7c5e", fontWeight: 700, lineHeight: 1.5 }}>
                      🌿 Applications reviewed manually. We'll respond within 24 hours.
                    </p>
                  </div>
                </>
              )}

              {/* PRODUCT details */}
              {item.type === "product" && (
                <>
                  <div>
                    <SectionTitle>Product Overview</SectionTitle>
                    <p style={{ margin: "6px 0 0", fontSize: 13.5, color: "#4a7c65", lineHeight: 1.6, fontWeight: 500 }}>
                      {item.description}
                    </p>
                  </div>

                  <SectionTitle>Product Details</SectionTitle>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 4 }}>
                    <InfoCard icon={<CheckCircle style={{ width: 14, height: 14, color: "#3db87a" }} />} label="Availability" value={item.inStock ? "In Stock ✓" : "Sold Out"} />
                    <InfoCard icon={<Award style={{ width: 14, height: 14, color: "#3db87a" }} />} label="Shipping Info" value="Free Delivery" />
                  </div>

                  <BenefitsList items={item.benefits && item.benefits.length >= 3 ? item.benefits.slice(0, 3) : [
                    "100% Organic & sustainably sourced",
                    "Authenticity verified by Nirvaha",
                    "7-day hassle-free return policy",
                  ]} />

                  <div style={{
                    marginTop: 6,
                    padding: "10px 14px",
                    background: "#f0faf5",
                    border: "1px solid #d6eee9",
                    borderRadius: 12,
                  }}>
                    <p style={{ margin: 0, fontSize: 11.5, color: "#3a7c5e", fontWeight: 700, lineHeight: 1.5 }}>
                      🚚 Delivery: Standard dispatch within 24 hours. Free express shipping on all orders.
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* RIGHT: CTA */}
            <div style={{
              width: 260, flexShrink: 0,
              padding: "28px 24px",
              background: "linear-gradient(160deg, #f8faf9 0%, #f0faf5 100%)",
              display: "flex", flexDirection: "column", justifyContent: "space-between",
              borderRadius: "0 0 28px 0",
            }}>
              {/* Price card */}
              <div>
                <div style={{
                  padding: "18px 20px", borderRadius: 18,
                  background: "#fff",
                  border: "1px solid #d6eee9",
                  boxShadow: "0 4px 20px rgba(10,46,31,0.06)",
                  marginBottom: 20,
                }}>
                  <p style={{ margin: "0 0 4px", fontSize: 10, fontWeight: 900, color: "#9abba8", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                    {item.type === "retreat" ? "Base Investment" : "Price"}
                  </p>
                  <p style={{ margin: 0, fontSize: 30, fontWeight: 900, color: "#0a2e1f", lineHeight: 1.1, letterSpacing: "-0.03em" }}>
                    {item.price}
                  </p>
                  {item.type === "session" && (
                    <p style={{ margin: "6px 0 0", fontSize: 11, color: "#5a8c72", fontWeight: 600 }}>per person · IST</p>
                  )}
                  {item.type === "retreat" && (
                    <p style={{ margin: "6px 0 0", fontSize: 11, color: "#5a8c72", fontWeight: 600 }}>per person · all-inclusive</p>
                  )}
                  {item.type === "product" && (
                    <p style={{ margin: "6px 0 0", fontSize: 11, color: "#5a8c72", fontWeight: 600 }}>incl. taxes & delivery</p>
                  )}
                </div>

                {/* Perks */}
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
                  {(item.type === "product"
                    ? ["Free express delivery", "Easy 7-day returns", "Secure payment"]
                    : item.type === "session"
                    ? ["Live & interactive", "Recording included", "Expert-led"]
                    : ["Curated program", "Expert facilitators", "All-inclusive option"]
                  ).map((perk) => (
                    <div key={perk} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{
                        width: 22, height: 22, borderRadius: "50%",
                        background: "#d6eee9", border: "1px solid #b8d8d1",
                        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                      }}>
                        <CheckCircle style={{ width: 12, height: 12, color: "#2d5a42" }} />
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#2d5a42" }}>{perk}</span>
                    </div>
                  ))}
                </div>

                {/* Organizer or stock note */}
                <div style={{
                  padding: "12px 14px", borderRadius: 12,
                  background: "rgba(61,184,122,0.08)", border: "1px solid rgba(61,184,122,0.2)",
                  marginBottom: 4,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Info style={{ width: 13, height: 13, color: "#3db87a", flexShrink: 0 }} />
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#2d6a4f", lineHeight: 1.5 }}>
                      {item.type === "product"
                        ? item.inStock ? "Ships within 2–3 business days" : "Currently out of stock"
                        : item.type === "session"
                        ? "Spot confirmed after host review"
                        : "Limited seats — apply early"}
                    </span>
                  </div>
                </div>
              </div>

              {/* CTA buttons */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 18 }}>
                <motion.button
                  whileHover={{ scale: 1.03, y: -2, boxShadow: "0 16px 40px -8px rgba(10,46,31,0.35)" }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleCta}
                  style={{
                    width: "100%", height: 52, borderRadius: 999,
                    background: "linear-gradient(135deg, #0a2e1f 0%, #1a5c3a 100%)",
                    color: "#fff", fontWeight: 800, fontSize: 15,
                    border: "none", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    boxShadow: "0 10px 28px -6px rgba(10,46,31,0.30)",
                    transition: "background 0.3s",
                    letterSpacing: "0.01em",
                  }}
                >
                  <CtaIcon style={{ width: 18, height: 18 }} />
                  {ctaLabel}
                  <ChevronRight style={{ width: 16, height: 16, opacity: 0.7 }} />
                </motion.button>
                <button
                  onClick={onClose}
                  style={{
                    width: "100%", height: 42, borderRadius: 999,
                    background: "transparent",
                    border: "1.5px solid #d1e0d9",
                    color: "#4a7c65", fontWeight: 700, fontSize: 13,
                    cursor: "pointer", transition: "all 0.2s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#edf7f3")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ margin: 0, fontSize: 10, fontWeight: 900, color: "#9abba8", letterSpacing: "0.18em", textTransform: "uppercase" }}>
      {children}
    </p>
  );
}

function InfoCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div style={{
      display: "flex", alignItems: "flex-start", gap: 10,
      padding: "12px 14px", borderRadius: 14,
      background: "#f8faf9", border: "1px solid #e8f2ec",
    }}>
      <div style={{
        width: 30, height: 30, borderRadius: 10,
        background: "#edf7f3", border: "1px solid #c8e6d8",
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        {icon}
      </div>
      <div>
        <p style={{ margin: 0, fontSize: 9, fontWeight: 900, color: "#9abba8", letterSpacing: "0.14em", textTransform: "uppercase" }}>{label}</p>
        <p style={{ margin: "3px 0 0", fontSize: 13, fontWeight: 800, color: "#0a2e1f", lineHeight: 1.3 }}>{value}</p>
      </div>
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      padding: "5px 12px", borderRadius: 999,
      background: "#edf7f3", border: "1px solid #c8e6d8",
      color: "#2d6a4f", fontSize: 11, fontWeight: 800,
    }}>
      {children}
    </span>
  );
}

function BenefitsList({ items }: { items: string[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <SectionTitle>What's Included</SectionTitle>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 4 }}>
        {items.map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 20, height: 20, borderRadius: "50%",
              background: "linear-gradient(135deg, #d6eee9, #b8d8d1)",
              border: "1px solid #b8d8d1",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <CheckCircle style={{ width: 11, height: 11, color: "#2d5a42" }} />
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#2d5a42", lineHeight: 1.4 }}>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
