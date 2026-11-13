"use client";

import StickerSlapFooter from "@/components/sticker-slap-footer";

export default function SiteFooter() {
  return (
    <StickerSlapFooter
      wordmark="quansah"
      homeHref="#"
      navLabel="top"
      navHref="#"
      /* Colours */
      paper="#FFFFFF"
      panel="#0A0A0A"
      ink="#0A0A0A"
      cream="#CCFF00"
      accent="#CCFF00"
      fontSans="var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif"
      /* Column 1 */
      jobsLabel="work with me"
      jobs={[
        { title: "clinical training for care teams", href: "#contact" },
        { title: "mentoring student nurses", href: "#contact" },
        { title: "speaking & workshops", href: "#contact" },
      ]}
      /* Column 2 */
      officeLabel="based in"
      address={["douglas", "isle of man"]}
      mapLabel="Google Maps"
      mapHref="https://www.google.com/maps/search/?api=1&query=Douglas,+Isle+of+Man"
      /* Column 3 */
      contactLabel="contact"
      email="emmanuel@topcaregroup.im"
      copiedLabel="copied, speak soon!"
      chatHref="https://wa.me/447624377104"
      chatLabel="send a whatsapp"
      note="*working with teams across the UK & Ghana. Messages are always welcome."
      socials={[]}
      /* Stickers on the wordmark */
      stickers={[
        "heart",
        { kind: "burst", text: "rn" },
        "smiley",
        { kind: "bubble", text: "hi!" },
        "bolt",
        "daisy",
      ]}
      /* Credits pill */
      credits={[
        { role: "design & build", name: "300 Mil Legacy Inc." },
        { role: "illustrations", name: "hand-drawn ink portraits" },
        { role: "stickers", name: "drawn in code, peel freely" },
      ]}
      height="100svh"
      wordmarkMaxHeight="45svh"
    />
  );
}