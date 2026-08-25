export const bioTranslations = {
  // en: "photography portfolio focused on architecture, interiors, and spatial detail",
  // de: "Fotografie-Portfolio mit Fokus auf Architektur, Innenräume und räumliche Details",
  en: "your text",
  de: "dein text",
};

const projectNames = {
  en: [
    "House in Podutik",
    "Offices in Vič",
    "ZGNL",
    "Faljič Single-Family House",
    "BF House",
    "Voge House",
    "Apartment Renovation",
    "MRDV Square and Kiosk",
  ],
  de: [
    "Haus in Podutik",
    "Büros in Vič",
    "ZGNL",
    "Einfamilienhaus Faljič",
    "Haus BF",
    "Haus Voge",
    "Wohnungsrenovierung",
    "MRDV-Platz und Kiosk",
  ],
};

export function localizeProject(project, projectIndex, language) {
  return {
    ...project,
    name: projectNames[language]?.[projectIndex] || project.name,
  };
}

export const legalDocuments = {
  en: {
    privacy: {
      linkLabel: "Privacy Policy",
      title: "Privacy Policy",
      updated: "Last updated: 9 August 2026",
      sections: [
        { heading: "1. Controller", paragraphs: ["The controller of personal data processed through this portfolio website is Kim Širec. For privacy questions or requests, contact kim.sirec100@gmail.com."] },
        { heading: "2. Data processed", paragraphs: ["This website has no contact forms, user accounts, newsletter, analytics, or advertising cookies. When you access the website, the hosting provider may technically process your IP address, browser and device information, requested pages, and the date and time of access in server logs.", "If you contact Kim Širec by email, the information in your message and your contact details are processed in order to respond to you."] },
        { heading: "3. Purposes and legal bases", paragraphs: ["Technical request and log data may be processed for delivery, reliability, and security of the website on the basis of legitimate interests. Email correspondence is processed to answer your request, take steps at your request before entering into a contract, or pursue the legitimate interest of professional communication."] },
        { heading: "4. External services and recipients", paragraphs: ["The website loads the Red Hat Text font from Google Fonts. Your browser may therefore connect to Google servers and transmit technical request data, including your IP address. The hosting provider may also process technical data as necessary to deliver the website.", "The Instagram link is an external link. No data is intentionally sent to Instagram by this website until you follow that link. External services process data under their own privacy policies."] },
        { heading: "5. Retention", paragraphs: ["Technical logs are retained only for as long as the hosting provider needs them for operation and security. Email correspondence is retained for as long as necessary to answer the request and, where applicable, to establish or protect legal claims and comply with legal obligations."] },
        { heading: "6. Your rights", paragraphs: ["Subject to applicable law, you may request access, correction, deletion, restriction, or portability of your personal data and may object to processing based on legitimate interests. You may lodge a complaint with the Information Commissioner of the Republic of Slovenia (ip-rs.si). To exercise your rights, email kim.sirec100@gmail.com."] },
        { heading: "7. Changes", paragraphs: ["This policy may be updated when the website, service providers, or legal requirements change. The current version is published on this page."] },
      ],
    },
    terms: {
      linkLabel: "Terms and Conditions",
      title: "Terms and Conditions",
      updated: "Effective: 9 August 2026",
      sections: [
        { heading: "1. Website operator and scope", paragraphs: ["This portfolio website is operated by Kim Širec. Contact: kim.sirec100@gmail.com. These terms govern access to and use of the website."] },
        { heading: "2. Portfolio information", paragraphs: ["The website presents photographic work for general information and professional reference. Its content is not a binding offer. Any commission, licence, price, delivery date, or other service term is agreed separately in writing."] },
        { heading: "3. Copyright and permitted use", paragraphs: ["Unless stated otherwise, all photographs, text, layout, and other original content on this website are protected by copyright and belong to Kim Širec or the identified rights holder. You may view the website for personal, non-commercial purposes. Copying, downloading, publishing, modifying, distributing, licensing, or using photographs or other content without prior written permission is prohibited, except where mandatory law permits it."] },
        { heading: "4. Accuracy and availability", paragraphs: ["Reasonable care is taken to keep the website accurate and available, but uninterrupted access and error-free content cannot be guaranteed. Projects, credits, images, and website functionality may be changed or removed without notice."] },
        { heading: "5. External links", paragraphs: ["Links to third-party websites are provided for convenience. Kim Širec does not control their content, availability, or data practices and is not responsible for them."] },
        { heading: "6. Liability", paragraphs: ["To the extent permitted by law, Kim Širec is not liable for indirect loss resulting solely from use of, inability to use, or reliance on this informational website. Nothing in these terms excludes or limits liability that cannot legally be excluded or limited."] },
        { heading: "7. Governing law and changes", paragraphs: ["These terms are governed by the laws of the Republic of Slovenia. Courts are determined under applicable procedural law. The terms may be updated when the website or legal requirements change; the current version is published on this page."] },
      ],
    },
  },
  de: {
    privacy: {
      linkLabel: "Datenschutzerklärung",
      title: "Datenschutzerklärung",
      updated: "Zuletzt aktualisiert: 9. August 2026",
      sections: [
        { heading: "1. Verantwortliche Person", paragraphs: ["Verantwortlich für die über diese Portfolio-Website verarbeiteten personenbezogenen Daten ist Kim Širec. Bei Datenschutzfragen oder zur Ausübung Ihrer Rechte schreiben Sie an kim.sirec100@gmail.com."] },
        { heading: "2. Verarbeitete Daten", paragraphs: ["Diese Website verwendet keine Kontaktformulare, Benutzerkonten, Newsletter, Analysewerkzeuge oder Werbe-Cookies. Beim Aufruf kann der Hosting-Anbieter technisch Ihre IP-Adresse, Browser- und Geräteinformationen, aufgerufene Seiten sowie Datum und Uhrzeit des Zugriffs in Serverprotokollen verarbeiten.", "Wenn Sie Kim Širec per E-Mail kontaktieren, werden die Angaben in Ihrer Nachricht und Ihre Kontaktdaten verarbeitet, um Ihnen zu antworten."] },
        { heading: "3. Zwecke und Rechtsgrundlagen", paragraphs: ["Technische Anfrage- und Protokolldaten können zur Bereitstellung, Zuverlässigkeit und Sicherheit der Website auf Grundlage berechtigter Interessen verarbeitet werden. E-Mail-Korrespondenz wird verarbeitet, um Ihre Anfrage zu beantworten, auf Ihren Wunsch vorvertragliche Maßnahmen durchzuführen oder das berechtigte Interesse an professioneller Kommunikation zu verfolgen."] },
        { heading: "4. Externe Dienste und Empfänger", paragraphs: ["Die Website lädt die Schriftart Red Hat Text über Google Fonts. Ihr Browser kann deshalb eine Verbindung zu Google-Servern herstellen und technische Anfragedaten einschließlich Ihrer IP-Adresse übermitteln. Auch der Hosting-Anbieter kann die für die Bereitstellung der Website erforderlichen technischen Daten verarbeiten.", "Der Instagram-Verweis ist ein externer Link. Diese Website übermittelt Instagram nicht absichtlich Daten, bevor Sie dem Link folgen. Externe Dienste verarbeiten Daten nach ihren eigenen Datenschutzbestimmungen."] },
        { heading: "5. Speicherdauer", paragraphs: ["Technische Protokolle werden nur so lange gespeichert, wie der Hosting-Anbieter sie für Betrieb und Sicherheit benötigt. E-Mail-Korrespondenz wird so lange aufbewahrt, wie dies zur Beantwortung der Anfrage sowie gegebenenfalls zur Geltendmachung oder Abwehr rechtlicher Ansprüche und zur Erfüllung gesetzlicher Pflichten erforderlich ist."] },
        { heading: "6. Ihre Rechte", paragraphs: ["Nach Maßgabe des anwendbaren Rechts können Sie Auskunft, Berichtigung, Löschung, Einschränkung oder Übertragbarkeit Ihrer personenbezogenen Daten verlangen und einer Verarbeitung aufgrund berechtigter Interessen widersprechen. Sie können sich beim Informationsbeauftragten der Republik Slowenien (ip-rs.si) beschweren. Zur Ausübung Ihrer Rechte schreiben Sie an kim.sirec100@gmail.com."] },
        { heading: "7. Änderungen", paragraphs: ["Diese Erklärung kann angepasst werden, wenn sich die Website, Dienstleister oder rechtliche Anforderungen ändern. Die aktuelle Fassung wird auf dieser Seite veröffentlicht."] },
      ],
    },
    terms: {
      linkLabel: "Allgemeine Geschäftsbedingungen",
      title: "Allgemeine Geschäftsbedingungen",
      updated: "Gültig ab: 9. August 2026",
      sections: [
        { heading: "1. Betreiberin und Geltungsbereich", paragraphs: ["Diese Portfolio-Website wird von Kim Širec betrieben. Kontakt: kim.sirec100@gmail.com. Diese Bedingungen regeln den Zugriff auf und die Nutzung der Website."] },
        { heading: "2. Portfolio-Informationen", paragraphs: ["Die Website präsentiert fotografische Arbeiten zur allgemeinen Information und als berufliche Referenz. Die Inhalte stellen kein verbindliches Angebot dar. Auftrag, Lizenz, Preis, Liefertermin und sonstige Leistungsbedingungen werden jeweils gesondert schriftlich vereinbart."] },
        { heading: "3. Urheberrecht und erlaubte Nutzung", paragraphs: ["Sofern nicht anders angegeben, sind alle Fotografien, Texte, das Layout und sonstige eigene Inhalte urheberrechtlich geschützt und gehören Kim Širec oder dem jeweils genannten Rechteinhaber. Sie dürfen die Website zu persönlichen, nicht kommerziellen Zwecken ansehen. Das Kopieren, Herunterladen, Veröffentlichen, Bearbeiten, Verbreiten, Lizenzieren oder Verwenden von Fotografien oder anderen Inhalten ohne vorherige schriftliche Genehmigung ist untersagt, soweit zwingendes Recht nichts anderes erlaubt."] },
        { heading: "4. Richtigkeit und Verfügbarkeit", paragraphs: ["Die Website wird mit angemessener Sorgfalt gepflegt. Eine ununterbrochene Verfügbarkeit oder Fehlerfreiheit kann jedoch nicht garantiert werden. Projekte, Urheberangaben, Bilder und Funktionen können ohne Ankündigung geändert oder entfernt werden."] },
        { heading: "5. Externe Links", paragraphs: ["Links zu Websites Dritter werden als Service bereitgestellt. Kim Širec kontrolliert deren Inhalte, Verfügbarkeit und Datenverarbeitung nicht und übernimmt dafür keine Verantwortung."] },
        { heading: "6. Haftung", paragraphs: ["Soweit gesetzlich zulässig, haftet Kim Širec nicht für mittelbare Schäden, die ausschließlich aus der Nutzung, der Nichtverfügbarkeit oder dem Vertrauen auf diese Informationswebsite entstehen. Eine Haftung, die gesetzlich nicht ausgeschlossen oder beschränkt werden darf, bleibt unberührt."] },
        { heading: "7. Anwendbares Recht und Änderungen", paragraphs: ["Es gilt das Recht der Republik Slowenien. Die gerichtliche Zuständigkeit richtet sich nach dem anwendbaren Verfahrensrecht. Diese Bedingungen können bei Änderungen der Website oder rechtlicher Anforderungen angepasst werden; die aktuelle Fassung wird auf dieser Seite veröffentlicht."] },
      ],
    },
  },
};
