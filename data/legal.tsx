import type { ReactNode } from "react";
import { TransitionLink } from "@/components/motion/Transition";
import { site } from "@/lib/site";
import { whatsappUrl } from "@/lib/whatsapp";

export type LegalSection = { id: string; title: string; body: ReactNode };
export type LegalDocument = { title: string; intro: string; updated: string; sections: LegalSection[] };

const returnsEmail = "neoacademylashbrow@gmail.com";
const wa = (
  <a href={whatsappUrl("Hi Neo Lash!")} target="_blank" rel="noopener noreferrer" className="link-u text-ink">
    WhatsApp ({site.whatsapp.display})
  </a>
);
const address = `${site.address.street}, ${site.address.locality} ${site.address.postalCode}, ${site.address.country}`;

/*
 * Plain-English policies written for the WhatsApp ordering model (no cart,
 * no online payment). They should be reviewed by a qualified professional
 * before launch — see README.
 */
export const legal: Record<"returns" | "privacy" | "terms", LegalDocument> = {
  returns: {
    title: "Returns",
    intro: "Not happy with your purchase? We want you to love your tools — here's how returns work.",
    updated: "October 2026",
    sections: [
      {
        id: "promise",
        title: "Our promise",
        body: (
          <p>
            We understand how important it is to be completely satisfied with your tools when it comes to your craft. If something isn&apos;t
            right, we&apos;ll take it back or replace it.
          </p>
        ),
      },
      {
        id: "how",
        title: "Returning an item",
        body: (
          <>
            <p>
              Let us know on {wa} or by email at{" "}
              <a href={`mailto:${returnsEmail}`} className="link-u text-ink">
                {returnsEmail}
              </a>{" "}
              within 14 days of receiving your order if you&apos;d like to return or replace an item.
            </p>
            <p>You then have 14 days to send the products back to us in good condition.</p>
          </>
        ),
      },
      {
        id: "packing",
        title: "Packing your return",
        body: (
          <p>
            Please package products carefully. Products damaged during return shipping can&apos;t be refunded or credited.
          </p>
        ),
      },
      {
        id: "refunds",
        title: "Refunds",
        body: (
          <p>
            Returned shipments are processed within one week of arriving at our studio. Once your return is approved, please allow up to 10
            business days for the refund to reach you through the payment method we agreed for your order.
          </p>
        ),
      },
      {
        id: "rights",
        title: "Your rights",
        body: <p>This policy doesn&apos;t affect your statutory rights as a consumer under Maltese and EU law.</p>,
      },
    ],
  },

  privacy: {
    title: "Privacy",
    intro: "What this website collects (very little), what happens when you message us, and your rights.",
    updated: "October 2026",
    sections: [
      {
        id: "who",
        title: "Who we are",
        body: (
          <p>
            {site.fullName} is a lash and brow studio at {address}. You can reach us on {wa}.
          </p>
        ),
      },
      {
        id: "collect",
        title: "What this website collects",
        body: (
          <p>
            This website has no user accounts, no shopping cart and no online payments, and we don&apos;t use advertising or analytics
            cookies. Fonts and images are served from our own domain.
          </p>
        ),
      },
      {
        id: "device",
        title: "Data kept on your device",
        body: (
          <p>
            Your wishlist and your theme and sound preferences are saved in your browser&apos;s local storage, and whether you have already
            seen the intro animation is kept for the current visit. This information stays on your device — it is never sent to us — and you
            can remove it at any time by clearing your browser data.
          </p>
        ),
      },
      {
        id: "whatsapp",
        title: "Orders and messages on WhatsApp",
        body: (
          <>
            <p>
              When you tap a WhatsApp button or send the contact form, WhatsApp opens with a message written for you. Nothing reaches us
              until you press send in WhatsApp.
            </p>
            <p>
              We use what you share with us — such as your name, phone number, message, order and delivery details — only to reply to you,
              handle your order or course enrolment, and arrange delivery and payment. WhatsApp is provided by WhatsApp Ireland Limited under
              its own privacy policy.
            </p>
          </>
        ),
      },
      {
        id: "bookings",
        title: "Bookings and newsletter",
        body: (
          <>
            <p>Salon appointments are booked on Fresha, which processes your booking details under its own privacy policy.</p>
            <p>If you join our newsletter, we use your email address only to send you news and offers. You can unsubscribe at any time.</p>
          </>
        ),
      },
      {
        id: "hosting",
        title: "Hosting",
        body: (
          <p>
            This website is hosted by Vercel Inc. Like any web server, it processes technical information such as your IP address and
            browser type in order to deliver pages and keep the service secure.
          </p>
        ),
      },
      {
        id: "retention",
        title: "How long we keep your data",
        body: (
          <p>
            We keep order and enrolment conversations only as long as we need them to look after you and to meet our legal and accounting
            obligations.
          </p>
        ),
      },
      {
        id: "rights",
        title: "Your rights",
        body: (
          <p>
            Under the GDPR you can ask us for a copy of your personal data, ask us to correct or delete it, or object to how we use it —
            just message us. You also have the right to complain to Malta&apos;s Information and Data Protection Commissioner (
            <a href="https://idpc.org.mt" target="_blank" rel="noopener noreferrer" className="link-u text-ink">
              idpc.org.mt
            </a>
            ).
          </p>
        ),
      },
    ],
  },

  terms: {
    title: "Terms",
    intro: "The terms that apply when you use this website or order Neo Lash® Pro products.",
    updated: "October 2026",
    sections: [
      {
        id: "about",
        title: "About these terms",
        body: (
          <p>
            These terms apply to your use of this website and to products ordered from {site.fullName}, {address}. By using the website or
            placing an order you agree to them.
          </p>
        ),
      },
      {
        id: "ordering",
        title: "Ordering on WhatsApp",
        body: (
          <p>
            Orders are placed through WhatsApp. Sending an order message is a request: your order is confirmed once we have agreed
            availability, the final price, delivery and payment with you in the conversation.
          </p>
        ),
      },
      {
        id: "prices",
        title: "Prices and payment",
        body: (
          <>
            <p>
              Prices are shown in euro (EUR). Where a price range is shown, the final price depends on the option you choose. Delivery costs
              are confirmed before you pay, and the price confirmed in our conversation is the price of your order.
            </p>
            <p>This website does not take card details or online payments — we agree the payment method with you directly.</p>
          </>
        ),
      },
      {
        id: "returns",
        title: "Delivery and returns",
        body: (
          <p>
            We confirm the delivery method and an estimated delivery time when you order. If you&apos;re not happy with your purchase, see
            our{" "}
            <TransitionLink href="/returns" className="link-u text-ink">
              returns policy
            </TransitionLink>
            .
          </p>
        ),
      },
      {
        id: "services",
        title: "Treatments and courses",
        body: (
          <p>
            Salon appointments are booked on Fresha and are subject to the booking conditions shown there. Course dates, prices and
            enrolment conditions are confirmed with you individually before you enrol.
          </p>
        ),
      },
      {
        id: "use",
        title: "Professional products",
        body: <p>Our professional products are designed for trained lash artists. Always use them according to their instructions.</p>,
      },
      {
        id: "content",
        title: "Website content",
        body: (
          <p>
            Text, photography and branding on this website belong to Neo Lash® or are used under licence, and may not be reused without our
            written permission.
          </p>
        ),
      },
      {
        id: "law",
        title: "Your rights and governing law",
        body: (
          <p>
            Nothing in these terms limits your rights as a consumer. These terms are governed by the laws of Malta. Questions? Message us on{" "}
            {wa}.
          </p>
        ),
      },
    ],
  },
};
