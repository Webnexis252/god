"use client";

import Link from "next/link";
import MotionReveal from "@/components/MotionReveal";

export default function ServicesList({ services }) {
  return (
    <div className="services-list">
      {services.map((service, index) => (
        <MotionReveal
          key={service.number}
          delay={0.04 * index}
          distance={54}
        >
          <Link href={`/services/${service.slug}`} className="service-row">
            <p className="service-number">{service.number}</p>
            <div className="service-body">
              <h3 className="service-title">{service.name}</h3>
              <p className="service-description">{service.description}</p>
            </div>
            <span className="service-row-arrow" aria-hidden="true">→</span>
          </Link>
        </MotionReveal>
      ))}
    </div>
  );
}
