import type { Contact, Task } from "../types";

const nonDigitOrPlus = /[^\d+]/g;

export const getWhatsAppNumber = (contact?: Contact | null) => {
  if (!contact) {
    return null;
  }

  return contact.whatsapp || contact.phone_jsonb?.[0]?.number || null;
};

export const normalizeWhatsAppNumber = (value: string | null | undefined) => {
  if (!value) {
    return null;
  }

  const sanitized = value.replace(nonDigitOrPlus, "");
  const withoutPlus = sanitized.startsWith("+")
    ? sanitized.slice(1)
    : sanitized;

  if (withoutPlus.startsWith("00")) {
    return withoutPlus.slice(2);
  }

  return withoutPlus || null;
};

export const getWhatsAppTemplate = ({
  contact,
  task,
  businessLineLabel,
}: {
  contact?: Contact | null;
  task: Task;
  businessLineLabel?: string | null;
}) => {
  const firstName = contact?.first_name?.trim() || "hola";
  const lineSuffix = businessLineLabel ? ` de ${businessLineLabel}` : "";

  return `Hola ${firstName}, te escribo desde Claridad para retomar tu seguimiento pendiente${lineSuffix}: ${task.text}`;
};

export const getBirthdayWhatsAppTemplate = ({
  contact,
  businessLineLabel,
}: {
  contact?: Contact | null;
  businessLineLabel?: string | null;
}) => {
  const firstName = contact?.first_name?.trim() || "hola";
  const lineSuffix = businessLineLabel ? ` desde ${businessLineLabel}` : "";

  return `Hola ${firstName}, feliz cumpleanos. Te escribo${lineSuffix} para mandarte un abrazo y quedar a disposicion si necesitas algo hoy.`;
};

export const buildWhatsAppUrl = ({
  contact,
  task,
  businessLineLabel,
}: {
  contact?: Contact | null;
  task: Task;
  businessLineLabel?: string | null;
}) => {
  const normalizedNumber = normalizeWhatsAppNumber(getWhatsAppNumber(contact));

  if (!normalizedNumber) {
    return null;
  }

  const message = getWhatsAppTemplate({
    contact,
    task,
    businessLineLabel,
  });

  return `https://wa.me/${normalizedNumber}?text=${encodeURIComponent(message)}`;
};

export const buildBirthdayWhatsAppUrl = ({
  contact,
  businessLineLabel,
}: {
  contact?: Contact | null;
  businessLineLabel?: string | null;
}) => {
  const normalizedNumber = normalizeWhatsAppNumber(getWhatsAppNumber(contact));

  if (!normalizedNumber) {
    return null;
  }

  const message = getBirthdayWhatsAppTemplate({
    contact,
    businessLineLabel,
  });

  return `https://wa.me/${normalizedNumber}?text=${encodeURIComponent(message)}`;
};
