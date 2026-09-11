import jsPDF from "jspdf";
import type { Consultation } from "@/types/consultation";

export function generatePrescriptionPDF(consultation: Consultation): jsPDF {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 14;
  const contentWidth = pageWidth - margin * 2; // 182mm
  let y = 14;

  const primaryColor: [number, number, number] = [13, 110, 75]; // Deep emerald
  const secondaryColor: [number, number, number] = [30, 41, 59]; // Slate 800
  const mutedColor: [number, number, number] = [100, 116, 139]; // Slate 500
  const lightBg: [number, number, number] = [240, 253, 244]; // Emerald 50
  const amberBg: [number, number, number] = [254, 243, 199]; // Amber 100
  const amberBorder: [number, number, number] = [217, 119, 6]; // Amber 600

  // 1. Header Banner
  doc.setFillColor(...primaryColor);
  doc.roundedRect(margin, y, contentWidth, 26, 3, 3, "F");

  // Logo / Title
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("AGRINOVA CLINIC", margin + 6, y + 10);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(209, 250, 229);
  doc.text(
    "Official Agricultural Diagnosis, Treatment Protocol & Input Prescription",
    margin + 6,
    y + 16
  );

  // Rx Reference Tag
  const rawId = consultation._id || consultation.id || "000";
  const rxId = `RX-${rawId.slice(-8).toUpperCase()}`;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text(rxId, pageWidth - margin - 6, y + 10, { align: "right" });

  const dateIssued = new Date(
    consultation.completedAt ||
      consultation.recommendations?.createdAt ||
      consultation.updatedAt ||
      Date.now()
  ).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(209, 250, 229);
  doc.text(`ISSUED: ${dateIssued}`, pageWidth - margin - 6, y + 16, {
    align: "right",
  });

  y += 32;

  // 2. Patient / Farmer & Specialist Meta Box (2-column layout)
  const metaBoxHeight = 32;
  doc.setFillColor(248, 250, 252); // Slate 50
  doc.setDrawColor(226, 232, 240); // Slate 200
  doc.setLineWidth(0.4);
  doc.roundedRect(margin, y, contentWidth, metaBoxHeight, 2, 2, "FD");

  const farmerName =
    consultation.farmer?.name || consultation.farmerName || "Registered Farmer";
  const farmLocation =
    consultation.farmName || consultation.farmer?.farmName
      ? `${consultation.farmName || consultation.farmer?.farmName} · ${
          consultation.district || "Bangladesh"
        }`
      : consultation.district || "Bangladesh";
  const farmerContact =
    consultation.farmer?.phone ||
    consultation.farmer?.email ||
    consultation.farmerEmail ||
    "Verified Farmer ID";

  const expertName =
    consultation.expert?.name ||
    consultation.expertName ||
    "Specialist Agronomist";
  const expertTitle =
    consultation.expert?.title || "Agronomist & Crop Health Specialist";
  const cropInfo = `${consultation.cropType || "Crop"} · Urgency: ${
    consultation.urgency || "MEDIUM"
  }`;

  // Left Column - Farmer Details
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(...mutedColor);
  doc.text("PRESCRIPTION RECIPIENT", margin + 5, y + 6);

  doc.setFontSize(10.5);
  doc.setTextColor(...secondaryColor);
  doc.text(farmerName, margin + 5, y + 12);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...mutedColor);
  doc.text(`Farm / Field: ${farmLocation}`, margin + 5, y + 18);
  doc.text(`Contact: ${farmerContact}`, margin + 5, y + 24);

  // Divider between columns
  doc.setDrawColor(226, 232, 240);
  doc.line(pageWidth / 2, y + 4, pageWidth / 2, y + metaBoxHeight - 4);

  // Right Column - Specialist & Crop Details
  const rightColX = pageWidth / 2 + 5;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(...mutedColor);
  doc.text("ISSUING SPECIALIST & SPECIMEN", rightColX, y + 6);

  doc.setFontSize(10.5);
  doc.setTextColor(...primaryColor);
  doc.text(expertName, rightColX, y + 12);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...mutedColor);
  doc.text(`Title: ${expertTitle}`, rightColX, y + 18);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...secondaryColor);
  doc.text(`Target Crop: ${cropInfo}`, rightColX, y + 24);

  y += metaBoxHeight + 6;

  // Helper function to render section header
  const renderSectionHeader = (title: string, iconNumber: string) => {
    doc.setFillColor(...lightBg);
    doc.setDrawColor(187, 247, 208); // Emerald 200
    doc.setLineWidth(0.3);
    doc.roundedRect(margin, y, contentWidth, 7.5, 1.5, 1.5, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(...primaryColor);
    doc.text(`${iconNumber}  ${title}`, margin + 4, y + 5.2);
    y += 10.5;
  };

  // 3. Clinical Diagnosis
  renderSectionHeader("CLINICAL DIAGNOSIS & PATHOGEN ETIOLOGY", "1.");
  const diagnosis =
    consultation.recommendations?.diagnosis ||
    consultation.recommendation ||
    "Diagnosis and agronomic recommendations formulated based on reported field symptoms.";

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...secondaryColor);
  const diagLines = doc.splitTextToSize(diagnosis, contentWidth - 8);
  doc.text(diagLines, margin + 4, y);
  y += diagLines.length * 4.6 + 4;

  // 4. Prescribed Treatments & Inputs
  const prescriptions = consultation.recommendations?.prescriptions?.filter(
    (p) => p && p.trim().length > 0
  ) || [];

  renderSectionHeader(
    "PRESCRIBED TREATMENTS, DOSAGE & INPUT SCHEDULE",
    "2."
  );

  if (prescriptions.length === 0) {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8.5);
    doc.setTextColor(...mutedColor);
    doc.text(
      "No specific agrochemical/bio-inputs required. Follow the action plan steps below.",
      margin + 4,
      y
    );
    y += 6;
  } else {
    prescriptions.forEach((item, index) => {
      // Bullet dot
      doc.setFillColor(...primaryColor);
      doc.circle(margin + 5, y - 1, 1, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(...secondaryColor);
      const textLines = doc.splitTextToSize(item, contentWidth - 14);
      doc.text(textLines, margin + 9, y);
      y += textLines.length * 4.4 + 2.5;
    });
    y += 2;
  }

  // 5. Step-by-Step Action Plan
  const steps = consultation.recommendations?.treatmentSteps?.filter(
    (s) => s && s.trim().length > 0
  ) || [];

  if (steps.length > 0) {
    renderSectionHeader("STEP-BY-STEP FIELD ACTION & APPLICATION PLAN", "3.");
    steps.forEach((step, index) => {
      // Step badge
      doc.setFillColor(...lightBg);
      doc.setDrawColor(187, 247, 208);
      doc.roundedRect(margin + 3, y - 3.5, 9, 5, 1, 1, "FD");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(...primaryColor);
      doc.text(`S${index + 1}`, margin + 5, y - 0.2);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(...secondaryColor);
      const stepLines = doc.splitTextToSize(step, contentWidth - 18);
      doc.text(stepLines, margin + 15, y);
      y += stepLines.length * 4.3 + 2.5;
    });
    y += 2;
  }

  // 6. Safety Precautions & Additional Notes
  const notes = consultation.recommendations?.additionalNotes?.trim();
  if (notes) {
    renderSectionHeader("SAFETY PRECAUTIONS, PHI & HANDLING ADVISORY", "4.");

    doc.setFillColor(...amberBg);
    doc.setDrawColor(...amberBorder);
    doc.setLineWidth(0.3);

    const noteLines = doc.splitTextToSize(notes, contentWidth - 12);
    const boxH = noteLines.length * 4.2 + 6;
    doc.roundedRect(margin, y, contentWidth, boxH, 2, 2, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(180, 83, 9); // Amber 700
    doc.text("SPECIALIST WARNING & APPLICATION SAFETY:", margin + 4, y + 4.5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(120, 53, 15); // Amber 900
    doc.text(noteLines, margin + 4, y + 9);

    y += boxH + 5;
  }

  // 7. Follow-Up & Verification Footer
  const followUp = consultation.recommendations?.followUpDate;
  if (followUp) {
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(margin, y, contentWidth, 8, 1.5, 1.5, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...secondaryColor);
    doc.text("SCHEDULED FOLLOW-UP INSPECTION DATE:", margin + 4, y + 5.2);

    doc.setTextColor(...primaryColor);
    doc.text(followUp, margin + 82, y + 5.2);
    y += 12;
  }

  // Footer / Certification Block (Pushed near bottom if space allows)
  const footerY = Math.max(y + 4, pageHeight - 26);

  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.4);
  doc.line(margin, footerY, pageWidth - margin, footerY);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(...primaryColor);
  doc.text(
    "AgriNova Tele-Agronomy & Plant Clinic Certification",
    margin,
    footerY + 5
  );

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(...mutedColor);
  doc.text(
    "Digitally signed and verifiable crop prescription. Valid across certified agricultural input dealers and field extension offices.",
    margin,
    footerY + 9
  );
  doc.text(
    `Document Ref: ${rxId} · Generated: ${new Date().toLocaleString()} · AgriNova Bangladesh`,
    margin,
    footerY + 13
  );

  // Digital Signature Seal
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...primaryColor);
  doc.text("[ DIGITALLY CERTIFIED ]", pageWidth - margin, footerY + 6, {
    align: "right",
  });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(...mutedColor);
  doc.text(
    `Specialist: ${expertName}`,
    pageWidth - margin,
    footerY + 10,
    { align: "right" }
  );

  return doc;
}

export function downloadPrescriptionPDF(consultation: Consultation) {
  const doc = generatePrescriptionPDF(consultation);
  const crop = (consultation.cropType || "Crop").replace(/[^a-zA-Z0-9]/g, "_");
  const farmer = (
    consultation.farmer?.name ||
    consultation.farmerName ||
    "Farmer"
  )
    .split(" ")[0]
    .replace(/[^a-zA-Z0-9]/g, "_");
  const filename = `AgriNova_Prescription_${crop}_${farmer}.pdf`;
  doc.save(filename);
}
