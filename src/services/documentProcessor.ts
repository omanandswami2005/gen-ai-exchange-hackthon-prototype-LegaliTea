import mammoth from "mammoth";
import { createWorker } from "tesseract.js";
import * as pdfjsLib from "pdfjs-dist";

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export interface ProcessingProgress {
  stage: "validating" | "extracting" | "ocr" | "complete";
  progress: number;
  message: string;
}

export class DocumentProcessor {
  private onProgress?: (progress: ProcessingProgress) => void;

  constructor(onProgress?: (progress: ProcessingProgress) => void) {
    this.onProgress = onProgress;
  }

  private updateProgress(
    stage: ProcessingProgress["stage"],
    progress: number,
    message: string
  ) {
    if (this.onProgress) {
      this.onProgress({ stage, progress, message });
    }
  }

  // Validate document before processing
  validateDocument(file: File): { valid: boolean; error?: string } {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
    ];

    if (file.size > maxSize) {
      return { valid: false, error: "File size must be under 10MB" };
    }

    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: "Please upload a PDF or DOCX file" };
    }

    return { valid: true };
  }

  // Main processing method
  async processDocument(file: File): Promise<string> {
    this.updateProgress("validating", 0, "Validating document...");

    const validation = this.validateDocument(file);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    this.updateProgress("extracting", 10, "Reading document...");

    try {
      if (file.type === "application/pdf") {
        return await this.extractFromPDF(file);
      } else if (
        file.type.includes("wordprocessingml") ||
        file.type.includes("msword")
      ) {
        return await this.extractFromDOCX(file);
      } else {
        throw new Error("Unsupported file type");
      }
    } catch (error) {
      console.error("Document processing error:", error);
      throw new Error(
        "Failed to extract text from document. Please try another file."
      );
    }
  }

  // Extract text from PDF
  private async extractFromPDF(file: File): Promise<string> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

      this.updateProgress(
        "extracting",
        30,
        `Processing ${pdf.numPages} pages...`
      );

      let fullText = "";

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();

        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(" ");

        fullText += pageText + "\n";

        // Update progress
        const progress = 30 + (i / pdf.numPages) * 50;
        this.updateProgress(
          "extracting",
          progress,
          `Processing page ${i} of ${pdf.numPages}...`
        );
      }

      // If no text found, might be image-based PDF
      if (fullText.trim().length < 50) {
        this.updateProgress(
          "ocr",
          80,
          "Document appears to be image-based, using OCR..."
        );
        return await this.extractFromImagePDF(file);
      }

      this.updateProgress("complete", 100, "Text extraction complete!");
      return fullText.trim();
    } catch (error) {
      console.error("PDF processing error:", error);
      throw new Error("Unable to read PDF. Please try a different file.");
    }
  }

  // Extract text from DOCX
  private async extractFromDOCX(file: File): Promise<string> {
    try {
      const arrayBuffer = await file.arrayBuffer();

      this.updateProgress(
        "extracting",
        50,
        "Extracting text from Word document..."
      );

      const result = await mammoth.extractRawText({ arrayBuffer });

      if (result.value.trim().length === 0) {
        throw new Error("No text found in document");
      }

      this.updateProgress("complete", 100, "Text extraction complete!");
      return result.value.trim();
    } catch (error) {
      console.error("DOCX processing error:", error);
      throw new Error(
        "Unable to read Word document. Please try a different file."
      );
    }
  }

  // OCR for image-based PDFs
  private async extractFromImagePDF(file: File): Promise<string> {
    try {
      // Convert PDF to images first (simplified approach)
      // In a real implementation, you'd use pdf2pic or similar
      const worker = await createWorker("eng");

      this.updateProgress("ocr", 85, "Performing OCR on document...");

      // For now, we'll use a placeholder since full OCR implementation
      // requires additional setup and can be resource intensive
      await worker.terminate();

      // Return placeholder text indicating OCR would be needed
      return `[OCR Processing Required]
      
This document appears to be image-based and requires Optical Character Recognition (OCR) to extract text. 

For the MVP, please try uploading a text-based PDF or Word document instead.

If you need to process image-based documents, this feature will be available in a future update.`;
    } catch (error) {
      console.error("OCR processing error:", error);
      throw new Error(
        "Unable to process image-based document. Please try a text-based PDF or Word document."
      );
    }
  }

  // Process pasted text
  static processText(text: string): {
    valid: boolean;
    text?: string;
    error?: string;
  } {
    const maxLength = 50000;
    const minLength = 50;

    if (text.length > maxLength) {
      return {
        valid: false,
        error: `Text too long. Maximum ${maxLength.toLocaleString()} characters allowed.`,
      };
    }

    if (text.trim().length < minLength) {
      return {
        valid: false,
        error: `Text too short. Please provide at least ${minLength} characters.`,
      };
    }

    return { valid: true, text: text.trim() };
  }
}

// Sample documents for development
export const sampleDocuments = {
  lease: `RESIDENTIAL LEASE AGREEMENT

This lease agreement is entered into on January 1, 2024, between ABC Property Management (Landlord) and John Smith (Tenant) for the property located at 123 Main Street, Anytown, ST 12345.

TERM: This lease shall commence on January 1, 2024, and terminate on December 31, 2024, unless renewed or extended.

RENT: Tenant agrees to pay monthly rent of $2,500.00, due on the 1st day of each month. Late fees of $100.00 will be charged for payments received after the 5th day of the month.

SECURITY DEPOSIT: Tenant shall pay a security deposit of $2,500.00 prior to occupancy.

UTILITIES: Tenant is responsible for electricity, gas, internet, and cable. Landlord pays for water, sewer, and trash collection.

PETS: No pets are allowed without prior written consent from Landlord. If approved, a pet deposit of $500.00 is required.

MAINTENANCE: Tenant shall maintain the premises in good condition. Tenant is responsible for repairs under $100.00. Landlord is responsible for major repairs and maintenance.

RENT INCREASES: Landlord reserves the right to increase rent by up to 10% upon lease renewal or extension.

TERMINATION: Either party may terminate this lease with 30 days written notice. Early termination by tenant may result in forfeiture of security deposit.

INSPECTION: Landlord may inspect the premises with 24 hours written notice to tenant.

This agreement constitutes the entire agreement between the parties and may only be modified in writing signed by both parties.`,

  nda: `NON-DISCLOSURE AGREEMENT

This Non-Disclosure Agreement ("Agreement") is entered into on [DATE] between TechCorp Inc., a Delaware corporation ("Disclosing Party") and [RECIPIENT NAME] ("Receiving Party").

PURPOSE: The parties wish to explore a potential business relationship and need to share confidential information.

CONFIDENTIAL INFORMATION: Any information disclosed by either party, whether oral, written, or electronic, including but not limited to business plans, financial information, customer lists, technical data, and trade secrets.

OBLIGATIONS: Receiving Party agrees to:
1. Keep all confidential information strictly confidential
2. Not disclose confidential information to third parties
3. Use confidential information solely for evaluation purposes
4. Return or destroy all confidential information upon request

TERM: This agreement shall remain in effect for 2 years from the date of signing.

EXCEPTIONS: This agreement does not apply to information that:
- Is publicly available
- Was known prior to disclosure
- Is independently developed
- Is required to be disclosed by law

REMEDIES: Breach of this agreement may result in irreparable harm, and the disclosing party may seek injunctive relief and monetary damages.

GOVERNING LAW: This agreement shall be governed by the laws of Delaware.`,

  contract: `SERVICE AGREEMENT

This Service Agreement is entered into on [DATE] between Digital Solutions LLC ("Provider") and [CLIENT NAME] ("Client").

SERVICES: Provider agrees to provide web development and digital marketing services as detailed in Exhibit A.

TERM: This agreement begins on [START DATE] and continues for 12 months, with automatic renewal unless terminated.

COMPENSATION: Client agrees to pay $5,000 per month, due on the 1st of each month. Late payments incur a 5% monthly penalty.

INTELLECTUAL PROPERTY: All work product created by Provider shall be owned by Client upon full payment. Provider retains rights to general methodologies and know-how.

CONFIDENTIALITY: Both parties agree to maintain confidentiality of proprietary information shared during this engagement.

TERMINATION: Either party may terminate with 30 days written notice. Client remains liable for all work completed through termination date.

LIABILITY: Provider's liability is limited to the amount paid by Client in the 12 months preceding any claim.

INDEMNIFICATION: Client agrees to indemnify Provider against claims arising from Client's use of the services.

GOVERNING LAW: This agreement is governed by the laws of [STATE].`,
};
