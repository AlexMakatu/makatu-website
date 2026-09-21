"use client";

import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  Building2,
  CheckCircle2,
  Clock3,
  FileDown,
  Globe2,
  Mail,
  MapPinned,
  Maximize2,
  Phone,
  Printer,
  ShieldCheck,
  Sparkles,
  Truck,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { BusinessProfile } from "@/types/businessProfile";
import styles from "./BusinessProfilePresentation.module.css";

type Props = {
  profile: BusinessProfile;
};

function imageUrl(image?: { asset?: { url?: string } }) {
  return image?.asset?.url;
}

function SlideTitle({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className={styles.slideTitle}>
      <p>{eyebrow}</p>
      <h2>{title}</h2>
      {description ? <span>{description}</span> : null}
    </div>
  );
}

function BrandMark() {
  return (
    <div className={styles.brandMark}>
      <Image src="/logo.png" alt="Makatu" width={174} height={98} priority />
    </div>
  );
}

export default function BusinessProfilePresentation({ profile }: Props) {
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  const slides = useMemo(
    () => [
      "Introduction",
      "Why Makatu",
      "Fleet",
      "Leadership",
      "Operations",
      "Credentials & Clients",
      "Contact",
    ],
    [],
  );

  const goTo = (index: number) => {
    const next = Math.max(0, Math.min(slides.length - 1, index));
    setActive(next);
    rootRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight" || event.key === "PageDown")
        goTo(active + 1);
      if (event.key === "ArrowLeft" || event.key === "PageUp") goTo(active - 1);
      if (event.key === "Home") goTo(0);
      if (event.key === "End") goTo(slides.length - 1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active, slides.length]);

  const printProfile = () => {
    const hidden: HTMLElement[] = [];

    document
      .querySelectorAll<HTMLElement>(
        "header, footer, [class*='cookie' i], [class*='wh-widget' i], [class*='zsiq' i]",
      )
      .forEach((element) => {
        if (rootRef.current?.contains(element)) return;
        element.dataset.profilePrintDisplay = element.style.display;
        element.style.display = "none";
        hidden.push(element);
      });

    document.querySelectorAll<HTMLElement>("body *").forEach((element) => {
      if (rootRef.current?.contains(element)) return;
      if (hidden.includes(element)) return;
      const position = window.getComputedStyle(element).position;
      if (position === "fixed" || position === "sticky") {
        element.dataset.profilePrintDisplay = element.style.display;
        element.style.display = "none";
        hidden.push(element);
      }
    });

    const restore = () => {
      hidden.forEach((element) => {
        element.style.display = element.dataset.profilePrintDisplay ?? "";
        delete element.dataset.profilePrintDisplay;
      });
      window.removeEventListener("afterprint", restore);
    };

    window.addEventListener("afterprint", restore);
    window.print();
  };

  const enterFullscreen = async () => {
    if (!rootRef.current) return;
    if (document.fullscreenElement) await document.exitFullscreen();
    else await rootRef.current.requestFullscreen();
  };

  return (
    <div
      ref={rootRef}
      className={`${styles.presentation} business-profile-print-root`}
    >
      <div className={styles.toolbar}>
        <div className={styles.toolbarBrand}>
          <Image src="/logo.png" alt="Makatu" width={96} height={54} />
          <div>
            <p>Business profile</p>
            <span>{slides[active]}</span>
          </div>
        </div>

        <div className={styles.progress} aria-label="Presentation sections">
          {slides.map((label, index) => (
            <button
              key={label}
              type="button"
              onClick={() => goTo(index)}
              className={index === active ? styles.progressActive : ""}
              aria-label={`Open ${label}`}
            />
          ))}
        </div>

        <div className={styles.toolbarActions}>
          <button type="button" onClick={enterFullscreen} title="Fullscreen">
            <Maximize2 size={18} />
          </button>
          <button
            type="button"
            onClick={printProfile}
            title="Print or save as PDF"
          >
            <Printer size={18} />
            <span>Print / PDF</span>
          </button>
        </div>
      </div>

      <div className={styles.stage}>
        <section
          className={`${styles.slide} ${styles.cover} ${active === 0 ? styles.active : ""}`}
        >
          {imageUrl(profile.heroImage) ? (
            <Image
              src={imageUrl(profile.heroImage)!}
              alt="Makatu vehicle transport"
              fill
              priority
              sizes="100vw"
              className={styles.coverImage}
            />
          ) : null}
          <div className={styles.coverOverlay} />
          <div className={styles.coverGlow} />
          <div className={styles.coverContent}>
            <BrandMark />
            <p className={styles.kicker}>Company profile</p>
            <h1>{profile.title}</h1>
            <h2>{profile.tagline}</h2>
            <p className={styles.coverIntro}>{profile.intro}</p>
            <div className={styles.coverFacts}>
              <div>
                <Truck />
                <strong>{profile.dailyLocalCapacity ?? 140}+</strong>
                <span>local vehicles daily</span>
              </div>
              <div>
                <MapPinned />
                <strong>Nationwide</strong>
                <span>South African coverage</span>
              </div>
              <div>
                <ShieldCheck />
                <strong>{profile.insuranceAmount ?? "Comprehensive"}</strong>
                <span>goods-in-transit cover</span>
              </div>
            </div>
          </div>
          <div className={styles.coverNumber}>01</div>
        </section>

        <section
          className={`${styles.slide} ${active === 1 ? styles.active : ""}`}
        >
          <SlideTitle
            eyebrow="Our advantage"
            title="Why businesses choose Makatu"
            description="Agile service backed by deep vehicle-logistics experience and real-time operational visibility."
          />
          <div className={styles.reasonGrid}>
            {(profile.whyChooseUs ?? []).map((reason, index) => (
              <article
                key={reason._key ?? reason.title}
                className={styles.reasonCard}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <Sparkles size={24} />
                <h3>{reason.title}</h3>
                <p>{reason.description}</p>
              </article>
            ))}
          </div>
          <div className={styles.credentialRibbon}>
            <div>
              <Award />
              <span>Transformation</span>
              <strong>{profile.bbbeeLevel ?? "B-BBEE compliant"}</strong>
            </div>
            <div>
              <ShieldCheck />
              <span>Insurance</span>
              <strong>
                {profile.insuranceAmount ?? "Comprehensive cover"}
              </strong>
            </div>
            <div>
              <Globe2 />
              <span>Coverage</span>
              <strong>Nationwide service</strong>
            </div>
          </div>
        </section>

        <section
          className={`${styles.slide} ${active === 2 ? styles.active : ""}`}
        >
          <SlideTitle
            eyebrow="Operational capacity"
            title="A fleet built for every movement"
            description="Flexible vehicle-carrier capacity for local distribution, long-haul movements and specialist assignments."
          />
          <div className={styles.capacityStrip}>
            <div>
              <strong>{profile.dailyLocalCapacity ?? 140}+</strong>
              <span>local vehicles per day</span>
            </div>
            <div>
              <strong>{profile.weeklyLongHaulCapacity ?? "20-30"}</strong>
              <span>long-haul vehicles per week</span>
            </div>
            <div>
              <strong>
                {profile.fleet?.reduce(
                  (sum, item) => sum + (item.quantity ?? 0),
                  0,
                ) || "Multi"}
              </strong>
              <span>carrier capacity</span>
            </div>
          </div>
          <div className={styles.fleetGrid}>
            {(profile.fleet ?? []).map((item) => (
              <article
                key={item._key ?? item.title}
                className={styles.fleetCard}
              >
                <div className={styles.fleetPhoto}>
                  {imageUrl(item.image) ? (
                    <Image
                      src={imageUrl(item.image)!}
                      alt={item.title}
                      fill
                      sizes="(max-width: 900px) 100vw, 33vw"
                    />
                  ) : (
                    <Truck size={54} />
                  )}
                  {item.quantity ? <span>{item.quantity} in fleet</span> : null}
                </div>
                <div className={styles.fleetText}>
                  <p>{item.status ?? "Operational"}</p>
                  <h3>{item.title}</h3>
                  <span>{item.description}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section
          className={`${styles.slide} ${active === 3 ? styles.active : ""}`}
        >
          <SlideTitle
            eyebrow="Leadership"
            title="Experience that keeps operations moving"
            description="A hands-on leadership team combining operational knowledge, client service and business-system innovation."
          />
          <div className={styles.peopleGrid}>
            {(profile.leadership ?? []).map((person) => (
              <article key={person._id} className={styles.personCard}>
                <div className={styles.personPhoto}>
                  {imageUrl(person.photo) ? (
                    <Image
                      src={imageUrl(person.photo)!}
                      alt={person.fullName}
                      fill
                      sizes="260px"
                    />
                  ) : (
                    <Users size={52} />
                  )}
                </div>
                <div className={styles.personText}>
                  <p>{person.position}</p>
                  <h3>{person.fullName}</h3>
                  <span>{person.leadershipProfile || person.bio}</span>
                  {person.yearsExperience ? (
                    <strong>
                      {person.yearsExperience}+ years&apos; experience
                    </strong>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section
          className={`${styles.slide} ${active === 4 ? styles.active : ""}`}
        >
          <SlideTitle
            eyebrow="How we deliver"
            title="Structured from instruction to handover"
            description="Clear milestones, live status visibility and documented vehicle handovers throughout the transport journey."
          />
          <div className={styles.processGrid}>
            {(profile.processSteps ?? []).map((step, index) => (
              <article
                key={step._key ?? step.title}
                className={styles.processCard}
              >
                <div>{String(index + 1).padStart(2, "0")}</div>
                <CheckCircle2 size={22} />
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
          <div className={styles.operationsBottom}>
            <div className={styles.leadTimeCard}>
              <h3>Typical lead times</h3>
              <div className={styles.leadTimeTable}>
                {(profile.leadTimes ?? []).map((item) => (
                  <div key={item._key ?? item.route}>
                    <strong>{item.route}</strong>
                    <span>{item.collection}</span>
                    <b>{item.delivery}</b>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.termStack}>
              <div>
                <Clock3 />
                <span>Operating hours</span>
                <strong>{profile.operatingHours ?? "06:00-23:00"}</strong>
              </div>
              <div>
                <FileDown />
                <span>Payment terms</span>
                <strong>{profile.paymentTerms ?? "30 days"}</strong>
              </div>
              <div>
                <MapPinned />
                <span>Service area</span>
                <strong>
                  {profile.serviceArea ?? "Nationwide South Africa"}
                </strong>
              </div>
            </div>
          </div>
        </section>

        <section
          className={`${styles.slide} ${active === 5 ? styles.active : ""}`}
        >
          <SlideTitle
            eyebrow="Trust & assurance"
            title="Credentials and client partnerships"
            description="Compliance, protection and established relationships supporting dependable delivery."
          />
          <div className={styles.assuranceGrid}>
            <article className={styles.assuranceCard}>
              <Award size={32} />
              <p>Transformation</p>
              <h3>{profile.bbbeeLevel ?? "B-BBEE compliant"}</h3>
              <span>{profile.bbbeeSummary}</span>
              {profile.bbbeeCertificateUrl ? (
                <a
                  href={profile.bbbeeCertificateUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  View current certificate <ArrowRight size={15} />
                </a>
              ) : null}
            </article>
            <article className={styles.assuranceCard}>
              <ShieldCheck size={32} />
              <p>Goods-in-transit protection</p>
              <h3>{profile.insuranceAmount ?? "Comprehensive cover"}</h3>
              <span>{profile.insuranceSummary}</span>
              {profile.insuranceDocumentUrl ? (
                <a
                  href={profile.insuranceDocumentUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  View confirmation of cover <ArrowRight size={15} />
                </a>
              ) : null}
            </article>
          </div>
          <div className={styles.clientGrid}>
            {(profile.clients ?? []).map((client) => (
              <article
                key={client._key ?? client.name}
                className={styles.clientCard}
              >
                <div>
                  {imageUrl(client.logo) ? (
                    <Image
                      src={imageUrl(client.logo)!}
                      alt={client.name}
                      width={120}
                      height={52}
                    />
                  ) : (
                    <Building2 size={28} />
                  )}
                </div>
                <h3>{client.name}</h3>
                <p>{client.services}</p>
                {client.showContactPublicly &&
                (client.contactName || client.contactPhone) ? (
                  <span>
                    {[client.contactName, client.contactPhone]
                      .filter(Boolean)
                      .join(" - ")}
                  </span>
                ) : null}
              </article>
            ))}
          </div>
        </section>

        <section
          className={`${styles.slide} ${styles.contactSlide} ${active === 6 ? styles.active : ""}`}
        >
          <div className={styles.contactGlow} />
          <div className={styles.contactContent}>
            <BrandMark />
            <p className={styles.kicker}>
              Your nationwide vehicle-logistics partner
            </p>
            <h2>{profile.contactHeading}</h2>
            <p>{profile.contactText}</p>
            <div className={styles.contactLinks}>
              {profile.contactPhone ? (
                <a href={`tel:${profile.contactPhone}`}>
                  <Phone />
                  {profile.contactPhone}
                </a>
              ) : null}
              {profile.contactEmail ? (
                <a href={`mailto:${profile.contactEmail}`}>
                  <Mail />
                  {profile.contactEmail}
                </a>
              ) : null}
              {profile.website ? (
                <a href={profile.website}>
                  <Globe2 />
                  {profile.website.replace(/^https?:\/\//, "")}
                </a>
              ) : null}
            </div>
          </div>
          <div className={styles.contactNumber}>07</div>
        </section>
      </div>

      <div className={styles.navigation}>
        <button
          type="button"
          onClick={() => goTo(active - 1)}
          disabled={active === 0}
        >
          <ArrowLeft /> Previous
        </button>
        <p>
          <strong>{String(active + 1).padStart(2, "0")}</strong> /{" "}
          {String(slides.length).padStart(2, "0")}
        </p>
        <button
          type="button"
          onClick={() => goTo(active + 1)}
          disabled={active === slides.length - 1}
        >
          Next <ArrowRight />
        </button>
      </div>
    </div>
  );
}
