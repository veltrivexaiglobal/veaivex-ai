import jsPDF from 'jspdf';
import html2canvasPro from 'html2canvas-pro';

export interface PdfGenerationOptions {
  businessName: string;
  reportDate?: string;
}

// In-memory 2D canvas context used to convert any modern CSS color to standard HEX/RGBA
const colorConverterCanvas = typeof document !== 'undefined' ? document.createElement('canvas') : null;
if (colorConverterCanvas) {
  colorConverterCanvas.width = 1;
  colorConverterCanvas.height = 1;
}
const colorCtx = colorConverterCanvas ? colorConverterCanvas.getContext('2d', { willReadFrequently: true }) : null;

/**
 * Converts any CSS color (including oklab, oklch, lab, lch, color-mix, etc.) to standard hex or rgb(a).
 * Canvas 2D fillStyle natively resolves modern color functions into #rrggbb or rgba(...).
 */
export function normalizeCssColor(colorStr: string): string {
  if (!colorStr || colorStr === 'transparent' || colorStr === 'inherit' || colorStr === 'currentColor') {
    return colorStr;
  }
  if (!colorCtx) return colorStr;

  try {
    // Check if the color contains modern color functions that older canvas/html2canvas cannot parse
    if (/oklab|oklch|lab\(|lch\(|color\(/i.test(colorStr)) {
      colorCtx.fillStyle = '#000000'; // reset
      colorCtx.fillStyle = colorStr;
      return colorCtx.fillStyle || '#0f172a';
    }
    return colorStr;
  } catch {
    return '#0f172a';
  }
}

/**
 * Traverses an element tree and replaces any modern/unsupported color functions (oklab, oklch, lab, lch, color)
 * in inline styles, style attributes, SVG attributes, and CSS rules with standard sRGB hex/rgb values.
 */
export function sanitizeDomColorsForCanvas(rootElement: HTMLElement, documentNode: Document) {
  if (!rootElement) return;

  const colorProperties = [
    'color',
    'backgroundColor',
    'borderColor',
    'borderTopColor',
    'borderBottomColor',
    'borderLeftColor',
    'borderRightColor',
    'outlineColor',
    'fill',
    'stroke',
    'stopColor',
    'accentColor',
  ];

  // 1. Process all inline stylesheets in the cloned document
  const styleTags = documentNode.querySelectorAll('style');
  styleTags.forEach((styleTag) => {
    try {
      if (styleTag.textContent && /oklab|oklch|lab\(|lch\(/i.test(styleTag.textContent)) {
        styleTag.textContent = styleTag.textContent.replace(
          /(oklab|oklch|lab|lch)\([^)]+\)/gi,
          (match) => {
            return normalizeCssColor(match);
          }
        );
      }
    } catch {
      // ignore
    }
  });

  // 2. Walk all DOM nodes and sanitize inline styles & SVG attributes
  const allElements = rootElement.querySelectorAll<HTMLElement | SVGElement>('*');
  const processElement = (el: HTMLElement | SVGElement) => {
    // Process style attribute directly if present
    const styleAttr = el.getAttribute('style');
    if (styleAttr && /oklab|oklch|lab\(|lch\(/i.test(styleAttr)) {
      const sanitized = styleAttr.replace(/(oklab|oklch|lab|lch)\([^)]+\)/gi, (match) =>
        normalizeCssColor(match)
      );
      el.setAttribute('style', sanitized);
    }

    // Check SVG attributes
    ['fill', 'stroke', 'color'].forEach((attr) => {
      const val = el.getAttribute(attr);
      if (val && /oklab|oklch|lab\(|lch\(/i.test(val)) {
        el.setAttribute(attr, normalizeCssColor(val));
      }
    });

    // Check computed/inline style object properties
    const elStyle = (el as HTMLElement).style;
    if (elStyle) {
      for (const prop of colorProperties) {
        const val = (elStyle as any)[prop];
        if (val && typeof val === 'string' && /oklab|oklch|lab\(|lch\(/i.test(val)) {
          (elStyle as any)[prop] = normalizeCssColor(val);
        }
      }
    }
  };

  processElement(rootElement);
  allElements.forEach(processElement);
}

/**
 * Generates and downloads a real executive PDF document from the report DOM node.
 * Uses high-DPI canvas capture, precise A4 pagination, and robust error handling.
 */
export async function generateExecutiveReportPdf(
  element: HTMLElement,
  options: PdfGenerationOptions
): Promise<boolean> {
  if (!element) {
    throw new Error('Report element not found for PDF generation');
  }

  // Preserve styles on the live element
  const originalWidth = element.style.width;
  const originalMaxWidth = element.style.maxWidth;

  try {
    // Set standardized width for crisp desktop PDF rendering (850px ~ standard A4 printable ratio)
    element.style.width = '850px';
    element.style.maxWidth = '850px';

    // Use html2canvas-pro which has full native support for oklab, oklch, and modern CSS color functions
    const canvas = await html2canvasPro(element, {
      scale: 2, // 2x scale for sharp typography and vector-like clarity
      useCORS: true,
      logging: false,
      allowTaint: true,
      backgroundColor: '#ffffff',
      windowWidth: 1024,
      onclone: (clonedDoc) => {
        const clonedElement = clonedDoc.getElementById(element.id);
        if (clonedElement) {
          clonedElement.style.width = '850px';
          clonedElement.style.maxWidth = '850px';
          clonedElement.style.margin = '0 auto';
          clonedElement.style.padding = '32px';
          clonedElement.style.backgroundColor = '#ffffff';

          // Apply comprehensive color sanitizer to cloned tree
          sanitizeDomColorsForCanvas(clonedElement, clonedDoc);
        }
      },
    });

    // Reset styles on live element
    element.style.width = originalWidth;
    element.style.maxWidth = originalMaxWidth;

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const pdf = new jsPDF('p', 'mm', 'a4');

    const pdfWidth = pdf.internal.pageSize.getWidth(); // 210 mm
    const pdfHeight = pdf.internal.pageSize.getHeight(); // 297 mm

    // Canvas dimensions scaled to A4 width
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    // Render first page
    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pdfHeight;

    // Render remaining pages
    while (heightLeft > 0) {
      position = -(imgHeight - heightLeft);
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pdfHeight;
    }

    // Generate safe filename
    const dateStr = options.reportDate || new Date().toISOString().slice(0, 10);
    const safeBusiness = (options.businessName || 'Enterprise')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .replace(/__+/g, '_');
    const filename = `VEAIVEX_Executive_BI_Report_${safeBusiness}_${dateStr}.pdf`;

    pdf.save(filename);
    return true;
  } catch (err) {
    // Ensure element styles are restored in case of error
    element.style.width = originalWidth;
    element.style.maxWidth = originalMaxWidth;
    console.error('VEAIVEX PDF Generation Error:', err);
    throw err;
  }
}
